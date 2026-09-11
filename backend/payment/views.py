from rest_framework import permissions,status,viewsets
from .serializers import Payment,PaymentSerializer
from common.response import ErrorResponse,SuccessResponse
from orders.serializers import Order,OrderModelSerializer
from rest_framework.views import APIView
from products.serializers import Product
from django.db.models import F
from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from django.conf import settings

import uuid
import stripe
import os
from decimal import Decimal
import time
from django.utils import timezone
from datetime import timedelta
import json

client = stripe.StripeClient(os.getenv('STRIPE_API_KEY'))
webhook = os.getenv("STRIPE_WEBHOOK_SECRET")

domain = os.getenv("FRONT_END_DOMAIN")

class PaymentDetailViewSet(viewsets.ViewSet):
    permission_classes=[permissions.IsAuthenticated]
    
    def get_one(self,request,pk):
        try:
            payment= Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return ErrorResponse(msg="Payment not found!",status_code=status.HTTP_404_NOT_FOUND)
        
        serializer = PaymentSerializer(instance=payment)
        return SuccessResponse(data=serializer.data)
    
    def create_payment(self,request):
        
        # create order firstly
        order_id = request.data.get("order_id")
        
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return ErrorResponse(msg="Order not found!",status_code=status.HTTP_404_NOT_FOUND)
        
        # Check the order is paid
        if hasattr(order,'payment'):
            return ErrorResponse(msg="This order already has a payment!",status_code=status.HTTP_400_BAD_REQUEST)
        
        
        payment_method = request.data.get("payment_method", "Simulated")
        
        # create payment
        payment = Payment.objects.create(
            order=order,
            amount=order.total_amount,
            status=Payment.PaymentStatus.PENDING,
            payment_method=payment_method,
            transaction_id = uuid.uuid4()
        )
        
        # update order 
        if payment_method is Payment.PaymentMethod.SIMULATED:
            order.order_status=Order.OrderStatus.COMPLETED
        else:
            order.order_status=Order.OrderStatus.PROCESSING
        order.payment_method = payment_method
        order.save()
        
        serializer = PaymentSerializer(instance=payment)
        return SuccessResponse(msg="",data=serializer.data,status_code=status.HTTP_201_CREATED)
        
    def update_payment(self,request,pk):
        
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return ErrorResponse(msg="Payment not found!",status_code=status.HTTP_404_NOT_FOUND)
        
        if payment.PaymentStatus == Payment.PaymentStatus.REFUND:
            return ErrorResponse(msg="Payment is refund!")
        
        new_status = request.data.get("payment_status")
        if new_status is None:
            return ErrorResponse(msg="Payment Status can not empty!")
        
        payment.PaymentStatus = new_status
        payment.save()
        
        serializer = PaymentSerializer(instance=payment)
        return SuccessResponse(data=serializer.data)
            
        
class StripeCheckoutAPIView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def post(self,request):
        
        order_id = request.data.get("id")
        if not order_id:
            return ErrorResponse(msg="Order id is required",
                                status_code=status.HTTP_404_NOT_FOUND)
                        
        
        try:
            order = Order.objects.get(pk=order_id, user=request.user)
        except Order.DoesNotExist:
            return ErrorResponse(msg="Order not found",
                                status_code=status.HTTP_404_NOT_FOUND)
        
        if order.order_status not in (
            Order.OrderStatus.PENDING,
        ):
            return ErrorResponse(
                msg="Order cannot be paid",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        
        if (
           order.payment_session_id
           and order.payment_session_expires_at
           and order.payment_session_expires_at > timezone.now() 
        ):
            try:
                existing = client.v1.checkout.sessions.retrieve(
                    order.payment_session_id
                )
                
                if existing.status =="open" and existing.client_secret:
                    return SuccessResponse(
                        msg="",
                        data={
                            "clientSecret":existing.client_secret,
                            "session_id":existing.id
                        },
                        status_code=status.HTTP_200_OK
                    )
                
            except Exception:
                pass
        
        amount_cents = int(
            (order.total_amount * Decimal("100")).quantize(Decimal("1"))
        )
        if amount_cents < 1:
            return ErrorResponse(
                msg="Invalid order amount",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
            
        expires_at = int(time.time()) + 60 * 30
        
        try:
            
            session = client.v1.checkout.sessions.create(
                params={
                    "ui_mode":"embedded_page",
                    "line_items":[
                        {
                            "price_data":{
                                "currency":"hkd",
                                "product_data":{
                                    "name": f"Order #{order_id}"
                                },
                                "unit_amount_decimal":amount_cents
                            },"quantity":1,
                        }
                        
                    ],
                    "expires_at":expires_at,
                    "mode":"payment",
                    "return_url":domain+'/dashboard/checkout/return?session_id={CHECKOUT_SESSION_ID}',
                    "metadata":{'order_id':order_id, "user_id":request.user.id}
                }
            )
        except Exception as e:
            return ErrorResponse(msg=str(e),status_code=status.HTTP_400_BAD_REQUEST)
                
            
        order.payment_session_id = session.id
        order.payment_session_expires_at = timezone.now()+timedelta(minutes=30)
        order.save()
            
        
        return SuccessResponse(msg="",data={"clientSecret":session.client_secret,"session_id":session.id},status_code=status.HTTP_201_CREATED)
    
class StripeSessionStatusAPIView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def get(self,request,session_id):
        try:
            try:
                session = client.v1.checkout.sessions.retrieve(session_id)
            except Exception as e:
                return ErrorResponse(msg=str(e), status_code=status.HTTP_400_BAD_REQUEST)
            
            order_id = session.metadata["order_id"]
            if not order_id:
                return ErrorResponse(msg="Not found Order id at session!",status_code=status.HTTP_404_NOT_FOUND)
            
            try:
                order = Order.objects.get(pk=order_id,user=request.user)
            except Order.DoesNotExist:
                return ErrorResponse(msg="Not found Order!",status_code=status.HTTP_404_NOT_FOUND)


            # get status of stripe
            if session.status == 'complete':
                
                with transaction.atomic():
                    
                    order = Order.objects.select_for_update().get(
                        pk=order_id, user=request.user
                    )
                
                    # update order 
                    should_mark_paid= order.order_status in (
                        Order.OrderStatus.PENDING,
                        Order.OrderStatus.PAYMENT_FAILED
                    )
                    
                    if should_mark_paid:
                        order.order_status=Order.OrderStatus.PROCESSING
                        order.payment_method="Stripe"
                        order.save()
                        
                        # update product -> sell_count
                        for item in order.order_items.select_related("product"):
                            Product.objects.filter(id=item.product.id).update(
                                sell_count = F("sell_count")+item.quantity
                            )
                    
                    # create payment record
                    item, created = Payment.objects.update_or_create(
                        order=order,
                        defaults={
                            "amount":session.amount_total,
                            "status":Payment.PaymentStatus.COMPLETED,
                            "transaction_id":session.id,
                            "currency":session.currency,
                            "gateway_response":str(session)
                        }
                    )
            
            
            order.refresh_from_db()
            
            serializer = OrderModelSerializer(instance=order)
        
            return SuccessResponse(msg="",data={
                "status":session.status,
                "order_detail":serializer.data
            },status_code=status.HTTP_200_OK)
            
        except Exception as e:
            return ErrorResponse(msg=str(e),status_code=status.HTTP_400_BAD_REQUEST)
        

@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookAPIView(APIView):
    authentication_classes=[]
    permission_classes=[permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        
        payload = request.body
        sig_header=request.META.get("HTTP_STRIPE_SIGNATURE","")
        
        try:
            event = stripe.Webhook.construct_event(payload,
                                                   sig_header,
                                                   webhook)
        except ValueError:
            return HttpResponse(status=400)
        except stripe.SignatureVerificationError:
            return HttpResponse(status=400)
        
        event_type = event["type"]
        data_object=event["data"]["object"]
        
        if event_type=="checkout.session.completed":
            self._handle_checkout_completed(data_object)
        elif event_type=="checkout.session.expired":
            self._handle_checkout_expired(data_object)
            
        return HttpResponse(status=200)
    
    def _handle_checkout_completed(self,session):
        
        order_id = session["metadata"]["order_id"]
        if not order_id:
            return 
        
        try:
            order_id = int(order_id)
        except (TypeError, ValueError):
            return
        
        with transaction.atomic():
            try:
                order = Order.objects.select_for_update().get(pk=order_id)
            except Order.DoesNotExist:
                return
            
            should_mark_paid = order.order_status in (
                Order.OrderStatus.PENDING,
                Order.OrderStatus.PAYMENT_FAILED
            )
            if not should_mark_paid:
                return
            
            order.order_status=Order.OrderStatus.PROCESSING
            order.payment_method ="Stripe"
            order.save()
            
            for item in order.order_items.all():
                Product.objects.filter(id=item.product.id).update(
                    sell_count =F("sell_count")+item.quantity
                )
            
            amount = session["amount_total"]
            Payment.objects.update_or_create(
                order=order,
                defaults={
                    "amount":amount,
                    "status":Payment.PaymentStatus.COMPLETED,
                    "transaction_id":session["id"],
                    "currency":session["currency"],
                    "gateway_response":str(session)
                }
            )
                
    def _handle_checkout_expired(self, session):
        order_id = session["metadata"]["order_id"]
        if not order_id:
            return 
        try:
            order_id = int(order_id)
        except (TypeError, ValueError):
            return
            
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return
        if order.order_status != Order.OrderStatus.PENDING:
            return
        order.payment_session_id = None
        order.payment_session_expires_at = None
        order.save()
        
                    
        
        
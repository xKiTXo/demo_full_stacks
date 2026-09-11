from rest_framework import permissions,status
from rest_framework.views import APIView
from .serializers import Order,OrderModelSerializer,OrderItem\
    ,OrderItemModelSerializer,OrderCommentSerializer
from common.response import SuccessResponse,ErrorResponse
from cart.serializers import Cart
from django.db import transaction
from django.db.models import F
from products.serializers import Product

class OrderAPIView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    
    def get(self,request):
        order_list = Order.objects.filter(user=request.user).all()
        serializer = OrderModelSerializer(instance = order_list, many=True)
        return SuccessResponse(msg="",status_code=status.HTTP_200_OK,data=serializer.data)
    
class OrderDetailAPIView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    
    def post(self,request):
        current_user = request.user
        shipping_address=request.data.get("shipping_address")
        if not shipping_address:
            return ErrorResponse(
                msg="shipping address is required",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = Cart.objects.filter(user=current_user).prefetch_related("items__product").get()
        except Cart.DoesNotExist:
            return ErrorResponse(msg="Cart is not found",
                                 status_code=status.HTTP_404_NOT_FOUND)
        
        if not cart.validate_cart():
            return ErrorResponse(msg="Cart is empty",
                                 status_code=status.HTTP_400_BAD_REQUEST)
            
        
        try:
            cart_items = list(cart.items.all())
            with transaction.atomic():
                # lock the products
                product_ids = [item.product.id for item in cart_items]
                locked_products = {
                    p.id: p
                    for p in Product.objects.select_for_update().filter(
                        id__in=product_ids,
                        is_published=True,
                    )
                }
                
                # check stock
                for item in cart_items:
                    product = locked_products.get(item.product.id)
                    if not product:
                        raise ValueError(f"Product unavailable: id={item.product.id}")
                    if item.quantity > product.stock_quantity:
                        raise ValueError(f"Insufficient stock for {product.name}")
                
                total = cart.calculate_total()
        
                # Create Order 
                order = Order.objects.create(
                    user=current_user,
                    discount_amount=0,
                    total_amount=total,
                    shipping_fee=0,
                    shipping_address=shipping_address,
                    order_status=Order.OrderStatus.PENDING,
                )
                
                # Create Order item from cart.items
                for item in cart_items:
                    product = locked_products[item.product.id]
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity= item.quantity,
                        priceAtPurchase= product.price
                    )
                    # reduce product stock by reduce_stock() method
                    if not product.reduce_stock(item.quantity):
                        raise ValueError(f"Insufficient stock for {product.name}")
                
                cart.clear()
        
        except ValueError as e:
            return ErrorResponse(msg=str(e),status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return ErrorResponse(msg=str(e),status_code=status.HTTP_400_BAD_REQUEST)
        
        serializer = OrderModelSerializer(instance=order)
        return SuccessResponse(msg="Order created",data=serializer.data,status_code=status.HTTP_201_CREATED)

    def get(self,request,pk):
        try:
            order_detail = Order.objects.filter(user=request.user).get(pk=pk)
        except Order.DoesNotExist:
            return ErrorResponse(msg="Order not found!",status_code=status.HTTP_404_NOT_FOUND)
        
        serializer = OrderModelSerializer(instance=order_detail)
        return SuccessResponse(msg="",status_code=status.HTTP_200_OK,data=serializer.data)
    
    def delete(self,request,pk):
        try:
            order_detail = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return ErrorResponse(msg="Order not found!",status_code=status.HTTP_404_NOT_FOUND)
        
        # logic delete
        order_detail.order_status = Order.OrderStatus.CANCELLED
        order_detail.save()
        return SuccessResponse(msg="Order cancelled.",status_code=status.HTTP_204_NO_CONTENT)
    
class OrderCommentCreateView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    
    def post(self,request,pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return ErrorResponse(msg="Order not found!",status_code=status.HTTP_400_BAD_REQUEST)

        serializer = OrderCommentSerializer(data=request.data)
        if serializer.is_valid():
            is_admin = getattr(request.user, 'role', None) == 'Admin'
            serializer.save(
                order=order,
                user=request.user,
                is_staff_reply=is_admin,
            )
            return SuccessResponse(msg="",data=serializer.data, status_code=status.HTTP_201_CREATED)
        return ErrorResponse(msg=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

class OrderCancelAPIView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    
    def post(self,request,pk=None):
        order_id = pk
        if not order_id:
            return ErrorResponse(msg="Order id is required",
                                status_code=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                try:
                    order = (
                        Order.objects.select_for_update()
                        .prefetch_related("order_items")
                        .get(pk=order_id,user=request.user)
                    )
                except Order.DoesNotExist:
                    return ErrorResponse(msg="Order not found"
                                        ,status_code=status.HTTP_404_NOT_FOUND)
                
                if order.order_status not in (
                    Order.OrderStatus.PENDING
                ):
                    return ErrorResponse(msg="Only pending orders can be cancelled"
                                        ,status_code=status.HTTP_400_BAD_REQUEST)
                
                order.release_order_stock()
                
                order.order_status = Order.OrderStatus.CANCELLED
                
                if hasattr(order,"payment_session_id"):
                    order.payment_session_id=None
                if hasattr(order,"payment_session_expires_at"):
                    order.payment_session_expires_at=None
                
                order.save()
                
        except Exception as e:
            return ErrorResponse(msg=str(e),status_code=status.HTTP_400_BAD_REQUEST)
        
        serializer = OrderModelSerializer(instance=order)
        
        return SuccessResponse(
            msg="Order cancelled",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    

from rest_framework import serializers
from .models import Order,OrderItem,OrderComment
from users.serializers import UserModelSerializer
from products.serializers import ProductSerializer
from payment.serializers import PaymentSerializer

from django.utils import timezone

class OrderItemModelSerializer(serializers.ModelSerializer):
    
    product = ProductSerializer(read_only=True)
    sub_total = serializers.SerializerMethodField()
    
    class Meta:
        model=OrderItem
        fields="__all__"
        
    def get_sub_total(self,obj):
        return obj.quantity *  obj.product.price
    

class OrderCommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = OrderComment
        fields="__all__"
        read_only_fields = [
            'id',
            'order',
            'username',
            'is_staff_reply',
            'created_datetime',
        ]


class OrderModelSerializer(serializers.ModelSerializer):
    user = UserModelSerializer(read_only=True)
    order_items = OrderItemModelSerializer(many=True,read_only=True)
    payment = PaymentSerializer(read_only=True)
    comments = OrderCommentSerializer(many=True, read_only=True)
    is_payment_session_active = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields="__all__"
        
    def get_is_payment_session_active(self, obj):
        if not obj.payment_session_id or not obj.payment_session_expires_at:
            return False
        return obj.payment_session_expires_at > timezone.now()
        


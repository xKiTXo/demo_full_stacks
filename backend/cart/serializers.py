from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer,ProductImageSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()
    class Meta:
        model=CartItem
        fields="__all__"
    
    def get_subtotal(self, obj):
        return obj.product.price * obj.quantity
    

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True,read_only=True)
    total = serializers.SerializerMethodField()
    
    def get_total(self,obj):
        return sum(item.product.price * item.quantity for item in obj.items.all())
    
    class Meta:
        model= Cart
        fields=['id', 'items', 'total', 'updated_datetime']







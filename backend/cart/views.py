from rest_framework.views import APIView
from .serializers import CartSerializer,Cart,CartItem,CartItemSerializer
from products.serializers import Product
from rest_framework.response import Response
from rest_framework import permissions,status
from common.response import ErrorResponse,SuccessResponse

class CartAPIView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    
    def get(self,request):
        cart , _ = Cart.objects.get_or_create(user = request.user)
        serializer = CartSerializer(cart)
        return SuccessResponse(msg="",data=serializer.data,status_code=status.HTTP_200_OK)

    def delete(self,request):
        cart , _ = Cart.objects.get_or_create(user = request.user)
        cart.clear()
        return SuccessResponse(msg="Cart cleared",status_code=status.HTTP_204_NO_CONTENT)

class CartItemAPIView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    
    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity',1))
        
        if quantity <1:
            return ErrorResponse(msg="Quantity must be at least 1")
    
        try:
            product = Product.objects.get(pk=product_id,is_published=True)
        except Product.DoesNotExist:
            return ErrorResponse(msg='Product not found',status_code=status.HTTP_404_NOT_FOUND)
        
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            item.quantity += quantity
            item.save()
        
        serializer = CartItemSerializer(instance=item)
        return SuccessResponse(msg="Add Success!",data=serializer.data,status_code=status.HTTP_201_CREATED)
    
    def patch(self,request,pk):
    
        try:
            item = CartItem.objects.get(pk=pk,cart__user = request.user)
        except CartItem.DoesNotExist:
            return ErrorResponse(msg='Item not found',status_code=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get("quantity")
        if quantity is None or int(quantity)<1:
            return ErrorResponse(msg='Invalid quantity')
        
        item.quantity = int(quantity)
        item.save()
        
        serializer = CartItemSerializer(instance=item)
        return SuccessResponse(msg="",data=serializer.data)
    
    def delete(self,request,pk):
        try:
            item = CartItem.objects.get(pk=pk,cart__user= request.user)
            item.delete()
            return SuccessResponse(msg="Item removed",data={},status_code=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return ErrorResponse(msg="Item not found",status_code=status.HTTP_404_NOT_FOUND)
        
from rest_framework import serializers
from .models import ProductDetail,Product,ProductImage,Brand,Category,ProductSpecification

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductImage
        fields="__all__"

class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(source='category.name',read_only=True)
    brand_name = serializers.CharField(source='brand.name',read_only=True)
    images = ProductImageSerializer(many=True,read_only=True)
    
    class Meta:
        model = Product
        fields="__all__"

    
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model=Brand
        fields="__all__"
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields="__all__"

class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductSpecification
        fields="__all__"

class ProductDetailSerializer(serializers.ModelSerializer):

    specifications=ProductSpecificationSerializer(many=True,read_only=True)
    full_description = serializers.CharField(source="product.description",read_only=True)
    
    class Meta:
        model = ProductDetail
        fields="__all__"

    
  
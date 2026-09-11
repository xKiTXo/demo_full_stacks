from rest_framework import viewsets, permissions, status, filters
from rest_framework.views import APIView
from .serializers import ProductDetail, ProductDetailSerializer, Product, ProductSerializer, Category, CategorySerializer, Brand, BrandSerializer
from common.response import ErrorResponse, SuccessResponse
from .paginations import CustomPagination
from rest_framework.filters import OrderingFilter


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = CustomPagination
    filter_backends = [OrderingFilter, filters.SearchFilter]
    ordering_fields = ["created_datetime", "sell_count", "price"]
    search_fields = ['name', 'description', 'sku']
    lookup_field = "pk"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return SuccessResponse(msg="", data=serializer.data, status_code=status.HTTP_200_OK)


class ProductDetailAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):

        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return ErrorResponse(msg="Product not found!")

        try:
            productDetail = ProductDetail.objects.get(product=product)
        except Product.DoesNotExist:
            return SuccessResponse(data={})

        serializer = ProductDetailSerializer(instance=productDetail)

        return SuccessResponse(data=serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class SummaryAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):

        popular = Product.objects.order_by("-sell_count").all()[:5]
        popular_serializer = ProductSerializer(instance=popular, many=True)

        latest = Product.objects.order_by("-created_datetime").all()[:5]
        latest_serializer = ProductSerializer(instance=latest, many=True)

        final_data = {
            "popular_products": popular_serializer.data,
            "latest_products": latest_serializer.data,
            "isDeployed": True
        }

        return SuccessResponse(msg="", data=final_data, status_code=status.HTTP_200_OK)

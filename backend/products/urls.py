from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path("products/", views.ProductViewSet.as_view({
        "get": "list",
        "post":"create"
    })),
    path("product/<int:pk>",views.ProductViewSet.as_view({
        "get":"retrieve",
        "put":"update",
        "patch":"partial_update",
        "delete":"destroy"
    })),
    # path("product/<int:pk>",views.ProductDetailAPIView.as_view())
    path("summary/",views.SummaryAPIView.as_view())
]

router = DefaultRouter()
router.register("category",views.CategoryViewSet)
router.register("brand",views.BrandViewSet)

urlpatterns += router.urls

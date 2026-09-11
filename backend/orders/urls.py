from django.urls import path
from . import views

urlpatterns = [
    path("",views.OrderAPIView.as_view()),
    path("order/",views.OrderDetailAPIView.as_view()),
    path("order/<int:pk>/",views.OrderDetailAPIView.as_view()),
    path("order/<int:pk>/comments/",views.OrderCommentCreateView.as_view()),
    path("order/<int:pk>/cancel/",views.OrderCancelAPIView.as_view()),
]

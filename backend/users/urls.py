from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from . import views

urlpatterns = [
    path("account/<int:pk>/",views.RetrieveAPIView.as_view()),
    path("account/update/<int:pk>/",views.UpdateAPIView.as_view()),
    path("account/changePassword/",views.ChangePasswordAPIView.as_view()),
    path('login/', views.CustomTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path("register/",views.RegisterAPIView.as_view()),
    path("contact/",views.ContactCreateAPIView.as_view()),
    # path("list/",views.UserListAPIView.as_view())
]
from django.urls import path
from . import views

payment_view_set = views.PaymentDetailViewSet.as_view({
    "get":"get_one",
    "put":"update_payment",
})
payment_create = views.PaymentDetailViewSet.as_view({
    "post":"create_payment",
})

urlpatterns = [
    path("payment/",payment_create),
    path("payment/<int:pk>/",payment_view_set),
    path("payment/create-checkout-session/",views.StripeCheckoutAPIView.as_view()),
    path("payment/session-status/<str:session_id>",views.StripeSessionStatusAPIView.as_view()),
    path("payment/stripe/webhook/",views.StripeWebhookAPIView.as_view())
]
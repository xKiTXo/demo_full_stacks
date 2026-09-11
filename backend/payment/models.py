from common.models import TimeStampedModel
from django.db import models

class Payment(TimeStampedModel):
    
    class PaymentStatus(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        AUTHORIZED = 'Authorized', 'Authorized'
        COMPLETED = 'Completed', 'Completed'
        FAILED = 'Failed', 'Failed'
        EXPIRED = 'Expired', 'Expired'
        REFUND = 'Refund', 'Refund'
        
    class PaymentMethod(models.TextChoices):
        PAYPAL = 'PayPal', 'PayPal'
        STRIPE = 'Stripe', 'Stripe'
        SIMULATED = 'Simulated', 'Simulated' # use it for dev
    
    
    order = models.OneToOneField("orders.Order", verbose_name=("Order"),on_delete=models.CASCADE,related_name="payment",db_constraint=False)
    amount= models.DecimalField(max_digits=12,decimal_places=2)
    status = models.CharField(max_length=20,choices=PaymentStatus.choices,default=PaymentStatus.PENDING)
    transaction_id = models.CharField(max_length=255,null=True,blank=True)
    currency = models.CharField(max_length=10,default='HKD')
    gateway_response= models.TextField(blank=True,null=True)
    payment_method = models.CharField(max_length=20,choices=PaymentMethod.choices,default=PaymentMethod.SIMULATED)
    
    def __str__(self):
        return f"Payment for Order #{self.order.id}"
    
    def processPayment(self):
        self.status = self.PaymentStatus.COMPLETED
        self.save(update_fields=['status', 'updated_datetime'])

    def refund(self):
        self.status = self.PaymentStatus.REFUND
        self.save(update_fields=['status', 'updated_datetime'])
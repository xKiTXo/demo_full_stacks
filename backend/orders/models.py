from django.db import models
from common.models import TimeStampedModel
from products.serializers import Product
from django.db.models import F


class Order(TimeStampedModel):
    
    class OrderStatus(models.TextChoices):
        PENDING = 'Pending','Pending'
        PAYMENT_FAILED = 'Payment_failed', 'Payment Failed'
        PROCESSING = 'Processing', 'Processing'
        SHIPPED = 'Shipped', 'Shipped'
        DELIVERED = 'Delivered', 'Delivered'
        CANCELLED = 'Cancelled', 'Cancelled'
        REFUND = 'Refund', 'Refund'
        COMPLETED = 'Completed','Completed'
        EXPIRED = 'Expired','Expired'
    
    user = models.ForeignKey("users.User",on_delete=models.SET_NULL,null=True,db_constraint=False, related_name="orders")
    total_amount = models.DecimalField(max_digits=12,decimal_places=2)
    order_status = models.CharField(max_length=20,choices=OrderStatus.choices,default=OrderStatus.PENDING)
    shipping_address = models.TextField()
    tracking_number = models.CharField(max_length=100,null=True,blank=True)
    shipping_fee = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    discount_amount = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    payment_method = models.CharField(max_length=20,null=True,blank=True)
    payment_session_id = models.CharField(max_length=255,blank=True,null=True,db_index=True)
    payment_session_expires_at = models.DateTimeField(null=True,blank=True)
    
    class Meta:
        ordering=["-created_datetime"]
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
    
    def release_order_stock(self):
        for item in self.order_items.all():
            Product.objects.filter(id=item.product.id).update(
                stock_quantity=F("stock_quantity") + item.quantity
            )
        
    
    
class OrderItem(TimeStampedModel):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,db_constraint=True, related_name="order_items")
    product = models.ForeignKey("products.Product",on_delete=models.PROTECT,db_constraint=False)
    quantity = models.PositiveIntegerField(default=1)
    priceAtPurchase = models.DecimalField(max_digits=10,decimal_places=2)
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    def getSubTotal(self):
        return self.quantity * self.priceAtPurchase

class OrderComment(TimeStampedModel):
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='comments',
        db_constraint=False
    )
    user = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_comments',
        db_constraint=False
    )
    content = models.TextField()
    is_staff_reply = models.BooleanField(
        default=False,
        help_text='is admin reply message?'
    )
    
    class Meta:
        ordering = ['-created_datetime']
    
    def __str__(self):
        return f'Order #{self.order_id} - {self.content[:10]}'
    
    
    
from django.db import models

class Cart(models.Model):
    user = models.OneToOneField("users.User",on_delete=models.CASCADE,
                                db_constraint=False,related_name="cart")
    updated_datetime=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.username}"
    
    def calculate_total(self):
        return sum(item.get_subtotal() for item in self.items.all())
    
    def validate_cart(self) -> bool:
        return self.items.count() > 0
    
    def clear(self):
        self.items.all().delete()
    
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart,on_delete=models.CASCADE,db_constraint=False,related_name="items")
    product = models.ForeignKey("products.Product",on_delete=models.CASCADE,db_constraint=False)
    quantity= models.PositiveIntegerField(default=1)
    
    class Meta:
        unique_together = ('cart', 'product')
    
    def get_subtotal(self):
        return self.product.price * self.quantity
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    
    
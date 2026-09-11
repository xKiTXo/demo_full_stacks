from django.db import models
from common.models import TimeStampedModel
from django.db.models import F


class Brand(TimeStampedModel):
    name =models.CharField(max_length=100, unique=True)
    parent_brand=models.ForeignKey(
        'self', on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="children",
        db_constraint=False
    )
    
    def __str__(self):
        return self.name

class Category(TimeStampedModel):
    name = models.CharField(max_length=100)
    target_type = models.CharField(max_length=50,blank=True,null=True)
    parent_category = models.ForeignKey(
        'self', on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='children',
        db_constraint=False
    )
    
    class Meta:
        verbose_name = "Categories"
    
    def __str__(self):
        return self.name

    def get_sub_categories(self):
        return self.children.all()
    
class Product(TimeStampedModel):
    name= models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True)
    weight = models.FloatField(null=True, blank=True)
    rating = models.FloatField(default=0.0)
    is_published = models.BooleanField(default=True)
    sell_count = models.PositiveIntegerField(default=0)
    brand = models.ForeignKey(Brand, db_constraint=False,on_delete=models.SET_NULL,
                            null=True, blank=True, related_name='products')
    category = models.ForeignKey(Category,null=True, db_constraint=False,on_delete=models.SET_NULL,
                            related_name='products')
    
    # by timeline
    # Wishlist (Many-to-Many)
    wishlisted_by = models.ManyToManyField(
        "users.User",
        related_name='wishlist',
        blank=True
    )
    
    def __str__(self):
        return self.name
    
    def is_available(self):
        return self.is_published and self.stock_quantity > 0

    def increase_stock(self, quantity):
        self.stock_quantity += quantity
        self.save(update_fields=['stock_quantity'])

    def reduce_stock(self, quantity:int)->bool:
        updated = Product.objects.filter(
            pk=self.pk, 
            stock_quantity__gte = quantity
        ).update(stock_quantity=F("stock_quantity")-quantity)
        return bool(updated)
        

    def get_all_specifications(self):
        return self.specifications.all()
    
    
class ProductDetail(TimeStampedModel):
    product = models.OneToOneField(Product,db_constraint=False,
                                on_delete=models.CASCADE,related_name="detail")
    full_description = models.TextField(blank=True)
    
    def __str__(self):
        return f"Detail of {self.product.name}"

class SpecificationName(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class ProductSpecification(models.Model):
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='specifications', 
        db_constraint=False
    )
    specification = models.ForeignKey(
        SpecificationName, 
        on_delete=models.PROTECT,
        db_constraint=False,
        related_name='product_specs'
    )
    value = models.CharField(max_length=255)
    
    class Meta:
        unique_together = ('product', 'specification')

    def __str__(self):
        return f"{self.product.name} - {self.specification.name}: {self.value}"

class ProductImage(TimeStampedModel):
    
    product = models.ForeignKey(Product,db_constraint=False,on_delete=models.CASCADE,related_name="images")
    image = models.ImageField(upload_to="images")
    isMain=models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['sort_order']
        
    def __str__(self):
        return f"{self.product.name} image #{self.pk}"
    
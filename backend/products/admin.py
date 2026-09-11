from django.contrib import admin
from .models import ProductImage,Product,Brand,Category,ProductDetail,ProductSpecification,SpecificationName

class ProductModelAdmin(admin.ModelAdmin):
    pass
    
class BrandModelAdmin(admin.ModelAdmin):
    pass
    
class CategoryModelAdmin(admin.ModelAdmin):
    pass
    
class ProductDetailModelAdmin(admin.ModelAdmin):
    pass

# Performance
class ProductSpecificationModelAdmin(admin.ModelAdmin):
    pass

class SpecificationNameModelAdmin(admin.ModelAdmin):
    list_display=['id','name']
    list_display_links=None
    ordering=['id']
    actions_on_bottom=True
    list_editable=['name']
    list_per_page=10
    search_fields=['name']

class ProductImageModelAdmin(admin.ModelAdmin):
    pass

admin.site.register(Product,ProductModelAdmin)
admin.site.register(Brand,BrandModelAdmin)
admin.site.register(Category,CategoryModelAdmin)
admin.site.register(ProductDetail,ProductDetailModelAdmin)
admin.site.register(ProductSpecification,ProductSpecificationModelAdmin)
admin.site.register(SpecificationName,SpecificationNameModelAdmin)
admin.site.register(ProductImage,ProductImageModelAdmin)

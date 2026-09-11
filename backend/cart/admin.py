from django.contrib import admin
from .models import CartItem,Cart

class CartModelAdmin(admin.ModelAdmin):
    pass

class CartItemModelAdmin(admin.ModelAdmin):
    pass 

admin.site.register(Cart,CartModelAdmin)
admin.site.register(CartItem,CartItemModelAdmin)


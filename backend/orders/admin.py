from django.contrib import admin
from .models import Order,OrderItem,OrderComment


class OrderCommentModelAdmin(admin.ModelAdmin):
    pass
    # def save_model(self, request, obj, form, change):
    #     if not change:
    #         obj.user = request.user
    #     if getattr(request.user, 'role', None) == 'Admin' or request.user.is_staff:
    #         obj.is_staff_reply = True
    #     else:
    #         obj.is_staff_reply = False
    #     super().save_model(request, obj, form, change)
    

class OrderModelAdmin(admin.ModelAdmin):
    pass 

class OrderItemModelAdmin(admin.ModelAdmin):
    pass


admin.site.register(Order,OrderModelAdmin)
admin.site.register(OrderItem,OrderItemModelAdmin)
admin.site.register(OrderComment,OrderCommentModelAdmin)

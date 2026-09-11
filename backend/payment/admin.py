from django.contrib import admin
from .models import Payment

class PaymentModelAdmin(admin.ModelAdmin):
    pass

admin.site.register(Payment,PaymentModelAdmin)

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User,ContactMessage

class CustomUserAdmin(UserAdmin):
     list_display = ("username", "email", "phone_number", "is_staff")
     
     # Change detail page
     fieldsets = (
          (None, {"fields": ("username", "password")}),
          ("Personal info", {"fields": ("first_name", "last_name", "email",
                                        "phone_number",      
                                        "profile_image",     
                                        "description",)
                             }
           ),
          (
               "Permissions",
               {
                    "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                    ),
               },
          ),
          ("Important dates", {"fields": ("last_login", "date_joined")}),
          ("Verification", {"fields": ("email_verified",)})
     )
     
     add_fieldsets = (
          (
               None,
               {
                    "classes": ("wide",),
                    "fields": ("username", "email", "phone_number", "password1", "password2"),
               },
          ),
     )
     
class ContactModelAdmin(admin.ModelAdmin):
     pass

admin.site.register(User,CustomUserAdmin)
admin.site.register(ContactMessage,ContactModelAdmin)



from django.contrib.auth.models import AbstractUser
from common.models import TimeStampedModel
from django.db import models

class User(AbstractUser,TimeStampedModel):
    
    class ROLE_CHOICES(models.TextChoices):
        Member = 'Member','Member'
        Admin = 'Admin','Admin'
        
    role = models.CharField(max_length=10, choices=ROLE_CHOICES.choices, default=ROLE_CHOICES.Member)
    phone_number = models.CharField(max_length=20,unique=True,null=True,blank=True,default=None)
    email_verified =models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='avatar',null=True,blank=True)
    description = models.TextField(null=True,blank=True)
    
    class Meta:
        db_table = "member"
        
    def __str__(self):
        return self.username
   
    def is_member(self):
        return self.role == self.ROLE_CHOICES.Member

  
    def is_admin_user(self):
        return self.role == self.ROLE_CHOICES.Admin
        
        
class Address(TimeStampedModel):
    user = models.ForeignKey(User,on_delete=models.CASCADE,db_constraint=False,related_name="address_list")
    name= models.CharField(max_length=100)
    address_line_1=models.CharField(max_length=255)
    address_line_2=models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state= models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20)
    region = models.CharField(max_length=100, blank=True, null=True)
    id_active= models.BooleanField(default=True)
    id_shipping= models.BooleanField(default=True)
    id_default= models.BooleanField(default=False)
    

class ContactMessage(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING ="Pending","Pending"
        READ ="Read","Read"
        REPLIED ="Replied","Replied"
        CLOSED ="Closed","Closed"
    
    name=models.CharField(max_length=100)
    email=models.EmailField()
    phone=models.CharField(max_length=20,blank=True,null=True)
    subject=models.CharField(max_length=200)
    message=models.TextField()
    status=models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL,db_constraint=False,
                            null=True,blank=True,related_name="contact_message")
    
    admin_note = models.TextField(blank=True,null=True)
    
    class Meta:
        ordering=["-created_datetime"]
    
    def __str__(self):
        return f"{self.subject} - {self.email}"    
    
    
    
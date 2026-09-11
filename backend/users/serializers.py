from rest_framework import serializers,status
from django.contrib.auth.models import Group
from .models import User,Address,ContactMessage
from common.response import SuccessResponse
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

import os


class AddressModelSerializer(serializers.ModelSerializer):
    class Meta:
        model=Address
        fields="__all__"

class UserModelSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(max_length=128,write_only=True)
    re_password = serializers.CharField(max_length=128,write_only=True)
    address_list= AddressModelSerializer(many=True,read_only=True)
    
    class Meta:
        model=User
        fields="__all__"
        
    def validate(self, attrs):
        if attrs["password"]!=attrs["re_password"]:
            raise serializers.ValidationError({
                "password":"Password fields didn't match"
            })
        username = attrs["username"].lower()
        if "admin" in username or "root" in username:
            raise serializers.ValidationError({
                "username":"Username cannot contain 'admin' or 'root'."
            })
        return attrs
    
    def create(self, validated_data):
        
        validated_data.pop("re_password")
        # ORM 
        user = User.objects.create_user(
            username=validated_data.get("username"),
            email=validated_data.get("email",""),
            password=validated_data.get("password"),
            phone_number=validated_data.get("phone_number")
        )
        
        # Member group
        # created: boolean
        group, created = Group.objects.get_or_create(name="Member")
        user.groups.add(group)
        
        return SuccessResponse(msg="Created Account Successed!",data=user,status_code=status.HTTP_201_CREATED)

class UserProfileModelSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=User
        # fields="__all__"
        read_only_fields=['password','username']
        exclude=['password']
    
    def update(self, instance, validated_data):
        new_image = validated_data.get("profile_image",None)
        if new_image and instance.profile_image:
            old_image_path = instance.profile_image.path
            if os.path.isfile(old_image_path):
                try:
                    os.remove(old_image_path)
                except Exception as e:
                    print(f"Failed to delete old image: {e}")

        return super().update(instance, validated_data)
        
class UserChangePasswordModelSerializer(serializers.Serializer):
    
    old_password=serializers.CharField(required=True,write_only=True)
    new_password=serializers.CharField(required=True,write_only=True)
    re_password=serializers.CharField(required=True,write_only=True)
    
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['re_password']:
            raise serializers.ValidationError({
                "new_password":"New passwords do not match."
            })
        return attrs
    
    def save(self, **kwargs):
        
        user = self.context['request'].user
        print("🚀 ~ UserChangePasswordModelSerializer ~ save ~ user:", user)
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
        
class ContactMessageModelSerializer(serializers.ModelSerializer):
    class Meta:
        model=ContactMessage
        fields="__all__"
        read_only_fields=['id','status','created_datetime']
        
class UserStaffListModelSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["is_staff","is_active","username","created_datetime"]
        ordering=["created_datetime"]


# Custom Token claims
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user):
        token = super().get_token(user)
        token["username"]=user.username
        token["role"]=user.role
        token["email"]=user.email
        token["phone_number"]=user.phone_number
        token["description"]=user.description
        
        return token
        

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from .serializers import UserModelSerializer, User, UserProfileModelSerializer, \
    UserChangePasswordModelSerializer, ContactMessageModelSerializer, ContactMessage, \
    UserStaffListModelSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from common.response import SuccessResponse, ErrorResponse

# API View


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserModelSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return SuccessResponse(
            msg="User registered successfully.",
            data={}, status_code=status.HTTP_201_CREATED)


class ChangePasswordAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        serializer = UserChangePasswordModelSerializer(
            data=request.data,
            context={"request": request}
        )
        if serializer.is_valid():

            serializer.save()
            return SuccessResponse(data={}, msg="Password changed successfully.",
                                   status_code=status.HTTP_200_OK)
        return ErrorResponse(msg=serializer.errors,
                             status_code=status.HTTP_400_BAD_REQUEST)


class UpdateAPIView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserProfileModelSerializer
    lookup_field = 'pk'


class RetrieveAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserModelSerializer
    lookup_field = "pk"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return SuccessResponse(data=serializer.data, msg="", status_code=status.HTTP_200_OK)


class ContactCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageModelSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserStaffListModelSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes=[]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            return SuccessResponse(msg="", data=serializer.validated_data, status_code=status.HTTP_200_OK)

        except Exception as e:
            return ErrorResponse(msg="Invalid credentials", status_code=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            return SuccessResponse(msg="Token refreshed", data=serializer.validated_data, status_code=status.HTTP_200_OK)

        except TokenError as e:
            return ErrorResponse(msg=str(e), status_code=status.HTTP_401_UNAUTHORIZED)

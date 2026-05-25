import random
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpResponse
from django.db import transaction
from openpyxl import Workbook

from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

# Simple JWT tokens helper to manually mint access tokens upon registration or OTP success
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Expense, Budget, UserProfile
from .serializers import ExpenseSerializer, BudgetSerializer


# --- 🍪 CUSTOM AUTHENTICATION PIECE: EXTRACTS TOKENS FROM SECURE COOKIES NATIVELY ---
# class JWTCookieAuthentication(JWTAuthentication):
#     def authenticate(self, request):
#         # Extract the token string directly out of the secure cookie storage layer
#         raw_token = request.COOKIES.get('access_token') or request.COOKIES.get('JWT')
        
#         if raw_token is None:
#             return None
            
#         validated_token = self.get_validated_token(raw_token)
#         return self.get_user(validated_token), validated_token


class UserRegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user, is_verified=True)
        return user


# --- REGISTRATION: AUTOMATICALLY MINTS VALID SESSION SIGNATURES ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def options(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_200_OK)
        return response

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
        response = Response({
            "is_verified": True,
            "username": user.username,
            "detail": "Registration successful. Welcome to your dashboard!"
        }, status=status.HTTP_201_CREATED)

        # BAKE TOKENS DIRECTLY INTO SECURE COOKIES
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=False,  # Set to True when you move to HTTPS production
            samesite='Lax',
            max_age=3600  # Valid for 1 Hour
        )
        return response


# --- LOGIN ENFORCES EMAIL OTP EVERY SINGLE TIME ---
# --- UPDATE IN YOUR expenses/views.py ---

class LedgerFlowTokenObtainPairView(APIView):
    permission_classes = [AllowAny]

    def options(self, request, *args, **kwargs):
        # 👑 MANUALLY ENFORCE PREFLIGHT CREDENTIAL APPROVALS NATIVELY
        response = Response(status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Headers"] = "content-type, authorization, x-csrftoken"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        
        if user is not None:
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.is_verified = False
            otp_code = profile.generate_otp()
            
            try:
                send_mail(
                    subject='LedgerFlow Security - Login Verification Code',
                    message=f'Your secure One-Time Password (OTP) login code is: {otp_code}. Use this to verify your session access.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception:
                return Response({"detail": "Mail delivery failure. Check configuration backend settings."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                "detail": "OTP generated and sent to email.",
                "is_verified": False,
                "username": user.username
            }, status=status.HTTP_200_OK)
            
        return Response({"detail": "Invalid username or password credentials."}, status=status.HTTP_401_UNAUTHORIZED)


# --- OTP VALIDATION ENDPOINT ---
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def options(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_200_OK)
        return response

    def post(self, request):
        username = request.data.get('username', '').strip()
        otp_submitted = request.data.get('otp', '').strip()
        
        try:
            user = User.objects.get(username=username)
            profile = user.profile
            
            if profile.otp == otp_submitted and otp_submitted != "":
                profile.is_verified = True
                profile.otp = None  
                profile.save()
                
                refresh = RefreshToken.for_user(user)
                
                response = Response({
                    "is_verified": True,
                    "username": user.username,
                    "detail": "Identity successfully authenticated."
                }, status=status.HTTP_200_OK)

                response.set_cookie(
                    key='access_token',
                    value=str(refresh.access_token),
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                    max_age=3600
                )
                return response
            else:
                return Response({"detail": "Invalid or expired 6-digit token entry mismatch."}, status=status.HTTP_400_BAD_REQUEST)
                
        except User.DoesNotExist:
            return Response({"detail": "User target scope validation error."}, status=status.HTTP_440_LOGIN_TIMEOUT)


# --- FINANCIAL DATA CORE TRANSACTIONS WORKSPACE ---
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def export_excel(self, request):
        queryset = self.get_queryset()
        
        wb = Workbook()
        ws = wb.active
        ws.title = "Financial Statement"
        
        headers = ["Transaction Date", "Description Title", "Category", "Transaction Type", "Amount (₹)"]
        ws.append(headers)
        
        for item in queryset:
            ws.append([
                str(item.date),
                item.title,
                item.category,
                item.get_type_display(),
                float(item.amount)
            ])
            
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="ledgerflow_report.xlsx"'
        wb.save(response)
        return response

    
class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
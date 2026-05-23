from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpenseViewSet, 
    RegisterView, 
    BudgetViewSet, 
    LedgerFlowTokenObtainPairView,  # Handles password evaluation + triggers email OTP
    VerifyOTPView                   # Validates OTP and issues real JWT signatures
)
from rest_framework_simplejwt.views import TokenRefreshView

# Initialize the REST Router for ViewSet routes
router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    # Authentication & Session Handshakes
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LedgerFlowTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Email Identity Verification Endpoint (Triggered right after password login stage)
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    
    # Automatically Include ViewSet Routes (expenses/ and budgets/)
    path('', include(router.urls)),
]
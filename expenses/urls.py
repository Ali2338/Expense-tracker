from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpenseViewSet, 
    RegisterView, 
    BudgetViewSet, 
    LedgerFlowTokenObtainPairView,  
    VerifyOTPView                   
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LedgerFlowTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    
    path('', include(router.urls)),
]
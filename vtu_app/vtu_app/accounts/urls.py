from django.urls import path
from .views import RegisterView, WalletView, InitializeFundingView, VerifyFundingView, ForgotPasswordView, ResetPasswordView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('wallet/', WalletView.as_view()),
    path('wallet/fund/', InitializeFundingView.as_view()),
    path('wallet/verify/<str:reference>/', VerifyFundingView.as_view()),
    path('forgot-password/', ForgotPasswordView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
    
]
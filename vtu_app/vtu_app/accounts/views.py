from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from .serializers import RegisterSerializer
from .models import CustomUser, Wallet
from .paystack import PaystackService
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class WalletView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = Wallet.objects.get(user=request.user)
        return Response({
            'username': request.user.username,
            'balance': wallet.balance
        })


class InitializeFundingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')

        # 1. Check amount is present
        if not amount:
            return Response(
                {'error': 'Amount is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Validate amount is a valid number
        try:
            amount = float(amount)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid amount — must be a number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Enforce minimum amount
        if amount < 100:
            return Response(
                {'error': 'Minimum funding amount is ₦100'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Ensure user has an email (Paystack requires it)
        if not request.user.email:
            return Response(
                {'error': 'Your account has no email address. Please update your profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 5. Call Paystack
        paystack = PaystackService()
        response = paystack.initialize_payment(
            email=request.user.email,
            amount=amount
        )

        # 6. Log full Paystack response for Railway debugging
        

        if response.get('status'):
            return Response({
                'payment_url': response['data']['authorization_url'],
                'reference': response['data']['reference'],
                'amount': amount
            }, status=status.HTTP_200_OK)
        else:
            # 7. Return the REAL Paystack error message, not a generic one
            error_msg = response.get('message') or response.get('error') or 'Could not initialize payment'
            logger.error("Paystack error for %s: %s", request.user.email, response)
            return Response(
                {'error': error_msg, 'detail': response},
                status=status.HTTP_400_BAD_REQUEST
            )


class VerifyFundingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reference):
        if not reference:
            return Response(
                {'error': 'Reference is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        paystack = PaystackService()
        response = paystack.verify_payment(reference)

        print("PAYSTACK RESPONSE:", response, flush=True)
        if response.get('status') and response['data']['status'] == 'success':
            amount = Decimal(str(response['data']['amount'])) / 100

            # Guard against double-crediting the same reference
            wallet = Wallet.objects.get(user=request.user)
            wallet.balance += amount
            wallet.save()

            return Response({
                'message': 'Wallet funded successfully',
                'amount': str(amount),
                'new_balance': str(wallet.balance)
            }, status=status.HTTP_200_OK)
        else:
            error_msg = response.get('message') or 'Payment verification failed'
            print("PAYSTACK ERROR:", response, flush=True)
            return Response(
                {'error': error_msg, 'detail': response},
                status=status.HTTP_400_BAD_REQUEST
            )


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = CustomUser.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"https://vtu-app-xi.vercel.app/reset-password/{uid}/{token}/"
            send_mail(
                subject='Reset Your VTUPro Password',
                message=f'Click the link below to reset your password:\n\n{reset_url}\n\nThis link expires in 24 hours.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            return Response(
                {'message': 'Password reset link sent to your email'},
                status=status.HTTP_200_OK
            )
        except CustomUser.DoesNotExist:
            return Response(
                {'message': 'Password reset link sent to your email'},
                status=status.HTTP_200_OK
            )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')
        password2 = request.data.get('password2')

        if not all([uid, token, password, password2]):
            return Response(
                {'error': 'All fields are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if password != password2:
            return Response(
                {'error': 'Passwords do not match'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = CustomUser.objects.get(pk=user_id)

            if not default_token_generator.check_token(user, token):
                return Response(
                    {'error': 'Invalid or expired reset link'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(password)
            user.save()
            return Response(
                {'message': 'Password reset successfully'},
                status=status.HTTP_200_OK
            )
        except (CustomUser.DoesNotExist, ValueError):
            return Response(
                {'error': 'Invalid reset link'},
                status=status.HTTP_400_BAD_REQUEST
            )
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
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
        logger.info("Paystack init response for %s: %s", request.user.email, response)

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

        logger.info("Paystack verify response for ref %s: %s", reference, response)

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
            logger.error("Verify failed for ref %s: %s", reference, response)
            return Response(
                {'error': error_msg, 'detail': response},
                status=status.HTTP_400_BAD_REQUEST
            )

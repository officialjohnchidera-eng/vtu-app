from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer
from .models import CustomUser, Wallet
from rest_framework.views import APIView

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

from .paystack import PaystackService
from decimal import Decimal

class InitializeFundingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        
        if not amount:
            return Response(
                {'error': 'Amount is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if float(amount) < 100:
            return Response(
                {'error': 'Minimum funding amount is ₦100'},
                status=status.HTTP_400_BAD_REQUEST
            )

        paystack = PaystackService()
        response = paystack.initialize_payment(
            email=request.user.email,
            amount=float(amount)
        )

        if response.get('status'):
            return Response({
                'payment_url': response['data']['authorization_url'],
                'reference': response['data']['reference'],
                'amount': amount
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Could not initialize payment'},
                status=status.HTTP_400_BAD_REQUEST
            )


class VerifyFundingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reference):
        paystack = PaystackService()
        response = paystack.verify_payment(reference)

        if response.get('status') and response['data']['status'] == 'success':
            amount = Decimal(str(response['data']['amount'])) / 100
            wallet = Wallet.objects.get(user=request.user)
            wallet.balance += amount
            wallet.save()

            return Response({
                'message': 'Wallet funded successfully',
                'amount': str(amount),
                'new_balance': str(wallet.balance)
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Payment verification failed'},
                status=status.HTTP_400_BAD_REQUEST
            )
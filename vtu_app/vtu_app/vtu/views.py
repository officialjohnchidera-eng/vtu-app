from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import AirtimePurchaseSerializer, AirtimePurchaseRequestSerializer, DataPurchase, DataPurchaseRequestSerializer, DataPurchaseSerializer
from .models import AirtimePurchase, DataPurchase
from .vtpass import VTPassService
from decimal import Decimal
from accounts.models import Wallet
import uuid

class BuyAirtimeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AirtimePurchaseRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone_number = serializer.validated_data['phone_number']
        network = serializer.validated_data['network']
        amount = serializer.validated_data['amount']

        # Check wallet balance
        wallet = Wallet.objects.get(user=request.user)
        if wallet.balance < amount:
            return Response(
                {'error': 'Insufficient wallet balance'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate unique reference
        reference = str(uuid.uuid4())

        # Call VTPass
        vtpass = VTPassService()
        response = vtpass.buy_airtime(phone_number, float(amount), network)

        # Check if successful
        if response.get('code') == '000':
            wallet.balance -= amount
            wallet.save()
            purchase = AirtimePurchase.objects.create(
                user=request.user,
                phone_number=phone_number,
                network=network,
                amount=amount,
                status='success',
                reference=reference,
                response_data=response
            )
            return Response({
                'message': 'Airtime purchased successfully',
                'reference': reference,
                'amount': amount,
                'phone_number': phone_number,
                'network': network
            }, status=status.HTTP_200_OK)
        else:
            AirtimePurchase.objects.create(
                user=request.user,
                phone_number=phone_number,
                network=network,
                amount=amount,
                status='failed',
                reference=reference,
                response_data=response
            )
            return Response(
                {'error': 'Transaction failed', 'details': response},
                status=status.HTTP_400_BAD_REQUEST
            )


class AirtimePurchaseHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AirtimePurchaseSerializer

    def get_queryset(self):
        return AirtimePurchase.objects.filter(user=self.request.user).order_by('-created_at')


class BuyDataView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DataPurchaseRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone_number = serializer.validated_data['phone_number']
        network = serializer.validated_data['network']
        variation_code = serializer.validated_data['variation_code']

        try:
            # Call VTPass to get bundle price
            vtpass = VTPassService()
            bundles = vtpass.get_data_bundles(network)

            # Find the price of the selected variation
            amount = None
            variations = bundles.get('content', {}).get('varations', [])
            for bundle in variations:
                if bundle.get('variation_code') == variation_code:
                    amount = float(bundle.get('variation_amount'))
                    break

            if not amount:
                return Response(
                    {'error': 'Invalid variation code'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check wallet balance
            wallet = Wallet.objects.get(user=request.user)
            if wallet.balance < amount:
                return Response(
                    {'error': 'Insufficient wallet balance'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Generate reference
            reference = str(uuid.uuid4())

            # Buy data
            response = vtpass.buy_data(phone_number, network, variation_code)

            if response.get('code') == '000':
                wallet.balance -= Decimal(str(amount))
                wallet.save()
                DataPurchase.objects.create(
                    user=request.user,
                    phone_number=phone_number,
                    network=network,
                    variation_code=variation_code,
                    amount=amount,
                    status='success',
                    reference=reference,
                    response_data=response
                )
                return Response({
                    'message': 'Data purchased successfully',
                    'reference': reference,
                    'phone_number': phone_number,
                    'network': network,
                    'variation_code': variation_code
                }, status=status.HTTP_200_OK)
            else:
                DataPurchase.objects.create(
                    user=request.user,
                    phone_number=phone_number,
                    network=network,
                    variation_code=variation_code,
                    amount=0,
                    status='failed',
                    reference=reference,
                    response_data=response
                )
                return Response(
                    {'error': 'Transaction failed', 'details': response},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            print("Error:", str(e))
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DataPurchaseHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DataPurchaseSerializer

    def get_queryset(self):
        return DataPurchase.objects.filter(user=self.request.user).order_by('-created_at')


class DataBundleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, network):
        vtpass = VTPassService()
        bundles = vtpass.get_data_bundles(network)
        return Response(bundles)

class TransactionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        airtime = AirtimePurchase.objects.filter(
            user=request.user
        ).values(
            'id', 'phone_number', 'network', 'amount', 
            'status', 'created_at'
        )

        data = DataPurchase.objects.filter(
            user=request.user
        ).values(
            'id', 'phone_number', 'network', 'amount',
            'status', 'created_at'
        )

        airtime_list = [dict(t, type='airtime') for t in airtime]
        data_list = [dict(t, type='data') for t in data]

        all_transactions = sorted(
            airtime_list + data_list,
            key=lambda x: x['created_at'],
            reverse=True
        )

        return Response(all_transactions, status=status.HTTP_200_OK)
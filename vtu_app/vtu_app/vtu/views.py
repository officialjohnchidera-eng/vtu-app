from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import AirtimePurchaseSerializer, AirtimePurchaseRequestSerializer, CablePurchaseRequestSerializer, DataPurchaseRequestSerializer, DataPurchaseSerializer, CablePurchaseSerializer,ElectricityPurchaseSerializer, ElectricityPurchaseRequestSerializer
from .models import AirtimePurchase, DataPurchase, CablePurchase, ElectricityPurchase
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
        cable = CablePurchase.objects.filter(
            user=request.user
        ).values('id', 'smartcard_number', 'provider', 'amount', 'status', 'created_at')
        cable_list = [dict(t, type='cable', network=t['provider'], phone_number=t['smartcard_number']) for t in cable]

        electricity = ElectricityPurchase.objects.filter(
        user=request.user
        ).values('id', 'meter_number', 'disco', 'amount', 'status', 'created_at')
        electricity_list = [dict(t, type='electricity', network=t['disco'], phone_number=t['meter_number']) for t in electricity]
        airtime_list = [dict(t, type='airtime') for t in airtime]
        data_list = [dict(t, type='data') for t in data]

        all_transactions = sorted(
            airtime_list + data_list + cable_list + electricity_list,
            key=lambda x: x['created_at'],
            reverse=True
        )

        return Response(all_transactions, status=status.HTTP_200_OK)

class VerifySmartcardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        smartcard_number = request.data.get('smartcard_number')
        provider = request.data.get('provider')

        if not smartcard_number or not provider:
            return Response(
                {'error': 'Smartcard number and provider are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            vtpass = VTPassService()
            response = vtpass.verify_smartcard(smartcard_number, provider)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CablePlansView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, provider):
        vtpass = VTPassService()
        plans = vtpass.get_cable_plans(provider)
        return Response(plans)


class BuyCableView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CablePurchaseRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        smartcard_number = serializer.validated_data['smartcard_number']
        provider = serializer.validated_data['provider']
        variation_code = serializer.validated_data['variation_code']

        try:
            vtpass = VTPassService()
            plans = vtpass.get_cable_plans(provider)
            
            amount = None
            variations = plans.get('content', {}).get('varations', []) or plans.get('content', {}).get('variations', [])
            for plan in variations:
                if plan.get('variation_code') == variation_code:
                    amount = float(plan.get('variation_amount'))
                    break

            if not amount:
                return Response(
                    {'error': 'Invalid plan selected'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            wallet = Wallet.objects.get(user=request.user)
            if wallet.balance < amount:
                return Response(
                    {'error': 'Insufficient wallet balance'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            reference = str(uuid.uuid4())
            response = vtpass.buy_cable(smartcard_number, provider, variation_code, amount)

            if response.get('code') == '000':
                wallet.balance -= Decimal(str(amount))
                wallet.save()
                CablePurchase.objects.create(
                    user=request.user,
                    smartcard_number=smartcard_number,
                    provider=provider,
                    variation_code=variation_code,
                    amount=amount,
                    status='success',
                    reference=reference,
                    response_data=response
                )
                return Response({
                    'message': 'Cable subscription successful',
                    'reference': reference,
                    'smartcard_number': smartcard_number,
                    'provider': provider,
                    'variation_code': variation_code
                }, status=status.HTTP_200_OK)
            else:
                CablePurchase.objects.create(
                    user=request.user,
                    smartcard_number=smartcard_number,
                    provider=provider,
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


class CablePurchaseHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CablePurchaseSerializer

    def get_queryset(self):
        return CablePurchase.objects.filter(user=self.request.user).order_by('-created_at')


class VerifyMeterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        meter_number = request.data.get('meter_number')
        disco = request.data.get('disco')
        meter_type = request.data.get('meter_type')

        if not meter_number or not disco or not meter_type:
            return Response(
                {'error': 'Meter number, disco and meter type are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            vtpass = VTPassService()
            response = vtpass.verify_meter(meter_number, disco, meter_type)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BuyElectricityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectricityPurchaseRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        meter_number = serializer.validated_data['meter_number']
        disco = serializer.validated_data['disco']
        meter_type = serializer.validated_data['meter_type']
        amount = serializer.validated_data['amount']
        phone = serializer.validated_data['phone']

        try:
            wallet = Wallet.objects.get(user=request.user)
            if wallet.balance < amount:
                return Response(
                    {'error': 'Insufficient wallet balance'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            reference = str(uuid.uuid4())
            vtpass = VTPassService()
            response = vtpass.buy_electricity(meter_number, disco, meter_type, float(amount), phone)

            if response.get('code') == '000':
                wallet.balance -= Decimal(str(amount))
                wallet.save()

                token = response.get('content', {}).get('transactions', {}).get('token', None)
                customer_name = response.get('content', {}).get('transactions', {}).get('customer_name', None)

                ElectricityPurchase.objects.create(
                    user=request.user,
                    disco=disco,
                    meter_number=meter_number,
                    meter_type=meter_type,
                    amount=amount,
                    customer_name=customer_name,
                    token=token,
                    status='success',
                    reference=reference,
                    response_data=response
                )
                return Response({
                    'message': 'Electricity purchase successful',
                    'token': token,
                    'reference': reference,
                    'amount': str(amount),
                    'meter_number': meter_number
                }, status=status.HTTP_200_OK)
            else:
                ElectricityPurchase.objects.create(
                    user=request.user,
                    disco=disco,
                    meter_number=meter_number,
                    meter_type=meter_type,
                    amount=amount,
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


class ElectricityPurchaseHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ElectricityPurchaseSerializer

    def get_queryset(self):
        return ElectricityPurchase.objects.filter(user=self.request.user).order_by('-created_at')


class DebugIPView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        import requests
        from django.conf import settings
        ip_response = requests.get('https://api.ipify.org?format=json')
        return Response({
            'ip': ip_response.json()['ip'],
            'api_key': settings.VTPASS_API_KEY[:8] + '...',
            'public_key': settings.VTPASS_PUBLIC_KEY[:8] + '...',
            'secret_key': settings.VTPASS_SECRET_KEY[:8] + '...',
            'base_url': settings.VTPASS_BASE_URL
        })
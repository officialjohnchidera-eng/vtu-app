from rest_framework import serializers
from .models import AirtimePurchase, DataPurchase, CablePurchase, ElectricityPurchase

class AirtimePurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirtimePurchase
        fields = ['id', 'phone_number', 'network', 'amount', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

class AirtimePurchaseRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    network = serializers.ChoiceField(choices=['mtn', 'airtel', 'glo', 'etisalat'])
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_amount(self, value):
        if value < 50:
            raise serializers.ValidationError("Minimum airtime purchase is ₦50")
        return value

    def validate_phone_number(self, value):
        if not value.startswith('0') or len(value) != 11:
            raise serializers.ValidationError("Enter a valid Nigerian phone number")
        return value

class DataPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataPurchase
        fields = ['id', 'phone_number', 'network', 'variation_code', 'amount', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

class DataPurchaseRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    network = serializers.ChoiceField(choices=['mtn', 'airtel', 'glo', 'etisalat'])
    variation_code = serializers.CharField(max_length=50)

    def validate_phone_number(self, value):
        if not value.startswith('0') or len(value) != 11:
            raise serializers.ValidationError("Enter a valid Nigerian phone number")
        return value


class CablePurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CablePurchase
        fields = ['id', 'smartcard_number', 'provider', 'variation_code', 'amount', 'customer_name', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at', 'customer_name']

class CablePurchaseRequestSerializer(serializers.Serializer):
    smartcard_number = serializers.CharField(max_length=20)
    provider = serializers.ChoiceField(choices=['dstv', 'gotv', 'startimes'])
    variation_code = serializers.CharField(max_length=50)

    def validate_smartcard_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Smartcard number must contain only digits")
        return value


class ElectricityPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectricityPurchase
        fields = ['id', 'disco', 'meter_number', 'meter_type', 'amount', 'customer_name', 'token', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at', 'customer_name', 'token']

class ElectricityPurchaseRequestSerializer(serializers.Serializer):
    meter_number = serializers.CharField(max_length=20)
    disco = serializers.ChoiceField(choices=[
        'ikeja-electric', 'eko-electric', 'abuja-electric',
        'kano-electric', 'portharcourt-electric', 'jos-electric',
        'ibadan-electric', 'kaduna-electric', 'enugu-electric',
        'benin-electric', 'aba-electric', 'yola-electric'
    ])
    meter_type = serializers.ChoiceField(choices=['prepaid', 'postpaid'])
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    phone = serializers.CharField(max_length=20)

    def validate_amount(self, value):
        if value < 500:
            raise serializers.ValidationError("Minimum electricity purchase is ₦500")
        return value
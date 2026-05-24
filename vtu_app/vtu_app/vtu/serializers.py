from rest_framework import serializers
from .models import AirtimePurchase, DataPurchase, CablePurchase

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
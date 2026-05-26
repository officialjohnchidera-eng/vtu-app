from django.db import models
from accounts.models import CustomUser

class AirtimePurchase(models.Model):
    NETWORK_CHOICES = [
        ('mtn', 'MTN'),
        ('airtel', 'Airtel'),
        ('glo', 'Glo'),
        ('etisalat', '9mobile'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    network = models.CharField(max_length=20, choices=NETWORK_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=100, unique=True)
    response_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.network} - ₦{self.amount} - {self.status}"

class DataPurchase(models.Model):
    NETWORK_CHOICES = [
        ('mtn', 'MTN'),
        ('airtel', 'Airtel'),
        ('glo', 'Glo'),
        ('etisalat', '9mobile'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    network = models.CharField(max_length=20, choices=NETWORK_CHOICES)
    variation_code = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=100, unique=True)
    response_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.network} data - {self.status}"


class CablePurchase(models.Model):
    PROVIDER_CHOICES = [
        ('dstv', 'DSTV'),
        ('gotv', 'GOtv'),
        ('startimes', 'Startimes'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    smartcard_number = models.CharField(max_length=20)
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    variation_code = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    customer_name = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=100, unique=True)
    response_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.provider} - {self.status}"


class ElectricityPurchase(models.Model):
    DISCO_CHOICES = [
        ('ikeja-electric', 'Ikeja Electric'),
        ('eko-electric', 'Eko Electric'),
        ('abuja-electric', 'Abuja Electric'),
        ('kano-electric', 'Kano Electric'),
        ('portharcourt-electric', 'Port Harcourt Electric'),
        ('jos-electric', 'Jos Electric'),
        ('ibadan-electric', 'Ibadan Electric'),
        ('kaduna-electric', 'Kaduna Electric'),
        ('enugu-electric', 'Enugu Electric'),
        ('benin-electric', 'Benin Electric'),
        ('aba-electric', 'Aba Electric'),
        ('yola-electric', 'Yola Electric'),
    ]

    METER_CHOICES = [
        ('prepaid', 'Prepaid'),
        ('postpaid', 'Postpaid'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    disco = models.CharField(max_length=50, choices=DISCO_CHOICES)
    meter_number = models.CharField(max_length=20)
    meter_type = models.CharField(max_length=10, choices=METER_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    customer_name = models.CharField(max_length=100, null=True, blank=True)
    customer_address = models.CharField(max_length=200, null=True, blank=True)
    token = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=100, unique=True)
    response_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.disco} - ₦{self.amount} - {self.status}"
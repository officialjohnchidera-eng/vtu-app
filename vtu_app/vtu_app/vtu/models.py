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
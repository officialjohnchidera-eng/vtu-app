import requests
from django.conf import settings


class PaystackService:
    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.base_url = 'https://api.paystack.co'

    def get_headers(self):
        return {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json'
        }

    def initialize_payment(self, email, amount):
        url = f"{self.base_url}/transaction/initialize"
        payload = {
            'email': email,
            'amount': int(amount * 100)  # Paystack uses kobo
        }
        try:
            response = requests.post(url, json=payload, headers=self.get_headers(), timeout=30)
            return response.json()
        except Exception as e:
            return {'status': False, 'message': str(e)}

    def verify_payment(self, reference):
        url = f"{self.base_url}/transaction/verify/{reference}"
        try:
            response = requests.get(url, headers=self.get_headers(), timeout=30)
            return response.json()
        except Exception as e:
            return {'status': False, 'message': str(e)}
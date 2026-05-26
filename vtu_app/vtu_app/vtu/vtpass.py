import requests
from django.conf import settings
import time


class VTPassService:
    def __init__(self):
        self.base_url = settings.VTPASS_BASE_URL
        self.api_key = settings.VTPASS_API_KEY
        self.public_key = settings.VTPASS_PUBLIC_KEY
        self.secret_key = settings.VTPASS_SECRET_KEY

    def get_headers_get(self):
        return {
            'api-key': self.api_key,
            'public-key': self.public_key,
            'Content-Type': 'application/json'
        }

    def get_headers_post(self):
        return {
            'api-key': self.api_key,
            'secret-key': self.secret_key,
            'Content-Type': 'application/json'
        }

    def buy_airtime(self, phone_number, amount, network):
        url = f"{self.base_url}/pay"
        payload = {
            'request_id': f"airtime_{phone_number}_{amount}_{int(time.time())}",
            'serviceID': network,
            'amount': amount,
            'phone': phone_number
        }
        try:
            response = requests.post(url, json=payload, headers=self.get_headers_post(), timeout=30)
            print("VTPass Response:", response.text)
            print("Status Code:", response.status_code)
            return response.json()
        except requests.exceptions.ReadTimeout:
            return {'code': 'timeout', 'message': 'Request timed out. Please try again.'}
        except requests.exceptions.ConnectionError:
            return {'code': 'connection_error', 'message': 'Could not connect to VTPass. Check your internet connection.'}
        except Exception as e:
            return {'code': 'error', 'message': str(e)}

    def buy_data(self, phone_number, network, variation_code):
        url = f"{self.base_url}/pay"
        payload = {
            'request_id': f"data_{phone_number}_{variation_code}_{int(time.time())}",
            'serviceID': f"{network}-data",
            'billersCode': phone_number,
            'variation_code': variation_code,
            'amount': '',
            'phone': phone_number
        }
        try:
            response = requests.post(url, json=payload, headers=self.get_headers_post(), timeout=30)
            print("VTPass Data Response:", response.text)
            print("Status Code:", response.status_code)
            return response.json()
        except requests.exceptions.ReadTimeout:
            return {'code': 'timeout', 'message': 'Request timed out. Please try again.'}
        except requests.exceptions.ConnectionError:
            return {'code': 'connection_error', 'message': 'Could not connect to VTPass.'}
        except Exception as e:
            return {'code': 'error', 'message': str(e)}

    def get_data_bundles(self, network):
        url = f"{self.base_url}/service-variations?serviceID={network}-data"
        try:
            response = requests.get(url, headers=self.get_headers_get(), timeout=30)
            return response.json()
        except Exception as e:
            return {'code': 'error', 'message': str(e)}

    def verify_smartcard(self, smartcard_number, provider):
        url = f"{self.base_url}/merchant-verify"
        payload = {
            'billersCode': smartcard_number,
            'serviceID': provider,
            'type': 'smartcard'
        }
        try:
            response = requests.post(url, json=payload, headers=self.get_headers_post(), timeout=30)
            print("Verify Response:", response.text)
            return response.json()
        except Exception as e:
            return {'code': 'error', 'message': str(e)}

    def get_cable_plans(self, provider):
        url = f"{self.base_url}/service-variations?serviceID={provider}"
        try:
            response = requests.get(url, headers=self.get_headers_get(), timeout=30)
            return response.json()
        except Exception as e:
            return {'code': 'error', 'message': str(e)}

    def buy_cable(self, smartcard_number, provider, variation_code, amount):
        url = f"{self.base_url}/pay"
        payload = {
            'request_id': f"cable_{smartcard_number}_{variation_code}_{int(time.time())}",
            'serviceID': provider,
            'billersCode': smartcard_number,
            'variation_code': variation_code,
            'amount': amount,
            'phone': smartcard_number
        }
        try:
            response = requests.post(url, json=payload, headers=self.get_headers_post(), timeout=30)
            print("Cable Response:", response.text)
            return response.json()
        except requests.exceptions.ReadTimeout:
            return {'code': 'timeout', 'message': 'Request timed out. Please try again.'}
        except requests.exceptions.ConnectionError:
            return {'code': 'connection_error', 'message': 'Could not connect to VTPass.'}
        except Exception as e:
            return {'code': 'error', 'message': str(e)}

def verify_meter(self, meter_number, disco, meter_type):
    url = f"{self.base_url}/merchant-verify"
    payload = {
        'billersCode': meter_number,
        'serviceID': disco,
        'type': meter_type
    }
    try:
        response = requests.post(url, json=payload, headers=self.get_headers_post(), timeout=30)
        print("Meter Verify Response:", response.text)
        return response.json()
    except Exception as e:
        return {'code': 'error', 'message': str(e)}

def buy_electricity(self, meter_number, disco, meter_type, amount, phone):
    url = f"{self.base_url}/pay"
    payload = {
        'request_id': f"elect_{meter_number}_{amount}_{int(time.time())}",
        'serviceID': disco,
        'billersCode': meter_number,
        'variation_code': meter_type,
        'amount': amount,
        'phone': phone
    }
    try:
        response = requests.post(url, json=payload, headers=self.get_headers_post(), timeout=30)
        print("Electricity Response:", response.text)
        return response.json()
    except requests.exceptions.ReadTimeout:
        return {'code': 'timeout', 'message': 'Request timed out. Please try again.'}
    except requests.exceptions.ConnectionError:
        return {'code': 'connection_error', 'message': 'Could not connect to VTPass.'}
    except Exception as e:
        return {'code': 'error', 'message': str(e)}
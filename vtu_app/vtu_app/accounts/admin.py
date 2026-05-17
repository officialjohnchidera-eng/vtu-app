from django.contrib import admin
from .models import CustomUser, Transaction, Wallet

admin.site.register(CustomUser)
admin.site.register(Transaction)
admin.site.register(Wallet)

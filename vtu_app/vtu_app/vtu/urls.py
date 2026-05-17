from django.urls import path
from .views import BuyAirtimeView, AirtimePurchaseHistoryView, DataPurchaseHistoryView, DataBundleListView, BuyDataView, TransactionHistoryView

urlpatterns = [
    path('airtime/', BuyAirtimeView.as_view()),
    path('airtime/history/', AirtimePurchaseHistoryView.as_view()),
    path('data/', BuyDataView.as_view()),
    path('data/history/', DataPurchaseHistoryView.as_view()),
    path('data/bundles/<str:network>/', DataBundleListView.as_view()),
     path('transactions/', TransactionHistoryView.as_view()),
]
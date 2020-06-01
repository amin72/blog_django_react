from django.urls import path
from . import api


app_name = 'user'

urlpatterns = [
    path('register/', api.RegisterAPIView.as_view(), name='register'),
]

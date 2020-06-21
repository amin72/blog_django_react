from django.urls import path
from . import api


app_name = 'user'

urlpatterns = [
    # register user
    path('register/', api.RegisterAPIView.as_view(), name='register'),
    
    # get username
    path('detail/', api.UserDetailAPIView.as_view(), name='detail'),
]

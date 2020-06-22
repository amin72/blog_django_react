from django.urls import path
from rest_framework.routers import DefaultRouter
from . import api


app_name = 'post'


urlpatterns = [
    path('tags/', api.TagListAPIView.as_view(), name='tags'),
]


router = DefaultRouter()
router.register('', api.PostViewSet)

urlpatterns += router.urls

from rest_framework.routers import DefaultRouter
from . import api


app_name = 'post'


router = DefaultRouter()
router.register('', api.PostViewSet)

urlpatterns = router.urls

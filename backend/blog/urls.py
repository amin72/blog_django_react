from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # post urls
    path('api/v1/posts/', include('post.urls')),

    # jwt: obtain token
    path('api/v1/token/',
        jwt_views.TokenObtainPairView.as_view(),
        name='token_obtain_pair'),
    
    # jwt: refresh token
    path('api/v1/token/refresh/',
        jwt_views.TokenRefreshView.as_view(),
        name='token_refresh'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

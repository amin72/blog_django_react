from django.utils.translation import ugettext_lazy as _
from rest_framework import viewsets
from rest_framework import generics
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post, Tag
from .serializers import PostSerializer, TagSerializer
from .permissions import IsAuthorOrReadyOnly
from .paginations import StandardPagination, TagPagination
from .throttles import (
    PostSecUserRateThrottle,
    PostMinUserRateThrottle,
    PostHourUserRateThrottle,
    PostDayUserRateThrottle
)


class PostViewSet(viewsets.ModelViewSet):
    """API endpoint for listing and creating posts."""

    queryset = Post.objects.filter(status=Post.STATUS_PUBLISH)
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadyOnly, IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    pagination_class = StandardPagination
    throttle_classes = [
        PostSecUserRateThrottle,
        PostMinUserRateThrottle,
        PostHourUserRateThrottle,
        PostDayUserRateThrottle,
     ]

    def perform_create(self, serializer):
        # set post's autor
        serializer.save(author=self.request.user)



class TagListAPIView(generics.ListAPIView):
    """API endpoint for listing tags"""

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'
    pagination_class = TagPagination

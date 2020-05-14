from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    """API endpoint for listing and creating posts."""

    queryset = Post.objects.filter(status=Post.STATUS_PUBLISH)
    serializer_class = PostSerializer
    lookup_field = 'slug'

    def perform_create(self, serializer):
        # set post's autor
        serializer.save(author=self.request.user)

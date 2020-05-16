from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Post, Tag


User = get_user_model()


class PostSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(
        slug_field=User.USERNAME_FIELD,
        read_only=True,
    )

    tags = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Tag.objects.all(),
        many=True
    )

    class Meta:
        model = Post
        fields = ['author',
            'title',
            'slug',
            'image',
            'content',
            'created',
            'updated',
            'total_likes',
            'total_comments',
            'tags']
        
        read_only_fields = ['author',
            'slug',
            'create',
            'update',
            'total_likes',
            'total_comments']

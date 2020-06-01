from django.contrib import admin
from .models import Post, Tag


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status']
    search_fields = ['title', 'content', 'author__username']
    list_editable = ['status']
    readonly_fields = ['total_likes', 'total_comments', 'slug']



@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

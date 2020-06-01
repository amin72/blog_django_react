from django.contrib import admin
from .models import User


@admin.register(User)
class UserModel(admin.ModelAdmin):
    list_display = ['username', 'email', 'is_staff']
    search_fields = ['username', 'email']
    readonly_fields = ['last_login', 'date_joined', 'password']

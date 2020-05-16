from rest_framework import permissions


class IsAuthorOrReadyOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        """Allow owner to edit object, Otherwise read only"""
        
        if request.method in permissions.SAFE_METHODS:
            return True

        # only allow owner to edit their own posts
        return obj.author and obj.author == request.user

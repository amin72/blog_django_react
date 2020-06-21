from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from .utils import get_tokens_for_user


User = get_user_model()



class RegisterAPIView(APIView):
    """API to create user and JWT token."""

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                
                # create jwt token for created user
                token = get_tokens_for_user(user)
                json['token'] = token

                return Response(json, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserDetailAPIView(APIView):
    """API to give logged in username"""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format='json'):
        serializer = self.serializer_class(request.user)
        return Response({'user': serializer.data})

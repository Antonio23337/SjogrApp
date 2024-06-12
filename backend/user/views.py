from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import get_user_model, authenticate
from .serializers import UserSerializer
from django.db import IntegrityError
from rest_framework.authtoken.models import Token

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                token, created = Token.objects.get_or_create(user=user)
                user_data = serializer.data
                user_data['token'] = token.key 
                user_data['codigo_identificativo'] = user.codigo_identificativo
                return Response(user_data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({"error": "Un usuario con este código identificativo ya existe. Intente nuevamente."}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'email': user.email,
                    'is_admin': user.is_staff
                },
                'message': 'Usuario logueado correctamente'
            })
        return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

    
    
class IsAdminView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        is_admin = user.is_staff
        return Response({'is_admin': is_admin}, status=status.HTTP_200_OK)

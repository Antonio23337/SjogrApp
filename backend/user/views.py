from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model, authenticate
from .serializers import UserSerializer
from django.db import IntegrityError

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                user_data = serializer.data
                user_data['codigo_identificativo'] = user.codigo_identificativo  # Añadir el código identificativo al response
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
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Usuario logueado correctamente'
            })
        return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

import random
import string
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models, IntegrityError, transaction
from rest_framework.authtoken.models import Token

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('El usuario debe tener un correo electrónico')
        email = self.normalize_email(email)

        for _ in range(10):
            codigo_identificativo = self.generate_unique_code()
            if not User.objects.filter(codigo_identificativo=codigo_identificativo).exists():
                break
        else:
            raise ValueError('No se pudo generar un código identificativo único después de múltiples intentos')

        user = self.model(email=email, codigo_identificativo=codigo_identificativo)
        user.set_password(password)
        user.save(using=self._db)

        Token.objects.create(user=user)

        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email, password)
        user.is_admin = True
        user.save(using=self._db)
        return user

    def generate_unique_code(self):
        while True:
            letters = ''.join(random.choices(string.ascii_uppercase, k=3))
            numbers = ''.join(random.choices(string.digits, k=3))
            codigo_identificativo = letters + numbers
            if not User.objects.filter(codigo_identificativo=codigo_identificativo).exists():
                return codigo_identificativo

class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    codigo_identificativo = models.CharField(max_length=6, unique=True, editable=False, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        if not self.codigo_identificativo:
            for _ in range(10): 
                self.codigo_identificativo = self.generate_unique_code()
                if not User.objects.filter(codigo_identificativo=self.codigo_identificativo).exists():
                    break
            else:
                raise ValueError('No se pudo generar un código identificativo único después de múltiples intentos')
        super().save(*args, **kwargs)

    def generate_unique_code(self):
        while True:
            letters = ''.join(random.choices(string.ascii_uppercase, k=3))
            numbers = ''.join(random.choices(string.digits, k=3))
            codigo_identificativo = letters + numbers
            if not User.objects.filter(codigo_identificativo=codigo_identificativo).exists():
                return codigo_identificativo

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

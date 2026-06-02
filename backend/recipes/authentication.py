from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

class AdminDummyUser(AnonymousUser):
    @property
    def is_authenticated(self):
        return True

    @property
    def is_staff(self):
        return True

    @property
    def is_superuser(self):
        return True

class EnvTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None

        token = parts[1]
        admin_key = getattr(settings, 'ADMIN_API_KEY', None)

        if not admin_key:
            raise AuthenticationFailed('Admin API key is not configured on the server.')

        if token == admin_key:
            return (AdminDummyUser(), None)

        raise AuthenticationFailed('Invalid admin token.')

    def authenticate_header(self, request):
        return 'Bearer'

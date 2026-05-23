from rest_framework_simplejwt.authentication import JWTAuthentication

class JWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # 🔥 CRITICAL FIX: Explicitly isolate 'access_token' to bypass legacy keys
        raw_token = request.COOKIES.get('access_token')
        
        if not raw_token:
            return None
            
        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except Exception:
            # Prevent unhandled exceptions from crashing the authentication lifecycle
            return None
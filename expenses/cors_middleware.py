# Create this file: expenses/cors_middleware.py
from django.http import HttpResponse

class BulletproofCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Catch the browser's preflight safety check before it reaches any view
        if request.method == "OPTIONS":
            response = HttpResponse(status=200)
            origin = request.headers.get("Origin", "http://localhost:5173")
            
            # 2. Force-inject the absolute browser requirements
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Headers"] = "content-type, authorization, x-csrftoken, accept, origin"
            response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
            return response

        response = self.get_response(request)
        
        # 3. Apply the same credentials guarantee to actual outbound responses
        origin = request.headers.get("Origin")
        if origin in ["http://localhost:5173", "http://127.0.0.1:5173"]:
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Credentials"] = "true"
            
        return response
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

# This will create an account named 'root' with the password below
USERNAME = 'root'
EMAIL = 'root@example.com'
PASSWORD = 'LedgerPassword2026!'

if not User.objects.filter(username=USERNAME).exists():
    User.objects.create_superuser(USERNAME, EMAIL, PASSWORD)
    print("🚀 SUPERUSER 'root' CREATED SUCCESSFULY ON RENDER!")
else:
    print("User already exists.")
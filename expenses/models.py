from django.db import models
from django.contrib.auth.models import User
import random

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(auto_now=True)

    def generate_otp(self):
        code = f"{random.randint(100000, 999999)}"
        self.otp = code
        self.save()
        return code

    def __str__(self):
        return f"{self.user.username} - Verified: {self.is_verified}"
    

class Expense(models.Model):
    TYPE_CHOICES = [
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    # Change max_value to max_length right here:
    title = models.CharField(max_length=255) 
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    category = models.CharField(max_length=100) # Check this line too! Change to max_length=100
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='EXPENSE') # Change to max_length=10

    def __str__(self):
        return f"{self.title} - {self.amount} ({self.type})"
    

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=100)
    limit = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        # Prevents a user from creating multiple conflicting budgets for the same category
        unique_together = ('user', 'category')

    def __str__(self):
        return f"{self.user.username} - {self.category}: ${self.limit}"
from django.contrib import admin
from .models import Expense, Budget


# Register your models here.
@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'category', 'date')
    list_filter = ('category', 'date')
    search_fields = ('user__username', 'category')

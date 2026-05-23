from rest_framework import serializers
from .models import Expense,Budget

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        # Explicitly match the fields defined on your Model schema
        fields = ['id', 'title', 'amount', 'date', 'category', 'type']

    def validate(self, data):
        if not data.get('category') or data['category'].strip() == "":
            payload_type = data.get('type', 'EXPENSE')
            data['category'] = 'Salary' if payload_type == 'INCOME' else 'Food'
            
        if not data.get('title') or data['title'].strip() == "":
            data['title'] = "Untitled Transaction"
            
        return data
    
class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'category', 'limit']
        
    def validate_limit(self, value):
        if value <= 0:
            raise serializers.ValidationError("Budget constraint limits must be greater than 0.")
        return value
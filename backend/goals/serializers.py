from rest_framework import serializers
from .models import Goal, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'user', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']


class GoalSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        allow_null=True,
        required=False
    )

    class Meta:
        model = Goal
        fields = ('id', 'title', 'description', 'status', 'target_date', 
                 'category', 'recurring', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
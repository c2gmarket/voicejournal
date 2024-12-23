from rest_framework import serializers
from .models import Goal


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ('id', 'title', 'description', 'status', 'target_date', 
                 'category', 'recurring', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
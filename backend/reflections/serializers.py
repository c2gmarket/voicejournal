from rest_framework import serializers
from .models import Reflection


class ReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reflection
        fields = ('id', 'audio_file', 'transcription', 'ai_summary', 
                 'keywords', 'created_at', 'updated_at')
        read_only_fields = ('transcription', 'ai_summary', 'keywords', 
                          'created_at', 'updated_at')
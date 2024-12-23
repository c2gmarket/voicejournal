from django.db import models
from django.conf import settings


class Reflection(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to='reflections/audio/', null=True, blank=True)
    transcription = models.TextField(blank=True)
    ai_summary = models.TextField(blank=True)
    keywords = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Reflection by {self.user.email} on {self.created_at.date()}"

from celery import shared_task
from .models import Reflection


@shared_task
def transcribe_audio(reflection_id):
    try:
        reflection = Reflection.objects.get(id=reflection_id)
        # TODO: Implement audio transcription using Whisper or Mozilla DeepSpeech
        # For MVP, we'll just set a placeholder text
        reflection.transcription = "Audio transcription will be implemented in the next iteration."
        reflection.ai_summary = "AI summary will be implemented in the next iteration."
        reflection.keywords = ["placeholder"]
        reflection.save()
        return True
    except Reflection.DoesNotExist:
        return False
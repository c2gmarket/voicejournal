from celery import shared_task
from .models import Reflection


@shared_task
def transcribe_audio(reflection_id):
    try:
        reflection = Reflection.objects.get(id=reflection_id)
        # TODO: Implement audio transcription using Whisper or Mozilla DeepSpeech
        # For MVP, we'll just set a placeholder text
        if reflection.audio_file and reflection.audio_file.name:
            reflection.transcription = f"Transcription processed for: {reflection.audio_file.name}"
        else:
            reflection.transcription = "No audio file provided for transcription."
        reflection.ai_summary = f"Summary of: {reflection.transcription[:50]}..."
        if reflection.audio_file and reflection.audio_file.name:
            reflection.keywords = ["processed", "placeholder"]
        else:
            reflection.keywords = []
        reflection.save()
        return True
    except Reflection.DoesNotExist:
        return False
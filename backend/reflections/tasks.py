from celery import shared_task
from django.conf import settings
from .models import Reflection
from .services import TranscriptionService


@shared_task(bind=True, max_retries=3)
def transcribe_audio(self, reflection_id):
    try:
        reflection = Reflection.objects.get(id=reflection_id)
        
        if not reflection.audio_file:
            return False

        service = TranscriptionService()
        result = service.transcribe_audio(reflection.audio_file.path)

        if result['success']:
            reflection.transcription = result['transcription']
            reflection.keywords = result['keywords']
            
            # Generate a simple summary by taking the first 100 words
            words = result['transcription'].split()
            summary = ' '.join(words[:100])
            if len(words) > 100:
                summary += '...'
            
            reflection.ai_summary = summary
            reflection.save()
            return True
        else:
            raise Exception(result.get('error', 'Transcription failed'))

    except Reflection.DoesNotExist:
        return False
    except Exception as e:
        self.retry(exc=e, countdown=60)  # Retry after 60 seconds

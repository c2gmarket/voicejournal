import os
import tempfile
import whisper
import ffmpeg
from pathlib import Path
from django.conf import settings

class TranscriptionService:
    def __init__(self):
        self.model = None
        self.model_name = "base"  # Can be tiny, base, small, medium, or large

    def _load_model(self):
        if self.model is None:
            self.model = whisper.load_model(self.model_name)
        return self.model

    def _convert_to_wav(self, input_path: str, output_path: str):
        try:
            stream = ffmpeg.input(input_path)
            stream = ffmpeg.output(stream, output_path, acodec='pcm_s16le', ac=1, ar='16k')
            ffmpeg.run(stream, capture_stdout=True, capture_stderr=True)
            return True
        except ffmpeg.Error as e:
            print('Error converting audio:', e.stderr.decode())
            return False

    def transcribe_audio(self, audio_file_path: str) -> dict:
        model = self._load_model()

        # Create a temporary WAV file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
            temp_wav_path = temp_wav.name

        try:
            # Convert the input audio to WAV format
            if not self._convert_to_wav(audio_file_path, temp_wav_path):
                return {
                    'success': False,
                    'error': 'Failed to convert audio file',
                }

            # Transcribe the audio
            result = model.transcribe(temp_wav_path)

            # Extract keywords using a simple frequency-based approach
            words = result['text'].lower().split()
            word_freq = {}
            for word in words:
                if len(word) > 3:  # Skip short words
                    word_freq[word] = word_freq.get(word, 0) + 1

            # Get top 5 keywords
            keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
            keywords = [word for word, _ in keywords]

            return {
                'success': True,
                'transcription': result['text'],
                'keywords': keywords,
                'language': result.get('language', 'en'),
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
            }

        finally:
            # Clean up temporary file
            if os.path.exists(temp_wav_path):
                os.unlink(temp_wav_path)

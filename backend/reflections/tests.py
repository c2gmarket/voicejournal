from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch
from .models import Reflection
from .tasks import transcribe_audio

User = get_user_model()

class ReflectionModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.audio_file = SimpleUploadedFile(
            "test_audio.wav",
            b"file_content",
            content_type="audio/wav"
        )
        self.reflection_data = {
            'user': self.user,
            'audio_file': self.audio_file,
            'transcription': '',
            'ai_summary': '',
            'keywords': []
        }

    def test_create_reflection(self):
        reflection = Reflection.objects.create(**self.reflection_data)
        self.assertEqual(reflection.user, self.user)
        self.assertEqual(reflection.transcription, '')
        self.assertEqual(reflection.keywords, [])

    def test_reflection_str_representation(self):
        reflection = Reflection.objects.create(**self.reflection_data)
        expected_str = f"Reflection by {self.user.email} on {reflection.created_at.date()}"
        self.assertEqual(str(reflection), expected_str)

class ReflectionAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.audio_file = SimpleUploadedFile(
            "test_audio.wav",
            b"file_content",
            content_type="audio/wav"
        )

    @patch('reflections.tasks.transcribe_audio.delay')
    def test_create_reflection(self, mock_task):
        url = reverse('reflection-list')
        data = {
            'audio_file': self.audio_file
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reflection.objects.count(), 1)
        self.assertIn('message', response.data)
        self.assertIn('audio_file', response.data)
        
        # Check that the task was called with the new reflection's ID
        reflection_id = response.data['id']
        mock_task.assert_called_once_with(reflection_id)

    def test_get_reflections(self):
        reflection = Reflection.objects.create(user=self.user, audio_file=self.audio_file)
        url = reverse('reflection-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertIn('audio_file', response.data[0])

    def test_unauthorized_access(self):
        # Create another user and their reflection
        other_user = User.objects.create_user(
            email='other@example.com',
            password='otherpass123'
        )
        other_reflection = Reflection.objects.create(
            user=other_user,
            audio_file=self.audio_file
        )
        
        # Try to access other user's reflection
        url = reverse('reflection-detail', args=[other_reflection.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access(self):
        self.client.force_authenticate(user=None)
        url = reverse('reflection-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class TranscriptionTaskTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.audio_file = SimpleUploadedFile(
            "test_audio.wav",
            b"file_content",
            content_type="audio/wav"
        )
        self.reflection = Reflection.objects.create(
            user=self.user,
            audio_file=self.audio_file
        )

    def test_transcribe_audio_task(self):
        # Test the task with an existing reflection
        result = transcribe_audio(self.reflection.id)
        self.assertTrue(result)
        
        # Refresh the reflection from db
        self.reflection.refresh_from_db()
        self.assertTrue(len(self.reflection.transcription) > 0)
        self.assertTrue(len(self.reflection.ai_summary) > 0)
        self.assertTrue(len(self.reflection.keywords) > 0)

    def test_transcribe_audio_task_invalid_id(self):
        # Test the task with a non-existent reflection ID
        result = transcribe_audio(999999)
        self.assertFalse(result)

    @patch('reflections.tasks.transcribe_audio.delay')
    def test_transcription_task_called_on_create(self, mock_task):
        client = APIClient()
        client.force_authenticate(user=self.user)
        url = reverse('reflection-list')
        data = {
            'audio_file': SimpleUploadedFile(
                "new_audio.wav",
                b"file_content",
                content_type="audio/wav"
            )
        }
        response = client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that the task was called with the new reflection's ID
        reflection_id = response.data['id']
        mock_task.assert_called_once_with(reflection_id)

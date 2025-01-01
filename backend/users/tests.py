from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
import json

User = get_user_model()

class UserModelTests(TestCase):
    def test_create_user(self):
        email = "test@example.com"
        password = "testpass123"
        user = User.objects.create_user(
            email=email,
            password=password
        )
        self.assertEqual(user.email, email)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertTrue(user.check_password(password))

    def test_create_superuser(self):
        email = "admin@example.com"
        password = "adminpass123"
        user = User.objects.create_superuser(
            email=email,
            password=password
        )
        self.assertEqual(user.email, email)
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.check_password(password))

    def test_user_email_normalized(self):
        email = "test@EXAMPLE.com"
        user = User.objects.create_user(email=email, password="test123")
        self.assertEqual(user.email, email.lower())

    def test_create_user_without_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="test123")

class UserAPITests(TestCase):
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('register')

    def test_create_valid_user(self):
        payload = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(
            self.register_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=payload['email']).exists())
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_create_invalid_user(self):
        payload = {
            'email': 'invalid-email',
            'password': 'pass'
        }
        response = self.client.post(
            self.register_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email=payload['email']).exists())

    def test_create_duplicate_user(self):
        payload = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        User.objects.create_user(**payload)
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.filter(email=payload['email']).count(), 1)

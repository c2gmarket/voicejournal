from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from .models import Goal
import datetime

User = get_user_model()

class GoalModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.goal_data = {
            'user': self.user,
            'title': 'Learn Django',
            'description': 'Master Django web framework',
            'status': 'in_progress',
            'target_date': datetime.date(2024, 12, 31),
            'category': 'Learning',
            'recurring': False
        }

    def test_create_goal(self):
        goal = Goal.objects.create(**self.goal_data)
        self.assertEqual(goal.title, self.goal_data['title'])
        self.assertEqual(goal.user, self.user)
        self.assertEqual(goal.status, 'in_progress')
        self.assertEqual(goal.target_date, self.goal_data['target_date'])

    def test_goal_str_representation(self):
        goal = Goal.objects.create(**self.goal_data)
        expected_str = f"{goal.title} (In Progress)"
        self.assertEqual(str(goal), expected_str)

class GoalAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.goal_data = {
            'title': 'Learn Django',
            'description': 'Master Django web framework',
            'status': 'in_progress',
            'target_date': '2024-12-31',
            'category': 'Learning',
            'recurring': False
        }

    def test_create_goal(self):
        url = reverse('goal-list')
        response = self.client.post(url, self.goal_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Goal.objects.count(), 1)
        self.assertEqual(Goal.objects.get().title, self.goal_data['title'])
        self.assertEqual(Goal.objects.get().user, self.user)

    def test_get_goals(self):
        Goal.objects.create(user=self.user, **self.goal_data)
        url = reverse('goal-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.goal_data['title'])

    def test_update_goal(self):
        goal = Goal.objects.create(user=self.user, **self.goal_data)
        url = reverse('goal-detail', args=[goal.id])
        updated_data = {
            'title': 'Learn Django Advanced',
            'status': 'completed'
        }
        response = self.client.patch(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        goal.refresh_from_db()
        self.assertEqual(goal.title, updated_data['title'])
        self.assertEqual(goal.status, updated_data['status'])

    def test_delete_goal(self):
        goal = Goal.objects.create(user=self.user, **self.goal_data)
        url = reverse('goal-detail', args=[goal.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Goal.objects.count(), 0)

    def test_unauthorized_access(self):
        # Create another user and their goal
        other_user = User.objects.create_user(
            email='other@example.com',
            password='otherpass123'
        )
        other_goal = Goal.objects.create(user=other_user, **self.goal_data)
        
        # Try to access other user's goal
        url = reverse('goal-detail', args=[other_goal.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access(self):
        self.client.force_authenticate(user=None)
        url = reverse('goal-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

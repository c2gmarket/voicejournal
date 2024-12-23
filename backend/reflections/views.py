from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Reflection
from .serializers import ReflectionSerializer
from .tasks import transcribe_audio


class ReflectionViewSet(viewsets.ModelViewSet):
    serializer_class = ReflectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reflection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        reflection = serializer.save(user=self.request.user)
        if reflection.audio_file:
            transcribe_audio.delay(reflection.id)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                **serializer.data,
                'message': 'Reflection created. Audio transcription is being processed.'
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )

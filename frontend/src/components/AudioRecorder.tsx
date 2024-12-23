import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number; // in seconds
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  maxDuration = 300, // 5 minutes default
}) => {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      onRecordingComplete(audioBlob);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob, onRecordingComplete]);

  useEffect(() => {
    if (duration >= maxDuration && isRecording) {
      stopRecording();
    }
  }, [duration, maxDuration, isRecording, stopRecording]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (duration / maxDuration) * 100;

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isRecording
            ? `Recording ${formatTime(duration)} / ${formatTime(maxDuration)}`
            : audioUrl
            ? 'Recording Complete'
            : 'Ready to Record'}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          color={isPaused ? 'warning' : 'primary'}
          sx={{ mb: 2, visibility: isRecording ? 'visible' : 'hidden' }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {!isRecording && !audioUrl && (
          <IconButton
            color="primary"
            onClick={startRecording}
            size="large"
            sx={{ width: 64, height: 64 }}
          >
            <MicIcon fontSize="large" />
          </IconButton>
        )}

        {isRecording && (
          <>
            <IconButton
              color="primary"
              onClick={isPaused ? resumeRecording : pauseRecording}
              size="large"
              sx={{ width: 64, height: 64 }}
            >
              {isPaused ? (
                <PlayArrowIcon fontSize="large" />
              ) : (
                <PauseIcon fontSize="large" />
              )}
            </IconButton>

            <IconButton
              color="error"
              onClick={stopRecording}
              size="large"
              sx={{ width: 64, height: 64 }}
            >
              <StopIcon fontSize="large" />
            </IconButton>
          </>
        )}

        {audioUrl && (
          <>
            <audio controls src={audioUrl} />
            <IconButton
              color="primary"
              onClick={resetRecording}
              size="large"
              sx={{ width: 64, height: 64 }}
            >
              <RefreshIcon fontSize="large" />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};
import { useState, useCallback, useRef } from 'react';

interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  error: string | null;
}

interface AudioRecorderHook extends AudioRecorderState {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
}

export const useAudioRecorder = (): AudioRecorderHook => {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    error: null,
  });

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const startTime = useRef<number>(0);
  const durationInterval = useRef<number | null>(null);

  const updateDuration = useCallback(() => {
    if (startTime.current && !state.isPaused) {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      setState((prev) => ({ ...prev, duration }));
    }
  }, [state.isPaused]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setState((prev) => ({ ...prev, audioBlob, isRecording: false }));

        // Stop all audio tracks
        stream.getAudioTracks().forEach((track) => track.stop());

        // Clear the duration interval
        if (durationInterval.current) {
          window.clearInterval(durationInterval.current);
          durationInterval.current = null;
        }
      };

      mediaRecorder.current.start(1000); // Collect data every second
      startTime.current = Date.now();
      durationInterval.current = window.setInterval(updateDuration, 1000);
      setState((prev) => ({ ...prev, isRecording: true, error: null }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Error accessing microphone. Please ensure microphone permissions are granted.',
      }));
      console.error('Error accessing microphone:', error);
    }
  }, [updateDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && state.isRecording) {
      mediaRecorder.current.stop();
    }
  }, [state.isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorder.current && state.isRecording && !state.isPaused) {
      mediaRecorder.current.pause();
      setState((prev) => ({ ...prev, isPaused: true }));
    }
  }, [state.isRecording, state.isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorder.current && state.isRecording && state.isPaused) {
      mediaRecorder.current.resume();
      setState((prev) => ({ ...prev, isPaused: false }));
    }
  }, [state.isRecording, state.isPaused]);

  const resetRecording = useCallback(() => {
    if (mediaRecorder.current) {
      if (state.isRecording) {
        mediaRecorder.current.stop();
      }
      audioChunks.current = [];
      startTime.current = 0;
      if (durationInterval.current) {
        window.clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
      setState({
        isRecording: false,
        isPaused: false,
        duration: 0,
        audioBlob: null,
        error: null,
      });
    }
  }, [state.isRecording]);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  };
};
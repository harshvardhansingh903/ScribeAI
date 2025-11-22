"use client";

import { useState, useRef, useCallback } from 'react';
import { transcribeChunk } from '@/app/actions';

export type RecordingStatus = 'idle' | 'permission' | 'recording' | 'paused' | 'stopped' | 'error';
export type AudioSource = 'mic' | 'tab';

const TRANSCRIPTION_INTERVAL = 4000; // 4 seconds

export function useAudioRecorder(onProcessingComplete: (transcript: string) => void) {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecordingFlow = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current = null;
  }, []);

  const processAndTranscribe = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      return;
    }
    
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    audioChunksRef.current = []; // Clear chunks after processing

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      if(base64Audio) {
        try {
          const transcription = await transcribeChunk(base64Audio);
          if (transcription) {
            setTranscript(prev => prev ? `${prev} ${transcription}` : transcription);
          }
        } catch (e) {
          console.error('Transcription failed', e);
          setError('Transcription failed. Please try again.');
        }
      }
    };
  }, []);

  const startRecording = useCallback(async (source: AudioSource) => {
    setTranscript('');
    setError(null);
    setStatus('permission');

    try {
      let mediaStream: MediaStream;
      if (source === 'mic') {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true, // Often required to trigger the picker
          audio: true,
        });
      }
      
      // If it's a screen share, check if an audio track was actually shared.
      if (source === 'tab' && mediaStream.getAudioTracks().length === 0) {
        mediaStream.getTracks().forEach(track => track.stop()); // Clean up video track
        throw new Error('No audio track was shared. Please share a tab with audio.');
      }

      streamRef.current = mediaStream;
      mediaRecorderRef.current = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        processAndTranscribe().finally(() => {
            onProcessingComplete(transcript + (audioChunksRef.current.length > 0 ? " [finalizing...]" : ""));
            setStatus('stopped');
        });
      };
      
      mediaRecorderRef.current.start();
      setStatus('recording');

      // Periodically request data and transcribe
      timerRef.current = setInterval(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current?.requestData();
            processAndTranscribe();
        }
      }, TRANSCRIPTION_INTERVAL);

    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(err instanceof Error ? err.message : 'Could not start recording.');
      setStatus('error');
      stopRecordingFlow();
    }
  }, [stopRecordingFlow, onProcessingComplete, processAndTranscribe, transcript]);

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setStatus('paused');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setStatus('recording');
      timerRef.current = setInterval(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current?.requestData();
            processAndTranscribe();
        }
      }, TRANSCRIPTION_INTERVAL);
    }
  };

  const stopRecording = useCallback(() => {
    stopRecordingFlow();
  }, [stopRecordingFlow]);

  return { status, transcript, error, startRecording, pauseRecording, resumeRecording, stopRecording };
}

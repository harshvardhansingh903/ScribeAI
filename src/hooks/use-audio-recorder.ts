"use client";

import { useState, useRef, useCallback } from 'react';
import { transcribeChunk } from '@/app/actions';

export type RecordingStatus = 'idle' | 'permission' | 'recording' | 'paused' | 'stopped' | 'error';
export type AudioSource = 'mic' | 'tab';

const TRANSCRIPTION_INTERVAL = 3000; // 3 seconds

export function useAudioRecorder(onProcessingComplete: (transcript: string) => void) {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fullTranscriptRef = useRef<string>("");

  const processAndTranscribe = useCallback(async (isFinal: boolean = false) => {
    if (audioChunksRef.current.length === 0) {
      if (isFinal) {
        onProcessingComplete(fullTranscriptRef.current);
      }
      return;
    }
    
    // Log audio chunk details for debugging
    if (audioChunksRef.current.length === 0) {
      console.warn('No audio chunks to process.');
    } else {
      console.log('Audio chunk size:', audioChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0));
      console.log('Audio chunk type:', audioChunksRef.current[0].type);
    }

    // Force WAV format for maximum compatibility with Gemini API
    let audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    console.log('[Recorder] AudioBlob size:', audioBlob.size, 'type:', audioBlob.type);
    if (audioBlob.size === 0) {
      setError('No audio data captured. Please check your microphone, browser, and try again.');
      if (isFinal) onProcessingComplete(fullTranscriptRef.current);
      return;
    }
    audioChunksRef.current = []; // Clear chunks for the next interval

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      console.log('[Recorder] base64Audio length:', base64Audio?.length, 'starts with:', base64Audio?.slice(0, 30));
      if (base64Audio) {
        try {
          const transcription = await transcribeChunk(base64Audio);
          if (transcription && transcription.trim()) {
            fullTranscriptRef.current = fullTranscriptRef.current ? `${fullTranscriptRef.current} ${transcription}` : transcription;
            setTranscript(fullTranscriptRef.current);
          } else {
            setError('No speech detected or transcription failed. Please speak clearly, check your microphone, and ensure your browser supports audio recording.');
          }
        } catch (e) {
          console.error('Transcription failed', e);
          setError('Transcription failed. Please try again.');
        } finally {
          if (isFinal) {
            onProcessingComplete(fullTranscriptRef.current);
          }
        }
      } else if (isFinal) {
        onProcessingComplete(fullTranscriptRef.current);
      }
    };
  }, [onProcessingComplete]);

  const stopRecordingFlow = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        processAndTranscribe(true);
        setStatus('stopped');
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        mediaRecorderRef.current = null;
      };
      mediaRecorderRef.current.stop();

    } else {
       if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
    }
  }, [processAndTranscribe]);


  const startRecording = useCallback(async (source: AudioSource) => {
    setTranscript('');
    fullTranscriptRef.current = "";
    setError(null);
    setStatus('permission');

    try {
      let mediaStream: MediaStream;
      if (source === 'mic') {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
         if (mediaStream.getAudioTracks().length === 0) {
            mediaStream.getTracks().forEach(track => track.stop());
            throw new Error('No audio track was shared. Please share a tab with audio.');
        }
      }
      
      streamRef.current = mediaStream;
      // Auto-detect the best supported audio format for MediaRecorder
      let recorder;
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        recorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm;codecs=opus' });
      } else if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm')) {
        recorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });
      } else if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/wav')) {
        recorder = new MediaRecorder(mediaStream, { mimeType: 'audio/wav' });
      } else {
        recorder = new MediaRecorder(mediaStream); // Let browser pick
      }
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.start(TRANSCRIPTION_INTERVAL);
      setStatus('recording');

      timerRef.current = setInterval(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            processAndTranscribe();
        }
      }, TRANSCRIPTION_INTERVAL);

    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(err instanceof Error ? err.message : 'Could not start recording.');
      setStatus('error');
      stopRecordingFlow();
    }
  }, [stopRecordingFlow, processAndTranscribe]);

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

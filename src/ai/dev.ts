import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-meeting-transcript.ts';
import '@/ai/flows/real-time-audio-transcription.ts';
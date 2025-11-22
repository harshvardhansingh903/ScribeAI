'use server';
/**
 * @fileOverview Real-time audio transcription flow using Gemini API.
 *
 * - realTimeAudioTranscription - A function that handles the real-time audio transcription process.
 * - RealTimeAudioTranscriptionInput - The input type for the realTimeAudioTranscription function.
 * - RealTimeAudioTranscriptionOutput - The return type for the realTimeAudioTranscription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealTimeAudioTranscriptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'Audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type RealTimeAudioTranscriptionInput = z.infer<
  typeof RealTimeAudioTranscriptionInputSchema
>;

const RealTimeAudioTranscriptionOutputSchema = z.object({
  transcription: z.string().describe('The real-time transcription of the audio.'),
});
export type RealTimeAudioTranscriptionOutput = z.infer<
  typeof RealTimeAudioTranscriptionOutputSchema
>;

export async function realTimeAudioTranscription(
  input: RealTimeAudioTranscriptionInput
): Promise<RealTimeAudioTranscriptionOutput> {
  return realTimeAudioTranscriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'realTimeAudioTranscriptionPrompt',
  input: {schema: RealTimeAudioTranscriptionInputSchema},
  output: {schema: RealTimeAudioTranscriptionOutputSchema},
  prompt: `Transcribe the following audio in real-time:

Audio: {{media url=audioDataUri}}`,
});

const realTimeAudioTranscriptionFlow = ai.defineFlow(
  {
    name: 'realTimeAudioTranscriptionFlow',
    inputSchema: RealTimeAudioTranscriptionInputSchema,
    outputSchema: RealTimeAudioTranscriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// Summarizes the meeting transcript and extracts key points, action items and decisions.
//
// - summarizeMeetingTranscript - A function that handles the summarization of the meeting transcript.
// - SummarizeMeetingTranscriptInput - The input type for the summarizeMeetingTranscript function.
// - SummarizeMeetingTranscriptOutput - The return type for the summarizeMeetingTranscript function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMeetingTranscriptInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the meeting.'),
});

export type SummarizeMeetingTranscriptInput = z.infer<typeof SummarizeMeetingTranscriptInputSchema>;

const SummarizeMeetingTranscriptOutputSchema = z.object({
  summary: z.string().describe('A summary of the meeting, including key points, action items, and decisions.'),
});

export type SummarizeMeetingTranscriptOutput = z.infer<typeof SummarizeMeetingTranscriptOutputSchema>;

export async function summarizeMeetingTranscript(
  input: SummarizeMeetingTranscriptInput
): Promise<SummarizeMeetingTranscriptOutput> {
  return summarizeMeetingTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMeetingTranscriptPrompt',
  input: {schema: SummarizeMeetingTranscriptInputSchema},
  output: {schema: SummarizeMeetingTranscriptOutputSchema},
  prompt: `Summarize the following meeting transcript, highlighting key points, action items, and decisions.\n\nTranscript: {{{transcript}}}`,
});

const summarizeMeetingTranscriptFlow = ai.defineFlow(
  {
    name: 'summarizeMeetingTranscriptFlow',
    inputSchema: SummarizeMeetingTranscriptInputSchema,
    outputSchema: SummarizeMeetingTranscriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

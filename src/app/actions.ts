"use server";

import { realTimeAudioTranscription } from "@/ai/flows/real-time-audio-transcription";
import { summarizeMeetingTranscript } from "@/ai/flows/summarize-meeting-transcript";
import { createSession } from "@/lib/data";

export async function transcribeChunk(audioDataUri: string): Promise<string> {
  try {
    const result = await realTimeAudioTranscription({ audioDataUri });
    return result.transcription;
  } catch (error) {
    console.error("Transcription error:", error);
    return ""; // Return empty string on error to not break the flow
  }
}

export async function summarizeAndStoreSession(transcript: string): Promise<{ sessionId: string } | { error: string }> {
  if (!transcript.trim()) {
    return { error: "Transcript is empty, cannot generate summary." };
  }
  
  try {
    // In a real app, the summary might be structured. For now, we expect a simple text summary.
    // The flow returns an object { summary: string }.
    const rawSummary = await summarizeMeetingTranscript({ transcript });

    // A simple parser to structure the summary. This should be made more robust.
    const structuredSummary = {
        keyPoints: rawSummary.summary.match(/Key Points:([\s\S]*?)Action Items:/i)?.[1].trim().split('\n- ').filter(Boolean) || [],
        actionItems: rawSummary.summary.match(/Action Items:([\s\S]*?)Decisions:/i)?.[1].trim().split('\n- ').filter(Boolean) || [],
        decisions: rawSummary.summary.match(/Decisions:([\s\S]*)/i)?.[1].trim().split('\n- ').filter(Boolean) || [],
    };
    
    const newSession = await createSession(transcript, structuredSummary);
    return { sessionId: newSession.id };

  } catch (error) {
    console.error("Summarization or storage error:", error);
    return { error: "Failed to summarize and save the session." };
  }
}

"use server";

import { realTimeAudioTranscription } from "@/ai/flows/real-time-audio-transcription";
import { summarizeMeetingTranscript } from "@/ai/flows/summarize-meeting-transcript";
import { createSession } from "@/lib/data";

export async function transcribeChunk(audioDataUri: string): Promise<string> {
  try {
    console.log("Sending audioDataUri to transcription:", audioDataUri.slice(0, 100));
    const result = await realTimeAudioTranscription({ audioDataUri });
    console.log("Transcription result:", result.transcription);
    if (!result.transcription || !result.transcription.trim()) {
      // Optionally, you can show a toast or UI message here
      console.warn("Transcription was empty. Please speak clearly and check your microphone.");
    }
    return result.transcription;
  } catch (error) {
    console.error("Transcription error:", error);
    // Optionally, you can show a toast or UI message here
    return ""; // Return empty string on error to not break the flow
  }
}

export async function summarizeAndStoreSession(transcript: string): Promise<{ sessionId: string } | { error: string }> {
  if (!transcript.trim()) {
    return { error: "Transcript is empty, cannot generate summary." };
  }
  
  try {
    const rawSummary = await summarizeMeetingTranscript({ transcript });

    // Try to parse structured summary, fallback to raw summary if parsing fails
    let structuredSummary;
    try {
      structuredSummary = {
        keyPoints: rawSummary.summary.match(/Key Points:([\s\S]*?)Action Items:/i)?.[1].trim().split('\n- ').filter(Boolean) || [],
        actionItems: rawSummary.summary.match(/Action Items:([\s\S]*?)Decisions:/i)?.[1].trim().split('\n- ').filter(Boolean) || [],
        decisions: rawSummary.summary.match(/Decisions:([\s\S]*)/i)?.[1].trim().split('\n- ').filter(Boolean) || [],
        raw: rawSummary.summary
      };
      // If all arrays are empty, fallback to raw summary
      if (
        structuredSummary.keyPoints.length === 0 &&
        structuredSummary.actionItems.length === 0 &&
        structuredSummary.decisions.length === 0
      ) {
        structuredSummary = { keyPoints: [], actionItems: [], decisions: [], raw: rawSummary.summary };
      }
    } catch (e) {
      structuredSummary = { keyPoints: [], actionItems: [], decisions: [], raw: rawSummary.summary };
    }

    const newSession = await createSession(transcript, structuredSummary);
    return { sessionId: newSession.id };

  } catch (error) {
    console.error("Summarization or storage error:", error);
    return { error: "Failed to summarize and save the session." };
  }
}

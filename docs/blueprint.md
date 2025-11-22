# **App Name**: ScribeAI

## Core Features:

- User Authentication: Secure user authentication via Better Auth to manage access to the app and personal session history.
- Real-time Audio Transcription: Capture audio from microphone or shared tab, stream to Gemini API in chunks, and display real-time transcript using Next.js and Socket.io.
- Meeting Tab Integration: Enable users to select a browser tab (e.g., Google Meet, Zoom) and capture system audio for transcription using getDisplayMedia API.
- Session Management: Manage recording sessions with pause/resume functionality and display status updates (Recording, Paused, Processing, Completed) via Socket.io for real-time UI feedback.
- AI-Powered Summarization: Upon session completion, leverage Gemini to summarize key points, action items, and decisions from the full transcript.
- Session History: Store transcripts and summaries in a Postgres database (via Prisma) for users to view, search, and export.
- Data-Loss Prevention Tool: Seamless handling of stream interruptions such as network drops to maintain recording, coupled with secure, hybrid buffering strategies to support continuous, 1-hour-long sessions.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to evoke focus and productivity.
- Background color: Light Gray (#F0F2F5) for a clean, distraction-free environment.
- Accent color: Vibrant Orange (#FF9800) for highlighting key actions and UI elements.
- Body font: 'Inter', a sans-serif font for a modern, readable interface.
- Headline font: 'Space Grotesk', a sans-serif font to provide a computerized, techy look to the app.
- Use consistent, minimalist icons from a library like Material Design Icons to represent actions and states.
- Responsive design using Tailwind CSS for optimal viewing across devices, with a focus on clear information hierarchy and user flow.
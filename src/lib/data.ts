export type Session = {
  id: string;
  title: string;
  date: string;
  transcript: string;
  summary: {
    keyPoints: string[];
    actionItems: string[];
    decisions: string[];
  };
};

const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    title: "Q3 Project Kick-off",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    transcript: "Alice: Welcome everyone to the Q3 project kick-off. Today we're going to discuss the new 'Phoenix' project. Bob, can you start with the goals?\nBob: Thanks, Alice. The main goal is to refactor our legacy billing system by the end of the quarter. We need to improve performance by 50%.\nCharlie: That's an ambitious goal. What's the plan for resource allocation?\nAlice: We'll have two dedicated engineers, and we're bringing in a consultant. Bob, you'll be the project lead.\nBob: I'm on it. I'll create the initial JIRA tickets and schedule a follow-up for next week.",
    summary: {
      keyPoints: ["Kick-off for 'Phoenix' project.", "Goal: Refactor legacy billing system by end of Q3.", "Target: 50% performance improvement."],
      actionItems: ["Bob to create JIRA tickets for the project.", "Bob to schedule a follow-up meeting."],
      decisions: ["Two engineers and one consultant will be allocated.", "Bob is assigned as the project lead."]
    }
  },
  {
    id: "2",
    title: "Marketing Sync - Weekly",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    transcript: "Dana: Let's review the campaign performance from last week. The 'Summer Sale' campaign saw a 20% increase in click-through rate.\nEve: That's great news. However, the conversion rate was slightly down. I think we need to optimize the landing page.\nFrank: I agree. I can work with the design team to run some A/B tests on the call-to-action button.\nDana: Perfect. Frank, please present the test variants in our next meeting. Eve, can you pull the detailed conversion data?",
    summary: {
      keyPoints: ["'Summer Sale' campaign had a 20% CTR increase.", "Conversion rate was slightly down.", "Landing page needs optimization."],
      actionItems: ["Frank to work with design on A/B testing the CTA button.", "Eve to pull detailed conversion data.", "Frank to present A/B test variants in the next sync."],
      decisions: ["A/B tests will be conducted on the landing page CTA."]
    }
  }
];

// Simulate a database
let sessions: Session[] = [...MOCK_SESSIONS];

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getSessions(): Promise<Session[]> {
  await delay(500);
  return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getSessionById(id: string): Promise<Session | undefined> {
  await delay(300);
  return sessions.find(session => session.id === id);
}

export async function createSession(transcript: string, summary: any): Promise<Session> {
  await delay(1000);
  const newSession: Session = {
    id: (sessions.length + 1).toString(),
    title: `Meeting - ${new Date().toLocaleDateString()}`,
    date: new Date().toISOString(),
    transcript,
    summary,
  };
  sessions.push(newSession);
  return newSession;
}

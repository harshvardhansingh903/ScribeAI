import Link from "next/link";
import { getSessions, Session } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function SessionCard({ session }: { session: Session }) {
  const summaryPreview = (session.summary.keyPoints[0] || "No key points available.").substring(0, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{session.title}</CardTitle>
        <CardDescription>
          {new Date(session.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground italic">
                "{summaryPreview}..."
            </p>
             <div className="flex flex-wrap gap-2 pt-2">
                {session.summary.actionItems.length > 0 && <Badge variant="secondary">{session.summary.actionItems.length} Action Items</Badge>}
                {session.summary.decisions.length > 0 && <Badge variant="secondary">{session.summary.decisions.length} Decisions</Badge>}
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/history/${session.id}`} className="ml-auto">
            <Button>
                View Details <ArrowRight className="ml-2" />
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default async function HistoryPage() {
  const sessions = await getSessions();

  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Session History
        </h1>
        <p className="text-muted-foreground">
          Review your past transcribed meetings and summaries.
        </p>
      </div>

      {sessions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
            <CardHeader>
                <div className="mx-auto bg-secondary p-4 rounded-full">
                    <History className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4 font-headline">No History Found</CardTitle>
                <CardDescription>You haven't recorded any sessions yet.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/dashboard">
                    <Button>Start Your First Session</Button>
                </Link>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

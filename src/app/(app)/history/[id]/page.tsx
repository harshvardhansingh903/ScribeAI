import { notFound } from "next/navigation";
import { getSessionById } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ListChecks, CheckCircle } from "lucide-react";

export default async function SessionDetailPage({ params }: { params: { id: string } }) {
  const session = await getSessionById(params.id);

  if (!session) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{session.title}</h1>
        <p className="text-muted-foreground">
          Recorded on{" "}
          {new Date(session.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Full Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] rounded-md border p-4 bg-muted/50">
                <p className="text-sm whitespace-pre-wrap">{session.transcript}</p>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Lightbulb className="text-accent" /> Key Points</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        {session.summary.keyPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-2"><Badge variant="outline" className="mt-1">●</Badge><span>{point}</span></li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><ListChecks className="text-accent"/> Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        {session.summary.actionItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2"><Badge variant="outline" className="mt-1">●</Badge><span>{item}</span></li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><CheckCircle className="text-accent" /> Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        {session.summary.decisions.map((decision, i) => (
                             <li key={i} className="flex items-start gap-2"><Badge variant="outline" className="mt-1">●</Badge><span>{decision}</span></li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

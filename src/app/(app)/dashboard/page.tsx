import { Recorder } from "./recorder";

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Start a new session to transcribe your meeting audio in real-time.
        </p>
      </div>
      <div className="mt-8">
        <Recorder />
      </div>
    </div>
  );
}

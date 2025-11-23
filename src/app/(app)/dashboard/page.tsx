
import { Recorder } from "./recorder";
import AnimatedDashboardBackground from "@/components/AnimatedDashboardBackground";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <AnimatedDashboardBackground />
      <div className="relative z-10 px-8 py-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold font-headline tracking-tight bg-gradient-to-r from-teal-500 via-orange-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground/80 max-w-prose">
            Start a new session to transcribe your meeting audio in real-time.
          </p>
        </div>
        <div className="mt-10">
          <Recorder />
        </div>
      </div>
    </div>
  );
}

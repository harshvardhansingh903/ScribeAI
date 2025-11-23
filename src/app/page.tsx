"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Gradient base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500" />
      {/* Radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
      {/* Decorative blur blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-4rem] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-[65%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
          AI-Powered Meeting Transcription & Insights
        </h1>
        <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
          Capture every word. Summarize instantly. Turn conversations into action with real-time transcription and AI summaries designed for teams and creators.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/signup"><Button className="w-full sm:w-auto">Get Started Free</Button></Link>
          <Link href="/login"><Button variant="secondary" className="w-full sm:w-auto bg-white/20 backdrop-blur hover:bg-white/30 text-white border border-white/30">Login</Button></Link>
        </div>
        {/* Feature Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="rounded-xl bg-white/15 backdrop-blur-md border border-white/25 py-6 flex flex-col items-center">
            <span className="font-headline text-2xl text-white">99.9%</span>
            <span className="text-xs text-white/70">Accuracy</span>
          </div>
          <div className="rounded-xl bg-white/15 backdrop-blur-md border border-white/25 py-6 flex flex-col items-center">
            <span className="font-headline text-2xl text-white">24/7</span>
            <span className="text-xs text-white/70">Cloud Sync</span>
          </div>
            <div className="rounded-xl bg-white/15 backdrop-blur-md border border-white/25 py-6 flex flex-col items-center">
            <span className="font-headline text-2xl text-white">∞</span>
            <span className="text-xs text-white/70">Sessions</span>
          </div>
          <div className="rounded-xl bg-white/15 backdrop-blur-md border border-white/25 py-6 flex flex-col items-center">
            <span className="font-headline text-2xl text-white">AI</span>
            <span className="text-xs text-white/70">Summaries</span>
          </div>
        </div>
      </div>
    </div>
  );
}

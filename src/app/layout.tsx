import type { Metadata } from 'next';
import './globals.css';
import '../styles/design-system.css';
import { Toaster } from "@/components/ui/toaster"
import AnimatedCursor from "@/components/AnimatedCursor"

export const metadata: Metadata = {
  title: 'ScribeAI - AI-Powered Meeting Transcription',
  description: 'Real-time audio transcription and summarization for your meetings.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AnimatedCursor />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

// next dev --turbopack -p 3000

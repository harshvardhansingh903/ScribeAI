"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, ScreenShare, Pause, Play, Square, Loader2, AlertCircle } from "lucide-react";
import { useAudioRecorder, AudioSource } from "@/hooks/use-audio-recorder";
import { summarizeAndStoreSession } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const StatusIndicator = ({ status }: { status: string }) => {
    const statusConfig = {
        recording: { color: "bg-red-500", text: "Recording" },
        paused: { color: "bg-yellow-500", text: "Paused" },
        processing: { color: "bg-blue-500", text: "Processing..." },
        idle: { color: "bg-gray-500", text: "Idle" },
        permission: { color: "bg-yellow-500", text: "Awaiting Permission" },
        stopped: { color: "bg-gray-500", text: "Finished" },
        error: { color: "bg-red-500", text: "Error" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle;

    return (
        <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${config.color} animate-pulse`} />
            <span className="text-sm font-medium text-muted-foreground">{config.text}</span>
        </div>
    );
};


export function Recorder() {
    const [isSourceSelectorOpen, setSourceSelectorOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [timer, setTimer] = useState(0);
    const router = useRouter();
    const { toast } = useToast();

    const onProcessingComplete = useCallback(async (finalTranscript: string) => {
        setIsProcessing(true);
        const result = await summarizeAndStoreSession(finalTranscript);
        setIsProcessing(false);
        if ("sessionId" in result) {
            toast({ title: "Success!", description: "Your session has been saved." });
            router.push(`/history/${result.sessionId}`);
        } else {
            toast({ variant: "destructive", title: "Error", description: result.error });
        }
    }, [router, toast]);

    const { status, transcript, error, startRecording, pauseRecording, resumeRecording, stopRecording } = useAudioRecorder(onProcessingComplete);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'recording') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            if (timer !== 0 && status !== 'paused') setTimer(0);
        }
        return () => clearInterval(interval);
    }, [status, timer]);

    const handleStart = (source: AudioSource) => {
        setSourceSelectorOpen(false);
        setTimer(0);
        startRecording(source);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    const isRecordingOrPaused = status === 'recording' || status === 'paused';

    return (
        <>
            <Card className="w-full min-h-[500px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">New Session</CardTitle>
                        <CardDescription>
                            {isRecordingOrPaused ? 'Your session is in progress.' : 'Click "Start Session" to begin.'}
                        </CardDescription>
                    </div>
                    {isRecordingOrPaused && <StatusIndicator status={isProcessing ? 'processing' : status} />}
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    {isRecordingOrPaused || transcript ? (
                        <div className="flex-grow flex flex-col space-y-4">
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div className="flex items-center gap-4">
                                    {status === 'recording' && <Button variant="outline" size="icon" onClick={pauseRecording}><Pause /></Button>}
                                    {status === 'paused' && <Button variant="outline" size="icon" onClick={resumeRecording}><Play /></Button>}
                                    <Button variant="destructive" size="icon" onClick={stopRecording} disabled={isProcessing} >
                                        {isProcessing ? <Loader2 className="animate-spin" /> : <Square />}
                                    </Button>
                                </div>
                                <Badge variant="secondary" className="text-lg font-mono">{formatTime(timer)}</Badge>
                            </div>
                            <ScrollArea className="flex-grow h-72 rounded-md border p-4 bg-muted/50">
                                <p className="text-sm text-foreground whitespace-pre-wrap">{transcript || "Waiting for transcription..."}</p>
                            </ScrollArea>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Recording Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center flex-grow">
                            <Button size="lg" onClick={() => setSourceSelectorOpen(true)}>
                                <Mic className="mr-2" /> Start New Session
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isSourceSelectorOpen} onOpenChange={setSourceSelectorOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Choose Audio Source</DialogTitle>
                        <DialogDescription>Select the audio source for your transcription.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <Button variant="outline" className="h-24 flex-col" onClick={() => handleStart('mic')}>
                            <Mic className="h-8 w-8 mb-2" />
                            <span>Microphone</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex-col" onClick={() => handleStart('tab')}>
                            <ScreenShare className="h-8 w-8 mb-2" />
                            <span>Tab Audio</span>
                        </Button>
                    </div>
                    <DialogFooter>
                        <p className="text-xs text-muted-foreground text-center w-full">For Tab Audio, please ensure you select "Share tab audio" in the browser prompt.</p>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Pause, Trash, Send, Loader2 } from "lucide-react";
import { startAudioRecording } from "@/lib/speech";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (audioBlob: Blob, audioUrl: string) => void;
  onCancelRecording: () => void;
}

export function VoiceRecorder({
  isRecording,
  onStartRecording,
  onStopRecording,
  onCancelRecording
}: VoiceRecorderProps) {
  const [recorder, setRecorder] = useState<{ stop: () => Promise<any>; cancel: () => void } | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  const handleStartRecording = async () => {
    try {
      onStartRecording();
      const rec = await startAudioRecording();
      setRecorder(rec);
      setRecordingTime(0);
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice recording",
        variant: "destructive"
      });
      onCancelRecording();
    }
  };

  const handleStopRecording = async () => {
    if (recorder) {
      try {
        const { blob, url } = await recorder.stop();
        onStopRecording(blob, url);
      } catch (error) {
        toast({
          title: "Error saving recording",
          description: "There was a problem processing your voice recording",
          variant: "destructive"
        });
        onCancelRecording();
      } finally {
        setRecorder(null);
      }
    }
  };

  const handleCancelRecording = () => {
    if (recorder) {
      recorder.cancel();
      setRecorder(null);
    }
    onCancelRecording();
    setRecordingTime(0);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!isRecording) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleStartRecording}
        className="rounded-full"
        aria-label="Start recording"
      >
        <Mic className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="mt-3 w-full">
      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/60">
        <div className="flex items-center">
          <div className="flex space-x-1 mr-3">
            <div className={`w-1 h-4 bg-red-500 animate-[voice-wave_1.5s_infinite] delay-0`}></div>
            <div className={`w-1 h-6 bg-red-500 animate-[voice-wave_1.5s_infinite] delay-[100ms]`}></div>
            <div className={`w-1 h-8 bg-red-500 animate-[voice-wave_1.5s_infinite] delay-[200ms]`}></div>
            <div className={`w-1 h-4 bg-red-500 animate-[voice-wave_1.5s_infinite] delay-[300ms]`}></div>
            <div className={`w-1 h-6 bg-red-500 animate-[voice-wave_1.5s_infinite] delay-0`}></div>
          </div>
          <span className="font-medium text-red-600 dark:text-red-400">
            Recording... <span id="recording-time">{formatTime(recordingTime)}</span>
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePause}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Pause className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancelRecording}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleStopRecording}
            className="px-3 py-1 bg-primary text-white rounded-lg"
          >
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

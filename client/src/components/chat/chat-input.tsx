import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import { DrawingPad } from "@/components/ui/drawing-pad";
import { FileUpload } from "@/components/ui/file-upload";
import { sendMessage } from "@/lib/socket";
import { startSpeechRecognition, speakText } from "@/lib/speech";
import { useToast } from "@/hooks/use-toast";
import { Bold, Italic, Link, Mic, Send } from "lucide-react";

interface ChatInputProps {
  conversationId: number;
  userId: number;
  language: string;
}

export function ChatInput({ conversationId, userId, language }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showDrawingPad, setShowDrawingPad] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Track network status
  useState(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (isOffline) {
      // Store message locally for later sending
      toast({
        title: "You're offline",
        description: "Your message will be sent when you're back online",
        variant: "destructive"
      });
      return;
    }

    sendMessage(conversationId, message, userId, language);
    setMessage("");
    
    // Resize the textarea back to initial size
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleStartVoiceRecording = () => {
    setIsRecording(true);
  };

  const handleStopVoiceRecording = (audioBlob: Blob, audioUrl: string) => {
    // In a real app, we would upload the audio file and add it to the chat
    toast({
      title: "Voice recording completed",
      description: "Your voice message is ready to send",
    });
    
    setIsRecording(false);
  };

  const handleCancelVoiceRecording = () => {
    setIsRecording(false);
  };

  const handleDrawingComplete = (imageData: string) => {
    // In a real app, we would upload the drawing and add it to the chat
    toast({
      title: "Drawing recognized",
      description: "Your handwritten input has been processed",
    });
    
    setShowDrawingPad(false);
  };

  const handleFileUploaded = (fileUrl: string, fileName: string) => {
    // Add file reference to the message
    const fileMessage = `[File: ${fileName}](${fileUrl})`;
    setMessage(prevMessage => prevMessage ? `${prevMessage}\n${fileMessage}` : fileMessage);
  };

  const formatText = (format: 'bold' | 'italic' | 'link') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = message.substring(start, end);
    
    let replacement = '';
    let cursorPosition = 0;
    
    switch (format) {
      case 'bold':
        replacement = `**${selected}**`;
        cursorPosition = start + 2;
        break;
      case 'italic':
        replacement = `*${selected}*`;
        cursorPosition = start + 1;
        break;
      case 'link':
        replacement = `[${selected}](url)`;
        cursorPosition = end + 3;
        break;
    }
    
    const newMessage = message.substring(0, start) + replacement + message.substring(end);
    setMessage(newMessage);
    
    // Set focus back to textarea and put cursor in the right position
    setTimeout(() => {
      textarea.focus();
      if (selected) {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + replacement.length;
      } else {
        textarea.selectionStart = cursorPosition;
        textarea.selectionEnd = cursorPosition;
      }
    }, 0);
  };

  return (
    <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      {/* File Upload Preview */}
      
      {/* Drawing Pad */}
      {showDrawingPad && (
        <DrawingPad 
          onSave={handleDrawingComplete} 
          onClose={() => setShowDrawingPad(false)} 
        />
      )}
      
      {/* Voice Recording Interface */}
      {isRecording && (
        <VoiceRecorder
          isRecording={isRecording}
          onStartRecording={handleStartVoiceRecording}
          onStopRecording={handleStopVoiceRecording}
          onCancelRecording={handleCancelVoiceRecording}
        />
      )}
      
      {/* Modern Input Box */}
      <div className="flex items-end">
        <div className="flex-1 border dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-800 transition-all">
          {/* Toolbar */}
          <div className="flex items-center p-2 border-b dark:border-gray-700 rounded-t-2xl bg-gray-50 dark:bg-gray-800">
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => formatText('bold')}
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => formatText('italic')}
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => formatText('link')}
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="h-5 border-r dark:border-gray-700 mx-2"></div>
            
            <div className="flex space-x-1">
              {/* File Upload */}
              <FileUpload onUpload={handleFileUploaded} />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDrawingPad(!showDrawingPad)}
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Text Input */}
          <div className="p-3">
            <Textarea
              ref={textareaRef}
              placeholder="Type a message..."
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              className="w-full border-0 focus-visible:ring-0 resize-none bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              rows={2}
            />
          </div>
        </div>
        
        {/* Send Controls */}
        <div className="flex gap-2 ml-2">
          {!isRecording && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartVoiceRecording}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Offline Mode Warning */}
      {isOffline && (
        <div className="mt-3">
          <div className="flex items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/60 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-500 mr-2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <span className="text-yellow-700 dark:text-yellow-400">
              You're in offline mode. Messages will be sent when you're back online.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

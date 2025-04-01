import { useState } from "react";
import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { speakText } from "@/lib/speech";
import { Copy, ThumbsUp, ThumbsDown, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: Message;
  language: string;
}

export function ChatMessage({ message, language }: ChatMessageProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The message has been copied to your clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handlePlayText = () => {
    speakText(message.content, language);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    toast({
      title: type === 'up' ? "Thanks for your feedback!" : "Thanks for your feedback",
      description: type === 'up' 
        ? "We're glad this response was helpful" 
        : "We'll try to improve our responses",
    });
  };
  
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is a translation message with side-by-side format
  const hasTranslation = message.translation !== null && message.translation !== undefined;
  
  // Function to highlight specific terms in a message
  const highlightTerms = (text: string) => {
    // Replace terms with highlighted spans
    // For simplicity, we'll highlight any text between * symbols
    return text.split(/(\*[^*]+\*)/g).map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const term = part.slice(1, -1);
        return (
          <span 
            key={index} 
            className="bg-orange-100 dark:bg-orange-900/20 hover:bg-orange-200 dark:hover:bg-orange-800/30 transition-colors cursor-pointer rounded px-1"
            title="Click to see definition"
          >
            {term}
          </span>
        );
      }
      return part;
    });
  };
  
  // Function to format message content with possible markdown-like formatting
  const formatContent = (content: string) => {
    // Replace **bold** with bold text
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *italic* with italic text
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace [link](url) with actual links
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>');
    
    // Replace file links
    formatted = formatted.replace(/\[File: (.*?)\]\((.*?)\)/g, 
      '<div class="flex items-center mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-primary mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>' +
      '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>' +
      '</div>'
    );
    
    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  if (message.isUserMessage) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-primary text-white rounded-[18px] rounded-br-none p-3 max-w-[80%] md:max-w-[70%] lg:max-w-[60%] shadow-sm">
          {formatContent(message.content)}
          <div className="flex justify-end mt-1">
            <span className="text-xs text-primary-foreground/70">{formatTimestamp(message.createdAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-4">
      <Avatar className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white">
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="ml-2 bg-white dark:bg-gray-800 rounded-[18px] rounded-bl-none p-3 max-w-[80%] md:max-w-[70%] lg:max-w-[60%] shadow-sm">
        {formatContent(message.content)}
        
        {/* Translation panel if message has a translation */}
        {hasTranslation && (
          <div className="mt-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Translation</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayText}
                className="text-primary"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">Original</div>
                <p>{message.content}</p>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">Translated</div>
                <p className="text-primary">{message.translation}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Message actions */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyText}
              className="p-1 text-gray-500 hover:text-primary h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleFeedback('up')}
              className="p-1 text-gray-500 hover:text-primary h-8 w-8"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleFeedback('down')}
              className="p-1 text-gray-500 hover:text-primary h-8 w-8"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimestamp(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

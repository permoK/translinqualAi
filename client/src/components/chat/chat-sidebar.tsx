import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getConversations, createConversation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Search, Plus, X } from "lucide-react";
import { Conversation } from "@/types";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("mas"); // Default to Maasai
  const { toast } = useToast();

  const { data: conversations = [], isLoading, error } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: getConversations,
    enabled: !!user
  });

  const handleCreateConversation = async () => {
    if (!newChatTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your conversation",
        variant: "destructive"
      });
      return;
    }

    try {
      const newConversation = await createConversation({
        title: newChatTitle,
        language: selectedLanguage
      });
      
      // Update cache
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      
      // Reset form
      setNewChatTitle("");
      setIsNewChatDialogOpen(false);
      
      // Navigate to the new conversation
      window.location.href = `/chat/${newConversation.id}`;
    } catch (error) {
      toast({
        title: "Error creating conversation",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'mas':
        return (
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        );
      case 'swa':
        return (
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="m5 8 6 6"></path>
              <path d="m4 14 6-6 2-3"></path>
              <path d="M2 5h12"></path>
              <path d="M7 2h1"></path>
              <path d="m22 22-5-5"></path>
              <path d="M17 8V7"></path>
              <path d="M22 8h-1"></path>
              <path d="M22 17v-1"></path>
              <path d="M14 22h1"></path>
            </svg>
          </div>
        );
      case 'kik':
        return (
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20"></path>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
        );
    }
  };

  // Mobile sidebar handling
  const sidebarClasses = isOpen !== undefined
    ? `${isOpen ? 'fixed' : 'hidden'} z-30 inset-y-0 left-0 w-full sm:w-80 md:w-64 lg:w-80 md:relative md:flex md:flex-col`
    : 'hidden md:flex md:w-64 lg:w-80 md:flex-col';

  return (
    <>
      <aside className={`${sidebarClasses} border-r dark:border-gray-800 bg-white dark:bg-gray-900`}>
        {/* Mobile close button */}
        {isOpen !== undefined && isOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 md:hidden"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        )}
      
        <div className="p-4 border-b dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-lg"
            />
          </div>
        </div>
        
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 py-2">
            Recent Conversations
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              Error loading conversations
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {searchTerm ? "No conversations match your search" : "No conversations yet"}
            </div>
          ) : (
            filteredConversations.map(conversation => (
              <Link key={conversation.id} href={`/chat/${conversation.id}`}>
                <div 
                  className={`p-2 rounded-lg mb-1 cursor-pointer transition-colors
                    ${location === `/chat/${conversation.id}` 
                      ? 'bg-primary bg-opacity-10' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <div className="flex items-center">
                    {getLanguageIcon(conversation.language)}
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <h4 className={`font-medium ${location === `/chat/${conversation.id}` ? 'text-primary' : ''}`}>
                          {conversation.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(conversation.updatedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {conversation.language === 'mas' ? 'Maasai' :
                         conversation.language === 'swa' ? 'Kiswahili' :
                         conversation.language === 'kik' ? 'Kikuyu' : conversation.language}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        
        {/* New Chat Button */}
        <div className="p-4 border-t dark:border-gray-800">
          <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Conversation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Conversation</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Conversation Title</Label>
                  <Input
                    id="title"
                    placeholder="E.g., Maasai Language Practice"
                    value={newChatTitle}
                    onChange={(e) => setNewChatTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConversation}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </aside>
      
      {/* Backdrop for mobile */}
      {isOpen !== undefined && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={onClose}
        />
      )}
    </>
  );
}

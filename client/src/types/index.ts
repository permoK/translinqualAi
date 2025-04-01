export interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: "user" | "admin";
  preferredLanguage: string;
  createdAt: string;
}

export interface ApiKey {
  id: number;
  provider: string;
  keyValue: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: number;
  userId: number;
  title: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  content: string;
  translation?: string | null;
  isUserMessage: boolean;
  createdAt: string;
  fileUrl?: string | null;
  audioUrl?: string | null;
}

export interface Language {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  region?: string;
}

export interface FileUpload {
  fileUrl: string;
  filename: string;
  size: number;
}

export type DrawingData = string; // Base64 encoded image

export interface VoiceRecording {
  blob: Blob;
  duration: number;
  url: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  preferredLanguage?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface ConversationWithMessages {
  conversation: Conversation;
  messages: Message[];
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  preferredLanguage?: string;
}

export interface WebSocketMessage {
  type: "message" | "error" | "typing" | "connected";
  message?: Message;
  error?: string;
  userId?: number;
  conversationId?: number;
}

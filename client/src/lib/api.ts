import { apiRequest } from "./queryClient";
import { 
  Conversation, 
  Message, 
  ApiKey, 
  Language, 
  FileUpload, 
  ConversationWithMessages 
} from "@/types";

// Conversations
export async function getConversations(): Promise<Conversation[]> {
  const res = await apiRequest("GET", "/api/conversations");
  return res.json();
}

export async function getConversation(id: number): Promise<ConversationWithMessages> {
  const res = await apiRequest("GET", `/api/conversations/${id}`);
  return res.json();
}

export async function createConversation(data: { title: string; language: string }): Promise<Conversation> {
  const res = await apiRequest("POST", "/api/conversations", data);
  return res.json();
}

export async function updateConversation(id: number, data: { title?: string; language?: string }): Promise<Conversation> {
  const res = await apiRequest("PUT", `/api/conversations/${id}`, data);
  return res.json();
}

export async function deleteConversation(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/conversations/${id}`);
}

// File Upload
export async function uploadFile(file: File): Promise<FileUpload> {
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || res.statusText);
  }
  
  return res.json();
}

// Languages
export async function getLanguages(): Promise<Language[]> {
  const res = await apiRequest("GET", "/api/languages");
  return res.json();
}

// Admin API Functions
export async function getApiKeys(): Promise<ApiKey[]> {
  const res = await apiRequest("GET", "/api/admin/api-keys");
  return res.json();
}

export async function createOrUpdateApiKey(data: { provider: string; keyValue: string; isActive?: boolean }): Promise<ApiKey> {
  const res = await apiRequest("POST", "/api/admin/api-keys", data);
  return res.json();
}

export async function deleteApiKey(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/admin/api-keys/${id}`);
}

export async function getAdminLanguages(): Promise<Language[]> {
  const res = await apiRequest("GET", "/api/admin/languages");
  return res.json();
}

export async function createLanguage(data: { name: string; code: string; isActive?: boolean; region?: string }): Promise<Language> {
  const res = await apiRequest("POST", "/api/admin/languages", data);
  return res.json();
}

export async function updateLanguage(id: number, data: { name?: string; code?: string; isActive?: boolean; region?: string }): Promise<Language> {
  const res = await apiRequest("PUT", `/api/admin/languages/${id}`, data);
  return res.json();
}

export async function promoteUserToAdmin(userId: number): Promise<void> {
  await apiRequest("POST", "/api/admin/promote-user", { userId });
}

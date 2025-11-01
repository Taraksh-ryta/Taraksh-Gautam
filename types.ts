export interface Source {
  uri: string;
  title: string;
}

export type TextContentPart = { type: 'text'; value: string; sources?: Source[] };
export type ImageContentPart = { type: 'image'; value: string; prompt?: string }; // value is data:image/...;base64,...
export type ToolCallContentPart = { type: 'tool_call'; call: { name: string; args: any } };

export type MessageContent = TextContentPart | ImageContentPart | ToolCallContentPart;

export interface Message {
  role: 'user' | 'model';
  content: MessageContent[];
  metadata?: {
    toolUsed?: string;
  };
}

export interface Conversation {
  id: string;
  title:string;
  messages: Message[];
}

export interface SearchResult {
  conversationId: string;
  conversationTitle: string;
  message: Message;
}

export interface User {
  email: string;
}
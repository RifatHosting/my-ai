export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  imageUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  seed?: number;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

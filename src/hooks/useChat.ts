import { useState, useCallback, useRef } from 'react';
import type { Message } from '@/types';
import { streamChatResponse, getChatResponse } from '@/services/aiService';

interface UseChatOptions {
  enableStreaming?: boolean;
}

export function useChat(options: UseChatOptions = {}) {
  const { enableStreaming = true } = options;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);
    setError(null);

    try {
      if (enableStreaming) {
        const stream = streamChatResponse([...messages, userMessage]);
        let fullContent = '';

        for await (const chunk of stream) {
          fullContent += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content = fullContent;
            }
            return newMessages;
          });
        }

        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.isLoading = false;
          }
          return newMessages;
        });
      } else {
        const response = await getChatResponse([...messages, userMessage]);
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content = response;
            lastMessage.isLoading = false;
          }
          return newMessages;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content = 'I apologize, but I encountered an error. Please try again.';
          lastMessage.isLoading = false;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, enableStreaming]);

  const clearMessages = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    deleteMessage,
  };
}

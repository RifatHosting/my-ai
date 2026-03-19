import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useChat } from '@/hooks/useChat';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import { LoadingDots } from '@/components/ui-custom/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Trash2, 
  Bot, 
  User, 
  Sparkles, 
  Image as ImageIcon,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const { messages, isLoading, sendMessage, clearMessages } = useChat({ enableStreaming: true });
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.chat-message',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const suggestedPrompts = [
    'Write a creative story about AI',
    'Explain quantum computing simply',
    'Generate a marketing slogan',
    'Help me debug my code',
  ];

  return (
    <div ref={containerRef} className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">RIFAT Chat</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-rifat-gray-400 text-xs">Online</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearMessages}
          disabled={messages.length === 0 || isLoading}
          className="text-rifat-gray-400 hover:text-white hover:bg-white/5"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white/60" />
            </div>
            <h4 className="text-white font-medium mb-2">Start a conversation</h4>
            <p className="text-rifat-gray-400 text-sm mb-6 max-w-xs">
              Ask me anything. I can help with writing, coding, analysis, and creative tasks.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm text-rifat-gray-300 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'chat-message flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'user' ? 'bg-white/20' : 'bg-white/10'
                )}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div
                className={cn(
                  'max-w-[80%] group',
                  message.role === 'user' ? 'text-right' : ''
                )}
              >
                <GlassCard
                  variant={message.role === 'user' ? 'subtle' : 'default'}
                  className={cn(
                    'inline-block px-4 py-3 text-left',
                    message.role === 'user' ? 'bg-white/10' : ''
                  )}
                >
                  {message.isLoading ? (
                    <LoadingDots />
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-white/90 text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  )}
                </GlassCard>
                
                {!message.isLoading && message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="text-rifat-gray-500 hover:text-white transition-colors"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-xs text-rifat-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/20 pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-12 px-4 bg-white text-rifat-black hover:bg-white/90 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
        <p className="text-center text-xs text-rifat-gray-500 mt-2">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}

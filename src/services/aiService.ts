import type { Message, GeneratedImage } from '@/types';

// Free AI Chat API using Pollinations AI (no API key required)
export async function* streamChatResponse(messages: Message[]): AsyncGenerator<string, void, unknown> {
  const formattedMessages = messages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          {
            role: 'system',
            content: 'You are Rifat AI, a helpful and creative AI assistant. You provide detailed, accurate, and engaging responses. You can help with writing, coding, analysis, creative tasks, and general questions.'
          },
          ...formattedMessages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  } catch (error) {
    console.error('Chat error:', error);
    yield 'I apologize, but I encountered an error. Please try again later.';
  }
}

// Alternative: Non-streaming chat response
export async function getChatResponse(messages: Message[]): Promise<string> {
  const formattedMessages = messages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          {
            role: 'system',
            content: 'You are Rifat AI, a helpful and creative AI assistant. You provide detailed, accurate, and engaging responses.'
          },
          ...formattedMessages
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';
  } catch (error) {
    console.error('Chat error:', error);
    return 'I apologize, but I encountered an error. Please try again later.';
  }
}

// Free Image Generation using Pollinations AI (no API key required)
export function generateImageUrl(prompt: string, options?: {
  width?: number;
  height?: number;
  seed?: number;
  nologo?: boolean;
}): string {
  const { width = 1024, height = 1024, seed, nologo = true } = options || {};
  
  const encodedPrompt = encodeURIComponent(prompt);
  let url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=${nologo}`;
  
  if (seed !== undefined) {
    url += `&seed=${seed}`;
  }
  
  return url;
}

export async function generateImage(prompt: string, options?: {
  width?: number;
  height?: number;
}): Promise<GeneratedImage> {
  const { width = 1024, height = 1024 } = options || {};
  const seed = Math.floor(Math.random() * 1000000);
  
  const url = generateImageUrl(prompt, { width, height, seed });
  
  // Pre-fetch to ensure the image is generated
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to generate image');
    }
  } catch (error) {
    console.error('Image generation error:', error);
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    url,
    prompt,
    timestamp: new Date(),
    seed,
  };
}

// Available AI Models
export const AI_MODELS = [
  {
    id: 'openai',
    name: 'RIFAT Pro',
    description: 'Best for images & code',
    tags: ['creative', 'coding', 'analysis'],
  },
  {
    id: 'mistral',
    name: 'RIFAT Lite',
    description: 'Fastest responses',
    tags: ['fast', 'efficient'],
  },
  {
    id: 'llama',
    name: 'RIFAT Reason',
    description: 'Complex problem solving',
    tags: ['reasoning', 'math', 'logic'],
  },
  {
    id: 'rifat',
    name: 'RIFAT Vision',
    description: 'Image understanding',
    tags: ['vision', 'multimodal'],
  },
];

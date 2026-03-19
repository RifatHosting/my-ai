import { useState, useCallback } from 'react';
import type { GeneratedImage } from '@/types';
import { generateImage } from '@/services/aiService';

interface UseImageGenOptions {
  onSuccess?: (image: GeneratedImage) => void;
  onError?: (error: string) => void;
}

export function useImageGen(options: UseImageGenOptions = {}) {
  const { onSuccess, onError } = options;
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generate = useCallback(async (
    prompt: string,
    options?: { width?: number; height?: number }
  ) => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const image = await generateImage(prompt.trim(), options);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setImages(prev => [image, ...prev]);
      onSuccess?.(image);
      
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 500);
      
      return image;
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image';
      setError(errorMessage);
      onError?.(errorMessage);
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, onSuccess, onError]);

  const deleteImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
    setProgress(0);
  }, []);

  const regenerate = useCallback(async (image: GeneratedImage) => {
    return generate(image.prompt, {
      width: image.seed ? 1024 : undefined,
      height: image.seed ? 1024 : undefined,
    });
  }, [generate]);

  return {
    images,
    isGenerating,
    error,
    progress,
    generate,
    deleteImage,
    clearImages,
    regenerate,
  };
}

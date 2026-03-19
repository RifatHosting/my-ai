import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useImageGen } from '@/hooks/useImageGen';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import { LoadingSpinner, ProgressBar } from '@/components/ui-custom/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Wand2,
  Download,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  Expand,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImageGeneratorProps {
  className?: string;
}

export function ImageGenerator({ className }: ImageGeneratorProps) {
  const { images, isGenerating, progress, generate, deleteImage, clearImages } = useImageGen();
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState<'square' | 'portrait' | 'landscape'>('square');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const sizeOptions = {
    square: { width: 1024, height: 1024, label: '1:1' },
    portrait: { width: 768, height: 1344, label: '3:4' },
    landscape: { width: 1344, height: 768, label: '4:3' },
  };

  const suggestedPrompts = [
    'A futuristic city at night with neon lights',
    'A serene mountain landscape at sunrise',
    'An abstract geometric pattern in black and white',
    'A cyberpunk character portrait',
  ];

  // Animation for new images
  useEffect(() => {
    if (images.length === 0 || !galleryRef.current) return;

    const newImage = galleryRef.current.firstElementChild;
    if (newImage) {
      gsap.fromTo(
        newImage,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [images.length]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    const size = sizeOptions[selectedSize];
    await generate(prompt.trim(), { width: size.width, height: size.height });
  };

  const handleCopyPrompt = async (promptText: string, id: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `rifat-generated-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  return (
    <div ref={containerRef} className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Image Generator</h3>
            <span className="text-rifat-gray-400 text-xs">Powered by Rifat AI</span>
          </div>
        </div>
        {images.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearImages}
            disabled={isGenerating}
            className="text-rifat-gray-400 hover:text-white hover:bg-white/5"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Input Section */}
        <div className="p-4 border-b border-white/10">
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm mb-2 block">Describe your image</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic cityscape with flying cars and neon lights..."
                disabled={isGenerating}
                className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/20 resize-none"
              />
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-white/80 text-sm mb-2 block">Aspect Ratio</label>
              <div className="flex gap-2">
                {Object.entries(sizeOptions).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSize(key as typeof selectedSize)}
                    disabled={isGenerating}
                    className={cn(
                      'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all',
                      selectedSize === key
                        ? 'bg-white text-rifat-black border-white'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full h-12 bg-white text-rifat-black hover:bg-white/90 font-semibold rounded-xl transition-all hover:scale-[1.02] hover:shadow-glow disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Image
                </span>
              )}
            </Button>

            {/* Progress Bar */}
            {isGenerating && progress > 0 && (
              <ProgressBar progress={progress} />
            )}

            {/* Suggested Prompts */}
            {!prompt && !isGenerating && (
              <div>
                <label className="text-rifat-gray-400 text-xs mb-2 block">Try these prompts</label>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(suggestion)}
                      className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-rifat-gray-300 hover:text-white transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        {images.length > 0 && (
          <div className="p-4">
            <h4 className="text-white/80 text-sm mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Generated Images ({images.length})
            </h4>
            <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((image) => (
                <GlassCard
                  key={image.id}
                  variant="default"
                  hover
                  className="overflow-hidden group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                            <Expand className="w-5 h-5" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-rifat-charcoal border-white/10 p-0">
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-auto"
                          />
                          <div className="p-4 border-t border-white/10">
                            <p className="text-white text-sm">{image.prompt}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <button
                        onClick={() => handleDownload(image.url, image.id)}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => deleteImage(image.id)}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-red-500/50 flex items-center justify-center text-white transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <p className="text-white/80 text-xs line-clamp-2 mb-2">{image.prompt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-rifat-gray-500 text-xs">
                        {image.timestamp.toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleCopyPrompt(image.prompt, image.id)}
                        className="text-rifat-gray-400 hover:text-white transition-colors"
                      >
                        {copiedId === image.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-white/40" />
            </div>
            <h4 className="text-white font-medium mb-2">No images yet</h4>
            <p className="text-rifat-gray-400 text-sm max-w-xs">
              Enter a prompt above to generate your first AI image. It's free and instant!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

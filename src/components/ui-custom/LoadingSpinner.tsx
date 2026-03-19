import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-white/20 border-t-white animate-spin',
          sizeClasses[size]
        )}
        style={{ borderWidth: size === 'lg' ? '3px' : size === 'xl' ? '4px' : '2px' }}
      />
      {text && (
        <span className="text-sm text-rifat-gray-400 font-mono tracking-wider animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ progress, className, showPercentage = true }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={cn('w-full', className)}>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between mt-2 text-xs text-rifat-gray-400 font-mono">
          <span>Generating...</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
    </div>
  );
}

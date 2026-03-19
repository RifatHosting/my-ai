import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle';
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover = false, glow = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[rgba(11,11,11,0.72)] border-white/[0.08]',
      strong: 'bg-[rgba(11,11,11,0.85)] border-white/[0.12]',
      subtle: 'bg-white/[0.03] border-white/[0.06]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'backdrop-blur-xl rounded-2xl border',
          variants[variant],
          hover && 'transition-all duration-300 hover:border-white/[0.18] hover:-translate-y-0.5',
          glow && 'shadow-glow',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };

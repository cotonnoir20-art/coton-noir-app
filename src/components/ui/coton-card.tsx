import React from 'react';
import { cn } from '@/lib/utils';

interface CotonCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'premium' | 'outline';
  onClick?: () => void;
}

export function CotonCard({ 
  children, 
  className, 
  variant = 'default',
  onClick
}: CotonCardProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component 
      onClick={onClick}
      className={cn(
        "rounded-xl sm:rounded-2xl transition-all duration-400 text-left backdrop-blur-sm",
        "px-2 py-2 sm:px-3 sm:py-3",
        "-mt-1 -mb-1 sm:-mt-1 sm:-mb-1",
        "w-full max-w-none",
        "transform-gpu will-change-transform",
        {
          'default': "bg-card/95 text-card-foreground border border-coton-rose/25 shadow-elegant sm:shadow-premium backdrop-blur-md hover:shadow-glow",
          'elevated': "bg-gradient-to-br from-coton-beige-light/95 to-white/90 text-coton-black shadow-elegant sm:shadow-premium hover:shadow-glow border border-coton-rose/30 backdrop-blur-md hover:scale-[1.01]",
          'premium': "bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 text-white shadow-premium border border-amber-300/50 backdrop-blur-md hover:shadow-glow hover:scale-[1.01]",
          'outline': "border-2 border-coton-rose bg-coton-beige-light/80 text-coton-black backdrop-blur-md hover:bg-coton-rose/15 hover:border-coton-rose/60 hover:scale-[1.01]"
        }[variant],
        onClick && [
          "cursor-pointer select-none",
          "hover:scale-[1.02] sm:hover:scale-[1.03]", 
          "active:scale-[0.97] sm:active:scale-[0.98]",
          "transform-gpu will-change-transform",
          "focus:outline-none focus:ring-2 focus:ring-coton-rose/60 focus:ring-offset-2",
          "touch-manipulation"
        ],
        className
      )}
    >
      {children}
    </Component>
  );
}
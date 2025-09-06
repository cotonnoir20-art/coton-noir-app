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
        "rounded-lg sm:rounded-xl transition-all duration-300 text-left",
        "px-1 py-1 sm:px-2 sm:py-1",
        "mt-0 mb-1 sm:mt-0 sm:mb-1",
        "w-full max-w-none",
        {
          'default': "bg-card text-card-foreground border border-coton-rose/20 shadow-card sm:shadow-elegant backdrop-blur-sm",
          'elevated': "bg-coton-beige-light text-coton-black shadow-card sm:shadow-elegant hover:shadow-soft border border-coton-rose/30 backdrop-blur-sm",
          'premium': "bg-gradient-coral text-coton-beige-light shadow-card sm:shadow-elegant border border-coton-coral/20 backdrop-blur-sm",
          'outline': "border border-coton-rose sm:border-2 bg-coton-beige-light/80 text-coton-black backdrop-blur-sm hover:bg-coton-rose/10"
        }[variant],
        onClick && [
          "cursor-pointer select-none",
          "hover:scale-[1.01] sm:hover:scale-[1.02]", 
          "active:scale-[0.98] sm:active:scale-[0.99]",
          "transform-gpu will-change-transform",
          "focus:outline-none focus:ring-2 focus:ring-coton-rose/50 focus:ring-offset-2",
          "touch-manipulation"
        ],
        className
      )}
    >
      {children}
    </Component>
  );
}
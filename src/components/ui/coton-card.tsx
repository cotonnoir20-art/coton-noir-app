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
        "rounded-lg transition-all duration-300 text-left",
        {
          'default': "bg-card text-card-foreground border border-coton-rose/20 shadow-card backdrop-blur-sm",
          'elevated': "bg-coton-beige-light text-coton-black shadow-elegant hover:shadow-soft border border-coton-rose/30 backdrop-blur-sm",
          'premium': "bg-gradient-coral text-coton-beige-light shadow-elegant border border-coton-coral/20 backdrop-blur-sm",
          'outline': "border-2 border-coton-rose bg-coton-beige-light/80 text-coton-black backdrop-blur-sm hover:bg-coton-rose/10"
        }[variant],
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </Component>
  );
}
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
          'default': "bg-card text-card-foreground border border-border shadow-card backdrop-blur-sm",
          'elevated': "bg-card text-card-foreground shadow-soft hover:shadow-card border border-border backdrop-blur-sm hover:bg-card/80",
          'premium': "bg-gradient-hero text-white shadow-soft border border-white/10 backdrop-blur-sm",
          'outline': "border-2 border-accent bg-background/50 text-foreground backdrop-blur-sm hover:bg-accent/5"
        }[variant],
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </Component>
  );
}
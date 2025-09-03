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
          'default': "bg-card border border-border shadow-card",
          'elevated': "bg-card shadow-soft hover:shadow-card border border-border",
          'premium': "bg-gradient-hero text-white shadow-soft",
          'outline': "border-2 border-coton-rose bg-transparent"
        }[variant],
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </Component>
  );
}
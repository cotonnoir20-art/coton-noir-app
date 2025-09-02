import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  variant?: 'default' | 'coins' | 'challenge';
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ 
  progress, 
  className, 
  variant = 'default',
  showLabel = false,
  label
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-roboto text-muted-foreground">
            {label}
          </span>
          <span className="text-sm font-roboto font-medium">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div className={cn(
        "h-2 rounded-full overflow-hidden",
        {
          'default': "bg-muted",
          'coins': "bg-coton-rose/30",
          'challenge': "bg-success/20"
        }[variant]
      )}>
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            {
              'default': "bg-primary",
              'coins': "bg-gradient-rose",
              'challenge': "bg-success"
            }[variant]
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
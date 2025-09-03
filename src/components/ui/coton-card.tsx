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
  return;
}
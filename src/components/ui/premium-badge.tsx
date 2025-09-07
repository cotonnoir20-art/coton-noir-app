import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PremiumBadge({ className, size = 'md' }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'h-4 text-xs',
    md: 'h-5 text-sm', 
    lg: 'h-6 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      className={cn(
        'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 hover:from-amber-500 hover:to-yellow-600 font-semibold px-2 py-1 gap-1',
        sizeClasses[size],
        className
      )}
    >
      <Crown className={iconSizes[size]} />
      Premium
    </Badge>
  );
}

interface PremiumFeatureProps {
  children: React.ReactNode;
  isPremium?: boolean;
  className?: string;
}

export function PremiumFeature({ children, isPremium = false, className }: PremiumFeatureProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {!isPremium && (
        <div className="absolute inset-0 bg-muted/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <PremiumBadge />
            <p className="text-sm text-muted-foreground">Fonctionnalité Premium</p>
          </div>
        </div>
      )}
    </div>
  );
}
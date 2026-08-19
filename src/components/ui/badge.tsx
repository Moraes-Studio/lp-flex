import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-pill font-mono text-[11.5px] font-bold tracking-wider uppercase',
  {
    variants: {
      variant: {
        institutional: 'border-2 border-flex-blue-600/50 bg-flex-blue-600/10 text-flex-blue-700',
        campaign: 'border-2 border-campaign-accent/50 bg-campaign-accent/15 text-campaign-accent',
        warning: 'border-2 border-warning/45 bg-warning/12 text-warning',
      },
      size: {
        default: 'px-3.5 py-2',
        sm: 'px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'institutional',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />;
}

export { Badge, badgeVariants };

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-pill font-mono text-[10px] font-medium tracking-wide uppercase',
  {
    variants: {
      variant: {
        institutional: 'border border-flex-bright/40 bg-flex-bright/10 text-flex-bright',
        campaign: 'border border-campaign-accent/35 bg-campaign-accent/15 text-campaign-accent',
        warning: 'border border-warning/35 bg-warning/15 text-warning',
      },
      size: {
        default: 'px-3 py-1.5',
        sm: 'px-2.5 py-1',
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

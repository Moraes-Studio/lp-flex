import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const eyebrowVariants = cva(
  'mb-4 flex items-center gap-2.5 font-mono text-[12.5px] font-medium tracking-[0.13em] uppercase before:h-px before:w-5 before:content-[""]',
  {
    variants: {
      variant: {
        bright: 'text-flex-bright before:bg-flex-bright',
        ice: 'text-flex-ice before:bg-flex-ice',
      },
    },
    defaultVariants: {
      variant: 'bright',
    },
  }
);

export interface EyebrowProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof eyebrowVariants> {}

function Eyebrow({ className, variant, ...props }: EyebrowProps) {
  return <div className={cn(eyebrowVariants({ variant, className }))} {...props} />;
}

export { Eyebrow, eyebrowVariants };

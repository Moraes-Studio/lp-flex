import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const panelVariants = cva(
  'bg-card border-border rounded-2xl border transition-colors duration-300',
  {
    variants: {
      interactive: {
        true: 'hover:border-flex-bright/60',
        false: '',
      },
    },
    defaultVariants: {
      interactive: false,
    },
  }
);

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof panelVariants> {}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, interactive, ...props }, ref) => (
    <div ref={ref} className={cn(panelVariants({ interactive, className }))} {...props} />
  )
);
Panel.displayName = 'Panel';

export { Panel, panelVariants };

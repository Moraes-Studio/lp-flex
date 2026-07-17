import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow, type EyebrowProps } from '@/components/shared/eyebrow';

interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow: React.ReactNode;
  eyebrowVariant?: EyebrowProps['variant'];
  title: React.ReactNode;
  description?: React.ReactNode;
  size?: 'default' | 'large';
}

function SectionHeading({
  className,
  eyebrow,
  eyebrowVariant,
  title,
  description,
  size = 'default',
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-13 max-w-[640px]', className)} {...props}>
      <Eyebrow variant={eyebrowVariant}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          'leading-[1.12]',
          size === 'large' ? 'text-[clamp(34px,4.4vw,56px)]' : 'text-[clamp(28px,3.1vw,42px)]'
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-3.5 max-w-[520px] text-sm">{description}</p>
      ) : null}
    </div>
  );
}

export { SectionHeading };

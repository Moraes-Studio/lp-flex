import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PhotoRatio = 'square' | 'portrait' | 'wide';

export const RATIO_CLASS: Record<PhotoRatio, string> = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[16/10]',
};

interface PhotoPlaceholderProps {
  /** O que essa foto vai mostrar quando existir o arquivo real. Nunca gerar
   * imagem sintética pra preencher — ver política de fotografia (CLAUDE.md). */
  label: string;
  className?: string;
  ratio?: PhotoRatio;
}

/**
 * Placeholder explícito de foto real ainda não disponível. Nunca substituir
 * por imagem gerada por IA ou banco de imagens — a Flex é fotografia
 * documental real ou nada (CLAUDE.md, política de fotografia — sem exceção).
 * Normalmente não usado direto — ver `<Photo>`, que alterna sozinho entre
 * isto e a imagem real assim que `src` existir.
 */
export function PhotoPlaceholder({ label, className, ratio = 'wide' }: PhotoPlaceholderProps) {
  return (
    <div
      className={cn(
        'border-border bg-background-alt relative flex items-center justify-center overflow-hidden rounded-2xl border',
        RATIO_CLASS[ratio],
        className
      )}
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, var(--border) 0, var(--border) 1.5px, transparent 1.5px, transparent 16px)',
      }}
      role="img"
      aria-label={`Espaço reservado para foto real — ${label}`}
    >
      <span className="border-border bg-background text-muted-foreground inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase shadow-sm">
        <Camera className="h-3.5 w-3.5" aria-hidden="true" />
        Foto — {label}
      </span>
    </div>
  );
}

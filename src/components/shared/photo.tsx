import Image from 'next/image';
import { cn } from '@/lib/utils';
import { RATIO_CLASS, type PhotoRatio } from '@/components/shared/photo-placeholder';

interface PhotoProps {
  /** Caminho real (`/fotos/...`) ou `null`/`undefined` — sem arquivo ainda. */
  src?: string | null;
  alt: string;
  /** Reservado pro dia em que o placeholder visual voltar a ser usado. */
  label: string;
  ratio?: PhotoRatio;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Slot de foto pronto pro dia em que o arquivo real chegar: enquanto `src`
 * for nulo, não reserva espaço nenhum (a caixa com padrão diagonal ficava
 * feia demais pra ir pro ar assim, pedido explícito) — o layout ao redor
 * simplesmente flui sem o card de foto. Trocar `src` de null pra um caminho
 * real não exige tocar em nenhum componente. Nunca gerar imagem sintética
 * pra preencher o vazio — política de fotografia do CLAUDE.md.
 */
export function Photo({ src, alt, ratio = 'wide', className, priority, sizes }: PhotoProps) {
  if (!src) {
    return null;
  }

  return (
    <div className={cn('border-border relative overflow-hidden rounded-2xl border', RATIO_CLASS[ratio], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? '(min-width: 1024px) 50vw, 100vw'}
        className="object-cover"
      />
    </div>
  );
}

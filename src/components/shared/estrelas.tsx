import { formatarNota } from '@/lib/content/reputacao';
import { cn } from '@/lib/utils';

const ESTRELA = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z';
const VAO = 2;

function Fileira({ tamanho, className }: { tamanho: number; className?: string }) {
  return (
    <span className={cn('flex', className)} style={{ gap: VAO }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={tamanho}
          height={tamanho}
          className="shrink-0"
          fill="currentColor"
        >
          <path d={ESTRELA} />
        </svg>
      ))}
    </span>
  );
}

/**
 * Cinco estrelas com a parte amarela proporcional à nota (4,5 → quatro e
 * meia). A fileira amarela é a mesma da cinza, cortada na largura da nota
 * (em px, contando os vãos entre estrelas), então a meia estrela sai certa.
 * Leitores de tela ouvem só "Nota 4,5 de 5".
 */
export function Estrelas({
  nota,
  tamanho = 14,
  className,
  vazia = 'text-white/25',
}: {
  nota: number;
  /** Lado de cada estrela, em px. */
  tamanho?: number;
  className?: string;
  /** Cor das estrelas apagadas, conforme o fundo. */
  vazia?: string;
}) {
  const n = Math.max(0, Math.min(5, nota));
  const cheias = Math.floor(n);
  const largura = cheias * (tamanho + VAO) + (n - cheias) * tamanho;
  return (
    <span
      role="img"
      aria-label={`Nota ${formatarNota(nota)} de 5`}
      className={cn('relative inline-flex', className)}
    >
      <Fileira tamanho={tamanho} className={vazia} />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: largura }}>
        <Fileira tamanho={tamanho} className="text-rating" />
      </span>
    </span>
  );
}

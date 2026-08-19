import {
  Activity,
  Disc3,
  Dumbbell,
  Flame,
  Flower2,
  Footprints,
  Music4,
  PersonStanding,
  Swords,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Um ícone próprio por modalidade — nunca reaproveitado entre duas
 * modalidades diferentes (RULES.md, `content/modalidades.json` já valida
 * isso em runtime). Se uma modalidade nova entrar sem chave aqui, cai no
 * ícone genérico em vez de quebrar a build — mas isso deve ser tratado como
 * pendência de design, não estado final.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  'flex-training': Waves,
  fitdance: Disc3,
  'jump-funcional': Zap,
  musculacao: Dumbbell,
  pilates: PersonStanding,
  'step-funcional': Footprints,
  yoga: Flower2,
  zumba: Music4,
  'cross-training': Activity,
  gap: Flame,
  ritbox: Swords,
};

export function ModalidadeIcon({ icone, className }: { icone: string; className?: string }) {
  const Icon = ICON_MAP[icone] ?? Activity;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}

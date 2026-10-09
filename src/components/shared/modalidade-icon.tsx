import {
  Activity,
  BicepsFlexed,
  Dumbbell,
  Flame,
  Flower2,
  Footprints,
  HandFist,
  Headphones,
  Music4,
  PersonStanding,
  Timer,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Um ícone próprio por modalidade — nunca reaproveitado entre duas
 * modalidades diferentes (RULES.md, `content/modalidades.json` já valida
 * isso em runtime). Se uma modalidade nova entrar sem chave aqui, cai no
 * ícone genérico em vez de quebrar a build — mas isso deve ser tratado como
 * pendência de design, não estado final.
 *
 * Rodada 2026-10-08 (feedback: ícones que ninguém entendia): Ritbox virou
 * punho (era espadas), Flex Training virou bíceps (eram ondas), Fit Dance
 * virou fone (era disco) e Cross Training virou cronômetro (era o mesmo
 * traço de batimento do ícone genérico).
 */
const ICON_MAP: Record<string, LucideIcon> = {
  'flex-training': BicepsFlexed,
  fitdance: Headphones,
  'jump-funcional': Zap,
  musculacao: Dumbbell,
  pilates: PersonStanding,
  'step-funcional': Footprints,
  yoga: Flower2,
  zumba: Music4,
  'cross-training': Timer,
  gap: Flame,
  ritbox: HandFist,
};

export function ModalidadeIcon({ icone, className }: { icone: string; className?: string }) {
  const Icon = ICON_MAP[icone] ?? Activity;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}

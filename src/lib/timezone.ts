import type { Dia } from '@/lib/content/horarios-shared';

/**
 * Fuso oficial da Flex (Vila Helena, Santo André/SP). Único ponto de verdade
 * usado por toda lógica de "que dia é hoje"/"que horas são agora" no site —
 * nunca `new Date().getDay()`/`getHours()` direto, que lê o fuso do
 * PROCESSO que roda o código (servidor Vercel roda em UTC; navegador do
 * visitante pode estar em qualquer fuso), não o de Santo André.
 *
 * Achado real em produção: a grade de Horários (Server Component, página
 * 100% estática — ver next.config.ts) calculava "hoje" com `new Date()`
 * direto no corpo do componente. Isso roda UMA VEZ no build/deploy da
 * Vercel (UTC) e fica congelado no HTML estático até o próximo deploy — não
 * é só timezone, é o dia inteiro ficando desatualizado. A correção real tem
 * duas partes: (1) fuso explícito América/São Paulo (este módulo) e (2)
 * mover o cálculo de "hoje" pra rodar no cliente, depois de montar — mesmo
 * padrão já usado em HeroBoard/StatusChip/HorariosMobile (ver comentário em
 * cada um), nunca no corpo de um Server Component estático.
 */
export const TIMEZONE_OFICIAL = 'America/Sao_Paulo';

const ORDEM_WEEKDAY_INTL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
type WeekdayIntl = (typeof ORDEM_WEEKDAY_INTL)[number];

const DIA_INTL_PARA_LABEL: Record<WeekdayIntl, Dia> = {
  Sun: 'Dom',
  Mon: 'Seg',
  Tue: 'Ter',
  Wed: 'Qua',
  Thu: 'Qui',
  Fri: 'Sex',
  Sat: 'Sáb',
};

/** `Intl.DateTimeFormat({ weekday: 'short' })` no fuso oficial retorna o
 * nome curto em inglês ("Mon", "Tue"...) — extraído uma vez aqui, reusado
 * pelas duas funções abaixo (rótulo pt-BR e índice numérico) pra não repetir
 * a formatação. */
function weekdayIntlEmSaoPaulo(instant: Date): WeekdayIntl {
  const valor = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE_OFICIAL,
    weekday: 'short',
  }).format(instant);
  return (ORDEM_WEEKDAY_INTL as readonly string[]).includes(valor) ? (valor as WeekdayIntl) : 'Mon';
}

/** Dia da semana (rótulo Seg..Dom) de um instante, sempre em São Paulo. */
export function diaDaSemanaEmSaoPaulo(instant: Date): Dia {
  return DIA_INTL_PARA_LABEL[weekdayIntlEmSaoPaulo(instant)];
}

/** Índice igual a `Date.prototype.getDay()` (0=domingo..6=sábado), mas
 * calculado em São Paulo — pra reaproveitar em código que já indexa array
 * nesse formato (ex: `calcularStatus`/funcionamento, 7 posições
 * domingo..sábado) sem duplicar a extração do dia da semana. */
export function numeroDoDiaEmSaoPaulo(instant: Date): number {
  return ORDEM_WEEKDAY_INTL.indexOf(weekdayIntlEmSaoPaulo(instant));
}

/** Minutos desde a meia-noite de um instante, em São Paulo — pra lógica de
 * "aberto agora"/"aula rolando agora" (calcularStatus, HeroBoard). */
export function minutosDoDiaEmSaoPaulo(instant: Date): number {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE_OFICIAL,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(instant);
  const get = (tipo: string) => Number(partes.find((p) => p.type === tipo)?.value ?? '0');
  // hour12:false pode retornar "24" pra meia-noite em alguns runtimes ICU —
  // `% 24` normaliza pra 0.
  return (get('hour') % 24) * 60 + get('minute');
}

/** Dia + minutos do dia em São Paulo, num só instante — conveniência pra
 * quem precisa dos dois (HeroBoard). */
export function agoraEmSaoPaulo(instant: Date = new Date()): { dia: Dia; minutos: number } {
  return { dia: diaDaSemanaEmSaoPaulo(instant), minutos: minutosDoDiaEmSaoPaulo(instant) };
}

/**
 * Instante UTC correspondente a 23:59:59.999 de uma data civil (YYYY-MM-DD)
 * em São Paulo — pra comparações de "válido até o fim do dia X" (campanha)
 * sem depender de offset fixo "-03:00" nem do fuso do processo.
 *
 * Algoritmo (o mesmo usado por bibliotecas como date-fns-tz, sem precisar
 * de uma dependência nova pra isto): chuta um instante tratando os
 * componentes como se já fossem UTC, mede em que horário local de São Paulo
 * esse chute realmente cai (via `Intl`), e corrige pela diferença. Continua
 * correto mesmo se o offset de São Paulo mudar no futuro (hoje é -03:00
 * fixo, sem horário de verão desde 2019) porque o offset nunca é
 * hardcoded — é medido a cada chamada.
 */
export function fimDoDiaEmSaoPaulo(dataISO: string): Date {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  // `Intl.formatToParts` não tem campo de milissegundo — o round-trip abaixo
  // roda só em precisão de segundo (o offset de fuso nunca depende de
  // milissegundo de qualquer forma) e os 999ms de "fim do dia" são somados
  // de volta só no final, fora da correção.
  const desejadoSemMs = Date.UTC(ano, mes - 1, dia, 23, 59, 59);
  const chute = new Date(desejadoSemMs);

  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE_OFICIAL,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(chute);
  const get = (tipo: string) => Number(partes.find((p) => p.type === tipo)?.value ?? '0');
  const chuteComoSP = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));

  const diferenca = chuteComoSP - desejadoSemMs;
  return new Date(desejadoSemMs - diferenca + 999);
}

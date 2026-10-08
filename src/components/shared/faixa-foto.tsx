import Image from 'next/image';
import { mediaConfig } from '@/config/media';
import { agruparFuncionamento, type DiaFuncionamento } from '@/lib/content/funcionamento';

/**
 * Faixa de foto em largura total entre Modalidades e Horários: o horário de
 * segunda (o do primeiro grupo da grade) em tamanho gigante sobre a foto real
 * da sala de cardio, com camada de cor sólida (nunca gradiente/vidro). Tudo
 * vem de `content/funcionamento.json`; nada de horário fixo aqui. Não é
 * eyebrow (limite de 3 na home) e não tem `id`: é pausa visual, não destino.
 * Parallax só por CSS (`.faixa-parallax` em globals.css), desligado com
 * `prefers-reduced-motion`.
 *
 * Abaixo da foto, numa barra de cor sólida (fora da imagem: sobre a foto só
 * vai o título), o resto da semana. Sem ela o visitante lê o horário gigante
 * como "só abre de segunda a quinta".
 */
export function FaixaFoto({ funcionamento }: { funcionamento: DiaFuncionamento[] }) {
  const segunda = funcionamento[1];
  const [grupo, ...restoDaSemana] = agruparFuncionamento(funcionamento);
  if (!segunda?.abre || !segunda.fecha || !grupo) return null;
  const foto = mediaConfig.faixaFoto;

  return (
    <section aria-label="Horário de funcionamento" className="bg-flex-blue-950">
      <div className="relative isolate flex min-h-[60vh] items-center overflow-hidden md:min-h-[70vh]">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div data-faixa-parallax className="faixa-parallax absolute inset-0">
            <Image src={foto.src} alt="" fill sizes="100vw" className="object-cover" />
          </div>
        </div>
        <div className="bg-flex-blue-950/55 absolute inset-0 -z-10" aria-hidden="true" />

        <div className="w-full px-[6%] py-20 text-white md:py-28">
          <div className="mx-auto max-w-[1180px]">
            <p className="font-heading text-[clamp(56px,11vw,168px)] leading-none font-bold tracking-[0.005em] tabular-nums">
              {segunda.abre} às {segunda.fecha}
            </p>
            <p className="font-heading mt-4 text-[clamp(22px,3.2vw,44px)] leading-tight font-semibold tracking-wide uppercase md:mt-6">
              {grupo.rotuloLongo.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {restoDaSemana.length > 0 ? (
        <div className="border-t border-white/15 px-[6%] text-white">
          <dl
            data-testid="faixa-resto-semana"
            className="mx-auto grid max-w-[1180px] divide-y divide-white/15 md:auto-cols-fr md:grid-flow-col md:divide-x md:divide-y-0"
          >
            {restoDaSemana.map((g) => (
              <div
                key={g.rotuloLongo}
                className="flex items-baseline justify-between gap-4 py-5 md:flex-col md:justify-start md:gap-1.5 md:px-8 md:py-8 md:first:pl-0"
              >
                <dt className="text-flex-blue-200 font-mono text-[12px] tracking-[0.08em] uppercase">
                  {g.rotuloLongo}
                </dt>
                <dd className="font-heading text-[clamp(22px,2.6vw,32px)] leading-none font-semibold tabular-nums">
                  {g.horario.replace('-', ' às ')}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}

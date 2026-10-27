'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog } from 'radix-ui';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Ambiente } from '@/config/media';
import { cn } from '@/lib/utils';

/**
 * Mosaico do espaço (Modalidades, rodada 2026-10-24, segunda versão). A galeria
 * longa por ambiente mostrava tudo, mas ocupava quase 3 telas no celular
 * (feedback do usuário: "ficou muito grande"). Agora:
 *
 * - Um bloco por ambiente de treino com a vista ampla dele, a academia
 *   inteira numa tela só. Musculação, o carro-chefe, ganha o bloco grande.
 *   Morava no Sobre e repetia as fotos de Modalidades; agora é o próprio
 *   conteúdo de Modalidades (a fachada foi pro Contato).
 * - Sobrando um bloco sozinho na última linha, ele ocupa a linha toda:
 *   nada de buraco na grade.
 * - Nome e quantidade de fotos ficam ABAIXO da foto (nada sobreposto às
 *   fotos, decisão do cliente de 2026-10-07) e sempre visíveis: o convite
 *   "ver fotos" não depende de hover (RULES #5).
 * - Tocar no bloco abre o visualizador em tela cheia com todas as fotos do
 *   ambiente. Arrastar (scroll-snap nativo), setas sempre visíveis e ← →
 *   no teclado. Na última foto, "próxima" segue para o ambiente seguinte:
 *   dá para percorrer a academia inteira sem fechar. Foco preso e Esc pra
 *   fechar vêm do Radix Dialog (mesmo padrão do menu mobile).
 * - Fundo sólido no visualizador, sem vidro nem blur (CLAUDE.md).
 */
export function EspacoMosaico({ ambientes }: { ambientes: Ambiente[] }) {
  const [aberto, setAberto] = React.useState<{ ambiente: number; foto: number } | null>(null);
  // Bloco que abriu o visualizador: o foco volta pra ele ao fechar (sem
  // Dialog.Trigger, o Radix não sabe pra onde devolver).
  const origem = React.useRef<HTMLButtonElement | null>(null);

  return (
    <Dialog.Root
      open={aberto !== null}
      onOpenChange={(open) => {
        if (!open) setAberto(null);
      }}
    >
      <ul
        data-testid="espaco-mosaico"
        className="grid grid-cols-2 gap-x-3 gap-y-6 md:h-[480px] md:grid-cols-4 md:grid-rows-2 md:gap-x-4 md:gap-y-5 lg:h-[600px]"
      >
        {ambientes.map((ambiente, i) => {
          const capa = ambiente.fotos[0];
          if (!capa) return null;
          const principal = i === 0;
          // Blocos menores em 2 colunas: se a conta for ímpar, o último fecha a linha.
          const ultimoLargo =
            !principal && (ambientes.length - 1) % 2 === 1 && i === ambientes.length - 1;
          return (
            <li
              key={ambiente.nome}
              className={cn(principal && 'col-span-2 md:row-span-2', ultimoLargo && 'col-span-2')}
            >
              <button
                type="button"
                onClick={(e) => {
                  origem.current = e.currentTarget;
                  setAberto({ ambiente: i, foto: 0 });
                }}
                // nome acessível contém o texto visível na mesma sequência ("Musculação 4 fotos"):
                // quem usa comando de voz fala o que vê (WCAG 2.5.3)
                aria-label={`${ambiente.nome} ${ambiente.fotos.length} fotos, abrir galeria`}
                className="group flex h-full w-full flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span
                  className={cn(
                    'relative block w-full overflow-hidden rounded-xl bg-white/5 md:min-h-0 md:flex-1',
                    principal || ultimoLargo
                      ? 'aspect-[3/2] md:aspect-auto'
                      : 'aspect-[4/3] md:aspect-auto'
                  )}
                >
                  <Image
                    src={capa.src}
                    alt={capa.alt}
                    fill
                    sizes={
                      principal || ultimoLargo
                        ? '(min-width: 1024px) 590px, (min-width: 768px) 50vw, 100vw'
                        : '(min-width: 1024px) 290px, (min-width: 768px) 25vw, 50vw'
                    }
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </span>
                <span
                  className={cn(
                    'mt-2.5 flex justify-between gap-x-2 gap-y-0.5 md:mt-3',
                    principal ? 'items-baseline' : 'flex-col xl:flex-row xl:items-baseline'
                  )}
                >
                  <span
                    className={cn(
                      'font-heading leading-tight font-semibold tracking-wide text-white uppercase',
                      principal ? 'text-[clamp(20px,2vw,26px)]' : 'text-[16px] xl:text-[18px]'
                    )}
                  >
                    {ambiente.nome}
                  </span>{' '}
                  {/* espaço real entre nome e contagem: o texto lido vira "Musculação 4 fotos"
                   * (não "Musculação4 fotos"); no flex ele não aparece na tela */}
                  <span className="text-flex-blue-200 inline-flex shrink-0 items-center gap-1 text-[13px] normal-case">
                    {ambiente.fotos.length} fotos
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {aberto !== null ? (
        <Visualizador
          ambientes={ambientes}
          posicao={aberto}
          irPara={setAberto}
          aoFechar={() => origem.current?.focus()}
        />
      ) : null}
    </Dialog.Root>
  );
}

interface VisualizadorProps {
  ambientes: Ambiente[];
  posicao: { ambiente: number; foto: number };
  irPara: (posicao: { ambiente: number; foto: number }) => void;
  aoFechar?: () => void;
}

function Visualizador(props: VisualizadorProps) {
  // O Radix monta o Portal depois do primeiro render: hooks que leem o DOM
  // (trilho, observer) precisam morar num filho do Content, senão rodam
  // antes de o trilho existir.
  return (
    <Dialog.Portal>
      <Dialog.Content
        data-testid="espaco-visualizador"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          props.aoFechar?.();
        }}
        className="bg-flex-blue-950 fixed inset-0 z-[110] text-white"
      >
        <ConteudoVisualizador {...props} />
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function ConteudoVisualizador({ ambientes, posicao, irPara }: VisualizadorProps) {
  const ambiente = ambientes[posicao.ambiente];
  const trilho = React.useRef<HTMLDivElement>(null);
  const slides = React.useRef<(HTMLDivElement | null)[]>([]);
  // Foto em vista vem do próprio scroll (arrastar no celular), lida por
  // IntersectionObserver, nunca por listener de scroll.
  const [emVista, setEmVista] = React.useState(posicao.foto);
  // Destino de um clique em seta enquanto a rolagem suave ainda anda: o
  // contador já mostra o destino e o observer ignora as fotos por onde o
  // trilho passa no caminho. Sem isso, dois cliques rápidos calculavam o
  // próximo a partir da foto antiga e não saíam do lugar.
  const pendente = React.useRef<number | null>(null);
  // Posição pedida de fora (abrir, trocar de ambiente): o contador acompanha
  // já no render, sem esperar o observer (padrão "ajustar estado no render").
  const chave = `${posicao.ambiente}-${posicao.foto}`;
  const [chaveAnterior, setChaveAnterior] = React.useState(chave);
  if (chave !== chaveAnterior) {
    setChaveAnterior(chave);
    setEmVista(posicao.foto);
  }

  const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Trocar de ambiente (ou abrir) leva o trilho até a foto pedida, sem animar.
  React.useLayoutEffect(() => {
    const el = trilho.current;
    const alvo = slides.current[posicao.foto];
    pendente.current = null;
    if (el && alvo) el.scrollTo({ left: alvo.offsetLeft, behavior: 'auto' });
  }, [posicao.ambiente, posicao.foto]);

  React.useEffect(() => {
    const root = trilho.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.intersectionRatio > 0.6) {
            const i = slides.current.indexOf(e.target as HTMLDivElement);
            if (i < 0) continue;
            if (pendente.current === null || pendente.current === i) {
              pendente.current = null;
              setEmVista(i);
            }
          }
        }
      },
      { root, threshold: [0.6] }
    );
    for (const s of slides.current) if (s) observer.observe(s);
    return () => observer.disconnect();
  }, [posicao.ambiente]);

  if (!ambiente) return null;
  const total = ambiente.fotos.length;
  const temAnterior = emVista > 0 || posicao.ambiente > 0;
  const temProxima = emVista < total - 1 || posicao.ambiente < ambientes.length - 1;

  const mover = (direcao: 1 | -1) => {
    const destino = emVista + direcao;
    if (destino >= 0 && destino < total) {
      const alvo = slides.current[destino];
      pendente.current = destino;
      setEmVista(destino);
      trilho.current?.scrollTo({
        left: alvo?.offsetLeft ?? 0,
        behavior: reduzido() ? 'auto' : 'smooth',
      });
      return;
    }
    // Passou da ponta: segue para o ambiente vizinho.
    const vizinho = posicao.ambiente + direcao;
    const anterior = ambientes[vizinho];
    if (!anterior) return;
    irPara({ ambiente: vizinho, foto: direcao === 1 ? 0 : anterior.fotos.length - 1 });
  };

  const seta =
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-disabled:cursor-not-allowed aria-disabled:opacity-35 aria-disabled:hover:bg-white/10';

  return (
    <div
      className="flex h-full flex-col"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (temProxima) mover(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (temAnterior) mover(-1);
        }
      }}
    >
      <div className="flex items-start justify-between gap-4 px-[6%] pt-5 pb-4 md:pt-7">
        <div className="min-w-0">
          <Dialog.Title className="text-[clamp(22px,3vw,34px)] leading-tight text-white">
            {ambiente.nome}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-[15px] text-white/75 normal-case">
            {ambiente.descricao}
          </Dialog.Description>
        </div>
        <Dialog.Close asChild>
          <button type="button" aria-label="Fechar fotos" className={seta}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </Dialog.Close>
      </div>

      {/* Arrastar ou rolar à mão cancela o destino do clique: vale a foto
       * onde o trilho parar. */}
      <div
        ref={trilho}
        onPointerDown={() => {
          pendente.current = null;
        }}
        onWheel={() => {
          pendente.current = null;
        }}
        className="flex min-h-0 flex-1 snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
      >
        {ambiente.fotos.map((foto, i) => (
          <div
            key={foto.src}
            ref={(el) => {
              slides.current[i] = el;
            }}
            role="group"
            aria-roledescription="foto"
            aria-label={`${i + 1} de ${total}`}
            className="relative w-full shrink-0 snap-center px-[6%]"
          >
            <div className="relative h-full">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                loading="eager"
                sizes="88vw"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="px-[6%] pt-4 pb-5 md:pb-7">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Foto anterior"
            aria-disabled={!temAnterior}
            onClick={() => {
              if (temAnterior) mover(-1);
            }}
            className={seta}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <p aria-live="polite" className="font-mono text-[13px] text-white/75 tabular-nums">
            {emVista + 1} de {total}
          </p>
          <button
            type="button"
            aria-label="Próxima foto"
            aria-disabled={!temProxima}
            onClick={() => {
              if (temProxima) mover(1);
            }}
            className={seta}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <ul
          aria-label="Outros ambientes"
          className="mt-4 flex [scrollbar-width:none] gap-2 overflow-x-auto md:justify-center [&::-webkit-scrollbar]:hidden"
        >
          {ambientes.map((a, i) => (
            <li key={a.nome} className="shrink-0">
              <button
                type="button"
                aria-pressed={i === posicao.ambiente}
                onClick={() => irPara({ ambiente: i, foto: 0 })}
                className="rounded-pill aria-pressed:text-flex-blue-900 min-h-11 border border-white/25 px-4 text-[14px] font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-pressed:border-white aria-pressed:bg-white"
              >
                {a.nome}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

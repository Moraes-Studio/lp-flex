import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eyebrow } from '@/components/shared/eyebrow';
import { SectionHeading } from '@/components/shared/section-heading';
import { Panel } from '@/components/shared/panel';
import { Marquee } from '@/components/shared/marquee';

export const metadata: Metadata = {
  title: 'Design System',
  robots: { index: false, follow: false },
};

const blueScale = [
  { step: 50, className: 'bg-flex-blue-50' },
  { step: 100, className: 'bg-flex-blue-100' },
  { step: 200, className: 'bg-flex-blue-200' },
  { step: 300, className: 'bg-flex-blue-300' },
  { step: 400, className: 'bg-flex-blue-400' },
  { step: 500, className: 'bg-flex-blue-500' },
  { step: 600, className: 'bg-flex-blue-600' },
  { step: 700, className: 'bg-flex-blue-700' },
  { step: 800, className: 'bg-flex-blue-800' },
  { step: 900, className: 'bg-flex-blue-900' },
  { step: 950, className: 'bg-flex-blue-950' },
] as const;

function Swatch({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`border-border h-16 w-full rounded-lg border ${className}`} />
      <span className="text-muted-foreground font-mono text-[11px]">{label}</span>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-20 px-6 py-16">
      <header className="flex items-center gap-4">
        <Image src="/logo.png" alt="Academia Flex" width={64} height={60} className="h-[60px] w-16" />
        <div>
          <h1 className="text-3xl">Design System</h1>
          <p className="text-muted-foreground font-mono text-xs">
            referência interna — não faz parte do site público
          </p>
        </div>
      </header>

      <section>
        <SectionHeading eyebrow="Cor" title="Flex Blue institucional" />
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-11">
          {blueScale.map(({ step, className }) => (
            <Swatch key={step} label={String(step)} className={className} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Swatch label="flex-bright (acento ativo)" className="bg-flex-bright" />
          <Swatch label="flex-ice (hover)" className="bg-flex-ice" />
          <Swatch label="campaign-accent (isolado)" className="bg-campaign-accent" />
          <Swatch label="destructive" className="bg-destructive" />
          <Swatch label="flex-graphite (fundo de faixa, ex: Horários)" className="bg-flex-graphite" />
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Tipografia" title="Oswald / Barlow / IBM Plex Mono" />
        <Panel className="space-y-4 p-8">
          <p className="font-heading text-4xl">Treinar é só o começo.</p>
          <p className="font-sans text-base">
            Aqui você encontra cuidado, energia e comunidade: professor na sala orientando o treino
            inteiro.
          </p>
          <p className="text-flex-bright font-mono text-xs tracking-widest uppercase">
            PROFESSOR — 01 · Musculação
          </p>
        </Panel>
      </section>

      <section>
        <SectionHeading eyebrow="Componentes" title="Botões" />
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Quero treinar agora</Button>
          <Button variant="ghost">Conhecer os professores</Button>
          <Button variant="primary" size="sm">
            Falar no WhatsApp
          </Button>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Componentes" title="Badges" />
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="institutional">Novidade</Badge>
          <Badge variant="campaign">Black Friday — 10% off</Badge>
          <Badge variant="warning">Vagas limitadas</Badge>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Componentes" title="Eyebrow" />
        <div className="flex flex-col gap-3">
          <Eyebrow variant="bright">Vila Helena · Santo André · desde 1992</Eyebrow>
          <Eyebrow variant="ice">O que nos diferencia</Eyebrow>
          <div className="bg-flex-graphite inline-block w-fit rounded-lg p-4">
            <Eyebrow variant="inverted">Sobre fundo escuro (Horários)</Eyebrow>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Tokens" title="Sombras" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border-border shadow-card rounded-2xl border bg-white p-6">
            <p className="text-sm">shadow-card</p>
          </div>
          <div className="border-border shadow-card-hover rounded-2xl border bg-white p-6">
            <p className="text-sm">shadow-card-hover</p>
          </div>
          <div className="border-border shadow-panel rounded-2xl border bg-white p-6">
            <p className="text-sm">shadow-panel</p>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Componentes" title="Panel" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel className="p-6">
            <p className="text-sm">Panel padrão — superfície de cartão.</p>
          </Panel>
          <Panel interactive className="p-6">
            <p className="text-sm">Panel interativo — borda acende no hover/foco.</p>
          </Panel>
        </div>
      </section>

      <section className="-mx-6">
        <div className="mb-4 px-6">
          <SectionHeading eyebrow="Componentes" title="Marquee" className="mb-0" />
        </div>
        <Marquee
          items={['FLEX TRAINING', 'FITDANCE', 'JUMP FUNCIONAL', 'MUSCULAÇÃO', 'PILATES', 'ZUMBA']}
        />
        <Marquee
          tone="dark"
          className="mt-3"
          items={['FLEX TRAINING', 'FITDANCE', 'JUMP FUNCIONAL', 'MUSCULAÇÃO', 'PILATES', 'ZUMBA']}
        />
      </section>
    </main>
  );
}

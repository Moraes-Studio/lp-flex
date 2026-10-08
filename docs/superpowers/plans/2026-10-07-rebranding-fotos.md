# Mini rebranding com fotos reais — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompor a home da Academia Flex em torno das fotos reais (hero com fotos rotativas, Modalidades com foto, Sobre com carrossel), mover o quadro HOJE para Horários e enxugar os vícios de template, sem mudar a identidade visual.

**Architecture:** Fotos otimizadas por script (`sharp`) para `public/fotos/` e declaradas em um único `src/config/media.ts`. Dois componentes client novos e isolados (`HeroRotator`, `PhotoCarousel`) feitos com CSS e IntersectionObserver, sem biblioteca de animação. O resto é recomposição de Server Components existentes, mais uma função pura nova em `lib/` (`agruparFuncionamento`) com teste.

**Tech Stack:** Next.js 16.3 (App Router, `next/image` com `preload`/`fetchPriority`), React 19, Tailwind v4, Vitest, Playwright (3 targets), sharp.

**Spec:** `docs/superpowers/specs/2026-10-07-rebranding-fotos-design.md`

## Global Constraints

- Nada sobreposto às fotos: sem texto, quadro, chip, legenda ou placa em cima de imagem. A legenda fica **abaixo**.
- Identidade intocada: logo, azul `#0B4DA2` (`flex-blue-600`), Oswald/Barlow/IBM Plex Mono e tema claro único. Nenhum token de cor novo.
- No máximo **3 eyebrows** na home: Hero, Horários e Contato.
- Rótulo único da intenção WhatsApp: **"Quero treinar agora"**. "Quero esse plano" e "Quero essa condição" (Planos) não mudam.
- Nenhum `—` ou `–` em texto visível. Faixa de horário usa hífen: `05:00-23:00`.
- Movimento: só `transform`/`opacity`. Sem `window.addEventListener('scroll')`. Sem biblioteca nova. Tudo neutralizado por `prefers-reduced-motion: reduce` (a regra global em `globals.css` já zera durações; os componentes JS também checam `matchMedia`).
- Foto até a borda da viewport: raio 0. Foto dentro de coluna ou carrossel: `rounded-xl`.
- Nenhuma imagem gerada por IA (`CLAUDE.md`). Os retratos de `public/06_equipe/` **não** entram.
- Imports sempre via `@/`. TypeScript strict, zero `any`.
- Commits no formato `tipo: descrição (SDD §n)`, **sem** co-autoria ou assinatura de IA (RULES #8). Nunca usar `git commit -a`: o working tree tem uma mudança do usuário em `src/components/layout/header.tsx` (`preload` + `fetchPriority` no logo). Ela entra no commit da Task 5, que reescreve o header; até lá, só `git add` de caminhos explícitos.
- Toda função nova em `src/lib/` tem teste unitário (RULES).
- Testes E2E rodam nos 3 targets. **A porta 3000 desta máquina é de outro projeto:** sempre rodar com `E2E_PORT=3100` (Task 1 adiciona suporte).

---

## File Structure

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `playwright.config.ts` | Modify | Porta configurável via `E2E_PORT` |
| `.gitignore` | Modify | Ignorar originais `public/0*_*/` |
| `scripts/otimizar-fotos.mjs` | Create | Exportar as fotos escolhidas para `public/fotos/` |
| `public/fotos/*.jpg` | Create (gerado) | 12 fotos otimizadas, versionadas |
| `src/config/media.ts` | Rewrite | Fonte única das fotos (`Foto`, `mediaConfig`) |
| `src/config/__tests__/media.test.ts` | Create | Todo `src` existe e todo `alt` é não vazio, sem travessão |
| `src/components/shared/photo.tsx` | Modify | Sem borda nem raio padrão |
| `src/components/shared/section-heading.tsx` | Modify | `eyebrow` opcional |
| `src/lib/content/funcionamento-shared.ts` | Modify | `+ agruparFuncionamento` |
| `src/lib/content/funcionamento.ts` | Modify | Reexportar `agruparFuncionamento`/`GrupoFuncionamento` |
| `src/lib/content/__tests__/funcionamento.test.ts` | Modify | Testes de `agruparFuncionamento` |
| `src/app/(home)/_components/contato.tsx` | Modify | Horário em grupos, CTA renomeado |
| `src/components/shared/hoje-strip.tsx` | Create (de `hero-board.tsx`) | Faixa HOJE para fundo grafite |
| `src/components/shared/hero-board.tsx` | Delete | Substituído por `hoje-strip.tsx` |
| `src/components/shared/aulas-hoje-indicator.tsx` | Delete | Redundante com a faixa HOJE |
| `src/app/(home)/_components/horarios.tsx` | Modify | Faixa HOJE no topo, resumo via `agruparFuncionamento` |
| `src/components/layout/header.tsx` | Modify | Sem barra do topo, com StatusChip (xl+) |
| `src/components/layout/footer.tsx` | Modify | Sem travessão, CTA renomeado |
| `src/components/shared/whatsapp-float.tsx` | Modify | `aria-label="Quero treinar agora"` |
| `src/config/site.ts` | Modify | Endereço sem travessão |
| `content/campaign.json` | Modify | Texto `sub` sem travessão |
| `src/components/shared/hero-rotator.tsx` | Create | Crossfade e zoom das fotos do hero |
| `src/app/(home)/_components/hero.tsx` | Rewrite | Split texto/foto, 4 elementos de texto |
| `src/app/(home)/_components/modalidades.tsx` | Rewrite | Dois blocos com foto |
| `src/components/shared/photo-carousel.tsx` | Create | Carrossel scroll-snap com setas |
| `src/app/(home)/_components/sobre.tsx` | Rewrite | Pilha vertical: texto, números, carrossel |
| `src/app/(home)/_components/professores.tsx` | Modify | Sem eyebrow, título novo |
| `src/app/(home)/_components/planos.tsx` | Modify | Sem eyebrow |
| `e2e/rebranding.spec.ts` | Create | E2E do rebranding, crescendo a cada task |
| `e2e/home.spec.ts` | Modify | Nome do botão flutuante |
| `CLAUDE.md`, `docs/tasks.md` | Modify | Desvio do quadro HOJE e registro da rodada |

**Desvio de spec descoberto ao ler o código:** o spec diz que o chip "aberto agora" "já está no header". Não está: ele só existe no hero. A Task 5 o **move** para o header (visível a partir de `xl`, para a navegação continuar em uma linha só em `lg`). Sinalizar no PR.

---

### Task 1: Base: porta do E2E, fotos otimizadas e `media.ts`

**Files:**
- Modify: `playwright.config.ts`
- Modify: `.gitignore`
- Create: `scripts/otimizar-fotos.mjs`
- Create: `public/fotos/*.jpg` (gerados)
- Rewrite: `src/config/media.ts`
- Create: `src/config/__tests__/media.test.ts`

**Interfaces:**
- Produces: `export interface Foto { src: string; alt: string; legenda?: string }` e `export const mediaConfig: { heroFotos: Foto[]; modalidades: { musculacao: Foto; aulas: Foto }; sobreGaleria: Foto[] }` em `@/config/media`.

- [ ] **Step 1: Porta configurável no Playwright**

Em `playwright.config.ts`, trocar o topo e os dois usos de `3000`:

```ts
import { defineConfig, devices } from '@playwright/test';

/** Porta do dev server dos testes. 3000 é o padrão; nesta máquina a 3000
 * costuma estar ocupada por outro projeto, e com `reuseExistingServer` o
 * Playwright testaria o app errado em silêncio. Usar `E2E_PORT=3100`. */
const PORT = Number(process.env.E2E_PORT ?? 3000);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
```

- [ ] **Step 2: Rodar a suíte E2E atual na porta nova (linha de base)**

Run: `E2E_PORT=3100 npm run test:e2e`
Expected: todos passam (é a linha de base antes de qualquer mudança visual). Se algo falhar aqui, parar e reportar: é problema pré-existente, não desta tarefa.

- [ ] **Step 3: Ignorar os originais no git**

Acrescentar ao fim de `.gitignore`:

```gitignore

# fotos originais (≈62 MB) — só as versões otimizadas de public/fotos/ vão pro repo
# (gerar com: node scripts/otimizar-fotos.mjs)
/public/0*_*/
```

Run: `git status --short public | head`
Expected: as pastas `public/0*_*/` não aparecem mais como `??`.

- [ ] **Step 4: Script de otimização**

Create `scripts/otimizar-fotos.mjs`:

```js
// Exporta as fotos escolhidas (originais em public/0*_*/, fora do git) para
// public/fotos/, prontas para o next/image. Uso: node scripts/otimizar-fotos.mjs
// Para trocar uma foto: editar a lista abaixo, rodar de novo e atualizar
// src/config/media.ts se o slug mudar.
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ORIGEM = 'public';
const DESTINO = 'public/fotos';
const LADO_MAIOR = 2000;

const FOTOS = [
  ['03_musculacao/IMG_2616.jpg', 'hero-musculacao'],
  ['02_cardio/IMG_2510.jpg', 'hero-cardio'],
  ['04_salao_aulas/IMG_2565.jpg', 'hero-salao'],
  ['03_musculacao/IMG_2601.jpg', 'modalidades-musculacao'],
  ['04_salao_aulas/IMG_2556.jpg', 'modalidades-aulas'],
  ['01_fachada/IMG_2895.jpg', 'sobre-fachada'],
  ['01_fachada/IMG_2903.jpg', 'sobre-entrada'],
  ['02_cardio/IMG_2543.jpg', 'sobre-cardio'],
  ['03_musculacao/IMG_2675.jpg', 'sobre-pesos'],
  ['03_musculacao/IMG_2837.jpg', 'sobre-maquinas'],
  ['04_salao_aulas/IMG_2571.jpg', 'sobre-salao'],
  ['05_detalhes/IMG_2641.jpg', 'sobre-anilhas'],
];

await mkdir(DESTINO, { recursive: true });

for (const [origem, slug] of FOTOS) {
  const entrada = path.join(ORIGEM, origem);
  const saida = path.join(DESTINO, `${slug}.jpg`);
  await sharp(entrada)
    .rotate()
    .resize(LADO_MAIOR, LADO_MAIOR, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(saida);
  const { size } = await stat(saida);
  console.log(`${saida}  ${(size / 1024).toFixed(0)} KB`);
}
```

Observação: `sharp` já está em `node_modules` como dependência do Next. Não adicionar ao `package.json`. O sharp não copia EXIF por padrão (sem `.withMetadata()`), então GPS e dados da câmera saem.

- [ ] **Step 5: Gerar as fotos**

Run: `node scripts/otimizar-fotos.mjs`
Expected: 12 linhas, cada uma com ≤ 400 KB. Se alguma passar de 400 KB, baixar `quality` para 76 e rodar de novo.

- [ ] **Step 6: Escrever o teste de `media.ts` (falha primeiro)**

Create `src/config/__tests__/media.test.ts`:

```ts
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { mediaConfig, type Foto } from '@/config/media';

const todas: Foto[] = [
  ...mediaConfig.heroFotos,
  mediaConfig.modalidades.musculacao,
  mediaConfig.modalidades.aulas,
  ...mediaConfig.sobreGaleria,
];

describe('mediaConfig', () => {
  it('tem 3 fotos no hero e de 6 a 8 na galeria do Sobre', () => {
    expect(mediaConfig.heroFotos).toHaveLength(3);
    expect(mediaConfig.sobreGaleria.length).toBeGreaterThanOrEqual(6);
    expect(mediaConfig.sobreGaleria.length).toBeLessThanOrEqual(8);
  });

  it.each(todas.map((f) => [f.src, f] as const))('%s existe em public/', (_src, foto) => {
    expect(foto.src.startsWith('/fotos/')).toBe(true);
    expect(existsSync(path.join(process.cwd(), 'public', foto.src))).toBe(true);
  });

  it('todo alt é descritivo e sem travessão', () => {
    for (const foto of todas) {
      expect(foto.alt.trim().length).toBeGreaterThan(10);
      expect(foto.alt).not.toMatch(/[—–]/);
      expect(foto.legenda ?? '').not.toMatch(/[—–]/);
    }
  });

  it('não repete a mesma foto em dois lugares', () => {
    const srcs = todas.map((f) => f.src);
    expect(new Set(srcs).size).toBe(srcs.length);
  });
});
```

Run: `npx vitest run src/config/__tests__/media.test.ts`
Expected: FAIL (`heroFotos` não existe no `mediaConfig` atual).

- [ ] **Step 7: Reescrever `src/config/media.ts`**

```ts
/**
 * Fonte única das fotos reais da home (política de fotografia do CLAUDE.md:
 * fotografia documental real, nunca gerada por IA nem banco de imagem).
 * Os arquivos em `public/fotos/` saem de `scripts/otimizar-fotos.mjs` a
 * partir dos originais (fora do git). Trocar uma foto = rodar o script com
 * a lista nova e ajustar a entrada aqui; nenhum componente precisa mudar.
 *
 * Regra de composição (decisão do cliente, 2026-10-07): nada é sobreposto
 * às fotos. `legenda`, quando existe, é renderizada abaixo da imagem.
 */
export interface Foto {
  src: string;
  alt: string;
  legenda?: string;
}

export const mediaConfig: {
  heroFotos: Foto[];
  modalidades: { musculacao: Foto; aulas: Foto };
  sobreGaleria: Foto[];
} = {
  heroFotos: [
    {
      src: '/fotos/hero-musculacao.jpg',
      alt: 'Área de musculação da Academia Flex, com aparelhos alinhados junto à parede azul',
    },
    {
      src: '/fotos/hero-cardio.jpg',
      alt: 'Sala de cardio com esteiras e bicicletas de frente para janelões com vista da cidade',
    },
    {
      src: '/fotos/hero-salao.jpg',
      alt: 'Salão de aulas coletivas com piso de madeira, espelhos e equipamentos organizados',
    },
  ],
  modalidades: {
    musculacao: {
      src: '/fotos/modalidades-musculacao.jpg',
      alt: 'Aparelhos de musculação sobre piso de madeira na Academia Flex',
    },
    aulas: {
      src: '/fotos/modalidades-aulas.jpg',
      alt: 'Salão amplo onde acontecem as aulas coletivas da Academia Flex',
    },
  },
  sobreGaleria: [
    {
      src: '/fotos/sobre-fachada.jpg',
      alt: 'Fachada do prédio da Academia Flex na Rua das Hortênsias, Vila Helena',
      legenda: 'Fachada, R. das Hortênsias 104',
    },
    {
      src: '/fotos/sobre-entrada.jpg',
      alt: 'Entrada da Academia Flex com o letreiro azul e a recepção ao fundo',
      legenda: 'Entrada e recepção',
    },
    {
      src: '/fotos/sobre-cardio.jpg',
      alt: 'Fileira de esteiras na sala de cardio com janelas de vidro',
      legenda: 'Sala de cardio',
    },
    {
      src: '/fotos/sobre-pesos.jpg',
      alt: 'Suportes de halteres e barras na área de pesos livres',
      legenda: 'Pesos livres',
    },
    {
      src: '/fotos/sobre-maquinas.jpg',
      alt: 'Aparelhos de musculação articulados na área de máquinas',
      legenda: 'Área de máquinas',
    },
    {
      src: '/fotos/sobre-salao.jpg',
      alt: 'Salão de aulas coletivas visto da entrada, com espelhos na parede',
      legenda: 'Salão de aulas',
    },
    {
      src: '/fotos/sobre-anilhas.jpg',
      alt: 'Anilhas e barras organizadas no suporte da área de musculação',
      legenda: 'Detalhe da musculação',
    },
  ],
};
```

- [ ] **Step 8: Rodar o teste**

Run: `npx vitest run src/config/__tests__/media.test.ts`
Expected: PASS.

Run: `npm run typecheck`
Expected: **FAIL** em `src/app/(home)/_components/sobre.tsx` (usa `mediaConfig.sobreFoto`, que não existe mais). Corrigir agora o mínimo para não deixar o build quebrado entre tasks: em `sobre.tsx`, apagar o bloco `<Photo src={mediaConfig.sobreFoto} … />` e os imports `mediaConfig` e `Photo` que ficarem sem uso. O Sobre é reescrito na Task 8.

Run: `npm run typecheck && npm run lint`
Expected: sem erros.

- [ ] **Step 9: Commit**

```bash
git add playwright.config.ts .gitignore scripts/otimizar-fotos.mjs public/fotos src/config/media.ts src/config/__tests__/media.test.ts "src/app/(home)/_components/sobre.tsx"
git commit -m "chore: pipeline de fotos otimizadas e media config (SDD §4)"
```

---

### Task 2: Primitivos: `Photo` sem moldura e `SectionHeading` com eyebrow opcional

**Files:**
- Modify: `src/components/shared/photo.tsx`
- Modify: `src/components/shared/section-heading.tsx`

**Interfaces:**
- Produces: `SectionHeading` com `eyebrow?: React.ReactNode` (quando ausente, não renderiza `<Eyebrow>`).
- Produces: `Photo` renderiza `relative overflow-hidden` + ratio + `className`, **sem** `border`/`rounded-2xl`.

- [ ] **Step 1: `Photo` sem moldura**

Em `src/components/shared/photo.tsx`, trocar o comentário do componente e o `className` do wrapper:

```tsx
/**
 * Slot de foto pronto pro dia em que o arquivo real chegar: enquanto `src`
 * for nulo, não reserva espaço nenhum. Sem borda nem raio próprios (o
 * card com borda fazia a foto parecer template, rodada 2026-10-07): quem
 * usa decide o raio pela regra do site (foto até a borda da tela = 0,
 * foto em coluna = rounded-xl). Nunca gerar imagem sintética pra
 * preencher o vazio (política de fotografia do CLAUDE.md).
 */
export function Photo({ src, alt, ratio = 'wide', className, priority, sizes }: PhotoProps) {
  if (!src) {
    return null;
  }

  return (
    <div className={cn('relative overflow-hidden', RATIO_CLASS[ratio], className)}>
```

(o resto do arquivo não muda).

- [ ] **Step 2: `SectionHeading` com eyebrow opcional**

Em `src/components/shared/section-heading.tsx`:

```tsx
interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Opcional: a home usa no máximo 3 eyebrows (Hero, Horários, Contato).
   * Eyebrow em toda seção é o vício de template nº 1 (revisão taste-skill,
   * 2026-10-07). Sem eyebrow, o título sozinho abre a seção. */
  eyebrow?: React.ReactNode;
```

e no JSX:

```tsx
    <Reveal className={cn('mb-13 max-w-[640px]', className)} {...props}>
      {eyebrow ? (
        <Eyebrow variant={eyebrowVariant ?? (tone === 'dark' ? 'inverted' : 'bright')}>
          {eyebrow}
        </Eyebrow>
      ) : null}
```

- [ ] **Step 3: Verificar**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: tudo verde (nenhum consumidor muda de comportamento: todos ainda passam `eyebrow`).

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/photo.tsx src/components/shared/section-heading.tsx
git commit -m "refactor: Photo sem moldura e eyebrow opcional no SectionHeading"
```

---

### Task 3: `agruparFuncionamento` e Contato com horário agrupado

**Files:**
- Modify: `src/lib/content/funcionamento-shared.ts`
- Modify: `src/lib/content/funcionamento.ts`
- Modify: `src/lib/content/__tests__/funcionamento.test.ts`
- Modify: `src/app/(home)/_components/contato.tsx`
- Create: `e2e/rebranding.spec.ts`

**Interfaces:**
- Consumes: `DiaFuncionamento` (`{ dia: string; diaCurto: string; abre: string | null; fecha: string | null }`), array de 7 dias com índice 0 = Domingo (ordem de `content/funcionamento.json`).
- Produces: `export interface GrupoFuncionamento { rotulo: string; horario: string }` e `export function agruparFuncionamento(funcionamento: DiaFuncionamento[]): GrupoFuncionamento[]`. Ordem de saída: Seg→Sáb e depois Domingo. `horario` é `"HH:MM-HH:MM"` ou `"Fechado"`. Rótulo: um dia sozinho usa `dia` (nome completo); vários dias consecutivos usam `"<diaCurto do primeiro> a <diaCurto do último>"`.

- [ ] **Step 1: Escrever os testes (falham)**

Acrescentar ao fim de `src/lib/content/__tests__/funcionamento.test.ts` (o arquivo já define `grade` no topo) e incluir `agruparFuncionamento` no import existente de `@/lib/content/funcionamento`:

```ts
describe('agruparFuncionamento', () => {
  it('junta dias consecutivos com o mesmo horário (grade real)', () => {
    expect(agruparFuncionamento(grade)).toEqual([
      { rotulo: 'Seg a Qui', horario: '05:00-23:00' },
      { rotulo: 'Sexta', horario: '05:00-22:00' },
      { rotulo: 'Sábado', horario: '09:00-15:00' },
      { rotulo: 'Domingo e feriados', horario: '09:30-12:30' },
    ]);
  });

  it('dia fechado vira "Fechado" e não se junta a dia aberto', () => {
    const comFechado = grade.map((d) => (d.diaCurto === 'Dom' ? { ...d, abre: null, fecha: null } : d));
    expect(agruparFuncionamento(comFechado).at(-1)).toEqual({
      rotulo: 'Domingo e feriados',
      horario: 'Fechado',
    });
  });

  it('semana inteira igual vira um grupo de Seg a Sáb mais o domingo separado', () => {
    const igual = grade.map((d) => ({ ...d, abre: '06:00', fecha: '22:00' }));
    expect(agruparFuncionamento(igual)).toEqual([
      { rotulo: 'Seg a Sáb', horario: '06:00-22:00' },
      { rotulo: 'Domingo e feriados', horario: '06:00-22:00' },
    ]);
  });

  it('todos os dias diferentes geram 7 grupos com nome completo', () => {
    const diferentes = grade.map((d, i) => ({ ...d, abre: `0${i}:00`, fecha: '20:00' }));
    const grupos = agruparFuncionamento(diferentes);
    expect(grupos).toHaveLength(7);
    expect(grupos.map((g) => g.rotulo)).toEqual([
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
      'Domingo e feriados',
    ]);
  });

  it('nunca usa travessão', () => {
    for (const g of agruparFuncionamento(grade)) {
      expect(`${g.rotulo} ${g.horario}`).not.toMatch(/[—–]/);
    }
  });
});
```

Run: `npx vitest run src/lib/content/__tests__/funcionamento.test.ts`
Expected: FAIL (`agruparFuncionamento` não é exportado).

- [ ] **Step 2: Implementar em `funcionamento-shared.ts`**

Acrescentar ao fim de `src/lib/content/funcionamento-shared.ts`:

```ts
export interface GrupoFuncionamento {
  rotulo: string;
  horario: string;
}

function formatarHorario(dia: DiaFuncionamento): string {
  return dia.abre && dia.fecha ? `${dia.abre}-${dia.fecha}` : 'Fechado';
}

/**
 * Agrupa dias consecutivos (Seg→Sáb) com o mesmo horário, pra tabela de
 * funcionamento ter 4 linhas em vez de 7 (revisão taste-skill, 2026-10-07).
 * Domingo fica sempre num grupo próprio no fim: ele carrega "e feriados"
 * no nome e é lido separado pelo público. Entrada na ordem de
 * `content/funcionamento.json` (índice 0 = domingo). Hífen como separador
 * de faixa, nunca travessão.
 */
export function agruparFuncionamento(funcionamento: DiaFuncionamento[]): GrupoFuncionamento[] {
  const semana = funcionamento.slice(1);
  const domingo = funcionamento[0];
  const grupos: { dias: DiaFuncionamento[]; horario: string }[] = [];

  for (const dia of semana) {
    const horario = formatarHorario(dia);
    const ultimo = grupos.at(-1);
    if (ultimo && ultimo.horario === horario) {
      ultimo.dias.push(dia);
    } else {
      grupos.push({ dias: [dia], horario });
    }
  }
  if (domingo) {
    grupos.push({ dias: [domingo], horario: formatarHorario(domingo) });
  }

  return grupos.map(({ dias, horario }) => ({
    rotulo: dias.length === 1 ? dias[0].dia : `${dias[0].diaCurto} a ${dias[dias.length - 1].diaCurto}`,
    horario,
  }));
}
```

Em `src/lib/content/funcionamento.ts`, incluir no reexport existente (ajustar a linha de import de `./funcionamento-shared` para trazer os nomes novos):

```ts
export { agruparFuncionamento, calcularStatus, parseFuncionamento };
export type { DiaFuncionamento, GrupoFuncionamento, StatusFuncionamento };
```

- [ ] **Step 3: Rodar os testes**

Run: `npx vitest run src/lib/content/__tests__/funcionamento.test.ts`
Expected: PASS (inclusive os testes antigos de `calcularStatus`).

- [ ] **Step 4: E2E do Contato (falha)**

Create `e2e/rebranding.spec.ts`:

```ts
import { expect, test, type Page } from '@playwright/test';

/** O banner de cookies cobre o canto inferior no mobile; fechar antes de
 * interagir com elementos da página (mesmo padrão de home.spec.ts). */
async function aceitarCookies(page: Page) {
  const aceitar = page.getByRole('button', { name: 'Aceitar todos' });
  if (await aceitar.isVisible().catch(() => false)) await aceitar.click();
}

test.describe('Contato: horário de funcionamento agrupado', () => {
  test('mostra 4 grupos com hífen, sem travessão', async ({ page }) => {
    await page.goto('/');
    const contato = page.locator('#contato');
    await contato.scrollIntoViewIfNeeded();
    const linhas = contato.getByTestId('grupo-funcionamento');
    await expect(linhas).toHaveCount(4);
    await expect(linhas.first()).toContainText('Seg a Qui');
    await expect(linhas.first()).toContainText('05:00-23:00');
    await expect(contato).not.toContainText('–');
    await expect(contato).not.toContainText('—');
  });

  test('CTA do contato usa o rótulo único', async ({ page }) => {
    await page.goto('/');
    await aceitarCookies(page);
    await expect(page.locator('#contato').getByRole('link', { name: 'Quero treinar agora' })).toBeAttached();
  });
});
```

Run: `E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts`
Expected: FAIL (sem `data-testid="grupo-funcionamento"` e CTA ainda "Falar no WhatsApp").

- [ ] **Step 5: Contato**

Em `src/app/(home)/_components/contato.tsx`:

1. Import: `import { agruparFuncionamento, getFuncionamento } from '@/lib/content/funcionamento';`
2. Endereço sem travessão: `const endereco = \`${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state}, ${siteConfig.address.zip}\`;`
3. Depois de `const funcionamento = getFuncionamento();`: `const grupos = agruparFuncionamento(funcionamento);`
4. Substituir o bloco que mapeia `funcionamento.slice(1).concat(funcionamento[0])` por:

```tsx
            <div>
              {grupos.map((grupo) => (
                <div
                  key={grupo.rotulo}
                  data-testid="grupo-funcionamento"
                  className="border-border flex items-baseline justify-between gap-3 border-b py-3.5 normal-case last:border-b-0"
                >
                  <span className="text-[15.5px] font-medium">{grupo.rotulo}</span>
                  <span className="text-flex-blue-700 font-mono text-[14px] tabular-nums">{grupo.horario}</span>
                </div>
              ))}
            </div>
```

5. No botão, trocar o texto `Falar no WhatsApp` por `Quero treinar agora`.

- [ ] **Step 6: Verificar**

Run: `E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts && npm run typecheck && npm run lint`
Expected: PASS nos 3 targets.

- [ ] **Step 7: Commit**

```bash
git add src/lib/content/funcionamento-shared.ts src/lib/content/funcionamento.ts src/lib/content/__tests__/funcionamento.test.ts "src/app/(home)/_components/contato.tsx" e2e/rebranding.spec.ts
git commit -m "feat: funcionamento agrupado no Contato (SDD §4)"
```

---

### Task 4: Faixa HOJE em Horários

**Files:**
- Create: `src/components/shared/hoje-strip.tsx`
- Delete: `src/components/shared/hero-board.tsx`
- Delete: `src/components/shared/aulas-hoje-indicator.tsx`
- Modify: `src/app/(home)/_components/horarios.tsx`
- Modify: `src/app/(home)/_components/hero.tsx` (só remover o uso de `HeroBoard`; o hero é reescrito na Task 6)
- Modify: `e2e/rebranding.spec.ts`

**Interfaces:**
- Consumes: `AulaSlot`, `Dia`, `DIA_NOME_COMPLETO`, `paraMinutos` de `@/lib/content/horarios-shared`; `agoraEmSaoPaulo` de `@/lib/timezone`; `agruparFuncionamento` (Task 3).
- Produces: `export function HojeStrip({ slots }: { slots: AulaSlot[] })`, com `data-testid="hoje-strip"` na raiz.

- [ ] **Step 1: E2E (falha)**

Acrescentar a `e2e/rebranding.spec.ts`:

```ts
test.describe('Horários: faixa HOJE', () => {
  test('a faixa HOJE fica em #horarios e não existe mais no hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#horarios').getByTestId('hoje-strip')).toBeAttached();
    await expect(page.getByTestId('hoje-strip')).toHaveCount(1);
    await expect(page.locator('main > section').first().getByText('Hoje', { exact: true })).toHaveCount(0);
  });

  test('resumo de funcionamento da grade sem travessão', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#horarios')).not.toContainText('–');
  });
});
```

Run: `E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts -g "faixa HOJE"`
Expected: FAIL.

- [ ] **Step 2: Criar `hoje-strip.tsx`**

```tsx
'use client';

import * as React from 'react';
import { DIA_NOME_COMPLETO, paraMinutos, type AulaSlot, type Dia } from '@/lib/content/horarios-shared';
import { agoraEmSaoPaulo } from '@/lib/timezone';
import { cn } from '@/lib/utils';

/**
 * Aulas de hoje, no topo de Horários (antes era o quadro "HOJE" do hero:
 * saiu de lá na rodada de 2026-10-07 pra o hero ficar só texto + foto, sem
 * nada sobreposto). Sempre no fuso de São Paulo (`@/lib/timezone`), só
 * depois de montar no cliente: a home é estática, um `new Date()` no
 * servidor congelaria o dia no build.
 */
export function HojeStrip({ slots }: { slots: AulaSlot[] }) {
  const [estado, setEstado] = React.useState<{ dia: Dia; minutos: number } | null>(null);

  React.useEffect(() => {
    const atualizar = () => setEstado(agoraEmSaoPaulo());
    atualizar();
    const id = window.setInterval(atualizar, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const doDia = estado
    ? slots
        .filter((s) => s.day === estado.dia)
        .slice()
        .sort((a, b) => paraMinutos(a.time) - paraMinutos(b.time))
    : [];

  return (
    <div
      data-testid="hoje-strip"
      className="mb-10 grid gap-4 border-y border-white/12 py-5 md:grid-cols-[160px_1fr] md:items-center md:gap-8"
    >
      <p className="flex items-baseline gap-2.5 text-white">
        <strong className="font-heading text-[22px] tracking-[0.02em] uppercase">Hoje</strong>
        <span className="text-flex-blue-300 font-mono text-[11px] tracking-[0.14em] uppercase" suppressHydrationWarning>
          {estado ? DIA_NOME_COMPLETO[estado.dia] : ''}
        </span>
      </p>

      {estado && doDia.length === 0 ? (
        <p className="text-sm text-white/70">
          Sem aulas coletivas hoje. A musculação funciona no horário normal, com professor na sala.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-x-6 gap-y-3" aria-live="polite">
          {doDia.map((slot) => {
            const rodando =
              estado !== null &&
              estado.minutos >= paraMinutos(slot.time) &&
              estado.minutos < paraMinutos(slot.time) + 60;
            return (
              <li
                key={`${slot.day}-${slot.time}-${slot.aula}`}
                className={cn(
                  'flex items-baseline gap-2.5 text-white/80',
                  rodando && 'text-white'
                )}
              >
                <time className="text-flex-blue-300 font-mono text-[13px] tabular-nums">{slot.time}</time>
                <span className={cn('text-[15px]', rodando && 'font-semibold')}>{slot.aula}</span>
                {rodando ? (
                  <span className="bg-flex-blue-600 rounded-pill px-2 py-0.5 font-mono text-[9.5px] tracking-[0.14em] text-white uppercase">
                    agora
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
```

Observação: o "agora" perde o `animate-ping` do quadro antigo, um loop infinito decorativo que a revisão taste-skill pediu para cortar. O texto "agora" é o estado.

- [ ] **Step 3: Horários usa a faixa e o resumo agrupado**

Em `src/app/(home)/_components/horarios.tsx`:

1. Imports: remover `AulasHojeIndicator`; adicionar
   `import { HojeStrip } from '@/components/shared/hoje-strip';`
   e trocar `import { getFuncionamento } from '@/lib/content/funcionamento';` por `import { agruparFuncionamento, getFuncionamento } from '@/lib/content/funcionamento';`.
2. Substituir as linhas de `seg`/`sex`/`sab`/`dom` e `resumoFuncionamento` por:

```ts
  const resumoFuncionamento = `Funcionamento: ${agruparFuncionamento(funcionamento)
    .map((g) => `${g.rotulo.toLowerCase()} ${g.horario}`)
    .join(' · ')}`;
```

3. No JSX, trocar o bloco do heading (o `div` com `SectionHeading` + `AulasHojeIndicator`) por:

```tsx
        <SectionHeading
          className="mb-8"
          tone="dark"
          size="compact"
          eyebrow="Grade de aulas coletivas"
          title="Horários"
          description="A grade completa da semana. No celular, escolha o dia."
        />

        <HojeStrip slots={horarios} />
```

(e atualizar o comentário que fala do indicador: agora quem decide "hoje" no cliente é o `HojeStrip`).

- [ ] **Step 4: Tirar o quadro do hero e apagar os arquivos antigos**

Em `src/app/(home)/_components/hero.tsx`, remover o import de `HeroBoard` e o bloco:

```tsx
        <div className="enter relative z-10" style={{ '--enter-delay': '120ms' } as React.CSSProperties}>
          <HeroBoard slots={horarios} />
        </div>
```

e a linha `const horarios = getHorarios();` mais o import de `getHorarios`, se ficarem sem uso.

```bash
git rm src/components/shared/hero-board.tsx src/components/shared/aulas-hoje-indicator.tsx
```

Run: `grep -rn "hero-board\|HeroBoard\|aulas-hoje-indicator\|AulasHojeIndicator" src e2e`
Expected: só referências em comentários (atualizar o texto se citarem o arquivo como existente) ou nenhuma.

- [ ] **Step 5: Verificar**

Run: `npm run typecheck && npm run lint && npm run test && E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts e2e/home.spec.ts`
Expected: PASS nos 3 targets (o teste de filtro de dia mobile em `home.spec.ts` continua verde).

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/hoje-strip.tsx "src/app/(home)/_components/horarios.tsx" "src/app/(home)/_components/hero.tsx" e2e/rebranding.spec.ts
git commit -m "feat: faixa HOJE no topo de Horários (SDD §4)"
```

---

### Task 5: Header, footer, rótulo único de CTA e travessões

**Files:**
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/components/shared/whatsapp-float.tsx`
- Modify: `src/config/site.ts`
- Modify: `content/campaign.json`
- Modify: `e2e/home.spec.ts`, `e2e/rebranding.spec.ts`

**Interfaces:**
- Consumes: `StatusChip` (`@/components/layout/status-chip`, props `{ funcionamento: DiaFuncionamento[]; className?; style? }`), `getFuncionamento`.

- [ ] **Step 1: E2E (falha)**

Em `e2e/home.spec.ts`, linha do botão flutuante:

```ts
    const float = page.getByRole('link', { name: 'Quero treinar agora' }).last();
```

Acrescentar a `e2e/rebranding.spec.ts`:

```ts
test.describe('Header e rótulos', () => {
  test('sem barra azul do topo e sem "Falar no WhatsApp" na página', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('formando a vizinhança')).toHaveCount(0);
    await expect(page.getByText('Falar no WhatsApp')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Falar no WhatsApp' })).toHaveCount(0);
  });

  test('chip de funcionamento aparece no header em telas largas', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('header').getByText(/Aberto agora|Abre hoje|Fechado/)).toBeVisible();
  });

  test('header e rodapé sem travessão', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).not.toContainText('—');
    await expect(page.locator('footer')).not.toContainText('—');
  });
});
```

Run: `E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts -g "Header e rótulos"`
Expected: FAIL.

- [ ] **Step 2: Header**

Reescrever `src/components/layout/header.tsx` (mantém a mudança do usuário no logo: `preload` + `fetchPriority="high"` e o comentário dela):

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { navigation } from '@/config/navigation';
import { siteConfig, whatsappUrl } from '@/config/site';
import { getFuncionamento } from '@/lib/content/funcionamento';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { StatusChip } from '@/components/layout/status-chip';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';
import { CtaArrow } from '@/components/shared/cta-arrow';

/**
 * Header único (a barra azul do topo com "desde 1992 · Vila Helena" saiu na
 * rodada de 2026-10-07: a mesma informação já abre o hero e repeti-la três
 * vezes era vício de template). O chip "aberto agora" veio do hero pra cá,
 * só a partir de `xl`, pra navegação continuar numa linha só em `lg`.
 */
export function Header() {
  const funcionamento = getFuncionamento();

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-background border-border flex items-center justify-between gap-4 border-b px-[6%] py-3">
        <Link href="/" aria-label={`${siteConfig.name}, página inicial`} className="shrink-0">
          {/* 102×96 = tamanho nativo do arquivo-fonte (public/logo.png) —
           * teto sem ficar borrado. Já aumentado uma vez (68×64) e o cliente
           * ainda achou pequeno; isto é o máximo que dá pra crescer sem pedir
           * um arquivo de logo maior/vetor (ver mesma pendência em footer.tsx). */}
          {/* `priority` foi deprecado no Next 16 em favor de `preload`, e nenhum
           * dos dois seta prioridade de fetch sozinho mais (confirmado em
           * node_modules/next/dist/docs/.../image.md) — sem `fetchPriority`
           * explícito essa imagem (LCP real da home, medido via Lighthouse
           * mobile local) baixava sem prioridade nenhuma, atrás das 14 fontes
           * e do CSS bloqueante: ~1,3s dos ~3,1s do LCP. */}
          <Image
            src="/logo.png"
            alt=""
            width={102}
            height={96}
            className="h-24 w-[102px]"
            preload
            fetchPriority="high"
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-foreground/75 hover:text-flex-blue-600 text-[13px] font-medium tracking-wide uppercase transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <StatusChip funcionamento={funcionamento} className="hidden xl:inline-flex" />
          <Button asChild size="sm" className="group hidden md:inline-flex">
            <a
              href={whatsappUrl('Olá! Quero treinar na Academia Flex.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappGlyph className="h-4 w-4" />
              Quero treinar agora
              <CtaArrow variant="up-right" />
            </a>
          </Button>
          <MobileMenu />
        </div>
      </header>
    </div>
  );
}
```

Nota: o LCP passa a ser a primeira foto do hero (Task 6). O logo continua com prioridade alta, o que é aceitável porque é pequeno. Se o Lighthouse da Task 10 acusar disputa de banda, tirar `fetchPriority` do logo.

- [ ] **Step 3: Footer, botão flutuante, endereço e campanha**

- `src/components/layout/footer.tsx`: `const endereco = \`${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state}\`;` e trocar o texto do link `Falar no WhatsApp` (perto da linha 109) por `Quero treinar agora`.
- `src/components/shared/whatsapp-float.tsx`: `aria-label="Quero treinar agora"`.
- `src/config/site.ts`: `street: 'R. das Hortênsias, 104, Vila Helena',` (o teste de structured-data só exige que contenha "Vila Helena").
- `content/campaign.json`: `"sub": "Depois 11x de R$ 129,90, ou R$ 1.300,00 à vista no Pix.",`

Run: `grep -rn '—\|–' content/campaign.json src/config/site.ts src/components/layout/footer.tsx src/components/layout/header.tsx | grep -v '^\S*:\s*\(//\|\*\|{/\*\)'`
Expected: nenhum resultado fora de comentário. (Os `—` de `content/professores.json` ficam: são o marcador interno `BIO_PENDENTE`, que nunca aparece na tela, porque card sem perfil completo não é renderizado.)

- [ ] **Step 4: Verificar**

Run: `npm run typecheck && npm run lint && npm run test && E2E_PORT=3100 npx playwright test`
Expected: tudo verde nos 3 targets, inclusive `header.spec.ts` (ele espera "Quero treinar agora" no header e continua igual).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/header.tsx src/components/layout/footer.tsx src/components/shared/whatsapp-float.tsx src/config/site.ts content/campaign.json e2e/home.spec.ts e2e/rebranding.spec.ts
git commit -m "refactor: header sem barra de topo, rótulo único de CTA e sem travessões"
```

---

### Task 6: Hero com fotos rotativas

**Files:**
- Create: `src/components/shared/hero-rotator.tsx`
- Rewrite: `src/app/(home)/_components/hero.tsx`
- Modify: `src/app/globals.css`
- Modify: `e2e/rebranding.spec.ts`

**Interfaces:**
- Consumes: `Foto`, `mediaConfig.heroFotos` (Task 1).
- Produces: `export function HeroRotator({ fotos, intervaloMs = 6000 }: { fotos: Foto[]; intervaloMs?: number })`, com `data-testid="hero-rotator"` e `data-ativo="<índice>"` na raiz.

- [ ] **Step 1: E2E (falha)**

Acrescentar a `e2e/rebranding.spec.ts`:

```ts
test.describe('Hero', () => {
  test('troca de foto depois do intervalo', async ({ page }) => {
    await page.goto('/');
    const rotator = page.getByTestId('hero-rotator');
    await expect(rotator).toHaveAttribute('data-ativo', '0');
    await expect(rotator).toHaveAttribute('data-ativo', '1', { timeout: 9000 });
  });

  test.describe('com movimento reduzido', () => {
    test.use({ reducedMotion: 'reduce' });

    test('fica parado na primeira foto', async ({ page }) => {
      await page.goto('/');
      const rotator = page.getByTestId('hero-rotator');
      await expect(rotator).toHaveAttribute('data-ativo', '0');
      await page.waitForTimeout(7000);
      await expect(rotator).toHaveAttribute('data-ativo', '0');
    });
  });

  test('hero tem no máximo 2 CTAs e nenhum chip ou número de stats', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('main > section').first();
    await expect(hero.getByRole('link')).toHaveCount(2);
    await expect(hero.getByText('anos na Vila Helena')).toHaveCount(0);
    await expect(hero.getByText(/Aberto agora|Abre hoje/)).toHaveCount(0);
  });

  test('primeira foto do hero carrega com prioridade alta', async ({ page }) => {
    await page.goto('/');
    const primeira = page.getByTestId('hero-rotator').locator('img').first();
    await expect(primeira).toHaveAttribute('fetchpriority', 'high');
  });
});
```

Run: `E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts -g "Hero"`
Expected: FAIL.

- [ ] **Step 2: CSS do zoom lento**

Acrescentar a `src/app/globals.css`, logo depois do bloco `@keyframes heading-wipe`:

```css
/* Hero (rodada 2026-10-07): zoom lento na foto ativa do HeroRotator.
 * Só transform. A regra global de prefers-reduced-motion (fim do arquivo)
 * zera a duração, e o HeroRotator nem troca de foto nesse caso. */
@keyframes hero-zoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.06);
  }
}
.hero-zoom {
  animation: hero-zoom 7s ease-out both;
}
```

- [ ] **Step 3: `HeroRotator`**

Create `src/components/shared/hero-rotator.tsx`:

```tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Foto } from '@/config/media';
import { cn } from '@/lib/utils';

interface HeroRotatorProps {
  fotos: Foto[];
  intervaloMs?: number;
}

/**
 * Fotos do hero em crossfade lento (o "site vivo" pedido pelo cliente, sem
 * setas nem bolinhas: o visitante não precisa controlar, é ambientação).
 * Nada é sobreposto à foto (decisão de 2026-10-07).
 * - Só a primeira foto é prioridade de carregamento (é o LCP).
 * - Com `prefers-reduced-motion: reduce`, nunca troca: fica na primeira.
 * - Pausa com a aba oculta, pra não acumular trocas em segundo plano.
 */
export function HeroRotator({ fotos, intervaloMs = 6000 }: HeroRotatorProps) {
  const [ativo, setAtivo] = React.useState(0);

  React.useEffect(() => {
    if (fotos.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let id: number | undefined;
    const iniciar = () => {
      window.clearInterval(id);
      id = window.setInterval(() => setAtivo((i) => (i + 1) % fotos.length), intervaloMs);
    };
    const aoMudarVisibilidade = () => {
      if (document.hidden) window.clearInterval(id);
      else iniciar();
    };

    iniciar();
    document.addEventListener('visibilitychange', aoMudarVisibilidade);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', aoMudarVisibilidade);
    };
  }, [fotos.length, intervaloMs]);

  return (
    <div data-testid="hero-rotator" data-ativo={ativo} className="relative h-full w-full overflow-hidden">
      {fotos.map((foto, i) => (
        <div
          key={foto.src}
          aria-hidden={i !== ativo}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1200ms] ease-out',
            i === ativo ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={foto.src}
            alt={i === 0 ? foto.alt : ''}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            preload={i === 0}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className={cn('object-cover', i === ativo && 'hero-zoom')}
          />
        </div>
      ))}
    </div>
  );
}
```

Notas:
- `alt` só na primeira. As outras são ambientação trocando sozinhas, e anunciar cada troca a leitores de tela seria ruído; elas ficam `aria-hidden` quando inativas e com `alt=""`.
- `key={foto.src}` + `hero-zoom` só na ativa: quando a ativa muda, a classe entra na nova imagem e a animação recomeça.
- Confirmar em `node_modules/next/dist/docs/` (busca por `preload` em `image.md`) que `preload` é a prop válida nesta versão, como o header já usa. Não usar `priority` (deprecado no Next 16).

- [ ] **Step 4: Reescrever o hero**

Reescrever `src/app/(home)/_components/hero.tsx`:

```tsx
import { siteConfig, whatsappUrl } from '@/config/site';
import { mediaConfig } from '@/config/media';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/shared/eyebrow';
import { HeroRotator } from '@/components/shared/hero-rotator';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';
import { CtaArrow } from '@/components/shared/cta-arrow';

/**
 * Hero (rodada 2026-10-07): texto à esquerda no fundo claro, fotos reais à
 * direita até a borda da tela, nada sobreposto à foto. No máximo 4
 * elementos de texto (eyebrow, h1, subtexto ≤ 20 palavras, CTAs). O quadro
 * HOJE foi pra Horários, o chip "aberto agora" pro header e os números pro
 * Sobre.
 *
 * Subtexto revisado contra SDD §7 (portão 1): só frases permitidas
 * ("professor presente na sala", "orientação", "tirar dúvidas"), nada que
 * implique acompanhamento individual incluso no plano.
 */
export function Hero() {
  return (
    <section className="grid lg:min-h-[min(720px,calc(100dvh-121px))] lg:grid-cols-2">
      <div className="relative aspect-[4/3] w-full lg:order-2 lg:aspect-auto">
        <HeroRotator fotos={mediaConfig.heroFotos} />
      </div>

      <div className="flex items-center px-[6%] py-12 md:py-16 lg:order-1 lg:py-20 lg:pr-12">
        <div className="mx-auto w-full max-w-[560px] lg:mr-0 lg:ml-auto">
          <Eyebrow className="enter" style={{ '--enter-delay': '0ms' } as React.CSSProperties}>
            Vila Helena · {siteConfig.address.city} · desde {siteConfig.foundedYear}
          </Eyebrow>
          <h1
            className="enter heading-reveal text-[clamp(34px,4.6vw,58px)] leading-[1.12]"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            Musculação e aulas com professor <span className="text-flex-blue-600">em sala</span>.
          </h1>
          <p
            className="enter text-muted-foreground mt-5 max-w-[460px] text-[17px] font-normal normal-case"
            style={{ '--enter-delay': '140ms' } as React.CSSProperties}
          >
            Professor de Educação Física presente na sala em todo o horário, orientando a execução e
            tirando dúvidas.
          </p>

          <div
            className="enter mt-8 flex flex-wrap gap-3"
            style={{ '--enter-delay': '210ms' } as React.CSSProperties}
          >
            <Button asChild className="group">
              <a
                href={whatsappUrl('Olá! Quero treinar na Academia Flex.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappGlyph className="h-4 w-4" />
                Quero treinar agora
                <CtaArrow variant="up-right" />
              </a>
            </Button>
            <Button asChild variant="ghost" className="group">
              <a href="#planos">
                Ver planos
                <CtaArrow variant="right" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Notas de layout:
- Mobile (`< lg`): a foto vem primeiro na ordem do DOM, com largura total e proporção 4:3, e o texto embaixo. Desktop: `lg:order-2` joga a foto para a direita, e o `grid-cols-2` sem `max-w` faz ela encostar na borda da viewport (raio 0).
- `121px` é a altura do header (logo 96 + `py-3` 24 + borda 1). Se ela mudar, a foto só fica um pouco mais alta ou mais baixa; o layout não quebra.
- O teste "hero tem 2 links" depende de o hero ter exatamente os 2 CTAs como links.

- [ ] **Step 5: Verificar**

Run: `npm run typecheck && npm run lint && E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts e2e/home.spec.ts`
Expected: PASS nos 3 targets.

Conferência visual (playwright-cli): `playwright-cli open http://localhost:3100`, depois `playwright-cli resize 1440 900` e `playwright-cli screenshot --filename=hero-desktop.png`; repetir com `resize 390 844` e salvar como `hero-mobile.png`. Abrir as duas imagens com Read e conferir: foto até a borda direita no desktop, nada em cima da foto, H1 em até 2 linhas no desktop e CTAs visíveis sem rolar. Salvar os screenshots no scratchpad, nunca no repo.

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/hero-rotator.tsx "src/app/(home)/_components/hero.tsx" src/app/globals.css e2e/rebranding.spec.ts
git commit -m "feat: hero com fotos rotativas e stack enxuto (SDD §4)"
```

---

### Task 7: Modalidades em dois blocos com foto

**Files:**
- Rewrite: `src/app/(home)/_components/modalidades.tsx`
- Modify: `e2e/rebranding.spec.ts`

**Interfaces:**
- Consumes: `getModalidades(): { nome: string; icone: string }[]`, `ModalidadeIcon({ icone, className })`, `Photo`, `mediaConfig.modalidades`, `SectionHeading` sem eyebrow (Task 2), `Reveal({ delayMs })`.

- [ ] **Step 1: E2E (falha)**

```ts
test.describe('Modalidades', () => {
  test('dois blocos com foto e todas as aulas como etiquetas', async ({ page }) => {
    await page.goto('/');
    const secao = page.locator('#modalidades');
    await secao.scrollIntoViewIfNeeded();
    await expect(secao.locator('img')).toHaveCount(2);
    await expect(secao.getByTestId('aula-coletiva')).toHaveCount(10);
    await expect(secao.getByRole('heading', { name: 'Musculação' })).toBeVisible();
    await expect(secao.getByRole('heading', { name: 'Aulas coletivas' })).toBeVisible();
  });
});
```

Run: `E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts -g "Modalidades"`
Expected: FAIL.

- [ ] **Step 2: Reescrever `modalidades.tsx`**

```tsx
import { getModalidades } from '@/lib/content/modalidades';
import { mediaConfig } from '@/config/media';
import { SectionHeading } from '@/components/shared/section-heading';
import { ModalidadeIcon } from '@/components/shared/modalidade-icon';
import { Photo } from '@/components/shared/photo';
import { Reveal } from '@/components/shared/reveal';

/**
 * Modalidades (rodada 2026-10-07): em vez de 11 linhas numeradas com
 * hairline (o padrão de lista mais genérico), dois blocos com foto real:
 * a musculação e o salão onde acontecem as aulas coletivas. Cada aula
 * mantém o próprio ícone (nunca reaproveitado entre modalidades, RULES).
 * Sem eyebrow (máximo 3 na home).
 */
export function Modalidades() {
  const modalidades = getModalidades();
  const aulas = modalidades.filter((m) => m.icone !== 'musculacao');

  return (
    <section id="modalidades" className="bg-surface-100 border-border border-y px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading title="O que você treina aqui." />

        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <Reveal>
            <Photo
              src={mediaConfig.modalidades.musculacao.src}
              alt={mediaConfig.modalidades.musculacao.alt}
              label="musculação"
              ratio="portrait"
              className="rounded-xl"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <h3 className="mt-5 text-[22px]">Musculação</h3>
            <p className="text-muted-foreground mt-2 max-w-[420px] text-[15.5px] normal-case">
              Aparelhos, pesos livres e área de cardio, abertos em todo o horário de funcionamento.
            </p>
          </Reveal>

          <Reveal delayMs={60}>
            <Photo
              src={mediaConfig.modalidades.aulas.src}
              alt={mediaConfig.modalidades.aulas.alt}
              label="salão de aulas"
              ratio="wide"
              className="rounded-xl"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
            <h3 className="mt-5 text-[22px]">Aulas coletivas</h3>
            <p className="text-muted-foreground mt-2 text-[15.5px] normal-case">
              {aulas.length} aulas no mesmo plano. Confira os dias na grade de horários.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {aulas.map((aula) => (
                <li
                  key={aula.nome}
                  data-testid="aula-coletiva"
                  className="border-border inline-flex items-center gap-2 rounded-pill border bg-white px-3.5 py-2 text-[14px] font-medium"
                >
                  <ModalidadeIcon icone={aula.icone} className="text-flex-blue-600 h-4 w-4" />
                  {aula.nome}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

Notas:
- A separação usa `icone === 'musculacao'`, que é único por construção (o schema de `modalidades.ts` rejeita ícone repetido). Não depende da ordem do JSON.
- Os textos dos blocos não falam de professor, então não acionam o portão 1. "No mesmo plano" repete um fato que já está no Sobre e no título de Planos ("todas as modalidades inclusas").
- A foto da musculação é retrato (3:4) e a do salão é larga (16:10). As alturas diferem de propósito (composição assimétrica). Se o bloco da direita ficar muito mais baixo no desktop, trocar a da esquerda para `ratio="square"`.

- [ ] **Step 3: Verificar**

Run: `npm run typecheck && npm run lint && E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts e2e/home.spec.ts`
Expected: PASS nos 3 targets, incluindo "não introduz scroll horizontal".

Conferência visual com playwright-cli em 1440 e 390 (mesmo processo da Task 6), focando em `#modalidades`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(home)/_components/modalidades.tsx" e2e/rebranding.spec.ts
git commit -m "feat: Modalidades em dois blocos com foto (SDD §4)"
```

---

### Task 8: Sobre com carrossel do espaço

**Files:**
- Create: `src/components/shared/photo-carousel.tsx`
- Rewrite: `src/app/(home)/_components/sobre.tsx`
- Modify: `e2e/rebranding.spec.ts`

**Interfaces:**
- Consumes: `Foto[]` (`mediaConfig.sobreGaleria`), `CountUp({ value: string })` de `@/components/shared/count-up`, `contarConfirmados`, `getProfessores`, `getModalidades`, `siteConfig.foundedYear`.
- Produces: `export function PhotoCarousel({ fotos, rotulo }: { fotos: Foto[]; rotulo: string })`. Botões com `aria-label="Foto anterior"` / `"Próxima foto"`, região com `aria-roledescription="carrossel"` e `aria-label={rotulo}`.

- [ ] **Step 1: E2E (falha)**

```ts
test.describe('Sobre: carrossel', () => {
  test('setas visíveis sem hover e navegação por toque/clique', async ({ page }) => {
    await page.goto('/');
    await aceitarCookies(page);
    const sobre = page.locator('#sobre');
    await sobre.scrollIntoViewIfNeeded();

    const anterior = sobre.getByRole('button', { name: 'Foto anterior' });
    const proxima = sobre.getByRole('button', { name: 'Próxima foto' });
    await expect(anterior).toBeVisible();
    await expect(proxima).toBeVisible();
    await expect(anterior).toBeDisabled();
    await expect(proxima).toBeEnabled();

    const trilho = sobre.getByRole('region', { name: 'Fotos da Academia Flex' });
    const antes = await trilho.evaluate((el) => el.scrollLeft);
    await proxima.click();
    await expect.poll(() => trilho.evaluate((el) => el.scrollLeft)).toBeGreaterThan(antes);
    await expect(anterior).toBeEnabled();
  });

  test('teclado: seta para a direita avança', async ({ page, isMobile }) => {
    test.skip(isMobile, 'teclado só no desktop');
    await page.goto('/');
    await aceitarCookies(page);
    const trilho = page.locator('#sobre').getByRole('region', { name: 'Fotos da Academia Flex' });
    await trilho.scrollIntoViewIfNeeded();
    await trilho.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => trilho.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });

  test('legenda fica abaixo da foto, nunca por cima', async ({ page }) => {
    await page.goto('/');
    const primeiro = page.locator('#sobre figure').first();
    await primeiro.scrollIntoViewIfNeeded();
    const img = await primeiro.locator('img').boundingBox();
    const legenda = await primeiro.locator('figcaption').boundingBox();
    expect(img && legenda && legenda.y >= img.y + img.height - 1).toBe(true);
  });

  test('números saíram do hero e estão no Sobre', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sobre').getByText('anos na Vila Helena')).toBeAttached();
  });
});

test.describe('Sem scroll horizontal', () => {
  for (const largura of [375, 768, 1440]) {
    test(`largura ${largura}px`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 900 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const transborda = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(transborda).toBe(false);
    });
  }
});
```

Run: `E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts -g "Sobre"`
Expected: FAIL.

- [ ] **Step 2: `PhotoCarousel`**

Create `src/components/shared/photo-carousel.tsx`:

```tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Foto } from '@/config/media';
import { cn } from '@/lib/utils';

interface PhotoCarouselProps {
  fotos: Foto[];
  /** Nome acessível da região, ex.: "Fotos da Academia Flex". */
  rotulo: string;
}

/**
 * Carrossel de fotos do espaço (Sobre, rodada 2026-10-07).
 * - Scroll nativo com scroll-snap: toque, trackpad e arraste funcionam sem JS.
 * - Setas SEMPRE visíveis, nunca só no hover (RULES #5: a seta do carrossel
 *   antigo de professores ficou invisível em touch, bug real de produção).
 * - Fim/início detectados por IntersectionObserver no primeiro/último slide
 *   (nada de listener de scroll).
 * - Sem autoplay e sem contador "03 / 08". Legenda abaixo da foto.
 */
export function PhotoCarousel({ fotos, rotulo }: PhotoCarouselProps) {
  const trilho = React.useRef<HTMLDivElement>(null);
  const primeiro = React.useRef<HTMLElement>(null);
  const ultimo = React.useRef<HTMLElement>(null);
  const [noInicio, setNoInicio] = React.useState(true);
  const [noFim, setNoFim] = React.useState(false);

  React.useEffect(() => {
    const root = trilho.current;
    if (!root || !primeiro.current || !ultimo.current) return;
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.target === primeiro.current) setNoInicio(e.intersectionRatio > 0.9);
          if (e.target === ultimo.current) setNoFim(e.intersectionRatio > 0.9);
        }
      },
      { root, threshold: [0, 0.9, 1] }
    );
    observer.observe(primeiro.current);
    observer.observe(ultimo.current);
    return () => observer.disconnect();
  }, []);

  const mover = React.useCallback((direcao: 1 | -1) => {
    const el = trilho.current;
    const slide = el?.querySelector<HTMLElement>('figure');
    if (!el || !slide) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direcao * (slide.offsetWidth + gap), behavior: reduzido ? 'auto' : 'smooth' });
  }, []);

  const aoTeclar = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      mover(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      mover(-1);
    }
  };

  const botao =
    'border-border text-flex-blue-700 hover:bg-flex-ice flex h-11 w-11 items-center justify-center rounded-full border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flex-blue-600 disabled:cursor-not-allowed disabled:opacity-35';

  return (
    <div>
      <div
        ref={trilho}
        role="region"
        aria-roledescription="carrossel"
        aria-label={rotulo}
        tabIndex={0}
        onKeyDown={aoTeclar}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flex-blue-600 md:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((foto, i) => (
          <figure
            key={foto.src}
            ref={i === 0 ? primeiro : i === fotos.length - 1 ? ultimo : undefined}
            className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[31.5%]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 82vw"
                className="object-cover"
              />
            </div>
            {foto.legenda ? (
              <figcaption className="text-muted-foreground mt-2.5 text-[13.5px]">{foto.legenda}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <div className="mt-5 flex gap-2.5">
        <button type="button" aria-label="Foto anterior" onClick={() => mover(-1)} disabled={noInicio} className={botao}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Próxima foto" onClick={() => mover(1)} disabled={noFim} className={cn(botao)}>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
```

Notas:
- O trilho é `overflow-x-auto` **dentro** do container de largura máxima. A página não transborda porque o conteúdo largo fica contido no próprio elemento rolável; o teste "Sem scroll horizontal" cobre isso.
- `lucide-react` já é a família de ícones do projeto. Não trocar.

- [ ] **Step 3: Reescrever `sobre.tsx`**

```tsx
import { siteConfig } from '@/config/site';
import { mediaConfig } from '@/config/media';
import { getModalidades } from '@/lib/content/modalidades';
import { contarConfirmados, getProfessores } from '@/lib/content/professores';
import { CountUp } from '@/components/shared/count-up';
import { PhotoCarousel } from '@/components/shared/photo-carousel';
import { Reveal } from '@/components/shared/reveal';
import { cn } from '@/lib/utils';

/**
 * Sobre (rodada 2026-10-07): pilha vertical, não split. Hero e Professores
 * já são duas colunas, e Contato também; três seções seguidas no mesmo
 * formato é zigue-zague de template. Título, texto curto, os números que
 * saíram do hero e o carrossel com o espaço real (fachada primeiro). Sem
 * eyebrow e sem o bloco azul com o "1992" gigante.
 */
export function Sobre() {
  const anos = new Date().getFullYear() - siteConfig.foundedYear;
  const modalidades = getModalidades();
  const professores = getProfessores();

  const stats = [
    { valor: `${anos}+`, label: 'anos na Vila Helena' },
    { valor: String(modalidades.length), label: 'modalidades inclusas' },
    { valor: String(contarConfirmados(professores)), label: 'professores confirmados' },
  ];

  return (
    <section id="sobre" className="px-[6%] py-16 md:py-24">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="max-w-[640px]">
          <h2 className="heading-reveal text-[clamp(28px,3.6vw,44px)] leading-[1.1]">
            Academia completa, desde {siteConfig.foundedYear}.
          </h2>
          <p className="text-muted-foreground mt-5 text-[17px] normal-case">
            Musculação e as {modalidades.length - 1} aulas coletivas no mesmo plano, na Vila Helena
            desde {siteConfig.foundedYear}.
          </p>
        </Reveal>

        <dl className="border-flex-blue-600/15 divide-flex-blue-600/15 mt-10 grid max-w-[620px] grid-cols-3 divide-x border-t pt-6">
          {stats.map((stat, i) => (
            <div key={stat.label} className={cn('flex flex-col-reverse', i > 0 && 'pl-4 sm:pl-6')}>
              <dt className="text-muted-foreground mt-1.5 text-[12px] leading-snug normal-case">{stat.label}</dt>
              <dd className="font-heading text-flex-blue-700 text-[38px] leading-none tabular-nums sm:text-[46px]">
                <CountUp value={stat.valor} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 md:mt-14">
          <PhotoCarousel fotos={mediaConfig.sobreGaleria} rotulo="Fotos da Academia Flex" />
        </div>
      </div>
    </section>
  );
}
```

Nota de conteúdo: o parágrafo não afirma "mesmo endereço desde 1992", porque o SDD §1 não confirma isso. `foundedYear` já é publicado hoje em vários lugares; a pendência de confirmar 1992 continua em `docs/tasks.md`, sem mudança aqui. `modalidades.length - 1` desconta a Musculação, que é a única não coletiva.

- [ ] **Step 4: Verificar**

Run: `npm run typecheck && npm run lint && npm run test && E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts e2e/home.spec.ts`
Expected: PASS nos 3 targets.

Conferência visual com playwright-cli em 1440 e 390, focando em `#sobre`: setas visíveis, legendas abaixo, sem barra de rolagem aparente e a segunda foto aparecendo pela metade no mobile (sinal de que dá para arrastar).

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/photo-carousel.tsx "src/app/(home)/_components/sobre.tsx" e2e/rebranding.spec.ts
git commit -m "feat: Sobre com carrossel do espaço (SDD §4)"
```

---

### Task 9: Professores e Planos sem eyebrow; limite de eyebrows

**Files:**
- Modify: `src/app/(home)/_components/professores.tsx`
- Modify: `src/app/(home)/_components/planos.tsx`
- Modify: `e2e/rebranding.spec.ts`

- [ ] **Step 1: E2E (falha)**

```ts
test.describe('Eyebrows', () => {
  test('no máximo 3 na home', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main .eyebrow-line')).toHaveCount(3);
  });

  test('título de Professores revisado (SDD §7)', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.locator('#professores').getByRole('heading', { name: 'Professores presentes na sala.' })
    ).toBeAttached();
  });
});
```

Run: `E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts -g "Eyebrows"`
Expected: FAIL (a contagem atual é 5: Hero, Planos, Horários, Professores e Contato).

- [ ] **Step 2: Professores**

Em `src/app/(home)/_components/professores.tsx`, no `SectionHeading`: remover `eyebrow="Equipe"` e trocar `title` por:

```tsx
              title={
                <>
                  Professores
                  <br />
                  presentes na sala.
                </>
              }
```

Comentário acima do `SectionHeading`: `{/* Título revisado contra SDD §7 (portão 1, rodada 2026-10-07): o anterior, "Seu treino montado por um professor", ficava perto de "Seu professor"/acompanhamento individual. */}`

O nome acessível do heading com `<br />` vira "Professores presentes na sala." (o `<br>` conta como espaço no cálculo do nome acessível). Se o teste falhar por espaço, usar `getByRole('heading', { name: /Professores\s*presentes na sala\./ })`.

- [ ] **Step 3: Planos**

Em `src/app/(home)/_components/planos.tsx`, remover a linha `eyebrow="Planos"` do `SectionHeading`.

- [ ] **Step 4: Verificar**

Run: `npm run typecheck && npm run lint && E2E_PORT=3100 npx playwright test`
Expected: suíte inteira verde nos 3 targets.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(home)/_components/professores.tsx" "src/app/(home)/_components/planos.tsx" e2e/rebranding.spec.ts
git commit -m "refactor: Professores e Planos sem eyebrow, título revisado (SDD §7)"
```

---

### Task 10: Documentação, verificação completa e PR

**Files:**
- Modify: `CLAUDE.md`
- Modify: `docs/tasks.md`

- [ ] **Step 1: CLAUDE.md**

Em `CLAUDE.md`, seção "Padrão de frontend/UX/UI", trocar o trecho `motivo de assinatura "quadro de avisos" — quadro de horário de hoje no hero, cartões com hairline e header azul sólido` por `motivo de assinatura "quadro de avisos" — faixa de aulas de hoje no topo de Horários, cartões com hairline e header azul sólido`. Logo abaixo da nota de 2026-08-18, acrescentar:

```markdown
> Nota de histórico (2026-10-07): mini rebranding com as fotos reais. O quadro "HOJE" saiu do hero e virou faixa no topo de Horários (decisão do cliente: o hero fica só texto + foto, e nada é sobreposto às fotos). Ver `docs/superpowers/specs/2026-10-07-rebranding-fotos-design.md`.
```

- [ ] **Step 2: docs/tasks.md**

Acrescentar uma seção ao fim de `docs/tasks.md`:

```markdown
## Rodada 2026-10-07 — mini rebranding com fotos reais

Spec: `docs/superpowers/specs/2026-10-07-rebranding-fotos-design.md` · Plano: `docs/superpowers/plans/2026-10-07-rebranding-fotos.md`

- [x] Fotos reais otimizadas em `public/fotos/` (originais fora do git, `scripts/otimizar-fotos.mjs`), fonte única `src/config/media.ts`.
- [x] Hero: texto + fotos rotativas (crossfade, pausa em movimento reduzido), 4 elementos de texto. Quadro HOJE foi pra Horários (desvio do CLAUDE.md, atualizado); chip "aberto agora" foi pro header (xl+); números foram pro Sobre.
- [x] Modalidades em dois blocos com foto; Sobre em pilha vertical com carrossel (setas sempre visíveis, RULES #5).
- [x] Eyebrows limitados a 3 (Hero, Horários, Contato); rótulo único "Quero treinar agora"; sem travessão em texto visível; horário de funcionamento agrupado (`agruparFuncionamento`, com teste).
- [ ] **Portão 1 (SDD §11):** aprovação humana dos textos novos: subtexto do hero e título "Professores presentes na sala.".
- [ ] Retratos da equipe (`public/06_equipe/`, fora do git): entram quando todos os professores mandarem bio; o card já aceita `fotoUrl`.
```

- [ ] **Step 3: Suíte completa**

Run: `npm run lint && npm run typecheck && npm run test && npm run build && E2E_PORT=3100 npm run test:e2e`
Expected: tudo verde. Registrar a contagem de testes (unit e e2e) para o PR.

- [ ] **Step 4: Lighthouse local (preset desktop, como o gate do CI)**

```bash
npx next start -p 3100 &   # build da Step 3
sleep 5
CHROME_PATH=$(node -e "console.log(require('playwright').chromium.executablePath())") \
  npx --yes lighthouse http://localhost:3100/ --preset=desktop \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh-home.json --quiet
node -e "const r=require('/tmp/lh-home.json');for(const[k,v]of Object.entries(r.categories))console.log(k,Math.round(v.score*100));console.log('LCP',r.audits['largest-contentful-paint'].displayValue)"
kill %1
```

Expected: ≥ 95 nas 4 categorias. Se Performance ficar abaixo de 95, a causa provável é o peso das fotos do hero: baixar `quality` no script para 74 e regenerar, ou conferir se as fotos 2 e 3 do hero estão carregando antes da primeira. **Não** reduzir o escopo do teste.

- [ ] **Step 5: Revisão `web-design-guidelines`**

Invocar a skill `web-design-guidelines` sobre os arquivos alterados: `src/app/(home)/_components/*.tsx`, `src/components/shared/hero-rotator.tsx`, `src/components/shared/photo-carousel.tsx`, `src/components/shared/hoje-strip.tsx` e `src/components/layout/header.tsx`. Corrigir os achados de acessibilidade e UX que forem bugs reais; listar no PR os que forem decisão de projeto.

- [ ] **Step 6: Releitura do diff (RULES, item 8)**

Run: `git diff origin/develop --stat && git diff origin/develop`
Ler o diff inteiro procurando `console.log`, texto placeholder, travessão em texto visível, nota interna visível ao usuário e qualquer coisa não executada. Run: `git log origin/develop..HEAD --format=%B | grep -i 'claude\|co-authored\|generated'`
Expected: nenhum resultado.

- [ ] **Step 7: Screenshots de antes e depois**

Com playwright-cli, capturar a home inteira em 1440 e 390: o "antes" a partir de `origin/develop` (em um worktree temporário, no scratchpad) e o "depois" a partir desta branch. Salvar no scratchpad, nunca no repo.

- [ ] **Step 8: Commit dos docs, push e PR**

```bash
git add CLAUDE.md docs/tasks.md
git commit -m "docs: CLAUDE.md e tasks.md com o desvio do quadro HOJE (SDD §4)"
git push -u origin feat/rebranding-fotos
gh pr create --base develop --title "feat: mini rebranding com fotos reais (SDD §4)" \
  --body-file <arquivo no scratchpad> --attach <screenshots antes/depois>
```

Corpo do PR: resumo por seção, desvios (quadro HOJE para Horários; chip para o header em `xl+`, porque o spec assumia que ele já estava lá), **portão 1 pendente** (os dois textos novos, com o texto exato), resultado do Lighthouse, contagem de testes e achados da revisão `web-design-guidelines`. **Sem** linha de "Generated with Claude Code" (RULES #8).

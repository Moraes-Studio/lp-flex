# Rebranding imersivo (iteração 2) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Levar a home ao padrão visual de SmartFit/Bluefit: hero em tela cheia com título gigante sobre a foto tingida, header transparente sobre o hero, página com mais contraste e escala.

**Architecture:** Reaproveita `HeroRotator`, `PhotoCarousel`, `mediaConfig` e os componentes de seção existentes. Novo: um client leaf pequeno para o estado do header (transparente/sólido) via IntersectionObserver num sentinela do hero, e um componente `FaixaFoto` server-side com parallax por CSS scroll-driven animation (progressive enhancement). Sem biblioteca nova.

**Tech Stack:** Next.js 16.3, React 19, Tailwind v4, Playwright (3 targets), Vitest.

**Spec:** `docs/superpowers/specs/2026-10-07-rebranding-fotos-design.md`, seção "Iteração 2".

## Global Constraints

- Hero e faixa de foto: título/CTA sobre foto **apenas** com camada de cor sólida (`bg-flex-blue-900/xx` ou similar), nunca gradiente, brilho ou vidro. Nada de placas, quadros, chips ou legendas sobre foto em lugar nenhum.
- Contraste AA: texto sobre foto medido nas 3 fotos do hero e na foto da faixa (amostrar o pior pixel da área do texto contra a cor do texto, já com a camada aplicada). Título ≥ 3:1, texto normal ≥ 4.5:1.
- Header: "Quero treinar agora" sempre visível (≥ md) e é o único CTA de WhatsApp acima da dobra; o hero tem um único botão, "Ver planos" → `#planos`.
- Nenhum token de cor novo: usar a escala `flex-blue-*`, `flex-graphite`, `flex-ice`, `surface-*`, branco.
- No máximo 3 eyebrows na home (Hero, Horários, Contato).
- `prefers-reduced-motion`: rotator parado (já existe), parallax desligado.
- Touch sem hover (RULES #5); sem `window.addEventListener('scroll')`.
- `/privacidade` (sem hero imersivo) mantém header sólido.
- Commits `tipo: descrição (SDD §n)`, só caminhos explícitos, **sem** co-autoria/assinatura de IA. Nunca `git add -A`/`commit -a` (`.claude/` é untracked e não entra).
- Dev server deste projeto já roda em http://localhost:3100; E2E com `E2E_PORT=3100`. A porta 3000 é de outro projeto.
- Falhas E2E pré-existentes, não tratar: `e2e/seo.spec.ts` (SITE_URL :3000) e home.spec "condição da campanha ativa" (campanha encerrada).
- Prints de verificação vão para `/tmp/claude-1000/-home-lbc-m-moraesStudio-lp-flex/ea7f9fb1-f6bd-46d6-9f72-24785dd7e605/scratchpad/`, nunca no repo.

---

### Task 1: Hero imersivo + header transparente

**Files:**
- Modify: `src/app/(home)/_components/hero.tsx`
- Modify: `src/components/layout/header.tsx`
- Create: `src/components/layout/header-shell.tsx` (client leaf)
- Modify: `e2e/rebranding.spec.ts` (bloco "Hero" e "Header e rótulos")

**Requisitos**
1. **Hero:**
   - `<section data-hero-imersivo className="relative isolate min-h-[100dvh] …">` puxado para baixo do header sticky com margem negativa igual à altura do header (`-mt-[121px]` hoje: logo 96 + `py-3` 24 + borda 1) e padding-top equivalente, para a foto começar no topo da viewport.
   - `HeroRotator` em `absolute inset-0` (sizes `100vw`), e por cima uma camada `absolute inset-0 bg-flex-blue-950/60` (ajustar a opacidade pela medição de contraste; pode usar `mix-blend-multiply` se melhorar a foto, desde que continue sendo cor sólida).
   - Conteúdo alinhado à esquerda, na grade do site (`px-[6%]`, `max-w-[1180px] mx-auto` ou o mesmo gutter do header), verticalmente na metade inferior/centro.
   - Eyebrow `inverted` (mantém "Vila Helena · Santo André · desde 1992").
   - H1 branco `text-[clamp(48px,8.4vw,124px)] leading-[0.95]`, quebrado em 3 linhas com `<br className="hidden md:block" />`: "Musculação" / "e aulas com" / "professor **em sala**." (span `text-flex-blue-300`). No mobile pode quebrar naturalmente, sem palavra órfã.
   - Subtexto branco/85, o mesmo texto aprovado no spec.
   - **Um** botão: `variant="onDark"`, tamanho maior (padding generoso), texto "Ver planos" com `CtaArrow variant="down"` se existir, senão `right`, `href="#planos"`.
   - Nada de stats/chip no hero.
2. **Header:**
   - O shell vira um client component (`header-shell.tsx`) que recebe o conteúdo do header como children e decide o modo:
     - Observa `document.querySelector('[data-hero-imersivo]')` com IntersectionObserver (`rootMargin` negativo da altura do header).
     - Enquanto o hero intersecta, o modo é `transparente`: fundo transparente, sem borda, links e textos brancos. O logo continua o mesmo arquivo; ele já tem branco e azul e funciona sobre o azul, mas confira contraste.
     - Fora do hero, ou sem hero na página, o modo é `solido`: o visual atual.
   - Transição só de `background-color`/`color`/`box-shadow` (200ms), desligada em movimento reduzido.
   - SSR: renderizar `solido` por padrão para não piscar em `/privacidade`. Na home, a mudança para `transparente` acontece no primeiro efeito. Para evitar o flash, use `data-modo` no wrapper e classes condicionadas a `[data-modo=transparente]`. O wrapper do servidor pode nascer `transparente` quando o pathname for `/`: use `usePathname` no client shell.
   - Nav, chip "Aberto agora" e menu mobile precisam ficar legíveis nos dois modos. O chip tem fundo próprio claro e fica igual. O botão do menu mobile e os links usam `text-white` no modo transparente.
   - O CTA "Quero treinar agora" segue azul nos dois modos. Sobre a foto escura ele tem contraste suficiente, mas meça.
3. **Testes (`e2e/rebranding.spec.ts`):** substituir os testes do hero que deixam de valer e adicionar os novos:
   - "hero tem no máximo 2 CTAs…" vira "hero tem um único link, 'Ver planos', para #planos, e nenhum stat/chip".
   - Remover "H1 em no máximo 2 linhas" e "tela larga 1920". Substituir por: o hero ocupa ≥ 95% da altura da viewport em 1440x900 e 390x844; o topo da foto (`hero-rotator`) está em y ≤ 1; o H1 está totalmente visível sem rolar em 1440x900 e 390x844.
   - Header: na home, logo após carregar, o header tem `data-modo="transparente"`. Depois de rolar 1200px, tem `data-modo="solido"`. Em `/privacidade`, é sempre `solido`.
   - Manter "troca de foto", "movimento reduzido" e "primeira foto com prioridade alta".
4. **Contraste:** escreva um script no scratchpad que, para cada uma das 3 fotos ativas, tire um screenshot da área do H1 e do subtexto em 1440 e 390 com o texto escondido (`visibility:hidden` via `addStyleTag`), pegue a luminância do pixel mais claro e calcule o contraste contra branco. Ajuste a opacidade da camada até título ≥ 3:1 e subtexto ≥ 4.5:1 nas 3 fotos. Registre os números no relatório.

- [ ] Escrever/ajustar E2E (RED)
- [ ] Implementar hero e header-shell
- [ ] Medir contraste e ajustar a camada
- [ ] `npm run typecheck && npm run lint && npm run test` + `E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts e2e/header.spec.ts e2e/home.spec.ts` (GREEN)
- [ ] Prints: hero em 1920x1080, 1440x900, 390x844 (cookie aceito, movimento reduzido) e header sólido após rolar, em 1440 (`imersivo-hero-*.png`, `imersivo-header-solido.png`)
- [ ] Commit: `feat: hero imersivo em tela cheia e header transparente (SDD §4)`

---

### Task 2: Escala e contraste das seções

**Files:**
- Modify: `src/components/shared/section-heading.tsx` (escala maior + tom "dark" já existe)
- Modify: `src/app/(home)/_components/modalidades.tsx`, `sobre.tsx`, `planos.tsx`, `professores.tsx`, `contato.tsx`, `horarios.tsx` (só o que for preciso para cor/escala)
- Modify: `src/components/shared/photo-carousel.tsx` (variante para fundo escuro, se necessário)
- Modify: `e2e/rebranding.spec.ts`

**Requisitos**
1. `SectionHeading`: `default` passa para `text-[clamp(34px,5vw,72px)] leading-[1.02]`; `large` para `text-[clamp(38px,5.6vw,80px)]`; `compact` (Horários) para `text-[clamp(28px,3.4vw,48px)]`. Nenhum título em mais de 3 linhas em 1440; sem palavra órfã (`text-balance`).
2. **Modalidades** em `bg-flex-blue-900` com título branco (`tone="dark"`), texto `white/75`, nomes "Musculação"/"Aulas coletivas" em branco. Etiquetas das aulas sobre o azul: `bg-white/10 border-white/20 text-white`, ícone `text-flex-blue-300`. Fotos `rounded-xl`, maiores se couber.
3. **Sobre** em `bg-flex-blue-700`: título branco; parágrafo `white/80`; números em branco grande (`text-[clamp(48px,6vw,88px)]`) com rótulo `white/70`; divisores `white/15`. No carrossel, legendas `white/70` e setas legíveis no azul (borda `white/30`, ícone branco, fundo `white/10`, foco com `ring-white`), mantendo `aria-disabled`. Adicione uma prop `tone?: 'light' | 'dark'` ao `PhotoCarousel` em vez de duplicar classes.
4. **Planos, Professores e Contato** continuam claros (branco, `surface-100` e `surface-200` como hoje). Só a escala dos títulos muda. O ritmo fica: hero (foto) → marquee → Planos (branco) → Modalidades (azul profundo) → faixa de foto (Task 3) → Horários (grafite) → Professores (claro) → Sobre (azul) → Contato (claro) → rodapé (azul).
5. **Horários:** só a escala do título.
6. **Contraste AA** em tudo que mudou de fundo: rodar uma checagem automatizada no E2E com axe se o projeto já tiver `@axe-core/playwright`; senão, calcular os pares de cor relevantes à mão e registrar.
7. E2E: o eyebrow continua contando 3; `#modalidades` e `#sobre` têm fundo escuro (`getComputedStyle(...).backgroundColor` igual ao valor do token); "sem scroll horizontal" continua verde.

- [ ] E2E (RED) → implementar → GREEN (`E2E_PORT=3100 npx playwright test e2e/rebranding.spec.ts e2e/home.spec.ts`)
- [ ] Prints de cada seção em 1440 e 390 (`imersivo-secoes-*.png`), olhar e descrever
- [ ] Commit: `feat: seções com mais contraste e títulos maiores (SDD §4)`

---

### Task 3: Faixa de foto "05:00 às 23:00"

**Files:**
- Create: `src/components/shared/faixa-foto.tsx` (Server Component)
- Modify: `src/config/media.ts` (`faixaFoto: Foto` usando `/fotos/hero-cardio.jpg` **não**: a foto não pode repetir, então gerar uma nova a partir de `02_cardio/IMG_2524.jpg` como `faixa-cardio` via `scripts/otimizar-fotos.mjs` e atualizar o teste de `media.ts` para incluir `faixaFoto`)
- Modify: `scripts/otimizar-fotos.mjs`
- Modify: `src/app/(home)/page.tsx` (inserir entre `<Modalidades />` e `<Horarios />`)
- Modify: `src/app/globals.css` (parallax)
- Modify: `e2e/rebranding.spec.ts`

**Requisitos**
1. Seção sem `id` próprio, `aria-label="Horário de funcionamento"`. É foto em largura total, com altura `min-h-[70vh]` no desktop e `min-h-[60vh]` no mobile, camada `bg-flex-blue-950/55` (ajustar pelo contraste) e texto branco centralizado à esquerda na grade do site.
2. Texto gigante: o horário de segunda (`funcionamento[1]`) no formato `05:00 às 23:00`, com `text-[clamp(56px,11vw,168px)] font-heading leading-none tabular-nums`. Abaixo, menor: "segunda a quinta", usando o `rotulo` do primeiro grupo de `agruparFuncionamento` em minúsculas ("seg a qui" vira "segunda a quinta"). Para isso, adicione a `GrupoFuncionamento` um campo `rotuloLongo` com o nome completo do primeiro e do último dia ("Segunda a Quinta") e um teste unitário. Nada fixo no código: se o JSON mudar, a faixa muda junto.
3. Parallax: a imagem fica num wrapper com `animation: faixa-parallax linear both; animation-timeline: view(); animation-range: cover;` (translateY de -8% a 8%, com a imagem em `scale(1.18)` para não mostrar borda). Use `@supports (animation-timeline: view())` e `@media (prefers-reduced-motion: no-preference)`; fora disso, a imagem fica parada. Não use JS.
4. Contraste medido como na Task 1.
5. E2E: a faixa existe entre `#modalidades` e `#horarios`, contém "05:00" e "23:00" e não tem travessão; com `reducedMotion: 'reduce'`, o wrapper da imagem não tem `animation-name` ativo.

- [ ] Teste unitário de `rotuloLongo` (RED → GREEN)
- [ ] Gerar a foto e atualizar `media.ts` e o teste
- [ ] E2E (RED) → implementar → GREEN
- [ ] Prints da faixa em 1440 e 390 (`imersivo-faixa-*.png`)
- [ ] Commit: `feat: faixa de foto com horário de funcionamento (SDD §4)`

---

### Task 4: Documentação e verificação final

- [ ] `CLAUDE.md`: em "Padrão de frontend/UX/UI", trocar "paleta Flex Blue institucional em tema claro — 'papel'" pela nova direção (Flex Blue institucional com seções azul profundo/grafite/claras alternadas, hero imersivo) e adicionar uma nota de histórico de 2026-10-07 (segunda rodada) explicando o pivô e que placas/quadros/chips sobre foto continuam proibidos.
- [ ] `docs/tasks.md`: acrescentar o item "Iteração 2 (imersiva)" na seção da rodada de 2026-10-07.
- [ ] `npx prettier --write` nos arquivos alterados; `npm run lint && npm run typecheck && npm run test && npm run build`.
- [ ] `E2E_PORT=3100 npm run test:e2e`: só as 15 falhas pré-existentes conhecidas são aceitáveis.
- [ ] Lighthouse no build de produção em `:3200`, presets desktop **e** mobile, em `/`. Registrar os scores e o LCP. Se Performance < 95 no desktop, investigar antes de seguir.
- [ ] Prints da home inteira em 1440 e 390 (`imersivo-final-desktop.png`, `imersivo-final-mobile.png`), seção por seção com cookie aceito e movimento reduzido.
- [ ] Commit: `docs: CLAUDE.md e tasks.md com o pivô imersivo (SDD §4)`

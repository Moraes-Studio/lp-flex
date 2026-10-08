# Mini rebranding com fotos reais — design

Data: 2026-10-07 · Branch: `feat/rebranding-fotos` → PR para `develop`

## Contexto e objetivo

O cliente viu o site da SmartFit e quer a home da Flex com cara mais moderna e com movimento, sem orçamento para refazer a marca. Chegaram fotos profissionais reais (fachada, cardio, musculação, salão de aulas, detalhes e equipe) em `public/0*_*/`. Uma tentativa anterior de encaixá-las foi rejeitada: as fotos entraram como cards com borda e chip, empilhadas sobre o layout antigo, com sobras vazias ("nada em cima de nada").

**Objetivo:** dar acabamento profissional à home usando as fotos como estrutura da página e um movimento contido, sem mudar a identidade (logo, azul Flex `#0B4DA2`, Oswald/Barlow/IBM Plex Mono e tema claro único).

**Leitura de design (taste-skill):** academia de bairro para mulheres 40+, mobile-first, redesign que preserva a marca e passa confiança com acabamento premium. Dials: ousadia de layout 5-6, movimento 4-5, densidade 3-4.

## Decisões fechadas com o usuário

1. Refinar, não trocar identidade (caminho A).
2. **Nada sobreposto às fotos:** sem texto, quadro, chip, legenda ou "placa" em cima de imagem. A legenda, quando existir, fica abaixo da foto, em texto pequeno.
3. O quadro "HOJE" sai do hero e vai para o topo de Horários. **Desvio do `CLAUDE.md`**, que define "quadro de horário de hoje no hero" como motivo de assinatura: atualizar a nota no `CLAUDE.md` e no `docs/tasks.md`.
4. Carrossel é permitido onde fizer sentido.
5. Transição das fotos: fade simples, sem cortina azul.
6. Professores fica sem retrato até todos os professores mandarem bio e foto. O card já aceita `fotoUrl`.
7. Não criar seção nova (`SDD.md §4`): as fotos do espaço entram em seções que já existem.

## Seções

A ordem da home não muda: Header → Hero → Marquee → Promo → Planos → Modalidades → Horários → Professores → Sobre → Contato → Footer.

### Header
- Remover a barra azul do topo ("Desde 1992 · Vila Helena · Santo André — SP · 34+ anos…"). Essa informação aparece uma vez, no hero.
- O chip "aberto agora" continua no header, como está.
- CTA "Quero treinar agora", como hoje (ver "Rótulos de CTA").
- Mantém a mudança de `preload` + `fetchPriority` no logo, que hoje está no working tree e ainda não foi commitada.

### Hero
- **Layout:** duas colunas no desktop (`lg`). À esquerda, o texto no fundo claro. À direita, a foto até a borda direita da viewport, na altura do hero. No mobile (`< 768px`), a foto fica no topo, com proporção de cerca de 4:3 e largura total, e o texto vem embaixo.
- **No máximo 4 elementos de texto:** eyebrow ("Vila Helena · Santo André · desde 1992"), H1 (o atual, em até 2 linhas no desktop), subtexto com até 20 palavras e CTAs (WhatsApp como primário, "Ver planos" como secundário).
- **Sai do hero:** chip "aberto agora" (já está no header), números 34+/11/10 (vão para o Sobre) e o `HeroBoard` (vai para Horários).
- **Subtexto proposto**, sujeito a revisão no portão 1 do SDD §11: "Professor de Educação Física presente na sala em todo o horário, orientando a execução e tirando dúvidas." (17 palavras.)
- **Troca de fotos (`HeroRotator`):** 3 fotos (musculação `03_musculacao/IMG_2616`, cardio `02_cardio/IMG_2510` e salão `04_salao_aulas/IMG_2565`), com crossfade de cerca de 1,2 s a cada 6 s e zoom lento de 1.0 para 1.06 na foto ativa. Pausa com a aba oculta (`visibilitychange`). Só a primeira foto recebe `preload`/`fetchPriority="high"` (LCP). As demais carregam depois. Com movimento reduzido, mostra só a primeira foto parada.
- Sem borda e sem canto arredondado na foto que vai até a borda.

### Marquee e Promo
Sem mudança.

### Planos
Sem foto. Sai o eyebrow "Planos". Ajustes de espaçamento apenas se a revisão visual pedir.

### Modalidades
- Sai o eyebrow e a lista numerada de 11 linhas com hairline.
- **Dois blocos com foto:**
  - **Musculação:** foto `03_musculacao/IMG_2601`, nome e uma linha curta.
  - **Aulas coletivas:** foto `04_salao_aulas/IMG_2556` e as 10 aulas como etiquetas. Cada etiqueta mantém o ícone por modalidade (`modalidade-icon.tsx`), sem reaproveitar ícone entre modalidades.
- Desktop com dois blocos lado a lado em proporção assimétrica (ex.: `5fr 7fr`). Mobile empilhado.
- Os dados vêm de `getModalidades()`. A separação entre musculação e aulas é por `nome === 'Musculação'`, ou por um campo no JSON se já existir (verificar no plano).

### Horários
- Mantém o eyebrow (é 1 dos 3 permitidos).
- **Nova faixa "HOJE" no topo da seção**, acima da grade: aulas do dia com destaque para a que está acontecendo agora. Reaproveita a lógica atual do `HeroBoard`/`aulas-hoje-indicator` (fuso `America/Sao_Paulo`, já corrigido em `4fb8253`). No desktop é uma linha horizontal; no mobile, uma lista curta.
- A grade da semana não muda.

### Professores
- Sai o eyebrow "Equipe". O conteúdo e os 3 perfis completos se mantêm.
- O card reserva o retrato **só quando `fotoUrl` existe**. Sem foto, não aparece caixa vazia.
- **O título "Seu treino montado por um professor." fica pendente no portão 1:** está perto da frase proibida "Seu professor" (SDD §7). Alternativa proposta: "Professores presentes na sala." Quem decide é o humano.

### Sobre
- **Pilha vertical, não split.** Isso evita 3 seções seguidas com imagem e texto lado a lado (Professores, Sobre e Contato).
- Ordem: título "Academia completa, desde 1992." → parágrafo curto (até 25 palavras) → linha de números (34+ anos, 11 modalidades, N professores, com `CountUp` e lidos de `content/`, como hoje) → carrossel.
- Sai o bloco azul com o "1992" gigante.
- **Carrossel (`PhotoCarousel`):** de 6 a 8 fotos, com a fachada `01_fachada/IMG_2895` primeiro e depois cardio, musculação, salão e detalhes. Usa scroll nativo com `scroll-snap`, então toque e trackpad funcionam sem código extra. Setas anterior/próximo **sempre visíveis** (nunca só no hover, RULES #5), focáveis e acionadas por teclado (setas ← →). Sem autoplay e sem contador "03 / 08". Legenda curta **abaixo** de cada foto. O carrossel não pode gerar scroll horizontal na página: a faixa fica contida em `overflow-x: auto` dentro de um container com `overflow: hidden` lateral.
- Sem eyebrow.

### Contato
- Mantém o eyebrow (é 1 dos 3).
- O mapa fica no lugar e sem foto.
- Horário de funcionamento passa de 7 linhas para 4 grupos ("Seg a Qui", "Sex", "Sáb", "Dom e feriados"), derivados de `content/funcionamento.json`. Os grupos são calculados pelos horários iguais, não fixados no código.

### Footer
Troca o "—" por vírgula. Fora isso, sem mudança.

## Regras transversais

- **Eyebrows:** no máximo 3 na página (Hero, Horários e Contato).
- **Rótulos de CTA:** um único rótulo para a intenção "falar no WhatsApp": **"Quero treinar agora"** (decisão do usuário em 2026-10-07: é o CTA já usado no header e faz parte da estratégia de SEO/conversão). Vale no header, no hero, no contato e no aria-label do botão flutuante; "Falar no WhatsApp" deixa de ser usado. "Quero esse plano" se mantém nos cards de Planos, porque carrega o plano na mensagem.
- **Travessões:** nenhum "—" ou "–" em texto visível. Faixas de horário usam hífen ("05:00-23:00"). Inclui os 13 textos de `content/professores.json` e 1 de `content/campaign.json`, que são edição de conteúdo; os de professores passam pelo portão 1.
- **Forma:** foto até a borda da viewport tem raio 0. Foto dentro de coluna ou carrossel usa `--radius-xl`. Botões e cards seguem a escala atual.
- **`Photo`:** perde a borda e o `rounded-2xl` padrão. O raio vem por prop ou classe conforme a regra acima.
- **Movimento:** só `transform` e `opacity`. Entradas com o `Reveal` existente (IntersectionObserver, uma vez) e `delayMs` de 60 ms entre itens. Nada de listener de `scroll` nem biblioteca nova. Tudo neutralizado em `prefers-reduced-motion: reduce`.
- **Tema:** claro, único. Sem modo escuro (decisão do projeto, que tem prioridade sobre a taste-skill).

## Fotos e assets

- **Originais fora do git:** adicionar `public/0*_*/` ao `.gitignore`. Hoje somam cerca de 62 MB, e a Vercel publica a partir do git, então eles também não vão para o ar.
- **Script `scripts/otimizar-fotos.mjs`:** usa `sharp`, que já está em `node_modules` via Next. Lê uma lista explícita das fotos escolhidas (origem → destino) e exporta para `public/fotos/<slug>.jpg`, com lado maior de até 2000 px, qualidade de cerca de 80, `mozjpeg` e metadados EXIF removidos. Meta de até 400 KB por arquivo. O `next/image` entrega AVIF/WebP responsivo.
- **`src/config/media.ts`** vira a fonte única das fotos. Cada entrada tem `src`, `alt` (descritivo, em português, sem travessão) e `legenda` opcional:
  - `heroFotos: Foto[]` (3)
  - `modalidades: { musculacao: Foto; aulas: Foto }`
  - `sobreGaleria: Foto[]` (de 6 a 8)
  - Remove `heroFoto`, `sobreFoto` e `comunidadeFotos`, depois de verificar que não há outros usos.
- Os retratos de `06_equipe/` **não** entram agora (decisão 6).
- Nenhuma imagem gerada por IA (`CLAUDE.md`).

## Componentes

| Componente | Tipo | Responsabilidade |
|---|---|---|
| `HeroRotator` (novo, `components/shared/`) | Client | Recebe `Foto[]`, faz o crossfade e o zoom e pausa com aba oculta ou movimento reduzido |
| `PhotoCarousel` (novo, `components/shared/`) | Client | Faixa com scroll-snap, setas sempre visíveis, teclado e legenda abaixo |
| `HojeStrip` (de `hero-board.tsx`) | Client | Aulas de hoje com "agora" destacado, usado em Horários |
| `Photo` (alterado) | Server | Sem borda nem raio padrão |
| `hero.tsx`, `modalidades.tsx`, `horarios.tsx`, `professores.tsx`, `sobre.tsx`, `contato.tsx`, `header.tsx`, `footer.tsx` | — | Recomposição descrita acima |

Agrupar o horário de funcionamento é lógica pura: uma função em `lib/content/` (ex.: `agruparFuncionamento`) **com teste unitário** (RULES: toda função de `lib/` tem teste).

## Testes (Definition of Done, 3 targets do Playwright)

- **E2E carrossel:** setas visíveis e clicáveis sem hover em Mobile Chrome e Mobile Safari (toque), navegação por teclado no desktop, e a primeira e a última posição desabilitando a seta correspondente.
- **E2E scroll horizontal:** nenhum overflow horizontal da página em 3 larguras (375, 768 e 1440), com o carrossel presente.
- **E2E movimento reduzido:** com `reducedMotion: 'reduce'`, o hero mostra uma única foto visível e não troca após 7 s.
- **E2E Horários:** a faixa "HOJE" está presente na seção `#horarios` e ausente no hero.
- **E2E eyebrows:** no máximo 3 eyebrows na home.
- **Unitário:** `agruparFuncionamento` (caminho feliz, dia fechado, todos iguais e todos diferentes).
- **Unitário:** validação de `media.ts`, garantindo que todo `src` existe em `public/` e todo `alt` é não vazio.
- **Testes existentes:** `home.spec.ts` e `header` continuam verdes. Ajustar só o que depender da barra do topo ou do quadro no hero.
- **Lighthouse ≥ 95** nas 4 categorias (preset desktop, como o gate atual), com o LCP sendo a primeira foto do hero.
- **Revisão `web-design-guidelines`** nos arquivos alterados antes do PR.
- **Screenshots de antes e depois** (playwright-cli) anexados ao PR, em desktop e mobile.

## Portões humanos acionados (SDD §11)

- **Portão 1:** novo subtexto do hero, título de Professores e remoção de travessões nos textos de professores. Aprovação explícita antes do merge.

## Fora de escopo

Retratos da equipe, nova seção de comunidade, mudança de paleta, fontes ou logo, modo escuro, vídeo e mudança de preço ou conteúdo de planos.

## Commits (um por seção, SDD §12)

1. `chore: pipeline de otimização de fotos e media config (SDD §4)`
2. `refactor: Photo sem borda/raio padrão`
3. `feat: hero com fotos rotativas e stack enxuto (SDD §4)`
4. `feat: faixa HOJE em Horários (SDD §4)`
5. `feat: Modalidades em dois blocos com foto (SDD §4)`
6. `feat: Sobre com carrossel do espaço (SDD §4)`
7. `feat: Contato com funcionamento agrupado (SDD §4)`
8. `refactor: header/footer sem barra de topo, eyebrows e rótulos de CTA`
9. `docs: CLAUDE.md e tasks.md com o desvio do quadro HOJE`

Sem assinatura ou co-autoria de IA nos commits nem no PR (RULES #8).

---

## Iteração 2 — direção imersiva (decisão do usuário, 2026-10-07)

Depois de ver a versão anterior, o usuário comparou com SmartFit/Bluefit e pediu um salto ("pode perder muita coisa, mas deixa algo foda"). Decisões:

1. **Hero imersivo em tela cheia:** as 3 fotos do `HeroRotator` ocupam a viewport inteira (`min-h-[100dvh]`), com uma camada azul Flex sólida por cima para leitura (cor com opacidade, sem gradiente), título branco enorme em 3 linhas ("Musculação / e aulas com / professor em sala.", "em sala" em azul-claro) e **um único botão, "Ver planos"** (rola para `#planos`). Isto revoga, só para o hero e para a faixa de foto abaixo, a regra "nada sobreposto às fotos"; placas, quadros, chips e legendas sobre foto continuam proibidos.
2. **CTA sem duplicidade:** o header mantém "Quero treinar agora" (WhatsApp) sempre visível; o hero não repete esse botão.
3. **Header transparente sobre o hero:** links e logo sobre a foto; ao sair do hero vira branco sólido. Em páginas sem hero imersivo (ex.: `/privacidade`) é sempre sólido.
4. **Página com mais contraste (pivô do tema claro de agosto):** Modalidades em azul profundo com texto branco; nova faixa de foto em largura total (cardio com vista) com "05:00 às 23:00 / segunda a quinta" lido de `content/funcionamento.json`, com parallax leve via CSS (desligado em movimento reduzido); Sobre em azul Flex com texto branco; Planos, Professores e Contato claros; títulos de seção maiores (~72px no desktop). `CLAUDE.md` ganha nota do novo pivô.
5. Continua valendo: sem gradiente/brilho/vidro, sem foto de pessoa gerada por IA, contraste AA (título sobre foto medido nas 3 fotos), ≤3 eyebrows, movimento reduzido respeitado, touch sem hover.

# tasks.md — o que falta pra terminar o site

> Checklist de acompanhamento das etapas do `SDD.md §12`. Cada etapa é revisável e commitável isoladamente — não pular pra etapa seguinte com a anterior quebrada ou sem teste. Itens marcados **BLOQUEADO** não podem ser codados até a decisão apontada existir; ver `RULES.md` Regra 0 e `SDD.md` §11 (portões de revisão humana).

## Já feito

- [x] Etapa 1 — Setup do projeto (Next.js 16, TS strict, Tailwind v4, lint/test, `.env.example`)
- [x] Etapa 2 — Design tokens (Flex Blue institucional extraída do logo real, tipografia Oswald/Inter/IBM Plex Mono, tema único) + primitivos do design system (Button, Badge, Eyebrow, SectionHeading, Panel, Marquee)
- [x] Etapa 3 — Camada de conteúdo (`content/*.json` + validadores Zod em `lib/content/`, 38 testes, integridade referencial modalidade↔professor)

> **Realinhamento com o layout do cliente (2026-08-18, segunda rodada):** o cliente pediu explicitamente pra seguir o `index_1.html`/`privacidade.html` originais como fonte de verdade de estrutura, não a versão reorganizada pelo SDD. Mudanças feitas:
> - Ordem da home voltou a ser Hero → Marquee → **Promo** → Planos → Modalidades → Horários → Professores → Sobre → Contato (Planos antes de Professores) — desvio deliberado do `SDD.md §4`, decidido pelo cliente depois de ver as duas versões.
> - Seção **Comunidade** removida (não existia no layout do cliente; era exigência do SDD, cliente decidiu não incluir agora).
> - **Botão flutuante de WhatsApp** adicionado (`WhatsappFloat`, em todas as páginas) — existia no protótipo, tinha ficado de fora.
> - **Faixa de campanha** (`Promo`) implementada e ativada com os dados reais do protótipo (Dia dos Pais, R$9,90) — schema de `content/campaign.json` expandido pra guardar o texto da faixa. Cor isolada (`--campaign-accent`), não o gradiente azul institucional do protótipo original — SDD.md §9 registra esse gradiente como bug já corrigido antes, então essa parte não foi revertida.
> - **Bug achado ao ativar a campanha**: `content/planos.json` já tinha `campanhaAtiva:true`/`discountPct:0.1` nos planos Mensal/Anual de uma sessão anterior — isso ficou invisível enquanto a campanha estava desligada, e ao ligar a campanha da Promo passou a aplicar 10% de desconto nos cards de plano, o que não existe no protótipo (preço fixo) nem tem relação com a oferta real da faixa (R$9,90 no primeiro mês, não 10% recorrente). Desliguei `campanhaAtiva` nos dois planos pra não aplicar desconto não-confirmado.
> - **Pendência não resolvida**: os nomes/preços dos planos em `content/planos.json` (Mensal R$129/Anual R$99,90/Família) **não batem** com os 3 planos do protótipo original (12 meses R$129, 6 meses R$159, Mensal R$189) — não mexi nisso porque é dado de preço real, não decido sozinho qual dos dois é o vigente (RULES.md #2 e #7). Confirmar qual estrutura de planos é a atual antes de publicar.

## Etapa 4 — Componentes de seção

Ordem da home fixada no `SDD.md §4`. Cada seção só é commitada depois de passar Playwright nos 3 targets (Desktop Chrome, Mobile Chrome, Mobile Safari) e do checklist do `RULES.md` ("Antes de abrir PR"). Um commit por seção, não um commit gigante.

> **Pivô de tema (2026-08-18):** todo o design system migrou de tema escuro pra tema claro ("papel", quadro de avisos) — ver nota em `CLAUDE.md`. As seções abaixo foram implementadas nesse pivô, todas de uma vez (fora do ritmo "um commit por seção" original) porque vieram como conversão de um protótipo HTML de referência já pronto. Rodado nesta sessão: `lint` + `typecheck` + `vitest` (47 testes) + `next build`, todos verdes, e `e2e/` (36 testes: header + `home.spec.ts` novo cobrindo scroll horizontal, presença de todas as seções, filtro de horários por toque, navegação pra `/privacidade`) nos 3 targets. **O que `home.spec.ts` cobre é o essencial de regressão, não é cobertura seção-a-seção completa** — Planos (cálculo de preço na tela), Professores, Modalidades e Contato ainda não têm teste E2E dedicado; tratar como pendência antes de considerar cada seção "pronta" pelo checklist do `RULES.md`.

- [x] **Header** — sticky, topbar institucional (desde 1992 · cidade), nav com âncoras (agora inclui Contato, que faltava), logo, chip "aberto agora" (`content/funcionamento.json`, novo), CTA WhatsApp. Menu mobile via Radix Dialog.
- [x] **Hero** — H1 + copy + CTA duplo + quadro "Hoje" (elemento de assinatura: aulas de hoje com destaque pra que está rolando agora) + stats (anos, nº de modalidades, nº de professores — todos lidos de `content/`, nunca hardcoded). Colagem de fotos do brief original virou o quadro de horário; segue sem foto real (placeholder explícito).
- [x] **Marquee de modalidades** — componente `Marquee` já pronto, alimentado por `getModalidades()`.
- [x] **Professores** — **desvio do spec, sinalizando aqui:** em vez de carousel em loop infinito + modal, virou grid responsivo simples. Motivo: hoje só há 3 profissionais confirmados (Flávio, Vanessa, Gustavo — todos Musculação) e um loop infinito com 3 itens fica visualmente quebrado; um modal pra 3 bios curtas era complexidade sem ganho. `content/professores.json` ficou com 11 entradas (3 reais + 8 placeholder cobrindo as outras modalidades, necessário pra `integrity.test.ts` continuar passando — SDD §5) mas a home só renderiza os 3 confirmados, com nota textual sobre o resto. **Revisitar carousel/modal quando o roster passar de ~6-8 pessoas confirmadas.**
- [x] **Comunidade** — sem fotos/eventos reais ainda (nada levantado do Instagram), então a seção ficou honesta sobre isso em vez de inventar legenda/evento: 3 placeholders de foto + link pro Instagram real.
- [x] **Planos** — usa `getPlanos()` + `calcularPrecoFinal()`. Badge de campanha só aparece com `campaign.active` (hoje `false`).
- [x] **Modalidades** — grid com ícone próprio por modalidade via `lucide-react` (Dumbbell, Flower2, Music4, Disc3, Zap, Footprints, Waves, Activity, PersonStanding — 9 ícones distintos, nenhum reaproveitado).
- [x] **Horários** — desktop mostra a grade completa da semana sempre (coluna de hoje destacada); mobile filtra por abas de dia tocáveis (não só clique no `<th>` como o `SDD.md` descrevia — abas full-touch cobrem melhor a Regra Absoluta 5 do `RULES.md`).
- [x] **Sobre** — selo "fundada em 1992" + texto institucional + placeholder de foto (fachada/equipe).
- [x] **Contato** — endereço, horário completo, mapa (embed Google Maps sem API key), CTA WhatsApp. Endereço/CNPJ/WhatsApp continuam como candidatos de dev não confirmados (ver `.env.local`, `src/config/site.ts`) — **não publicar em produção sem confirmação explícita do cliente** (`RULES.md` #7).
- [x] **Footer** — navegação, contato, CNPJ, redes sociais, crédito "Desenvolvido por MoraesStudio", link pra `/privacidade`.
- [x] **Privacidade** — página própria em `/privacidade` (antes era HTML solto fora do Next), lê dados de `siteConfig` em vez de duplicar.

## Etapa 5 — Sistema de campanhas sazonais

Isolado, só depois de Etapa 4 fechada. Requisito não-negociável (`SDD.md §9`, `RULES.md` Regra Absoluta 3): cor institucional (`--primary`/`--accent`/`--ring`) nunca muda com campanha ativa — só o token `--campaign-accent`, já isolado desde a Etapa 2. Teste automatizado obrigatório garantindo isso (o protótipo de referência tinha exatamente esse bug — cor de campanha vazando pro institucional — corrigido na Etapa 2, não pode voltar aqui).

- [ ] Catálogo de campanhas (Outubro Rosa, Black Friday) — decidir se vai pra `content/` ou fica em código (`SDD.md §9` deixa em aberto, mas menciona "tabela de acentos sazonais" como dado).
- [ ] Banner, badge no header, faixa promocional, selo de desconto — só nesses elementos, nunca em botão/link genérico.
- [ ] Teste: `campaign.active = false` remove 100% dos elementos sem rastro (sem espaço reservado, sem cor residual).
- [ ] Teste: cor institucional idêntica com campanha ativa e inativa (snapshot ou assert de computed style).

## Etapa 6 — Pagamento online (Rede ou Cielo)

**BLOQUEADO** — não começar a codar o endpoint de pagamento (`SDD.md §8`) até o cliente responder:
1. Rede ou Cielo (ver `estudo-pagamento-online-rede-cielo.md`, se existir, ou revisar de novo).
2. Cobrança recorrente automática vs. avulsa mensal — muda a complexidade da integração inteira.

Quando desbloqueado: `lib/payments/` isola a chamada atrás de `criarLinkDePagamento(plano): Promise<{url: string}>`, chave secreta só em variável de ambiente sem `NEXT_PUBLIC_`, nunca em `.env` versionado, sempre via `.env.test` (sandbox) primeiro. Portão de revisão humana 3 do `SDD.md §11` (revisão de segurança) obrigatório antes de credencial real.

## Etapa 7 — CI/CD

- [ ] GitHub Actions: `lint` + `typecheck` + `test` + `test:e2e` (3 targets) em todo PR.
- [ ] Gate de Lighthouse 95+ em Performance/Accessibility/Best Practices/SEO antes de merge pra `main` (`SDD.md §3`).
- [ ] `.env.test` injetado só nos jobs de teste — nenhum secret de produção acessível a workflow que o agente possa disparar sozinho (`RULES.md`).

## Etapa 8 — Deploy

**BLOQUEADO** — precisa de acesso à conta Vercel do cliente/estúdio (credencial que este agente não tem e não deve ter, por política do próprio `RULES.md`: agente só toca `.env.local`/`.env.test`, nunca ambiente de produção).

- [ ] Deploy inicial na Vercel.
- [ ] Variáveis de ambiente de produção configuradas direto no painel Vercel (nunca no repo).
- [ ] Confirmar domínio (`academiaflex.com.br`, hoje só placeholder em `.env.example`).

## Pendências transversais (não travam etapa, mas precisam de decisão do cliente antes de produção)

- [x] ~~WhatsApp~~ — confirmado pelo cliente em 2026-08-18 (+55 11 93918-2762), `.env.local`/`.env.example` atualizados.
- [x] ~~CNPJ~~ — confirmado pelo cliente em 2026-08-18.
- [ ] Endereço (R. das Hortênsias, 104 — Vila Helena) segue como candidato do protótipo, **ainda não confirmado**.
- [ ] Data exata de fundação — bio do Instagram cita 1992, `SDD.md §1` pede confirmação antes de publicar.
- [ ] Bio + foto real dos professores confirmados sem foto ainda (Flávio, Vanessa, Gustavo) e dos 8 pendentes de questionário em `content/professores.json`.
- [ ] Fotos reais: `src/config/media.ts` (hero, sobre, comunidade) e `professor.fotoUrl` em `content/professores.json` são os únicos lugares a editar quando as fotos chegarem — nenhum componente precisa mudar (`<Photo>` alterna sozinho entre placeholder e imagem real, mesma moldura, zero layout shift). Nenhuma gerada por IA nem banco de imagem (`CLAUDE.md`).
- [ ] Confirmar se a limitação da API Next Fit (só leitura) continua válida antes de qualquer feature que dependa dela (`SDD.md §11` portão 5).

### Passe de SEO/deploy-readiness (2026-08-18)

Motivado por: site sendo usado como prova de "negócio ativo" pro Meta Business Manager — precisa aparecer bem quando o link é compartilhado/verificado, não só funcionar.

- [x] Metadata completa no `layout.tsx` raiz: title template, OG (`type`, `locale`, `siteName`, imagem), Twitter card, `robots`, `canonical` via `metadataBase`.
- [x] `opengraph-image.tsx` — gráfico de marca gerado em runtime (Satori/`next/og`), não foto — usa cores institucionais + wordmark, é o preview que aparece ao compartilhar o link no WhatsApp/Instagram.
- [x] `robots.ts` + `sitemap.ts` (convenção App Router).
- [x] Slot pra tag de verificação de domínio do Meta Business Manager (`NEXT_PUBLIC_META_DOMAIN_VERIFICATION`, opcional) — só preencher quando o domínio real for cadastrado lá.
- [ ] **Pendente do usuário antes do deploy**: `NEXT_PUBLIC_SITE_URL` em produção precisa ser o domínio real (hoje `academiaflex.com.br` é placeholder em `.env.example`) — `metadataBase`, OG e sitemap todos dependem dela pra gerar URL absoluta correta.
- [ ] Deploy em si continua bloqueado por falta de acesso à conta Vercel do cliente (Etapa 8) — igual antes, esse agente não deve ter essa credencial.

## Nota de ambiente

Atualização 2026-08-18: WebKit (Mobile Safari) **já roda neste ambiente** — a limitação de libs de sistema (`libgtk-4`, `libmanette`) descrita aqui antes não se confirmou mais; os 36 testes de `e2e/` passaram nos 3 targets (Desktop Chrome, Mobile Chrome, Mobile Safari) nesta sessão. Se isso voltar a falhar em outra máquina/CI, tratar como configuração de ambiente, não reintroduzir a suposição de bloqueio permanente sem checar de novo.

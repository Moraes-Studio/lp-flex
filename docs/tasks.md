# tasks.md — o que falta pra terminar o site

> Checklist de acompanhamento das etapas do `SDD.md §12`. Cada etapa é revisável e commitável isoladamente — não pular pra etapa seguinte com a anterior quebrada ou sem teste. Itens marcados **BLOQUEADO** não podem ser codados até a decisão apontada existir; ver `RULES.md` Regra 0 e `SDD.md` §11 (portões de revisão humana).

## Já feito

- [x] Etapa 1 — Setup do projeto (Next.js 16, TS strict, Tailwind v4, lint/test, `.env.example`)
- [x] Etapa 2 — Design tokens (Flex Blue institucional extraída do logo real, tipografia Oswald/Inter/IBM Plex Mono, tema único) + primitivos do design system (Button, Badge, Eyebrow, SectionHeading, Panel, Marquee)
- [x] Etapa 3 — Camada de conteúdo (`content/*.json` + validadores Zod em `lib/content/`, 38 testes, integridade referencial modalidade↔professor)

## Etapa 4 — Componentes de seção

Ordem da home fixada no `SDD.md §4`. Cada seção só é commitada depois de passar Playwright nos 3 targets (Desktop Chrome, Mobile Chrome, Mobile Safari) e do checklist do `RULES.md` ("Antes de abrir PR"). Um commit por seção, não um commit gigante.

- [x] **Header** — sticky, nav com âncoras, logo, CTA WhatsApp. Menu mobile via Radix Dialog (drawer lateral, fecha por toque/Escape/seleção de item), testado nos 2 targets Chromium (WebKit bloqueado neste ambiente por libs de sistema faltando, ver nota no fim do arquivo).
- [ ] **Hero** — H1 + copy + CTA duplo + colagem de fotos (placeholders explícitos, `fotoUrl: null` em todo `content/*.json` por enquanto — política de fotografia do `CLAUDE.md`) + stats (30+ anos, 9 modalidades, 9 professores, lidos de `content/`, nunca hardcoded).
- [ ] **Marquee de modalidades** — usa o componente `Marquee` já pronto, alimentado por `getModalidades()`.
- [ ] **Professores** — carousel em loop infinito escalável (`content/professores.json`, hoje 9, precisa aguentar 50+ sem mudar código). Hover-reveal com alternativa por toque/foco (Regra Absoluta 5 do `RULES.md` — já causou bug real em produção neste projeto). Modal com bio completa.
- [ ] **Comunidade** — grid de eventos reais do Instagram (fotos pendentes — placeholder explícito até existir arquivo real).
- [ ] **Planos** — usa `getPlanos()` + `calcularPrecoFinal()` (já testado). Card em destaque (`destaque:true`), badge de campanha só aparece com `campaign.active`.
- [ ] **Modalidades** — grid com ícone próprio por modalidade (`content/modalidades.json` já valida ícone não-reaproveitado). Falta desenhar/escolher o set de ícones SVG real — hoje só existe a *key* (`"flex-training"`, `"zumba"` etc.), não o SVG.
- [ ] **Horários** — grade filtrável por dia clicando no cabeçalho (`getHorarios()` já resolve `profId` pela modalidade). Testar explicitamente em touch — filtro por clique no `<th>` precisa ter equivalente tocável.
- [ ] **Sobre** — citação + texto institucional + foto de equipe (placeholder até existir foto real).
- [ ] **Contato** — endereço, horário, mapa, CTA WhatsApp. **BLOQUEADO parcialmente**: endereço e horário de funcionamento precisam confirmação do cliente antes de publicar (`RULES.md` #7 — já houve dois números de WhatsApp conflitantes achados em fontes diferentes neste projeto). O protótipo trouxe um número (`5511939182762`) e um endereço (Rua das Hortênsias, 104 — Vila Helena) como candidatos; usar como placeholder de desenvolvimento, não publicar em produção sem confirmação explícita.
- [ ] **Footer** — mapa do site, dúvidas/contato, crédito "Desenvolvido por MoraesStudio".

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

- [ ] Data exata de fundação — bio do Instagram cita 1992, `SDD.md §1` pede confirmação antes de publicar.
- [ ] Bio + foto real de cada um dos 9 professores (hoje 100% placeholder em `content/professores.json`).
- [ ] Fotos reais de: hero (colagem), comunidade (eventos), sobre (equipe), mapa. Nenhuma gerada por IA nem banco de imagem (`CLAUDE.md`).
- [ ] WhatsApp e endereço — confirmação final antes de publicar (ver Etapa 4 → Contato acima).
- [ ] Confirmar se a limitação da API Next Fit (só leitura) continua válida antes de qualquer feature que dependa dela (`SDD.md §11` portão 5).

## Nota de ambiente

Este ambiente de desenvolvimento não tem as libs de sistema que o WebKit do Playwright precisa (`libgtk-4`, `libmanette` etc.) e instalá-las exige `sudo` interativo, que o agente não tem aqui. Todo `test:e2e` rodado durante o desenvolvimento até agora cobriu só Desktop Chrome + Mobile Chrome; Mobile Safari (WebKit) precisa ser confirmado em CI (Etapa 7) ou localmente por alguém com acesso a `sudo`, antes de qualquer seção ser considerada realmente "pronta" nos 3 targets exigidos pelo `RULES.md`.

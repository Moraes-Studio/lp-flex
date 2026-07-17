# Academia Flex

Site institucional da Academia Flex — academia de bairro na Vila Helena, Santo André, desde 1992. Objetivo: gerar lead qualificado via WhatsApp, comunicando o diferencial real do negócio (professor presente na sala em todo treino, sem cobrança de personal à parte).

Desenvolvido pela [MoraesStudio](https://github.com/Moraes-Studio).

## Documentação

Antes de mexer em qualquer coisa, ler nesta ordem:

1. [`docs/SDD.md`](docs/SDD.md) — o quê construir: spec, contratos de dados, regras de negócio e de conteúdo.
2. [`docs/RULES.md`](docs/RULES.md) — como construir: guardrails, política de env, arquitetura de módulos, definição de "pronto".
3. [`CLAUDE.md`](CLAUDE.md) — convenções de projeto e como dividir trabalho entre agentes.
4. [`docs/tasks.md`](docs/tasks.md) — **o que já foi feito e o que falta**, etapa por etapa, com o que está bloqueado por decisão do cliente.

Esse README não repete o conteúdo desses arquivos — é só o ponto de entrada.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · shadcn/ui · Zod · Vitest · Playwright.

## Como rodar

```bash
npm install
npm run dev          # ambiente local — http://localhost:3000
npm run build         # build de produção
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm run test            # vitest (unitário)
npm run test:watch       # vitest em modo watch
npm run test:e2e          # playwright — Desktop Chrome, Mobile Chrome, Mobile Safari
npm run format              # prettier --write .
```

`npm run dev` lê `.env.local`; `npm run test:e2e` lê `.env.test`. Nenhum dos dois deve conter credencial real — ver `docs/RULES.md`.

## Estrutura

```
content/            conteúdo editável (JSON), validado em runtime por src/lib/content/
docs/                spec (SDD), guardrails (RULES) e checklist de progresso (tasks)
e2e/                  testes Playwright
public/                assets estáticos (logo, fotos reais)
src/app/                 rotas (App Router)
src/components/ui/        primitivos do design system (shadcn-style)
src/components/shared/     componentes reutilizáveis sem lógica de negócio
src/components/layout/      header, footer, nav
src/components/sections/     seções da home (Hero, Professores, Planos...)
src/config/                   env validado, siteConfig, navegação
src/lib/content/                leitura + validação do conteúdo (nunca importa de app/)
src/lib/payments/                 integração de pagamento (Etapa 6, ainda não iniciada)
```

## Status atual

Setup, design tokens/design system e camada de conteúdo prontos. Componentes de seção em andamento (Header feito; Hero é o próximo). Ver [`docs/tasks.md`](docs/tasks.md) pra lista completa e o que está bloqueado aguardando decisão do cliente (gateway de pagamento, confirmação de WhatsApp/endereço, acesso à Vercel).

## Licença

Ver [`LICENSE`](LICENSE).

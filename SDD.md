# SDD — Academia Flex

> Este documento é a fonte da verdade do projeto. Qualquer ambiguidade encontrada durante a implementação deve ser resolvida consultando este arquivo — e se não estiver aqui, a implementação para e pergunta, não assume. Ver `RULES.md` para os guardrails do agente que vai codar em cima deste spec.

## 1. Visão geral

**O quê:** site institucional em Next.js pra Academia Flex, academia de bairro na Vila Helena, Santo André, com mais de 30 anos de mercado (bio oficial do Instagram cita 1992 — confirmar com o cliente antes de publicar a data exata).

**Pra quem:** cliente ideal declarado pelo dono é mulheres 40+. Site precisa funcionar bem em celular antes de qualquer coisa — é o dispositivo principal desse público.

**Objetivo de negócio:** gerar lead qualificado via WhatsApp. Matrícula 100% automática está fora de escopo nesta fase (ver seção 6, Next Fit).

**Diferencial real do negócio** (não é opinião de copywriting, é fato validado com o cliente): a Flex compete com SmartFit, Panobianco, Bluefit e Red Target não por preço nem estrutura — perde nas duas. Vence por relação: professor presente na sala em todo treino, orientando o grupo, sem que o aluno precise contratar personal pra ter acompanhamento. Ver seção 7 (regras de conteúdo) pra como isso deve e não deve ser comunicado — essa seção existe porque já erramos essa mensagem várias vezes ao longo do projeto.

## 2. Fora de escopo (nesta fase)

- Matrícula com liberação de acesso 100% automática (bloqueado pela limitação da API Next Fit — ver seção 6).
- Cobrança recorrente automática no cartão — depende de definição do cliente (ver seção 8).
- Painel administrativo custom — conteúdo é editado via arquivos JSON versionados no repo, não via CMS visual, até haver justificativa pra investir nisso.
- App mobile nativo.

## 3. Stack técnica

> Desvio documentado (aprovado pelo cliente/dev em 2026-07-17): a versão original desta seção fixava Next.js 14. Alinhado com os projetos irmãos da MoraesStudio (`lp-cibele`, `ms-templete-front`), que já rodam a stack abaixo em produção, o setup deste projeto sobe direto pra ela em vez de partir de uma versão defasada.

- Next.js 16.2.4, App Router, React 19.2.4, TypeScript strict (`"strict": true`, zero uso de `any`).
- Tailwind CSS v4 (`@theme inline` em `globals.css`, sem `tailwind.config.ts`).
- shadcn/ui (Radix + `class-variance-authority` + `tailwind-merge`) como base de componentes de UI — `components/ui/` só recebe componente gerado via shadcn, sem lógica de negócio.
- Imports sempre via alias `@/`.
- Validação de todo JSON de conteúdo com type guards explícitos (ver seção 5) — nunca `as Tipo` sem validação em runtime.
- Testes: Vitest (unitário) + Playwright (E2E: Desktop Chrome, Mobile Chrome, Mobile Safari — os três, sempre, porque bug relevante já foi só-mobile nesse projeto, ver seção 10).
- Hospedagem: Vercel. CI/CD via GitHub Actions, com Lighthouse mínimo de 95 em Performance/Accessibility/Best Practices/SEO antes de qualquer merge pra main.
- Sem servidor próprio: rotas de API do Next.js (`app/api/.../route.ts`) rodam na Vercel; segredos ficam em variáveis de ambiente sem prefixo `NEXT_PUBLIC_`, nunca chegam ao bundle do cliente.

## 4. Arquitetura de informação

Ordem das seções na home (single-page, âncoras por `id`):

1. Header (sticky, nav + CTA WhatsApp)
2. Hero
3. Marquee de modalidades (loop infinito)
4. Professores (showcase em loop infinito, escalável — ver seção 5)
5. Comunidade (conteúdo real do Instagram: eventos, palestras)
6. Planos (só aparece depois de Professores/Comunidade — vender valor antes de preço)
7. Modalidades (grid com ícone distinto por modalidade)
8. Horários (grade real, filtrável por dia clicando no cabeçalho da própria tabela)
9. Sobre
10. Contato (endereço, horário de funcionamento, mapa, CTA WhatsApp)
11. Footer (marca, mapa do site, dúvidas/contato, crédito "Desenvolvido por MoraesStudio")

Nenhuma seção nova deve ser adicionada sem primeiro checar se ela reforça o diferencial real (seção 1) — se não reforça, questionar se deveria existir.

## 5. Modelo de dados (contratos)

Todo conteúdo editável mora em JSON versionado no repo (`/content/*.json`), lido em build-time. Interfaces abaixo são a definição oficial — o código TypeScript deve derivar tipos delas, não o contrário.

```ts
// content/professores.json
interface Professor {
  id: string;           // slug único, ex: "professor-01"
  num: string;           // "01".."99" — exibido no card
  nome: string;
  papel: string;         // modalidade principal — DEVE bater com um Modalidade.nome existente
  desde: string;         // "na equipe desde 2016"
  bio: string;
  fotoUrl: string | null; // null = usa placeholder, nunca quebra o layout
}

// content/planos.json
interface Plano {
  id: string;
  nome: string;
  descricao: string;
  precoBase: number | null;   // null = "Sob consulta"
  periodo: string;             // "/mês" ou ""
  beneficios: string[];
  destaque: boolean;           // no máximo 1 plano com destaque:true por vez
  badge?: string;               // só existe se destaque:true
  campanhaAtiva: boolean;       // esse plano participa de desconto de campanha?
  discountPct: number;          // 0 a 1. Preço final = precoBase * (1 - discountPct), calculado em runtime, NUNCA hardcoded
  obs?: string;
}

// content/modalidades.json
interface Modalidade {
  nome: string;
  icone: string; // referência ao ícone SVG — cada modalidade tem ícone PRÓPRIO, nunca reaproveitado entre duas modalidades diferentes
}

// content/horarios.json
interface AulaSlot {
  time: string;      // "HH:MM"
  day: "Seg"|"Ter"|"Qua"|"Qui"|"Sex"|"Sáb"|"Dom";
  aula: string;       // DEVE bater com um Modalidade.nome existente
  profId: string | null; // referência a Professor.id — o professor daquele horário é resolvido por modalidade (papel), não hardcoded manualmente
}

// content/campaign.json
interface Campaign {
  active: boolean;
  season: string; // chave existente em seasonalAccents
}
interface SeasonalCopy {
  label: string;
  stamp: string;        // selo grande, ex: "BLACK FRIDAY — 10% OFF"
  bannerText: string;
  badgeText: string;
  stripTitle: string;
  stripSub: string;
  countdownTo: string;   // ISO date
}
```

Regra de integridade referencial: `Professor.papel`, `AulaSlot.aula` e `Modalidade.nome` devem ser validados como um conjunto fechado no build (falha o build se um horário referenciar uma modalidade que não existe, ou se uma modalidade não tiver nenhum professor correspondente — esse último cenário já aconteceu neste projeto e passou despercebido até revisão manual).

## 6. Integração Next Fit (gestão/catraca)

Fato confirmado, não é suposição: a API pública do Next Fit **só tem endpoints GET** (agenda, financeiro, contratos, vendas, CRM, clientes). Não existe endpoint de escrita — não dá pra criar matrícula nem liberar acesso pela API. Custo: R$99,90/mês por chave, após 15 dias de teste grátis, ativado pelo cliente no próprio painel Next Fit.

**Implicação de arquitetura:** o CTA "Quero me matricular" não pode ser um checkout com liberação automática de acesso. O fluxo real é: usuário clica, vai pro WhatsApp com mensagem pré-preenchida, equipe fecha matrícula manualmente no Next Fit depois. Qualquer feature que dependa de dado do Next Fit (ex: ocupação em tempo real) fica bloqueada até termos acesso à documentação completa dos endpoints (só abre dentro do painel do cliente, depois de ativado).

## 7. Regras de conteúdo (aprovadas pelo cliente — não são preferência de estilo, são correção de fato)

Essa seção existe porque o mesmo erro de posicionamento apareceu mais de uma vez ao longo do projeto antes de ser corrigido de vez. Ler antes de escrever qualquer copy nova sobre professores.

**O fato real:** os professores da Flex são profissionais formados, tecnicamente aptos a dar personal training. Durante o horário normal de aula, eles orientam a sala inteira (todos os alunos daquele horário), não uma pessoa só — isso está incluso no plano, sem custo extra. Se um aluno quiser um professor exclusivo, um a um, isso é um serviço separado, opcional, contratado à parte.

**Nunca escrever** (implica acompanhamento individual/exclusivo incluído no plano):
- "Ele conhece sua meta" / "Ele ajusta seu treino" / "Seu professor" / "acompanhamento personalizado"
- "sem cobrança de personal" ou qualquer frase que negue categoricamente que existe opção paga de personal (é falso, existe, é opcional)

**Pode escrever:**
- "Professor presente na sala" · "Orientação durante o treino" · "Correção da execução dos exercícios" · "Ajuda sempre que necessário" · "Acompanhamento próximo" · "Treino com orientação"
- Ao mencionar personal exclusivo: deixar claro que é uma opção adicional, contratável à parte, nunca "grátis" nem "sem cobrança"

**Regra de estilo geral:** evitar a construção "não é X, é Y" repetidamente — cansa e soa artificial em texto de marca.

## 8. Pagamento online (Rede ou Cielo — confirmar qual)

Ver `estudo-pagamento-online-rede-cielo.md` pro levantamento completo. Resumo do que vira regra de arquitetura:

- Nunca chamar a API da Cielo/Rede direto do navegador. Toda chamada passa por uma API Route do Next.js (`app/api/pagamento/route.ts`), que roda no servidor da Vercel.
- Chave secreta (ClientSecret ou token) fica em variável de ambiente sem `NEXT_PUBLIC_`, configurada no painel da Vercel, nunca commitada no repo, nunca em `.env` versionado.
- O navegador do aluno só recebe de volta a URL do link de pagamento gerado, nunca dado de cartão, nunca a chave.
- Preço enviado pro gateway de pagamento é sempre lido de `content/planos.json` no servidor (mesmo cálculo de desconto da seção 5), nunca hardcoded num segundo lugar, pra não haver risco de cobrar valor diferente do exibido na tela.
- Pendente de decisão do cliente antes de codar: cobrança recorrente automática vs. avulsa mensal. Muda a complexidade da integração, não começar a codar o endpoint de pagamento sem essa resposta.

## 9. Sistema de campanhas sazonais

Arquitetura obrigatória, já causou retrabalho quando não seguida à risca:

- A cor institucional (botões, links, CTA em geral) nunca muda, campanha ativa ou não. Aprovação explícita do cliente confirmou essa regra depois de uma implementação errada no protótipo.
- A cor sazonal fica isolada numa variável própria, usada só nos elementos que são literalmente a peça de campanha: banner no topo, badge no header, faixa promocional, selo grande, badge de desconto no plano.
- `campaign.active = false` remove 100% dos elementos de campanha sem deixar rastro (sem espaço fantasma reservado, sem cor residual).
- O catálogo de campanhas hoje tem só duas ativáveis (Outubro Rosa, Black Friday) por decisão consciente de escopo — a estrutura de dados aceita mais sem mudar código, só adicionando entradas na tabela de acentos sazonais.

## 10. Testes obrigatórios (Definition of Done por feature)

- Qualquer elemento interativo (botão, seta de carrossel, filtro) precisa funcionar sem `:hover` — testar explicitamente em Playwright com viewport mobile e emulação de touch, não só desktop. Isso não é preventivo, é porque já vazou pra produção uma vez: a seta do carrossel de professores ficou com opacidade zero permanente em touch porque só tinha regra de hover, sem alternativa. Todo componente novo com estado revelado por hover precisa de teste automatizado que falha se o elemento ficar inacessível sem mouse.
- Checar que não existe scroll horizontal indevido em pelo menos 3 breakpoints — problema já aconteceu neste projeto por posicionamento absoluto mal contido.
- Cálculo de preço de plano com campanha ativa e inativa — teste unitário cobrindo: preço volta ao normal quando campanha desliga, desconto aplicado bate matematicamente com o percentual configurado.
- Todo componente com animação respeita a preferência de movimento reduzido do sistema operacional.
- Lighthouse 95 ou mais em Performance, Accessibility, Best Practices, SEO antes de merge.
- Nenhum texto de nota interna (tipo "a confirmar com o cliente", placeholder de debug) pode ficar visível pro usuário final em build de produção, checagem manual antes de cada apresentação ou deploy.

## 11. Portões de revisão humana (harness, spec sozinho não basta)

Cada portão abaixo exige aprovação humana explícita antes de prosseguir, mesmo que o agente ache que está tudo certo:

1. Antes de publicar copy nova sobre professores ou personal, revisar contra a seção 7.
2. Antes de ativar qualquer campanha em produção, confirmar visualmente que a cor institucional não mudou.
3. Antes de conectar credenciais reais de pagamento, revisão de segurança confirmando que nenhum segredo está no bundle do cliente.
4. Antes de publicar número de WhatsApp ou endereço, confirmar com o cliente — o projeto já teve dois números conflitantes encontrados em fontes diferentes.
5. Antes de remover o link de leitura do Next Fit, confirmar que a limitação de API (só leitura) continua válida, caso a Next Fit lance nova versão.

## 12. Build incremental e disciplina de commit

O projeto não é implementado numa tacada só. Cada etapa abaixo é um commit (ou pequeno conjunto de commits) próprio, revisável e revertível isoladamente — se uma etapa quebrar alguma coisa, dá pra identificar exatamente qual commit foi.

**Ordem sugerida de etapas** (cada uma só começa com a anterior fechada e testada):

1. Setup do projeto — Next.js 14 + TypeScript strict + Tailwind, config de lint/test, `.env.test`/`.env.local` de exemplo (sem segredo real).
2. Design tokens — paleta, tipografia, espaçamento, como constantes/config do Tailwind, sem nenhum componente visual ainda.
3. Camada de conteúdo — `content/*.json` + os validadores/type guards da seção 5, com teste unitário cobrindo os casos de erro (JSON mal formado, referência quebrada entre modalidade e professor).
4. Componentes de seção, um de cada vez, na ordem da seção 4 (Header → Hero → Marquee → Professores → Comunidade → Planos → Modalidades → Horários → Sobre → Contato → Footer). Cada seção só é commitada depois de passar Playwright nos 3 targets.
5. Sistema de campanha sazonal, isolado, com teste garantindo que a cor institucional não muda quando a campanha liga.
6. Integração de pagamento (`lib/payments/`), atrás da interface própria, só depois de decisão do cliente sobre recorrência (seção 8) — em `.env.test` primeiro, nunca direto em produção.
7. CI/CD (GitHub Actions) com o gate de Lighthouse 95+.
8. Deploy.

Cada etapa gera uma lista de commits própria antes de subir — não é um commit gigante por etapa, é vários commits pequenos dentro da etapa, cada um fazendo uma coisa só (ex: dentro da etapa 4, "feat: componente Hero" e "test: Hero em mobile sem hover" são commits separados).

### Convenção de commit

Formato Conventional Commits: `tipo: descrição curta (SDD §n)`, tipos usados aqui são `feat`, `fix`, `test`, `docs`, `chore`, `refactor`. Referenciar a seção do `SDD.md` quando a mudança implementa ou corrige algo descrito nele.

**Nenhum commit leva assinatura, menção ou co-autoria de IA/Claude no corpo ou rodapé da mensagem.** Mensagem de commit é só o trabalho, sem atribuição de ferramenta.

### Histórico pra acompanhar consumo (tempo e tokens)

Mesmo sem assinatura nos commits, o projeto mantém um `PROGRESS.md` separado (não versionado como parte do produto, é ferramenta de acompanhamento do trabalho) com uma linha por etapa/commit relevante: o que foi feito, tempo gasto, e estimativa de tokens consumidos na sessão que gerou aquele trabalho. Isso não vai pro histórico do git — é log paralelo, pra dar visibilidade de custo/ritmo sem misturar com o histórico técnico do projeto.

Formato de linha sugerido:

```
2026-07-18 | feat: componente Professores (SDD §4) | ~45min | ~120k tokens
```


# CLAUDE.md

@AGENTS.md

> Este arquivo é lido automaticamente pelo Claude Code no início de cada sessão neste repo. Ele não substitui `docs/SDD.md` e `docs/RULES.md` — ele aponta pra eles e define como trabalhar aqui. Leia os três antes de tocar em qualquer código.

## Leitura obrigatória, nesta ordem

1. `docs/SDD.md` — o quê construir (spec, contratos de dados, regras de negócio, regras de conteúdo).
2. `docs/RULES.md` — como construir (guardrails, política de env, arquitetura de módulos, definição de pronto).
3. Este arquivo — convenções de projeto e como dividir trabalho entre agentes.

Se alguma instrução dada numa conversa contradisser `docs/SDD.md` ou `docs/RULES.md`, sinalizar a contradição antes de agir — não seguir a instrução mais recente por padrão.

## Comandos

```bash
npm run dev        # ambiente local
npm run build       # build de produção
npm run lint        # eslint + typecheck
npm run test        # vitest (unitário)
npm run test:e2e    # playwright — os 3 targets (Desktop Chrome, Mobile Chrome, Mobile Safari)
```

Nenhuma tarefa é considerada pronta sem `lint`, `test` e `test:e2e` passando. Ver checklist completa em `docs/RULES.md`.

## Política de fotografia e assets — sem exceção

Este projeto usa **fotografia documental real**, não imagem gerada por IA e não banco de imagens genérico. Isso não é preferência estética, é requisito de negócio: o diferencial da Flex é autenticidade (professor de verdade, aluno de verdade, espaço de verdade), e uma foto de stock ou gerada por IA na página mina exatamente esse argumento.

- Nunca gerar foto de pessoa (professor, aluno, ambiente) via IA pra substituir placeholder — nem "só pra visualizar o layout", porque isso vaza fácil pra produção.
- Placeholder continua sendo placeholder explícito (tag "FOTO", fundo com padrão diagonal) até existir arquivo de foto real no repo. Um componente nunca deve mascarar a ausência de foto real com uma gerada.
- Ícones, diagramas e elementos decorativos (SVG de UI) não entram nessa restrição — são elementos de interface, não claim de autenticidade.
- Se a tarefa exigir imagem e não houver foto real disponível, a resposta correta é sinalizar a lacuna, não preencher com substituto sintético.

## Padrão de frontend/UX/UI

Antes de criar ou alterar qualquer componente visual, usar a skill `frontend-design` disponível no ambiente — ela cobre os tokens deste projeto (paleta Flex Blue institucional, tipografia Oswald/Inter/IBM Plex Mono, regras de glass/glow) e evita cair em template genérico de IA (hero com gradiente + 3 cards, glassmorphism em excesso, ícones fora de contexto). Esse padrão de qualidade é não-negociável: o site compete visualmente com SmartFit, Panobianco, Bluefit e Red Target, que têm equipe de design própria — "parece feito à mão" não é aceitável aqui.

Todo componente novo passa pelo mesmo crivo que já filtrou o protótipo em HTML: funciona em touch sem hover, não introduz scroll horizontal, respeita `prefers-reduced-motion`, usa os ícones certos por contexto (nunca reaproveitar ícone de uma modalidade em outra diferente).

## Dividindo trabalho entre agentes

Este projeto ganha em usar agentes especializados em vez de um agente generalista fazendo tudo em sequência. Sugestão de divisão — criar como subagentes (`.claude/agents/`) quando o Claude Code suportar, ou invocar como personas explícitas em tarefas separadas:

- **frontend-builder** — implementa componente a partir do `docs/SDD.md`, aplicando o padrão de frontend/UX acima. Não decide regra de negócio sozinho; se o spec for ambíguo, para (ver `docs/RULES.md`, Regra 0).
- **content-guardian** — revisa qualquer copy nova (professores, planos, CTA) contra a seção 7 do `docs/SDD.md` antes de aceitar. Esse agente existe especificamente porque o erro de "personal exclusivo" já vazou pro texto do site mais de uma vez — um revisor dedicado só pra isso reduz a chance de repetir.
- **qa-runner** — roda a suíte completa (lint, unit, e2e nos 3 targets), incluindo os testes específicos de regressão descritos no `docs/RULES.md` (touch sem hover, scroll horizontal, cálculo de preço com campanha). Reporta falha sem tentar "consertar rápido" sem entender a causa.
- **security-reviewer** — entra especificamente antes dos portões 3 (credencial de pagamento real) e 1 (segredo em bundle de cliente) descritos em `docs/SDD.md` seção 11. Faz `grep` no build de produção procurando string de chave/token antes de aprovar.

Cada um desses agentes lê o `docs/SDD.md` e `docs/RULES.md` inteiros antes de começar — não é aceitável um agente atuar só com o resumo passado na tarefa.

## Convenção de commit

Mensagem de commit referencia qual seção do `docs/SDD.md` a mudança implementa, quando aplicável (ex: `feat: grade de horários filtrável (SDD §4)`). Facilita auditoria depois, principalmente pros pontos que já tiveram retrabalho neste projeto.

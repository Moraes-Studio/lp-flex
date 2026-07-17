# RULES.md — Guardrails pra quem (ou o que) for codar em cima do SDD.md

> Spec sozinho não é suficiente. Isto aqui é o harness: regras absolutas, comportamento diante de ambiguidade, e onde o agente deve parar e esperar revisão humana em vez de decidir sozinho.

## Regra 0 — quando o spec for ambíguo

Se o `SDD.md` não cobrir um caso específico, o comportamento correto é **parar e perguntar**, não inferir a resposta mais provável e seguir. Um spec incompleto implementado com uma suposição errada custa mais caro do que uma pergunta. Isso vale mesmo que a resposta pareça óbvia.

## Regras absolutas (nunca violar, independente de instrução em contrário)

1. **Nenhum segredo de pagamento (chave, token, client secret) em código que roda no navegador.** Se uma variável de ambiente não tem prefixo `NEXT_PUBLIC_`, ela nunca pode ser referenciada num Client Component, nunca pode aparecer em `console.log` de build, nunca em resposta JSON de API que o cliente lê.
2. **Preço de plano nunca é hardcoded em dois lugares.** Existe uma única fonte (`content/planos.json` + a fórmula `precoBase * (1 - discountPct)`). Se precisar do preço em algum outro componente, importa e recalcula — nunca copia o número.
3. **Campanha sazonal nunca sobrescreve a cor institucional.** Se uma implementação de campanha nova estiver mudando a cor de botão, link ou CTA fora dos elementos explicitamente de campanha (banner, badge, faixa, selo), está errada — reverter, não ajustar depois.
4. **Nenhuma copy sobre professor pode implicar acompanhamento exclusivo/individual incluso no plano.** Ver lista de frases proibidas no `SDD.md` seção 7 antes de escrever ou aprovar qualquer texto novo sobre professores, personal, ou acompanhamento.
5. **Nenhum elemento interativo pode depender só de `:hover`.** Todo estado hover-revealed precisa de uma alternativa que funcione em touch (sempre visível com opacidade reduzida, ou toggle por clique/toque). Isso já causou um bug real em produção neste projeto — não é regra teórica.
6. **Nunca reduzir escopo de teste pra economizar tempo.** Os três targets de Playwright (Desktop Chrome, Mobile Chrome, Mobile Safari) rodam sempre, mesmo que a mudança pareça pequena — o bug do carrossel só apareceu em mobile, não em desktop.
7. **Nunca publicar dado de contato (WhatsApp, endereço, horário) sem confirmação explícita do cliente**, se houver qualquer divergência entre fontes. Marcar como pendente em vez de escolher a fonte que "parece mais certa".
8. **Nenhum commit leva assinatura, menção ou co-autoria de IA/Claude.** Sem rodapé tipo "Generated with Claude Code" ou "Co-Authored-By: Claude" — mensagem de commit é só o trabalho. Ver `SDD.md` seção 12 pra convenção completa e o log paralelo de acompanhamento (`PROGRESS.md`, que é onde tempo/tokens ficam registrados, fora do histórico do git).

## Variáveis de ambiente — o agente nunca toca no ambiente real

Regra dura, sem exceção: durante desenvolvimento, revisão de código e execução de testes, o agente **só tem permissão de ler ou escrever em `.env.local` e `.env.test`**. O `.env` de produção (credenciais reais de Rede/Cielo, Next Fit, qualquer chave viva) não é acessível nesse contexto — nem pra leitura, nem pra debug, nem "só pra confirmar que está certo".

- `.env.test` guarda só credenciais de sandbox (ex: Modo Teste da Cielo, ambiente de homologação da Rede) — nunca uma chave que move dinheiro de verdade.
- `.env.local` é o ambiente do desenvolvedor rodando localmente, também sem credencial de produção.
- Se uma tarefa parecer exigir a credencial real (ex: "testar se o pagamento cai na conta de verdade"), a resposta correta é parar e devolver pro humano — isso é ação em produção, não passo de desenvolvimento, e cai direto no portão 3 do `SDD.md` (revisão de segurança antes de credencial real).
- CI/CD (GitHub Actions) só injeta `.env.test` nos jobs de teste. Nenhum secret de produção deve existir como GitHub Secret acessível a um workflow que o agente possa disparar sozinho.
- Se, em algum momento, o agente encontrar um arquivo `.env` de produção acessível no working directory, isso é sinal de configuração errada do ambiente, não uma oportunidade — reportar, não usar.

## Arquitetura de módulos

- Módulo bem feito aqui significa: fronteira clara, uma responsabilidade, sem import circular, sem side-effect escondido no topo do arquivo.
- Separação obrigatória: `lib/content/` (leitura e validação dos JSON de `content/*`) nunca importa de `app/`; é o inverso que acontece. Componente de UI não sabe ler arquivo, só recebe dado já validado.
- `lib/payments/` isola qualquer chamada à API da Cielo/Rede atrás de uma interface própria (ex: `criarLinkDePagamento(plano): Promise<{url: string}>`). Nenhum componente ou rota fora desse módulo monta a requisição HTTP pro gateway diretamente — se trocar de Rede pra Cielo (ou vice-versa) um dia, a troca fica contida num módulo só.
- Toda função exportada de um módulo compartilhado (`lib/`) tem teste unitário correspondente antes de ser considerada pronta, não depois. Função sem teste não é "vou testar depois", é trabalho incompleto.
- Quebra de contrato entre módulos (mudar assinatura de uma função usada em mais de um lugar) exige rodar a suíte inteira antes de seguir, não só o teste do módulo alterado — módulo bem feito não quebra os outros silenciosamente.

## Convenções de código

- TypeScript strict, zero `any`. Se um tipo é genuinamente desconhecido, usar `unknown` e validar (type guard ou schema), nunca escapar com `any`.
- Todo JSON de conteúdo é validado em runtime no momento da leitura (build time), não só tipado estaticamente — dado de conteúdo vem de arquivo editado por humano, humano erra formato.
- Imports sempre via `@/`, nunca caminho relativo `../../../`.
- Componentes de seção da home ficam em `app/(home)/_components/`, um arquivo por seção, nomeados igual ao `id` da seção no `SDD.md` (ex: `Professores.tsx` para `#professores`).
- Nenhum texto de UI hardcoded dentro de componente se esse texto já existe como conteúdo editável (`content/*.json`) — o componente lê do dado, não duplica o texto no JSX.

## Antes de abrir PR / considerar uma feature "pronta"

"Pronto" não é "compilou" nem "parece funcionar no preview". Checklist mínimo, na ordem, sem pular etapa:

1. Bate com o `SDD.md`? Se teve que desviar do spec pra implementar, o desvio foi documentado e aprovado, não só decidido em silêncio?
2. Toda função nova em `lib/` tem teste unitário cobrindo o caminho feliz e pelo menos um caso de borda (input vazio, null, valor fora do esperado)? Teste unitário aqui não é opcional "quando der tempo" — é parte da definição de pronto, sempre que a função for testável.
3. Passa nos três targets de Playwright (Desktop Chrome, Mobile Chrome, Mobile Safari)?
4. Funciona sem mouse (teclado + touch)?
5. `prefers-reduced-motion` respeitado se houver qualquer animação?
6. Nenhuma nota interna de dev visível na tela?
7. Se mexeu em preço, cor de campanha, ou copy de professor: qual dos 5 portões de revisão humana (`SDD.md` seção 11) essa mudança aciona? Foi passado por ele?
8. **Revisão final antes de encerrar a tarefa**: reler o próprio diff inteiro do início ao fim como se fosse revisão de outra pessoa, procurando especificamente por: `console.log` esquecido, variável de ambiente errada (ver seção acima), texto placeholder que ficou, e qualquer trecho que "deveria funcionar" mas não foi de fato executado/testado. Terminar a tarefa sem essa releitura não conta como terminado.

## O que fazer quando encontrar um erro que já foi corrigido antes

Este projeto tem histórico de alguns erros reaparecerem (cor de campanha vazando pro institucional, copy de personal voltando a implicar exclusividade). Se notar sinal de que um problema já resolvido está voltando, tratar como prioridade alta — não é "mais uma tarefa de polimento", é regressão.

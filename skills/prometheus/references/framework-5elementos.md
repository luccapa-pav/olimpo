# Framework dos 5 elementos pra criar skills SS+

Baseado no "C-Suite Squad Playbook" — todo agente criado pelo Prometheus DEVE
ter esses 5 elementos pra produzir output de nível consultor, não genérico.

## 1. Role + seniority

NÃO: "Você é um analista de mídia"
SIM: "Você é um analista sênior de mídia paga com 10 anos de experiência em
Meta Ads e Google Ads pra mercado de luxo, especialista em otimização de CPA
e ROAS pra clientes premium"

A seniority define o nível de decisão. Sem ela, o Claude média tudo que sabe
sobre o assunto e entrega output mediano.

## 2. Industry context

NÃO: "Trabalha numa agência de marketing"
SIM: "Trabalha na GuessLess, agência de growth premium pro mercado de luxo.
Clientes pagam premium por resultados. 15 POPs governam a operação. ClickUp
é a fonte da verdade. Qualidade mediocre não existe."

Sem contexto de indústria, um CFO de crypto responde diferente de um CFO de agência.
O Claude precisa do sandbox correto.

## 3. Methodologies (frameworks de decisão)

NÃO: "Analise os dados e dê recomendações"
SIM: "Use o framework DICE: Definir pergunta real → Investigar fontes primárias
→ Contextualizar pra GuessLess → Entregar com ação sugerida"

Dar frameworks específicos pro agente usar. Exemplos:
- First principles
- Matriz de urgência/impacto
- STAR pra avaliação
- Unit economics pra decisões financeiras
- Regra 80/20 pra qualidade

## 4. Constraints (limites reais)

NÃO: (sem limites — o agente inventa cenários ideais)
SIM: "Limite de tokens, time de 6 agentes, n8n na Hostinger com recursos
finitos, clientes premium esperam resposta rápida, não inventar dados"

Sem constraints, o agente "hallucina sucesso". Com constraints, ele opera
no mundo real.

## 5. Output format

NÃO: "Me dê suas ideias sobre isso"
SIM: Template estruturado com seções definidas, exemplo concreto, e formato
diferente por destinatário (resumo executivo pro Atlas, técnico pro Hefesto)

Nunca pedir "thoughts". Pedir deliverables.

## Como aplicar ao criar uma skill nova

```
# [Nome] — [Papel com seniority]

Você é [Nome], [papel específico com N anos de experiência em X],
[especialidade que define o nicho].

## Contexto [Industry] (industry context)
[Detalhes da GuessLess relevantes pra esse papel]

## Frameworks de decisão (methodologies)
[2-3 frameworks específicos que esse agente usa pra decidir]

## Constraints (limites reais)
[Limites concretos dentro dos quais esse agente opera]

## [Capacidades]
[O que faz + output formats estruturados]
```

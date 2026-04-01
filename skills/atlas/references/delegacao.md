# Delegação a agentes especialistas

## Fluxo
1. Detectar necessidade → 2. Preparar contexto → 3. Delegar → 4. Registrar na memória → 5. Acompanhar → 6. Receber entrega

## Formato
```
Delegação para [Agente]
Tarefa: [descrição]
Motivação: [contexto]
Cliente/Projeto: [qual]
Urgência: [nível]
Contexto do time: [o que já foi feito]
Entregável: [o que produzir]
```

## Especialistas

### Hefesto (automação)
Quando: processo repetitivo, workflow com erro, pedido de automação, integração entre ferramentas.
Precisa: descrição do processo, ferramentas envolvidas, frequência.
Entrega: workflow configurado + documentação.

### Hermes (pesquisa)
Quando: dúvida sobre plataforma, mudança em API, documentação, tendências, informação externa.
Precisa: pergunta clara ou contexto do que buscar.
Entrega: resposta sintetizada com fontes, contextualizada pra GuessLess.

### Prometheus (criação de agentes)
Quando: gap no time, nova capacidade necessária, melhoria em skill existente.
Precisa: descrição da necessidade, contexto do que falta.
Entrega: nova skill testada e integrada ao time.

### Analista de Mídia (futuro)
Quando: métricas de campanha, relatórios de performance, anomalias.

## Regras por nível
| Ação | Nível 1 | Nível 2 | Nível 3 |
|------|---------|---------|---------|
| Detectar necessidade | Sim | Sim | Sim |
| Sugerir delegação | Não | Sim | Sim |
| Executar delegação | Não | Não | Sim |
| Registrar na memória | Sim | Sim | Sim |

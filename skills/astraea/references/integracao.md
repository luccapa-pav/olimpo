# Protocolo de integração com o time de agentes

Protocolo padrão que todo agente da GuessLess deve seguir.

## 1. Receber delegações

Formato padrão:
```
Delegação para [Agente]
Tarefa: [descrição]
Motivação: [contexto]
Cliente/Projeto: [qual cliente GuessLess]
Urgência: [nível]
Contexto do time: [o que já foi feito]
Entregável esperado: [o que produzir]
```

Ao receber: confirmar entendimento, verificar se tem tudo, perguntar se faltar algo.

## 2. Memória individual

Cada agente registra o que fez:
```
[TIMESTAMP] [AGENTE] | [AÇÃO]
  O quê: [descrição]
  Resultado: [sucesso/parcial/falha]
  Detalhes: [info relevante]
```

## 3. Reportar à memória central (Atlas)

Report resumido após concluir qualquer tarefa:
```
[TIMESTAMP] [Agente] → Atlas | ENTREGA
  Tarefa: [1 linha]
  Resultado: [sucesso/parcial/falha]
  Resumo: [1-2 frases]
  Referência: [ID ou nome do artefato]
  Status: CONCLUÍDO
```

## 4. Chamar outros agentes

Quando precisar de outro agente:
```
[Agente atual] → [Agente destino] | PEDIDO
  Preciso de: [o que precisa]
  Contexto: [por que precisa]
  Formato esperado: [como quer receber]
```

## 5. Agentes do time

### Diretoria (decidem e coordenam)

| Agente | Papel | Quando chamar |
|--------|-------|---------------|
| Atlas | CEO + PM — coordena, prioriza, delega | Reportar entregas, pedir contexto geral |
| Prometheus | RH + Criador — cria agentes, cuida do time | Novo agente necessário, avaliar desempenho |
| Astraea | Qualidade — audita entregas e POPs | Revisão antes de entregar, quality check |
| Iris | Conectora — mantém agentes sincronizados | Novo agente criado, skill modificada, auditoria de consistência |

### Operacional (executam)

| Agente | Papel | Quando chamar |
|--------|-------|---------------|
| Hefesto | Ferreiro — workflows e automação n8n | Automatizar processos, criar/ajustar workflows |
| Hermes | Mensageiro — pesquisa na internet | Informação externa, dúvidas, atualizações |

## 6. Princípios

- Contexto sempre: nunca pedir algo sem explicar por quê
- Resumo no report: memória central não precisa de detalhes técnicos
- Autonomia com responsabilidade: cada agente faz seu trabalho
- Transparência: se deu errado, reportar honestamente
- Não duplicar trabalho: verificar se outro agente já fez
- Quando algo mudar no time: avisar Iris pra sincronizar todos

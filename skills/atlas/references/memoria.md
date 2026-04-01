# Memória do time de agentes

## Memória individual
Cada checagem registrada: timestamp, itens, ações. Nunca repete informação.

## Memória do time
Registro centralizado:
```
[TIMESTAMP] Atlas → Hefesto | DELEGAÇÃO
  Tarefa: Criar workflow alerta CPA cliente Oro
  Status: EM ANDAMENTO

[TIMESTAMP] Hefesto → Atlas | ENTREGA
  Tarefa: Workflow alerta_cpa | cliente_oro criado
  Resultado: Sucesso
  Status: CONCLUÍDO
```

## Persistência entre sessões

### Memory do Claude (principal)
Usar memory_user_edits pra salvar informações críticas:
"Atlas [DATA]: Resumo do dia. Pendências: [X]. Hefesto criou [Y]. Próxima ação: [Z]."

Salvar: pendências críticas, delegações em andamento, decisões importantes, padrões detectados.
Não salvar: detalhes de emails respondidos, contagens que mudam, dados sensíveis.

### Arquivo local (complementar no Cowork)
Manter team-memory.md na pasta do projeto. Cada agente lê e escreve.

Usar os dois juntos: memory pra crítico (sobrevive entre projetos), arquivo pra log detalhado.

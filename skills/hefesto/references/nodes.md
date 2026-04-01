# Referência de nodes — JSONs com nomenclatura padronizada

## Triggers
- Webhook: `n8n-nodes-base.webhook` (typeVersion 2)
- Schedule: `n8n-nodes-base.scheduleTrigger` (typeVersion 1.2)
- Error: `n8n-nodes-base.errorTrigger` (typeVersion 1)
- Execute Workflow Trigger: `n8n-nodes-base.executeWorkflowTrigger` (typeVersion 1)

## Processamento
- HTTP Request: `n8n-nodes-base.httpRequest` (typeVersion 4.2)
- Code: `n8n-nodes-base.code` (typeVersion 2)
- Set: `n8n-nodes-base.set` (typeVersion 3.4)
- IF: `n8n-nodes-base.if` (typeVersion 2)
- Switch: `n8n-nodes-base.switch` (typeVersion 3)
- Merge: `n8n-nodes-base.merge` (typeVersion 3)
- Split In Batches: `n8n-nodes-base.splitInBatches` (typeVersion 3)
- Wait: `n8n-nodes-base.wait` (typeVersion 1.1)

## Output
- Gmail: `n8n-nodes-base.gmail` (typeVersion 2.1)
- Respond to Webhook: `n8n-nodes-base.respondToWebhook` (typeVersion 1.1)
- No Operation: `n8n-nodes-base.noOp` (typeVersion 1)
- Execute Workflow: `n8n-nodes-base.executeWorkflow` (typeVersion 1)

## Organização
- Sticky Note: `n8n-nodes-base.stickyNote` (typeVersion 1)

## Padrão de nomenclatura nos JSONs
Todos: `"name": "tipo_node | contexto"` — minúsculas, underscore, pipe.

## Connections
Linear: `"node_a | ctx": { "main": [[{ "node": "node_b | ctx" }]] }`
IF branches: primeira array = true, segunda = false.
Switch: array por output nomeado.
Merge: dois nodes apontam pro merge em index 0 e 1.

Se precisar de um node não listado aqui, pedir ao Hermes pra pesquisar a documentação.

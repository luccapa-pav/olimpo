# Padrões de workflow

## 5 padrões fundamentais
1. Webhook Processing: webhook → validar → condicional → output
2. HTTP API Integration: trigger → http_request → transformar → salvar
3. Database Operations: trigger → query → processar → query
4. AI Agent Workflow: trigger → ai_agent → tools → output
5. Scheduled Tasks: schedule → buscar → processar → notificar

## Combinações comuns na GuessLess
- Scheduled + API: puxar métricas a cada hora e alertar anomalias
- Webhook + Database: receber lead do site e salvar no CRM
- Scheduled + Email: report semanal automático pros clientes

## Error handling obrigatório
Todo workflow em produção: Error Trigger → notificação (Gmail/Slack).

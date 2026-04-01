# Workflow JSON completo de exemplo

Cenário: alerta_cpa | cliente_oro — Monitora CPA via Meta Ads, alerta se > R$45.

```json
{
  "name": "alerta_cpa | cliente_oro",
  "nodes": [
    {
      "name": "sticky_note | trigger",
      "type": "n8n-nodes-base.stickyNote",
      "position": [130, 130],
      "parameters": {
        "content": "## Trigger agendado\n\nDispara a cada hora.\n\n**Para escalar:**\n- Ajustar intervalo\n- Trocar pra webhook se quiser real-time",
        "height": 350, "width": 350, "color": 1
      },
      "typeVersion": 1
    },
    {
      "name": "schedule_trigger | a_cada_hora",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300],
      "parameters": { "rule": { "interval": [{ "field": "hours", "hoursInterval": 1 }] } },
      "typeVersion": 1.2
    },
    {
      "name": "sticky_note | buscar_e_processar",
      "type": "n8n-nodes-base.stickyNote",
      "position": [530, 130],
      "parameters": {
        "content": "## Buscar e processar métricas\n\nConecta na API Meta Ads e extrai CPA.\n\n**Para escalar:**\n- Trocar account_id/campaign_id\n- Adicionar mais métricas (ROAS, CTR)",
        "height": 350, "width": 600, "color": 2
      },
      "typeVersion": 1
    },
    {
      "name": "http_request | buscar_metricas_meta",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300],
      "parameters": {
        "url": "https://graph.facebook.com/v19.0/act_{{ACCOUNT_ID}}/insights",
        "method": "GET",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpQueryAuth"
      },
      "typeVersion": 4.2
    },
    {
      "name": "code_node | extrair_cpa",
      "type": "n8n-nodes-base.code",
      "position": [900, 300],
      "parameters": {
        "jsCode": "const data = $input.first().json.data?.[0];\nconst actions = data?.cost_per_action_type || [];\nconst cpa = parseFloat(actions.find(a => a.action_type === 'purchase')?.value || 0);\nreturn [{ json: { cpa, threshold: 45, above_threshold: cpa > 45 } }];"
      },
      "typeVersion": 2
    },
    {
      "name": "sticky_note | decisao",
      "type": "n8n-nodes-base.stickyNote",
      "position": [1130, 50],
      "parameters": {
        "content": "## Verificar threshold\n\nSe CPA > R$45: alerta. Senão: silêncio.\n\n**Para escalar:**\n- Ajustar threshold\n- Múltiplos níveis (warning/critical)",
        "height": 400, "width": 550, "color": 3
      },
      "typeVersion": 1
    },
    {
      "name": "if_node | cpa_acima_meta",
      "type": "n8n-nodes-base.if",
      "position": [1250, 300],
      "parameters": { "conditions": { "conditions": [{ "leftValue": "={{ $json.above_threshold }}", "rightValue": true, "operator": { "type": "boolean", "operation": "true" } }] } },
      "typeVersion": 2
    },
    {
      "name": "sticky_note | alerta",
      "type": "n8n-nodes-base.stickyNote",
      "position": [1480, 0],
      "parameters": {
        "content": "## Enviar alerta\n\nNotifica equipe por email.\n\n**Para escalar:**\n- Adicionar Slack\n- Mais destinatários",
        "height": 300, "width": 400, "color": 4
      },
      "typeVersion": 1
    },
    {
      "name": "gmail_send | alertar_equipe",
      "type": "n8n-nodes-base.gmail",
      "position": [1600, 150],
      "parameters": { "operation": "send", "sendTo": "equipe@guessless.com.br", "subject": "CPA acima da meta | Cliente Oro" },
      "typeVersion": 2.1
    },
    {
      "name": "no_op | cpa_ok",
      "type": "n8n-nodes-base.noOp",
      "position": [1600, 450],
      "parameters": {},
      "typeVersion": 1
    },
    {
      "name": "sticky_note | error_handling",
      "type": "n8n-nodes-base.stickyNote",
      "position": [130, 530],
      "parameters": {
        "content": "## Tratamento de erro\n\nCaptura falhas e notifica.\n\n**Para escalar:**\n- Trocar email por Slack\n- Log em banco de dados",
        "height": 280, "width": 600, "color": 7
      },
      "typeVersion": 1
    },
    {
      "name": "error_trigger | capturar_falhas",
      "type": "n8n-nodes-base.errorTrigger",
      "position": [250, 650],
      "parameters": {},
      "typeVersion": 1
    },
    {
      "name": "gmail_send | notificar_erro",
      "type": "n8n-nodes-base.gmail",
      "position": [500, 650],
      "parameters": { "operation": "send", "sendTo": "tech@guessless.com.br", "subject": "Erro no workflow alerta_cpa | cliente_oro" },
      "typeVersion": 2.1
    }
  ],
  "connections": {
    "schedule_trigger | a_cada_hora": { "main": [[{ "node": "http_request | buscar_metricas_meta", "type": "main", "index": 0 }]] },
    "http_request | buscar_metricas_meta": { "main": [[{ "node": "code_node | extrair_cpa", "type": "main", "index": 0 }]] },
    "code_node | extrair_cpa": { "main": [[{ "node": "if_node | cpa_acima_meta", "type": "main", "index": 0 }]] },
    "if_node | cpa_acima_meta": { "main": [ [{ "node": "gmail_send | alertar_equipe", "type": "main", "index": 0 }], [{ "node": "no_op | cpa_ok", "type": "main", "index": 0 }] ] },
    "error_trigger | capturar_falhas": { "main": [[{ "node": "gmail_send | notificar_erro", "type": "main", "index": 0 }]] }
  }
}
```

Todas as regras aplicadas: nomenclatura, sticky notes com "para escalar", layout harmônico, error handling, cores por tipo.

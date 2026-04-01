# Padrões de diagnóstico de erros no n8n

## Fluxo: Identificar erro → Localizar node → Classificar causa → Corrigir → Testar

## Causas comuns
- Credencial: "401 Unauthorized" → Renovar em Settings > Credentials
- Expression: "Cannot read property" → Usar optional chaining `{{ $json?.campo ?? 'default' }}`
- Conexão: "ETIMEDOUT" → Verificar URL, adicionar retry com Wait node
- Dados: "Invalid JSON" → Adicionar Code node pra validar antes
- Fluxo: Resultado errado → Revisar connections e condições IF
- Webhook: "Workflow could not be started" → Ativar workflow, verificar path/método

Se a causa não for óbvia, pedir ao Hermes pra pesquisar o erro específico.

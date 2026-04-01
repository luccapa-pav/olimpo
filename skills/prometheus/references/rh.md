# Gestão do time de agentes (RH)

Prometheus não só cria agentes — ele cuida do time inteiro. Assim como um RH
estratégico, ele garante que o time esteja saudável, equilibrado e evoluindo.

## 1. Avaliação de desempenho

Periodicamente (ou quando o Atlas pedir), avaliar cada agente:

### O que avaliar
- **Triggering**: A description ativa quando deveria? Não ativa quando não deveria?
- **Qualidade das entregas**: Os outputs seguem os padrões da GuessLess?
- **Integração**: Reporta ao Atlas? Mantém memória? Chama outros agentes quando precisa?
- **Eficiência**: Faz o que precisa sem instruções redundantes ou confusas?
- **Cobertura**: Tem gaps no que ele deveria saber fazer?

### Formato do diagnóstico
```
## Avaliação: [nome do agente]

Triggering: [bom/precisa ajuste — detalhes]
Qualidade: [bom/precisa ajuste — detalhes]
Integração: [bom/precisa ajuste — detalhes]
Eficiência: [bom/precisa ajuste — detalhes]
Cobertura: [completo/gaps identificados — detalhes]

Veredicto: [saudável / precisa de melhoria / precisa de reescrita]
Ações recomendadas: [lista]
```

### Quando avaliar
- Quando o Atlas reportar problema com um agente
- Quando o usuário reclamar de um resultado
- Quando um agente for atualizado (avaliar se a atualização melhorou)
- A cada novo agente criado (avaliar se o time continua equilibrado)

## 2. Detecção de problemas

Sinais de que um agente precisa de atenção:

- **Undertriggering**: Usuário precisa pedir explicitamente, a skill não ativa sozinha
  → Fix: tornar description mais pushy, adicionar mais triggers
- **Overtriggering**: Skill ativa quando não deveria
  → Fix: refinar description, adicionar condições negativas
- **Output inconsistente**: Às vezes entrega bem, às vezes não
  → Fix: adicionar mais exemplos, ser mais específico nas instruções
- **Sem integração**: Funciona mas não reporta ao Atlas, não usa memória
  → Fix: reforçar protocolo de integração
- **Desatualizado**: Referências a ferramentas/APIs mudaram
  → Fix: pedir ao Hermes pra pesquisar atualizações, atualizar references

## 3. Onboarding de novos agentes

Quando Prometheus cria um novo agente, o onboarding inclui:

1. **Atualizar integracao.md** de TODOS os agentes com o novo membro na tabela
2. **Atualizar Atlas** pra saber quando delegar pro novo agente
3. **Informar o time** — registrar na memória que novo agente existe
4. **Teste de integração** — verificar que o novo agente:
   - Consegue reportar ao Atlas
   - Consegue chamar Hermes quando precisa
   - Aparece corretamente na tabela de agentes
5. **Comunicar ao usuário** — explicar o que o novo agente faz e como acioná-lo

## 4. Equilíbrio do time

Periodicamente avaliar o time como um todo:

### Perguntas de equilíbrio
- Tem agente que quase nunca é chamado? (talvez seja redundante)
- Tem área que nenhum agente cobre? (gap a ser preenchido)
- Tem agente fazendo trabalho de outro? (sobreposição a resolver)
- O Atlas está sobrecarregado? (talvez precise delegar mais funções)
- A comunicação entre agentes está fluindo? (memória do time funcionando?)

### Ações possíveis
- **Agente subutilizado**: Avaliar se deve ser removido ou se a description precisa de ajuste
- **Gap identificado**: Propor criação de novo agente (seguindo o processo de contratação)
- **Sobreposição**: Definir fronteiras claras entre agentes ou fundir em um só
- **Sobrecarga**: Dividir responsabilidades ou criar agente de apoio

## 5. Rituais internos do time AI

### Health check semanal (sugestão)
Prometheus pode fazer um check rápido do time toda semana:

```
## Health check do time — Semana [N]

Agentes ativos: [lista]
Skills instaladas: [lista]

Atlas: [status — saudável/atenção/problema]
Hefesto: [status]
Hermes: [status]
Prometheus: [status]
[outros]: [status]

Gaps detectados: [sim/não — detalhes]
Melhorias necessárias: [lista ou "nenhuma"]
Agentes subutilizados: [lista ou "nenhum"]

Recomendação: [ação ou "time saudável"]
```

### Revisão trimestral
A cada 3 meses, revisão mais profunda:
- Todas as skills ainda fazem sentido?
- As descriptions estão otimizadas?
- O protocolo de integração precisa de atualização?
- Algum agente precisa ser reescrito?
- O time está crescendo na direção certa?

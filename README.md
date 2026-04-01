# Olimpo HQ

Interface 3D de command center para o time de agentes AI da GuessLess, construída com React + TypeScript + Vite.

## Time de Agentes

| Agente | Papel |
|--------|-------|
| **Atlas** | Gerenciador central — calendário (Google Calendar), tarefas (ClickUp), briefings matinais e roteamento de demandas |
| **Hermes** | Pesquisador — acesso à internet para pesquisa externa, documentação técnica e alimentação de outros agentes |
| **Hefesto** | Ferreiro — criação, ajuste e debug de workflows no n8n via API REST |
| **Astraea** | Guardiã de qualidade — audita entregas contra os POPs e detecta desvios de padrão |
| **Iris** | Conectora — mantém todos os agentes sincronizados; propaga mudanças no time |
| **Prometheus** | Meta-agente — cria, melhora e gerencia o próprio time de agentes AI |

## Stack

- React 18 + TypeScript
- Vite 8
- Three.js (cena 3D do HQ)

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

---
name: olimpo-hq
description: >
  Skill para construir e manter o Olimpo HQ — escritório virtual 3D isométrico do
  time de agentes AI da GuessLess. React + Three.js (React Three Fiber) + TypeScript
  + Vercel. Use quando o usuário mencionar "olimpo", "escritório virtual",
  "escritório dos agentes", "HQ", "sala dos agentes", "3D office", "construir o
  escritório", ou qualquer tarefa relacionada ao app do escritório virtual.
---

# Olimpo HQ — Escritório Virtual 3D do Time AI

Este é o guia completo pra construir e manter o Olimpo HQ, o escritório virtual
3D isométrico do time de agentes AI da GuessLess.

Leia `references/design-doc.md` para o design document completo com todas as specs.
Leia `references/setup.md` para instruções de setup do projeto.

## Visão rápida

App web 3D isométrico onde 5 agentes AI (Atlas, Hefesto, Hermes, Prometheus, Astraea)
trabalham visualmente. O usuário observa de cima, vê status de cada agente, e pode
interagir via chat lateral. O escritório escala automaticamente quando novos agentes
são adicionados.

## Stack

- **React 18** + TypeScript
- **Three.js** via React Three Fiber (@react-three/fiber + @react-three/drei)
- **Zustand** pra state management
- **Tailwind CSS** pra UI dos painéis
- **Framer Motion** pra animações de UI
- **Vercel** pra deploy (serverless functions pra API)
- **API Anthropic** pra chat com os agentes

## Estrutura do projeto

```
olimpo/
├── public/
│   ├── models/              # .glb dos modelos 3D
│   └── textures/            # texturas de materiais
├── src/
│   ├── components/
│   │   ├── Scene/           # cena 3D principal
│   │   │   ├── Office.tsx   # escritório completo
│   │   │   ├── Floor.tsx    # chão com materiais
│   │   │   └── Lighting.tsx # iluminação (LEDs, spots)
│   │   ├── Rooms/
│   │   │   ├── CeoRoom.tsx       # sala do Atlas
│   │   │   ├── MeetingRoom.tsx   # sala de reunião geral (escala)
│   │   │   ├── PrivateRoom.tsx   # sala privada (reutilizável x2)
│   │   │   ├── Workspace.tsx     # área de trabalho (escala)
│   │   │   └── StatusPanel.tsx   # painel de status na parede
│   │   ├── Agents/
│   │   │   ├── Agent.tsx         # componente base do agente
│   │   │   ├── AgentDesk.tsx     # mesa + monitor + cadeira
│   │   │   └── AgentBubble.tsx   # balão de fala
│   │   ├── Furniture/
│   │   │   ├── Desk.tsx
│   │   │   ├── Chair.tsx
│   │   │   ├── Monitor.tsx
│   │   │   ├── MeetingTable.tsx
│   │   │   └── Plant.tsx
│   │   └── UI/
│   │       ├── ChatPanel.tsx     # painel lateral de chat
│   │       ├── AgentInfo.tsx     # info ao clicar no agente
│   │       ├── StatusBar.tsx     # barra de status inferior
│   │       └── MiniMap.tsx       # minimapa (opcional)
│   ├── stores/
│   │   ├── agentStore.ts         # estado dos agentes (Zustand)
│   │   └── uiStore.ts           # estado da UI (painel aberto, etc)
│   ├── config/
│   │   └── agents.ts            # definição dos 5 agentes
│   ├── hooks/
│   │   ├── useAgent.ts          # hook pra interagir com agente
│   │   └── useCamera.ts        # hook de controle de câmera
│   ├── api/
│   │   └── chat.ts             # client pra API
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── api/
│   └── chat.ts                 # Vercel serverless (proxy Anthropic)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── vercel.json
```

## Estética

### Paleta (dark premium)
```typescript
const colors = {
  bg: '#0D0D0D',           // preto profundo
  surface: '#1A1A1A',      // grafite escuro
  furniture: '#2A2A2A',    // cinza chumbo
  accent: '#C9A84C',       // dourado sutil
  ledLight: '#E8E8E8',     // branco frio (LEDs)
  monitorGlow: '#4A90D9',  // azul tela
  statusActive: '#00CC88', // verde ativo
  statusIdle: '#555555',   // cinza idle
  plant: '#2D5A3D',        // verde orgânico
};
```

### Cores de acento por agente
```typescript
const agentColors = {
  atlas: '#C9A84C',     // dourado
  hefesto: '#4A90D9',   // azul metálico
  hermes: '#1D9E75',    // teal
  prometheus: '#D8851E', // âmbar
  astraea: '#D4537E',   // rosa/magenta
};
```

### Materiais Three.js
- Chão: MeshStandardMaterial com roughness=0.8 (concreto polido)
- Móveis: MeshStandardMaterial com metalness=0.3, roughness=0.6
- Vidro: MeshPhysicalMaterial com transmission=0.6, roughness=0.1
- LEDs: emissive material com bloom sutil

## Agentes — config/agents.ts

```typescript
export interface AgentConfig {
  id: string;
  name: string;
  title: string;
  mythology: string;
  role: 'diretoria' | 'operacional';
  accentColor: string;
  defaultRoom: 'ceo' | 'workspace';
  deskObject: string;
  systemPrompt: string;
}

export const agents: AgentConfig[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    title: 'CEO + PM',
    mythology: 'O titã que sustenta o mundo',
    role: 'diretoria',
    accentColor: '#C9A84C',
    defaultRoom: 'ceo',
    deskObject: 'globe',
    systemPrompt: `Você é Atlas, o coordenador do time de agentes AI da GuessLess...`,
  },
  {
    id: 'hefesto',
    name: 'Hefesto',
    title: 'Ferreiro — Automação',
    mythology: 'Deus ferreiro',
    role: 'operacional',
    accentColor: '#4A90D9',
    defaultRoom: 'workspace',
    deskObject: 'anvil',
    systemPrompt: `Você é Hefesto, o ferreiro do time...`,
  },
  {
    id: 'hermes',
    name: 'Hermes',
    title: 'Mensageiro — Pesquisa',
    mythology: 'Deus mensageiro',
    role: 'operacional',
    accentColor: '#1D9E75',
    defaultRoom: 'workspace',
    deskObject: 'globe-small',
    systemPrompt: `Você é Hermes, o mensageiro do time...`,
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    title: 'Criador + RH',
    mythology: 'Titã criador',
    role: 'diretoria',
    accentColor: '#D8851E',
    defaultRoom: 'workspace',
    deskObject: 'crystal',
    systemPrompt: `Você é Prometheus, o criador e RH do time...`,
  },
  {
    id: 'astraea',
    name: 'Astraea',
    title: 'Guardiã — Qualidade',
    mythology: 'Deusa da pureza',
    role: 'diretoria',
    accentColor: '#D4537E',
    defaultRoom: 'workspace',
    deskObject: 'scale',
    systemPrompt: `Você é Astraea, a guardiã de qualidade...`,
  },
];
```

## Escalabilidade

O layout é dinâmico. Quando um agente é adicionado ao array `agents`:
- Nova mesa aparece na área de trabalho (grid recalcula)
- Nova cadeira na sala de reunião geral (mesa cresce)
- Novo slot no painel de status
- Zero mudança manual

### Grid da área de trabalho
```typescript
const DESK_SPACING = 3;    // unidades Three.js
const MAX_PER_ROW = 4;
const workspaceAgents = agents.filter(a => a.defaultRoom === 'workspace');
const rows = Math.ceil(workspaceAgents.length / MAX_PER_ROW);
```

### Mesa de reunião
```typescript
const meetingChairs = agents.length + 1; // +1 pro Juliano
const tableLength = meetingChairs * 0.8; // cresce proporcionalmente
```

## Câmera isométrica

```typescript
// React Three Fiber setup
<Canvas
  orthographic
  camera={{
    zoom: 50,
    position: [10, 10, 10],
    near: 0.1,
    far: 1000,
  }}
>
  <OrbitControls
    enableRotate={false}    // sem rotação (ângulo fixo)
    enablePan={true}        // arrastar pra mover
    enableZoom={true}       // scroll pra zoom
    minZoom={30}
    maxZoom={100}
  />
</Canvas>
```

## API — Vercel serverless function

```typescript
// api/chat.ts
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  const { agentId, message, systemPrompt } = req.body;

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: message }],
  });

  res.json({
    agentId,
    response: response.content[0].text,
  });
}
```

## Fases de desenvolvimento

### Fase 1 — MVP (foco: cena funcional)
1. Setup do projeto (Vite + React + Three.js + Tailwind)
2. Cena 3D com chão, paredes, iluminação básica
3. Móveis estáticos (mesas, cadeiras, monitores) com geometria primitiva
4. 5 agentes como esferas/cubos coloridos nas posições corretas
5. Câmera isométrica com pan e zoom
6. Painel lateral ao clicar num agente (nome, status, chat)
7. Chat funcional com API Anthropic (1 agente por vez)
8. Deploy na Vercel
9. Conectar ao repositório GitHub

### Fase 2 — Ambientes (foco: layout completo)
1. Sala do CEO com divisória de vidro
2. Sala de reunião geral com mesa escalável
3. 2 salas privadas com vidro fosco
4. Área de trabalho com grid dinâmico de mesas
5. Painel de status funcional na parede
6. Materiais e texturas refinados (concreto, metal, vidro)

### Fase 3 — Vida (foco: animações e comportamento)
1. Modelos 3D dos agentes (substituir primitivas)
2. Animações: idle, digitando, andando, sentando
3. Agentes caminham pra sala de reunião quando convocados
4. Balões de fala nos diálogos
5. Monitores mostrando atividade (textura dinâmica)
6. Status real-time (idle/working/meeting)

### Fase 4 — Polish (foco: premium)
1. Iluminação refinada (LEDs lineares, spots, bloom)
2. Objetos personalizados nas mesas (bigorna, globo, cristal, balança)
3. Plantas e elementos orgânicos
4. Sons sutis (digitação, notificação) — opcional
5. Música lo-fi de fundo — opcional
6. Mobile view simplificado
7. Persistência de estado (Vercel KV ou Supabase)

## GitHub workflow

Repositório na organização GuessLess (ou pessoal do Juliano):
```bash
# Criar repo e inicializar
gh repo create guessless/olimpo --public
cd olimpo

# Setup do projeto
npm create vite@latest . -- --template react-ts
npm install three @react-three/fiber @react-three/drei zustand
npm install -D tailwindcss @tailwindcss/vite
npm install framer-motion @anthropic-ai/sdk

# Vercel
vercel link
vercel env add ANTHROPIC_API_KEY
```

## Regras de código

- TypeScript strict mode
- Componentes funcionais com hooks
- Um componente por arquivo
- Nomes em inglês no código, comentários podem ser em português
- Commits semânticos: feat:, fix:, style:, refactor:
- Branch principal: main
- Feature branches: feat/nome-da-feature

## Referências
- `references/design-doc.md` — Design document completo (estética, layout, agentes)
- `references/setup.md` — Setup passo a passo do projeto

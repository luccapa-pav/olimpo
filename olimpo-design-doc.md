# Olimpo — Escritório Virtual do Time AI da GuessLess

## Design Document v1.0

---

## 1. Visão do produto

Um escritório virtual 3D isométrico onde os 5 agentes AI da GuessLess (Atlas, Hefesto,
Hermes, Prometheus, Astraea) trabalham visualmente em tempo real. O usuário observa de
cima, vê quem está trabalhando, o que estão fazendo, e pode interagir quando quiser.

O escritório escala automaticamente: quando novos agentes são adicionados ao time,
novas mesas aparecem e a sala de reunião cresce.

**Não é um dashboard.** É um lugar. Os agentes têm presença, movimento, personalidade.

---

## 2. Estética e identidade visual

### Paleta de cores
- Background principal: #0D0D0D (preto profundo)
- Superfícies: #1A1A1A (grafite escuro)
- Móveis: #2A2A2A a #333333 (cinza chumbo)
- Acentos de luz: #E8E8E8 (branco frio) — LEDs lineares
- Acentos secundários: #C9A84C (dourado sutil, toque premium)
- Telas dos monitores: glow suave azulado #4A90D9 quando ativo
- Status ativo: #00CC88 (verde suave)
- Status idle: #555555 (cinza médio)
- Plantas: #2D5A3D (verde escuro natural)

### Materiais e texturas
- Chão: concreto polido escuro
- Paredes: painéis escuros com textura sutil
- Mesas: superfície escura com borda metálica
- Cadeiras: couro preto, estilo gaming/ergonômico
- Vidro: divisórias com transparência sutil e reflexo
- Metal: aço escovado escuro nos detalhes

### Iluminação
- LEDs lineares no teto (faixas brancas frias)
- Glow dos monitores (azulado quando ativo)
- Spot lights suaves sobre cada estação
- Iluminação geométrica na sala de reunião (referência imagem 7)
- Sem luz ambiente forte — predomina escuridão com pontos de luz

### Elementos orgânicos
- Plantas penduradas nas prateleiras
- Vasos pequenos nas mesas (suculentas)
- Contraste com o ambiente tech

---

## 3. Câmera e perspectiva

### Estilo: Isométrico 2.5D com qualidade 3D

- Ângulo fixo ~30° de inclinação (isométrico clássico)
- Renderização com sombras, materiais e iluminação realistas
- Zoom in/out com scroll do mouse
- Pan (arrastar pra mover a câmera)
- Sem rotação da câmera (ângulo fixo mantém a clareza)
- Possibilidade de clicar num agente pra dar zoom e abrir painel de detalhes

### Responsividade
- Desktop: tela cheia, experiência principal
- Tablet: funcional mas simplificado
- Mobile: painel de status apenas (sem 3D)

---

## 4. Layout do escritório

### Planta baixa (visão de cima)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   ┌──────────────┐  ┌────────────────────────────────────────┐   │
│   │              │  │                                        │   │
│   │  SALA DO CEO │  │         SALA DE REUNIÃO GERAL          │   │
│   │  (Atlas)     │  │  (mesa + cadeiras escalam com o time)  │   │
│   │              │  │  TV na parede                          │   │
│   └──────────────┘  └────────────────────────────────────────┘   │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐                             │
│   │  SALA        │  │  SALA        │                             │
│   │  PRIVADA 1   │  │  PRIVADA 2   │                             │
│   │  (2-4 pess.) │  │  (2-4 pess.) │                             │
│   │  mesa+vidro  │  │  mesa+vidro  │                             │
│   └──────────────┘  └──────────────┘                             │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                   ÁREA DE TRABALHO                       │   │
│   │                                                          │   │
│   │   [Hefesto]  [Hermes]  [Prometheus]  [Astraea]           │   │
│   │    mesa       mesa       mesa         mesa               │   │
│   │                                                          │   │
│   │   [vazio]    [vazio]   ... (escala com o time)            │   │
│   │                                                          │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                   PAINEL DE STATUS                       │   │
│   │   (dashboard na parede, visível de longe)                │   │
│   │   Status de cada agente + métricas do dia                │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Escalabilidade automática
- Área de trabalho: grid de mesas. Começa com 4 (Hefesto, Hermes, Prometheus, Astraea).
  Quando Prometheus cria um novo agente, nova mesa aparece automaticamente.
- Sala de reunião: mesa central. Número de cadeiras = número de agentes + 1 (Juliano).
  Mesa cresce proporcionalmente.
- Layout recalcula automaticamente sem intervenção.

---

## 5. Ambientes detalhados

### 5.1 Sala do CEO (Atlas)

Sala separada com divisória de vidro. Premium e organizada.

Elementos:
- Mesa em L escura com monitor ultrawide
- Cadeira executiva preta
- Dashboard na parede atrás (tela grande mostrando status do time)
- Prateleira com livros/objetos decorativos
- Planta no canto
- LED linear no teto
- Nome "ATLAS" discreto na porta de vidro

O que aparece no dashboard do Atlas:
- Status de cada agente (ativo/idle/trabalhando em X)
- Briefing do dia resumido
- Próxima reunião
- Tasks urgentes

### 5.2 Área de trabalho

Mesas individuais lado a lado, cada uma com:
- Monitor (tela mostrando atividade do agente)
- Cadeira gaming/ergonômica preta
- Teclado + mouse
- Objeto personalizado por agente (identidade):
  - Hefesto: miniatura de bigorna ou engrenagem na mesa
  - Hermes: globo terrestre pequeno ou binóculos
  - Prometheus: cristal/chama decorativa
  - Astraea: balança dourada ou lupa
- LED no teto acima de cada mesa
- Plaquinha com o nome do agente

O monitor mostra:
- Se idle: screensaver com símbolo do agente
- Se ativo: texto scrollando (simulando trabalho)
- Se em reunião: cadeira vazia, agente na sala de reunião

### 5.3 Sala de reunião geral

Sala com divisória de vidro, mais espaçosa. Pra reuniões de todo o time.

Elementos:
- Mesa de conferência central (escura, borda metálica)
- Cadeiras ao redor (quantidade = agentes atuais + 1)
- TV/tela grande na parede (mostra pauta da reunião)
- LED geométrico no teto (referência imagem 7)
- Planta no canto

Quando o Atlas convoca reunião geral:
- Todos os agentes se levantam das mesas e caminham até a sala
- Sentam nas cadeiras ao redor da mesa
- TV mostra o assunto sendo discutido
- Balões de fala mostram os diálogos

### 5.4 Salas privadas (2x)

Duas salas menores com divisória de vidro, lado a lado. Pra reuniões de 2-4 agentes —
conversas que não envolvem o time todo.

Elementos (cada sala):
- Mesa redonda pequena (2-4 cadeiras)
- Divisória de vidro fosco (privacidade visual parcial)
- LED sutil no teto
- Whiteboard pequeno na parede (mostra tópico da conversa)
- Acústica isolada (visualmente representado pelo vidro fosco)

Exemplos de uso:
- Atlas + Hefesto: discutir um workflow específico
- Prometheus + Hermes: pesquisar antes de criar um novo agente
- Astraea + qualquer agente: feedback 1:1 sobre qualidade de entrega
- Atlas + Prometheus: avaliação de desempenho do time (RH)

Quando uma reunião privada acontece:
- Apenas os agentes envolvidos caminham até a sala privada
- Os demais continuam trabalhando nas suas mesas
- Balões de fala aparecem dentro da sala (conteúdo visível ao clicar)
- Indicador na porta: "Ocupada" com nomes dos participantes
- Se as 2 salas estiverem ocupadas, terceira reunião espera ou usa a geral

### 5.5 Painel de status (dashboard na parede)

Painel grande visível da área de trabalho. Mostra:
- Cada agente com avatar + nome + status
- Task atual de cada um
- Hora do último report
- Métricas do dia (emails processados, workflows criados, etc.)
- Timeline de atividades recentes

---

## 6. Agentes — Aparência e comportamento

### Estilo visual dos agentes
- Personagens estilizados (não pixelados tipo Gather, mas não hiper-realistas)
- Proporção chibi/compacta (cabeça levemente maior, corpo simplificado)
- Estética dark — roupas em tons escuros, detalhes em dourado/prata
- Cada agente tem visual único baseado na mitologia

### Atlas (CEO)
- Visual: terno escuro, gravata sutil, postura confiante
- Cor de acento: dourado (coroa/medalhão sutil)
- Animações: digitar, verificar tablet, olhar pro dashboard
- Localização padrão: sua sala

### Hefesto (Ferreiro)
- Visual: avental escuro sobre camisa, braços musculosos
- Cor de acento: azul metálico (faíscas)
- Animações: digitar intensamente, olhar código no monitor
- Localização padrão: sua mesa na área de trabalho

### Hermes (Mensageiro)
- Visual: jaqueta leve escura, tênis, visual ágil
- Cor de acento: teal/verde-água
- Animações: digitar rápido, olhar pro celular, andar entre mesas
- Localização padrão: sua mesa, mas se move bastante

### Prometheus (Criador)
- Visual: jaleco escuro tipo lab coat, óculos
- Cor de acento: âmbar/laranja (fogo)
- Animações: escrever em quadro, olhar documentos, pensar
- Localização padrão: sua mesa

### Astraea (Qualidade)
- Visual: blazer escuro, postura impecável, cabelo preso
- Cor de acento: rosa/magenta (pureza)
- Animações: examinar com lupa, fazer checkmarks, balançar a cabeça
- Localização padrão: sua mesa, mas visita outras mesas pra auditar

### Comportamentos compartilhados
- Idle: pequena animação respirando, olhando ao redor
- Trabalhando: digitando, olhando o monitor, fazendo anotações
- Reunião: caminham até a sala de reunião, sentam, dialogam
- Entrega: levantam e vão até o dashboard atualizar status
- Chamando outro agente: viram na direção do outro, balão de fala aparece

---

## 7. Interação do usuário

### Observar
- Ver o escritório de cima, zoom in/out, pan
- Ver status de cada agente em tempo real
- Ver diálogos entre agentes (balões de fala)
- Ver o dashboard de status

### Interagir
- Clicar num agente: abre painel lateral com detalhes + chat
- Chat com agente: mandar mensagem/comando no painel lateral
- Clicar na sala de reunião: ver histórico de reuniões
- Clicar no dashboard: ver métricas expandidas

### Comandos do chat lateral
- "Atlas, briefing de hoje" → Atlas começa a trabalhar (animação no monitor)
- "Hefesto, cria workflow X" → Hefesto digita intensamente
- "Hermes, pesquisa sobre Y" → Hermes abre browser no monitor
- Respostas aparecem no painel lateral + no monitor do agente

---

## 8. Stack técnica

### Frontend
- **React 18** + TypeScript
- **Three.js** (via React Three Fiber) pra renderização 3D isométrica
- **Zustand** pra state management (status dos agentes)
- **Tailwind CSS** pra UI dos painéis laterais
- **Framer Motion** pra animações dos painéis

### Backend / API
- **Anthropic API** (Claude) pra as interações com agentes
- **Vercel** pra hosting (serverless functions pras chamadas de API)
- **Vercel KV** ou **Supabase** pra persistência de estado dos agentes

### Assets 3D
- Modelos isométricos em GLTF/GLB
- Podem ser criados com:
  - Blender (modelos custom)
  - Ready Player Me (avatares)
  - KenShape / MagicaVoxel (estilo voxel premium)
  - Assets prontos do Sketchfab (licença compatível)

### Estrutura do projeto
```
olimpo/
├── public/
│   ├── models/          (arquivos .glb dos modelos 3D)
│   └── textures/        (texturas de materiais)
├── src/
│   ├── components/
│   │   ├── Office/      (escritório 3D principal)
│   │   ├── Agents/      (componentes de cada agente)
│   │   ├── Rooms/       (sala CEO, reunião, trabalho)
│   │   ├── UI/          (painéis, chat, dashboard)
│   │   └── Effects/     (iluminação, partículas)
│   ├── stores/          (Zustand - estado dos agentes)
│   ├── hooks/           (custom hooks pra API, animações)
│   ├── api/             (chamadas Anthropic API)
│   ├── config/
│   │   └── agents.ts    (definição dos agentes e suas propriedades)
│   └── types/           (TypeScript types)
├── api/                 (Vercel serverless functions)
│   └── chat.ts          (proxy pra Anthropic API)
├── package.json
├── tailwind.config.ts
└── vercel.json
```

---

## 9. Configuração dos agentes (agents.ts)

```typescript
interface Agent {
  id: string;
  name: string;
  title: string;
  mythology: string;
  role: 'diretoria' | 'operacional';
  accentColor: string;
  position: { x: number; z: number };
  room: 'ceo' | 'workspace' | 'meeting';
  status: 'idle' | 'working' | 'meeting' | 'auditing';
  currentTask: string | null;
  avatar: string; // path pro modelo 3D
  deskObject: string; // objeto personalizado na mesa
  systemPrompt: string; // prompt do agente pra API
}

const agents: Agent[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    title: 'CEO + PM',
    mythology: 'O titã que sustenta o mundo',
    role: 'diretoria',
    accentColor: '#C9A84C',
    room: 'ceo',
    deskObject: 'globe',
    // ...
  },
  {
    id: 'hefesto',
    name: 'Hefesto',
    title: 'Ferreiro — Automação',
    mythology: 'Deus ferreiro',
    role: 'operacional',
    accentColor: '#4A90D9',
    room: 'workspace',
    deskObject: 'anvil',
    // ...
  },
  // ... hermes, prometheus, astraea
];
```

---

## 10. Escalabilidade

### Adicionar novo agente
1. Adicionar entrada no agents.ts
2. O grid de mesas recalcula automaticamente (CSS grid ou posição calculada)
3. Nova cadeira aparece na sala de reunião
4. Dashboard atualiza com o novo membro
5. Nenhuma mudança manual no layout — tudo dinâmico

### Fórmula de layout
- Mesas na área de trabalho: grid de N colunas (max 4 por fileira)
- Se > 4 agentes operacionais: cria segunda fileira
- Sala de reunião: mesa retangular, comprimento = (N agentes * 80px)
- Cadeiras distribuídas uniformemente ao redor

---

## 11. Fases de desenvolvimento

### Fase 1 — MVP (1-2 semanas)
- Cena 3D isométrica com o escritório básico
- 5 agentes posicionados nas mesas (estáticos)
- Status visual (idle/working) com indicador
- Painel lateral ao clicar num agente
- Chat funcional com API Claude (1 agente por vez)
- Deploy na Vercel

### Fase 2 — Vida (1-2 semanas)
- Animações dos agentes (idle, digitando, andando)
- Agentes caminham até a sala de reunião quando convocados
- Balões de fala mostrando diálogos
- Dashboard de status na parede (funcional)
- Monitores mostrando atividade

### Fase 3 — Integração completa (1-2 semanas)
- Skills integradas nos prompts de cada agente
- Agentes se comunicam entre si (Atlas delega, outros reportam)
- Reuniões automáticas (briefing matinal = todos na sala de reunião)
- Escalabilidade testada (adicionar agente e ver escritório crescer)
- Persistência de estado (Supabase/Vercel KV)

### Fase 4 — Polish (1 semana)
- Iluminação e sombras refinadas
- Partículas (faíscas no Hefesto, brilho na Astraea)
- Música de fundo (lo-fi opcional)
- Sons sutis (digitação, notificação)
- Mobile view (painel de status simplificado)
- Customização do layout (arrastar móveis)

---

## 12. Referências visuais incorporadas

- Gather (imagem 1): visão isométrica top-down, múltiplas áreas no mesmo andar
- Home office dark (imagens 2-4): paleta escura, setup premium, monitores como foco
- Área de trabalho coletiva (imagem 5): mesas lado a lado, LEDs lineares, plantas
- Sala de reunião corporate dark (imagem 6): concreto + vidro + LED, minimalista
- Sala de reunião premium (imagem 7): LED geométrico no teto, mesa grande, tela

---

## 13. Nomes e referências

- Nome do app: **Olimpo** (ou "Olympus HQ")
- URL sugerida: olimpo.guessless.com.br
- Repositório: github.com/guessless/olimpo
- Tagline: "O QG do time AI da GuessLess"

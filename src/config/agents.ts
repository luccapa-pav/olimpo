// agents.ts — Configuração completa dos agentes do Olimpo HQ
// systemPrompts carregados dos SKILL.md em skills/ via Vite raw imports

import type { AgentConfig } from '../types';

import atlasRaw from '../../skills/atlas/SKILL.md?raw';
import hefestoRaw from '../../skills/hefesto/SKILL.md?raw';
import hermesRaw from '../../skills/hermes/SKILL.md?raw';
import prometheusRaw from '../../skills/prometheus/SKILL.md?raw';
import astraeaRaw from '../../skills/astraea/SKILL.md?raw';
import irisRaw from '../../skills/iris/SKILL.md?raw';

// Remove frontmatter YAML (bloco entre --- no início do arquivo)
function extractSkillBody(raw: string): string {
  const match = raw.match(/^---[\s\S]*?---\n([\s\S]*)$/);
  return match ? match[1].trim() : raw.trim();
}

const atlasPrompt = extractSkillBody(atlasRaw);
const hefestoPrompt = extractSkillBody(hefestoRaw);
const hermesPrompt = extractSkillBody(hermesRaw);
const prometheusPrompt = extractSkillBody(prometheusRaw);
const astraeaPrompt = extractSkillBody(astraeaRaw);
const irisPrompt = extractSkillBody(irisRaw);

export const agents: AgentConfig[] = [
  // ═══════════════════════════════════════════════════════════
  // DIRETORIA
  // ═══════════════════════════════════════════════════════════

  {
    id: 'atlas',
    name: 'Atlas',
    title: 'CEO + PM',
    mythology: 'O titã que sustenta o mundo',
    role: 'diretoria',
    accentColor: '#C9A84C',
    tagColor: '#FFA500',
    defaultRoom: 'ceo',
    deskObject: 'globe',
    systemPrompt: atlasPrompt,
  },

  {
    id: 'prometheus',
    name: 'Prometheus',
    title: 'RH + Criador',
    mythology: 'Titã que criou os humanos',
    role: 'diretoria',
    accentColor: '#D8851E',
    tagColor: '#FFD700',
    defaultRoom: 'workspace',
    deskObject: 'crystal',
    systemPrompt: prometheusPrompt,
  },

  {
    id: 'astraea',
    name: 'Astraea',
    title: 'Guardiã — Qualidade',
    mythology: 'Última deusa a deixar a Terra',
    role: 'diretoria',
    accentColor: '#D4537E',
    tagColor: '#FF1493',
    defaultRoom: 'workspace',
    deskObject: 'scale',
    systemPrompt: astraeaPrompt,
  },

  {
    id: 'iris',
    name: 'Iris',
    title: 'Conectora — Manutenção',
    mythology: 'Deusa do arco-íris, ponte entre mundos',
    role: 'diretoria',
    accentColor: '#6B5B95',
    tagColor: '#9400D3',
    defaultRoom: 'workspace',
    deskObject: 'tablet',
    systemPrompt: irisPrompt,
  },

  // ═══════════════════════════════════════════════════════════
  // OPERACIONAL
  // ═══════════════════════════════════════════════════════════

  {
    id: 'hefesto',
    name: 'Hefesto',
    title: 'Ferreiro — Automação',
    mythology: 'Deus ferreiro que forjava autômatos',
    role: 'operacional',
    accentColor: '#4A90D9',
    tagColor: '#00BFFF',
    defaultRoom: 'workspace',
    deskObject: 'anvil',
    systemPrompt: hefestoPrompt,
  },

  {
    id: 'hermes',
    name: 'Hermes',
    title: 'Mensageiro — Pesquisa',
    mythology: 'Deus mensageiro, o mais veloz',
    role: 'operacional',
    accentColor: '#1D9E75',
    tagColor: '#00FF7F',
    defaultRoom: 'workspace',
    deskObject: 'globe-small',
    systemPrompt: hermesPrompt,
  },
];

// ═══════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════

export const getAgent = (id: string): AgentConfig | undefined =>
  agents.find(a => a.id === id);

export const getAgentById = getAgent;

export const getDiretoria = (): AgentConfig[] =>
  agents.filter(a => a.role === 'diretoria');

export const getOperacional = (): AgentConfig[] =>
  agents.filter(a => a.role === 'operacional');

export const getWorkspaceAgents = (): AgentConfig[] =>
  agents.filter(a => a.defaultRoom === 'workspace');

// Grid layout: max 4 por fileira
export const DESK_SPACING = 3;
export const MAX_PER_ROW = 4;

// Mesa de reunião escala com o time
export const getMeetingTableLength = (): number =>
  (agents.length + 1) * 0.8; // +1 pro Juliano

export const getMeetingChairs = (): number =>
  agents.length + 1;

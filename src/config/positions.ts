// Posições das cadeiras nas salas de reunião
// Calculadas com base nas geometrias de MeetingRoom.tsx e PrivateRoom.tsx
// agentCount=5 workspace → tableLen=4.8, chairSpacing=1.2, chairsPerSide=3

// ── Sala de Reunião Geral (center: -4.5, 0, -9.5) ────────────────────────────
// Norte: z = -10.65 | Sul: z = -8.35 | Cabeça oeste: x = -7.45

export const MEETING_SEATS: Record<string, [number, number, number]> = {
  atlas:      [-7.45, 0.35, -9.5],   // cabeça oeste (CEO)
  prometheus: [-5.7,  0.35, -10.65], // norte i=0
  astraea:    [-4.5,  0.35, -10.65], // norte i=1
  iris:       [-3.3,  0.35, -10.65], // norte i=2
  hefesto:    [-5.7,  0.35, -8.35],  // sul i=0
  hermes:     [-4.5,  0.35, -8.35],  // sul i=1
};

// ── Sala Privada 1 (center: 5.75, 0, -9.5) ───────────────────────────────────
// Usada para delegações com 2 agentes (atlas + 1 delegado)

export const PRIVATE_SEATS_1: [number, number, number][] = [
  [5.75, 0.35, -8.9],  // exec (delegador)
  [5.20, 0.35, -10.7], // visitante 1 (delegado)
  [6.30, 0.35, -10.7], // visitante 2
];

// ── Sala Privada 2 (center: 9.2, 0, -9.5) ────────────────────────────────────

export const PRIVATE_SEATS_2: [number, number, number][] = [
  [9.20, 0.35, -8.9],
  [8.65, 0.35, -10.7],
  [9.75, 0.35, -10.7],
];

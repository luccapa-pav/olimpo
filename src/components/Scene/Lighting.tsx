import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init();

// ── Máx 8 luzes totais ─────────────────────────────────────────────────────────
// 1. Ambient
// 2. Directional (shadow caster)
// 3. RectArea CEO
// 4. RectArea Meeting Room
// 5. RectArea Salas Privadas (cobre ambas com uma luz maior)
// 6. RectArea Workspace
// 7. Point golden accent
// ──────────────────────────────────────────────────────────────────────────────

export function Lighting() {
  return (
    <>
      {/* 1. Ambient */}
      <ambientLight intensity={1.8} color="#D8E0F0" />

      {/* 2. Directional principal — único com sombra */}
      <directionalLight
        position={[15, 20, 10]}
        intensity={0.8}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* 3. RectArea CEO room */}
      <rectAreaLight
        position={[-11, 3.38, -9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={4.5}
        height={3.5}
        intensity={6}
        color="#EEF0FF"
      />

      {/* 4. RectArea Sala de Reunião */}
      <rectAreaLight
        position={[-4.5, 3.38, -9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={6}
        height={3.5}
        intensity={6}
        color="#EEF0FF"
      />

      {/* 5. RectArea Salas Privadas — uma luz cobre ambas (Room1 em -12, Room2 em -7) */}
      <rectAreaLight
        position={[-9.5, 3.38, -3.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={9}
        height={3.5}
        intensity={6}
        color="#EEF0FF"
      />

      {/* 6. RectArea Workspace */}
      <rectAreaLight
        position={[-8, 3.38, 1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={12}
        height={5}
        intensity={5}
        color="#EEF0FF"
      />

      {/* 7. Acento dourado */}
      <pointLight position={[-2, 3, -6]} intensity={0.8} color="#C9A84C" distance={20} />
    </>
  );
}

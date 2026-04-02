import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init();

export function Lighting() {
  return (
    <>
      {/* Ambient suave fria/azulada — preenche sombras sem criar marcas duras */}
      <ambientLight intensity={1.2} color="#C8D4F0" />

      {/* Hemisphere — céu frio / solo neutro */}
      <hemisphereLight args={['#D0DCF8', '#181208', 0.7]} />

      {/* Direcional principal — sombra borrada com mapSize alto */}
      <directionalLight
        position={[15, 20, 10]}
        intensity={0.7}
        color="#F0F4FF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-radius={4}
      />

      {/* Direcional fill — contraluz suave do lado oposto */}
      <directionalLight
        position={[-10, 14, -8]}
        intensity={0.25}
        color="#D8E8FF"
      />

      {/* RectArea CEO room */}
      <rectAreaLight
        position={[-11, 3.38, -9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={4.5}
        height={3.5}
        intensity={4}
        color="#EEF0FF"
      />

      {/* RectArea Sala de Reunião */}
      <rectAreaLight
        position={[-4.5, 3.38, -9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={6}
        height={3.5}
        intensity={4}
        color="#EEF0FF"
      />

      {/* RectArea Salas Privadas */}
      <rectAreaLight
        position={[-11.25, 3.38, -5.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={5.5}
        height={2.5}
        intensity={3.5}
        color="#EEF0FF"
      />

      {/* RectArea Workspace */}
      <rectAreaLight
        position={[-8, 3.38, 1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={12}
        height={5}
        intensity={6}
        color="#EEF0FF"
      />

      {/* ── PointLights por sala — calor e profundidade ── */}

      {/* CEO room */}
      <pointLight position={[-11, 2.8, -9.5]} intensity={0.35} color="#FFF5E6" distance={9} decay={2} />

      {/* Sala de Reunião */}
      <pointLight position={[-4.5, 2.8, -9.5]} intensity={0.35} color="#FFF5E6" distance={9} decay={2} />

      {/* Sala Privada 1 */}
      <pointLight position={[-12.75, 2.5, -5.5]} intensity={0.3} color="#FFF5E6" distance={6} decay={2} />

      {/* Sala Privada 2 */}
      <pointLight position={[-9.75, 2.5, -5.5]} intensity={0.3} color="#FFF5E6" distance={6} decay={2} />

      {/* Workspace — 2 luzes espaçadas para cobrir o chão inteiro */}
      <pointLight position={[-9, 2.5, 1.5]} intensity={0.3} color="#FFF5E6" distance={9} decay={2} />
      <pointLight position={[-3, 2.5, 1.5]} intensity={0.3} color="#FFF5E6" distance={9} decay={2} />

      {/* Acento dourado central */}
      <pointLight position={[-2, 3, -6]} intensity={0.5} color="#C9A84C" distance={22} decay={2} />
    </>
  );
}

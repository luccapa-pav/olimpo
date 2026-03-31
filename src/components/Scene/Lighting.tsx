// Iluminação da cena: ambiente escuro com spots sobre as mesas e LEDs lineares
export function Lighting() {
  return (
    <>
      {/* Luz ambiente muito baixa — predomina escuridão */}
      <ambientLight intensity={0.15} color="#1a1a2e" />

      {/* Luz direcional principal (simula LEDs do teto) */}
      <directionalLight
        position={[5, 12, 5]}
        intensity={0.8}
        color="#E8E8F0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Luz de preenchimento oposta — evita sombras totalmente negras */}
      <directionalLight
        position={[-5, 8, -5]}
        intensity={0.2}
        color="#4A90D9"
      />

      {/* Spot sobre a sala do CEO */}
      <spotLight
        position={[-7, 8, 4]}
        angle={0.4}
        penumbra={0.6}
        intensity={1.2}
        color="#E8E8E8"
        castShadow
      />

      {/* Spots sobre a área de trabalho */}
      <spotLight
        position={[3, 8, -3]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.0}
        color="#E8E8E8"
      />

      {/* Luz pontual dourada — acento premium */}
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#C9A84C" distance={15} />
    </>
  );
}

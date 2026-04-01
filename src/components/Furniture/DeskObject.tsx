// Objetos personalizados por agente — escala máx 0.15 unidades, material metálico

// Atlas: globo terrestre (esfera + meridianos)
function Globe({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={0.13}>
      <mesh>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#1a3a5a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Meridianos */}
      {[0, 60, 120].map((angle, i) => (
        <mesh key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
          <torusGeometry args={[1.01, 0.025, 6, 32]} />
          <meshStandardMaterial color="#C9A84C" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Equador */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.01, 0.025, 6, 32]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Hefesto: bigorna (base trapezoidal + corpo + chifre)
function Anvil({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={0.12}>
      {/* Base */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[2, 0.4, 1]} />
        <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Corpo principal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.9, 0.9]} />
        <meshStandardMaterial color="#3A3A3A" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Chifre (cone) */}
      <mesh position={[1.1, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.3, 1.2, 8]} />
        <meshStandardMaterial color="#3A3A3A" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Tampo */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 0.15, 1]} />
        <meshStandardMaterial color="#555555" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Hermes: binóculos (dois cilindros lado a lado + ponte)
function Binoculars({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={0.12}>
      {[-0.55, 0.55].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.38, 0.42, 1.4, 12]} />
            <meshStandardMaterial color="#2A2A2A" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Lente frontal */}
          <mesh position={[0, -0.72, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1, 12]} />
            <meshStandardMaterial color="#1a3a5a" metalness={0.3} roughness={0.1} emissive="#1a3a5a" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
      {/* Ponte central */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.22, 0.35]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Prometheus: cristal/chama (cone emissive âmbar)
function Crystal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={0.12}>
      {/* Cristal principal */}
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.55, 1.6, 6]} />
        <meshStandardMaterial
          color="#D8851E"
          emissive="#D8851E"
          emissiveIntensity={0.7}
          metalness={0.1}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Cristal secundário inclinado */}
      <mesh position={[0.4, 0.3, 0.2]} rotation={[0.3, 0.5, 0.4]}>
        <coneGeometry args={[0.3, 1.0, 6]} />
        <meshStandardMaterial
          color="#C9A84C"
          emissive="#C9A84C"
          emissiveIntensity={0.5}
          metalness={0.1}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.3, 8]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  );
}

// Astraea: balança (fiel + dois pratos)
function Scale({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={0.12}>
      {/* Pilar */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 2, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Fiel horizontal */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[2.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.8} roughness={0.2} emissive="#C9A84C" emissiveIntensity={0.2} />
      </mesh>
      {/* Prato esquerdo */}
      <mesh position={[-1.0, 0.7, 0]}>
        <cylinderGeometry args={[0.45, 0.4, 0.06, 12]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cordas do prato esquerdo */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[-1.0 + x * 0.5, 0.9, 0]} rotation={[0, 0, x > 0 ? 0.3 : -0.3]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 4]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Prato direito */}
      <mesh position={[1.0, 0.7, 0]}>
        <cylinderGeometry args={[0.45, 0.4, 0.06, 12]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.15, 10]} />
        <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Componente roteador por agente
interface DeskObjectProps {
  agentId: string;
  position: [number, number, number];
}

export function DeskObject({ agentId, position }: DeskObjectProps) {
  switch (agentId) {
    case 'atlas':     return <Globe position={position} />;
    case 'hefesto':   return <Anvil position={position} />;
    case 'hermes':    return <Binoculars position={position} />;
    case 'prometheus':return <Crystal position={position} />;
    case 'astraea':   return <Scale position={position} />;
    default:          return null;
  }
}

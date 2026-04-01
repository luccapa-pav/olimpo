/**
 * Placeholder components — substituir por useGLTF() quando os modelos estiverem prontos.
 *
 * Para substituir por GLTF, troque cada componente por algo como:
 *   const { scene } = useGLTF('/models/bookshelf.glb')
 *   return <primitive object={scene.clone()} position={position} />
 */

// ── Bookshelf Placeholder ────────────────────────────────────────────────────
// Posicionado na parede norte, lado leste do painel de status.
// Substitua por: useGLTF('/models/bookshelf.glb')

const BOOK_COLORS = [
  '#1C1008', '#2A1A0E', '#3A2010', '#160C04',
  '#0E1520', '#12181F', '#1A2030', '#0A1018',
  '#111111', '#1A1A1A', '#0E0E0E', '#222018',
];

export function BookshelfPlaceholder({
  position = [0, 0, 0] as [number, number, number],
  width = 4.5,
}: {
  position?: [number, number, number];
  width?: number;
}) {
  const SHELF_H = 3.0;
  const SHELF_DEPTHS = [0.2, 0.85, 1.5, 2.15, 2.8];
  const [px, py, pz] = position;

  return (
    <group position={[px, py, pz]}>
      {/* Back panel */}
      <mesh position={[0, SHELF_H / 2, 0]}>
        <boxGeometry args={[width, SHELF_H, 0.06]} />
        <meshStandardMaterial color="#111418" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Side panels */}
      {([-width / 2, width / 2] as number[]).map((ox, i) => (
        <mesh key={i} position={[ox, SHELF_H / 2, 0.15]}>
          <boxGeometry args={[0.05, SHELF_H, 0.32]} />
          <meshStandardMaterial color="#1A1E24" roughness={0.8} metalness={0.1} />
        </mesh>
      ))}

      {/* Shelves */}
      {SHELF_DEPTHS.map((sy, i) => (
        <mesh key={i} position={[0, sy, 0.15]}>
          <boxGeometry args={[width - 0.05, 0.04, 0.30]} />
          <meshStandardMaterial color="#1E2228" roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* Top cap */}
      <mesh position={[0, SHELF_H + 0.02, 0.15]}>
        <boxGeometry args={[width + 0.04, 0.04, 0.34]} />
        <meshStandardMaterial color="#1E2228" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* Books per shelf */}
      {SHELF_DEPTHS.slice(0, 4).map((sy, si) => {
        const slots = Math.floor((width - 0.2) / 0.18);
        const books = [];
        for (let b = 0; b < slots; b++) {
          const bookW = 0.10 + (b % 3) * 0.03;
          const bookH = 0.20 + (b % 5) * 0.04;
          const color = BOOK_COLORS[(si * slots + b) % BOOK_COLORS.length];
          const bx = -width / 2 + 0.12 + b * 0.19;
          books.push(
            <mesh key={b} position={[bx, sy + bookH / 2 + 0.04, 0.12]}>
              <boxGeometry args={[bookW, bookH, 0.18]} />
              <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
            </mesh>,
          );
        }
        return books;
      })}

      {/* Accent LED strip at top */}
      <mesh position={[0, SHELF_H + 0.06, 0.31]}>
        <boxGeometry args={[width - 0.1, 0.02, 0.02]} />
        <meshStandardMaterial
          color="#C9A84C"
          emissive="#C9A84C"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

// ── Professional Workstation Placeholder ─────────────────────────────────────
// Setup de monitor duplo + PC tower visível para as mesas do workspace.
// Substitua por: useGLTF('/models/workstation.glb')

export function WorkstationPlaceholder({
  position = [0, 0, 0] as [number, number, number],
  accentColor = '#4A90D9',
  rotation = [0, 0, 0] as [number, number, number],
}: {
  position?: [number, number, number];
  accentColor?: string;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Monitor principal (centro) */}
      <group position={[0, 0, 0]}>
        {/* Bezel */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.62, 0.38, 0.025]} />
          <meshStandardMaterial color="#111416" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.55, 0.014]}>
          <boxGeometry args={[0.56, 0.33, 0.002]} />
          <meshStandardMaterial
            color="#050C18"
            emissive={accentColor}
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0}
          />
        </mesh>
        {/* Stand neck */}
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[0.04, 0.22, 0.04]} />
          <meshStandardMaterial color="#252830" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Stand base */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.20, 0.02, 0.14]} />
          <meshStandardMaterial color="#1E2128" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* Monitor secundário (ligeiramente à direita, ângulo) */}
      <group position={[0.52, 0, 0]} rotation={[0, -0.28, 0]}>
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.52, 0.32, 0.025]} />
          <meshStandardMaterial color="#111416" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.52, 0.014]}>
          <boxGeometry args={[0.47, 0.28, 0.002]} />
          <meshStandardMaterial
            color="#050C18"
            emissive={accentColor}
            emissiveIntensity={0.25}
            roughness={0.1}
            metalness={0}
          />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[0.04, 0.18, 0.04]} />
          <meshStandardMaterial color="#252830" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.18, 0.02, 0.12]} />
          <meshStandardMaterial color="#1E2128" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* PC Tower (à esquerda, vertical, painel transparente com RGB) */}
      <group position={[-0.60, 0, -0.05]}>
        {/* Case body */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.16, 0.44, 0.40]} />
          <meshStandardMaterial color="#0E1218" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Side panel (glass look) */}
        <mesh position={[0.081, 0.22, 0]}>
          <boxGeometry args={[0.002, 0.42, 0.38]} />
          <meshPhysicalMaterial
            color="#1A2A3A"
            transmission={0.5}
            roughness={0.05}
            thickness={0.04}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* RGB strip inside */}
        <mesh position={[0.065, 0.22, 0]}>
          <boxGeometry args={[0.002, 0.38, 0.01]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1.8}
          />
        </mesh>
        {/* Power button */}
        <mesh position={[0, 0.42, 0.201]}>
          <cylinderGeometry args={[0.012, 0.012, 0.005, 8]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>
    </group>
  );
}

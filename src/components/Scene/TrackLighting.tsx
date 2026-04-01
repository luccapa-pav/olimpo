// LED track lighting fixtures — parallel rails over the workspace desk row
// Two tracks at z=0.5 and z=2.5, x from -13.5 to -0.5, y=3.40

const TRACK_Y   = 3.40;
const TRACK_LEN = 13.0;
const TRACK_CX  = -7.0; // center of desk row x
const FIXTURE_SPACING = 1.5;
const FIXTURE_COUNT = Math.floor(TRACK_LEN / FIXTURE_SPACING);

const TRACK_Z_POSITIONS = [0.5, 2.5];


function FixtureHead({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, TRACK_Y, z]}>
      {/* Housing cylinder */}
      <mesh position={[0, -0.032, 0]}>
        <cylinderGeometry args={[0.038, 0.030, 0.065, 10]} />
        <meshStandardMaterial color="#0E0E0E" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lens — emissive warm white */}
      <mesh position={[0, -0.068, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.008, 10]} />
        <meshStandardMaterial
          color="#FFF8E7"
          emissive="#FFF8E7"
          emissiveIntensity={2.2}
        />
      </mesh>
      {/* Lens rim */}
      <mesh position={[0, -0.068, 0]}>
        <torusGeometry args={[0.024, 0.004, 6, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export function TrackLighting() {
  const startX = TRACK_CX - TRACK_LEN / 2;

  return (
    <group>
      {TRACK_Z_POSITIONS.map((z) => (
        <group key={z}>
          {Array.from({ length: FIXTURE_COUNT }, (_, i) => {
            const x = startX + FIXTURE_SPACING * 0.5 + i * FIXTURE_SPACING;
            return <FixtureHead key={i} x={x} z={z} />;
          })}
        </group>
      ))}
    </group>
  );
}

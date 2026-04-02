import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Office } from './components/Scene/Office';
import { ChatPanel } from './components/UI/ChatPanel';
import { StatusBar } from './components/UI/StatusBar';
import { AudioControls } from './components/UI/AudioControls';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0D0D0D', position: 'relative' }}>
      <Suspense fallback={null}>
        <Canvas
          orthographic
          camera={{ zoom: 40, position: [14, 14, 14], near: 0.1, far: 1000 }}
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          frameloop="demand"
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={['#0D0D0D']} />
          <fogExp2 attach="fog" args={['#0A0A12', 0.010]} />

          <Office />

          <EffectComposer>
            <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.3} darkness={0.5} />
          </EffectComposer>

          <OrbitControls
            enableRotate={false}
            enablePan={true}
            enableZoom={true}
            minZoom={20}
            maxZoom={120}
            panSpeed={0.8}
            zoomSpeed={0.8}
            target={[-1, 0, 0]}
          />
        </Canvas>
      </Suspense>

      <ChatPanel />
      <StatusBar />
      <AudioControls />
    </div>
  );
}

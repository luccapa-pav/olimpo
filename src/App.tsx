import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Office } from './components/Scene/Office';
import { ChatPanel } from './components/UI/ChatPanel';
import { StatusBar } from './components/UI/StatusBar';

function LoadingFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0D0D0D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#C9A84C',
        fontFamily: 'monospace',
        fontSize: '14px',
        letterSpacing: '3px',
      }}
    >
      OLIMPO HQ — CARREGANDO…
    </div>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0D0D0D', position: 'relative' }}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          orthographic
          camera={{
            zoom: 55,
            position: [12, 12, 12],
            near: 0.1,
            far: 1000,
          }}
          shadows
          style={{ background: '#0D0D0D' }}
          gl={{ antialias: true }}
        >
          {/* Fog suave para profundidade */}
          <fog attach="fog" args={['#0D0D0D', 30, 80]} />

          <Office />

          <OrbitControls
            enableRotate={false}
            enablePan={true}
            enableZoom={true}
            minZoom={25}
            maxZoom={120}
            panSpeed={0.8}
            zoomSpeed={0.8}
          />

          <Environment preset="night" />
        </Canvas>
      </Suspense>

      <ChatPanel />
      <StatusBar />
    </div>
  );
}

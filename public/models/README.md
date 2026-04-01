# /public/models — 3D Asset Drop Zone

Drop CC0-licensed `.glb` files here to replace procedural geometry.

| File          | Component               | Source suggestion              |
|---------------|-------------------------|-------------------------------|
| `desk.glb`    | `Furniture/Desk.tsx`    | Poly Haven / Sketchfab CC0    |
| `chair.glb`   | `Furniture/Chair.tsx`   | Poly Haven / Sketchfab CC0    |
| `monitor.glb` | `Furniture/Monitor.tsx` | Poly Haven / Sketchfab CC0    |
| `pc-tower.glb`| `Furniture/PCTower.tsx` | Poly Haven / Sketchfab CC0    |

## Integration pattern (per component)

1. Uncomment the `useGLTF` stub lines at the top of each component
2. Replace the `<RoundedBox>` / `<mesh>` subtree with `<primitive object={scene} />`
3. Wrap in `<Suspense fallback={<FallbackGeometry />}>` in the parent
4. Adjust `scale` / `position` to match the existing layout grid

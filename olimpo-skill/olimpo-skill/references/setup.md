# Setup do projeto Olimpo HQ

## Pré-requisitos
- Node.js 18+
- npm ou pnpm
- Git
- Conta Vercel
- API key Anthropic
- GitHub CLI (gh) — opcional mas recomendado

## 1. Criar repositório

```bash
# Via GitHub CLI
gh repo create guessless/olimpo --public --clone
cd olimpo

# Ou manualmente
mkdir olimpo && cd olimpo
git init
```

## 2. Inicializar projeto

```bash
# Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Dependências principais
npm install three @react-three/fiber @react-three/drei
npm install zustand
npm install framer-motion
npm install @anthropic-ai/sdk

# Dev dependencies
npm install -D tailwindcss @tailwindcss/vite
npm install -D @types/three
```

## 3. Configurar Tailwind

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

```css
/* src/index.css */
@import "tailwindcss";
```

## 4. Configurar Vercel

```bash
# Login e link
vercel login
vercel link

# Adicionar API key como env var
vercel env add ANTHROPIC_API_KEY production
```

```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@3"
    }
  }
}
```

## 5. Estrutura inicial de arquivos

Após o setup, criar a estrutura de pastas:
```bash
mkdir -p src/components/{Scene,Rooms,Agents,Furniture,UI}
mkdir -p src/{stores,config,hooks,api,types}
mkdir -p api
mkdir -p public/{models,textures}
```

## 6. Primeiro deploy

```bash
git add .
git commit -m "feat: initial project setup"
git push origin main
vercel --prod
```

## 7. Variáveis de ambiente

Necessárias no Vercel:
- `ANTHROPIC_API_KEY` — key da API Anthropic

Opcionais:
- `NEXT_PUBLIC_APP_URL` — URL do app (pra CORS)

## Desenvolvimento local

```bash
npm run dev
# Abre em http://localhost:5173

# Pra testar a serverless function localmente:
vercel dev
```

## Assets 3D

Pra fase 1 (MVP), usar geometria primitiva do Three.js (BoxGeometry, SphereGeometry).
Pra fases posteriores, modelos .glb podem vir de:
- Modelagem no Blender
- Sketchfab (licença CC)
- Ready Player Me (avatares)
- Quaternius (assets low-poly gratuitos)

Colocar os .glb em public/models/ e carregar com useGLTF do drei.

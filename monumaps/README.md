# Monumaps 🏛️
### Turismo Cultural — São Luís, Maranhão

Aplicação web móvel para exploração de monumentos históricos de São Luís via câmera, reconhecimento visual e narração guiada.

---

## Estrutura do projeto

```
src/
├── assets/              # Imagens, ícones, áudios estáticos
├── components/
│   └── ui/              # Componentes base (utils, hooks de UI)
├── data/
│   └── monuments.ts     # Banco de dados local com 5 monumentos de São Luís
├── hooks/
│   ├── useCamera.ts     # Acesso à câmera real (getUserMedia)
│   └── useAudioPlayer.ts # Player de áudio com controles
├── pages/
│   ├── HomePage.tsx         # Tela inicial com lista de monumentos
│   ├── CameraPage.tsx       # Câmera AR com scanner e captura
│   ├── MonumentDetailPage.tsx # Detalhes do monumento identificado
│   └── AudioPlayerPage.tsx  # Player de narração guiada com capítulos
├── routes/
│   └── AppRouter.tsx    # React Router v7 com todas as rotas
├── services/
│   └── recognitionService.ts # Camada de reconhecimento (mock + stubs AI)
├── types/
│   └── Monument.ts      # Interface TypeScript do monumento
└── utils/
    └── cn.ts            # Utilitário de classes CSS (clsx + tailwind-merge)
```

---

## Rotas

| Rota | Tela |
|------|------|
| `/` | Tela inicial com lista de monumentos |
| `/camera` | Scanner AR com câmera real |
| `/monumento/:id` | Detalhes do monumento |
| `/audio/:id` | Player de narração guiada |

---

## Como executar

### Pré-requisitos
- Node.js 18+
- npm 9+

### Instalação

```bash
# Clone ou descompacte o projeto
cd monumaps

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:5173**

> **Importante:** Para testar a câmera, acesse via **HTTPS** ou **localhost**.  
> Em redes locais, use `npm run dev -- --host` e acesse pelo IP via HTTPS (configure um certificado local com [mkcert](https://github.com/FiloSottile/mkcert)).

### Build para produção

```bash
npm run build
npm run preview   # Prévia local do build
```

---

## Monumentos cadastrados

| ID | Nome | Período |
|----|------|---------|
| `obelisco-memoria` | Obelisco da Memória | Século XIX |
| `palacio-leoes` | Palácio dos Leões | Século XVII |
| `catedral-se` | Catedral da Sé | Século XVII |
| `teatro-artur-azevedo` | Teatro Arthur Azevedo | Século XIX |
| `fonte-ribeirão` | Fonte do Ribeirão | Século XVIII |

---

## Fluxo de uso

```
Tela Inicial (/)
    │
    ├── [Escanear] ──→ /camera
    │                     │
    │               [Captura imagem]
    │                     │
    │           identificarMonumento()
    │                     │
    │              /monumento/:id ──→ [Ouvir narração] ──→ /audio/:id
    │
    └── [Monumento da lista] ──→ /monumento/:id
```

---

## Sistema de Reconhecimento

O arquivo `src/services/recognitionService.ts` possui uma arquitetura em camadas preparada para integração progressiva com visão computacional:

### Atual: Mock
Simula processamento e retorna monumentos ciclicamente para demonstração do fluxo completo.

### Próximos passos — Integração com IA

#### 1. TensorFlow.js (recomendado para início)
```bash
npm install @tensorflow/tfjs
```
- Treine um modelo de classificação com imagens dos monumentos
- Exporte como `model.json` + pesos
- Coloque em `public/models/monuments/`
- Descomente o stub `tensorflowRecognition()` no service

#### 2. OpenCV.js (feature matching)
```bash
# Baixe opencv.js de https://docs.opencv.org/4.x/opencv.js
# Coloque em public/
```
- Use ORB/SIFT para extrair descritores das imagens dos monumentos
- Compare descritores da câmera com o banco de referências
- Descomente o stub `opencvRecognition()` no service

#### 3. YOLO via ONNX Runtime (detecção em tempo real)
```bash
npm install onnxruntime-web
```
- Treine YOLOv8 com dataset dos monumentos
- Exporte para formato ONNX: `yolo export format=onnx`
- Descomente o stub `yoloRecognition()` no service

Para alternar entre engines:
```typescript
import { setRecognitionEngine } from "./services/recognitionService";
setRecognitionEngine("tensorflow"); // "mock" | "tensorflow" | "opencv" | "yolo"
```

---

## Adicionando áudios

Os monumentos têm o campo `audioUrl` pronto para receber arquivos MP3:

```typescript
// src/data/monuments.ts
{
  id: "obelisco-memoria",
  audioUrl: "/audios/obelisco-memoria.mp3",  // coloque em public/audios/
  duracao: "2:45",
  capitulos: [
    { id: 1, title: "Contexto histórico", time: "0:00", startSeconds: 0 },
    // ...
  ]
}
```

Coloque os arquivos MP3 em `public/audios/` e atualize os `audioUrl`.

---

## Deploy na Vercel

### Opção 1: Interface web (recomendado)

1. Suba o projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project**
3. Importe o repositório
4. Configurações automáticas (Vercel detecta Vite):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Clique em **Deploy**

### Opção 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Configuração de rotas (já incluída)

O arquivo `vercel.json` já está configurado para SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Câmera em produção

A Vercel serve via HTTPS automaticamente — a câmera funcionará sem configuração adicional.

---

## Permissões de câmera

A aplicação solicita permissão de câmera ao entrar em `/camera`. Se negada:
- Mostra mensagem de erro clara
- Instrui o usuário a habilitar nas configurações do navegador
- Prioriza câmera traseira (`facingMode: "environment"`) em dispositivos móveis

---

## Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.3 | UI |
| React Router | 7.13 | Navegação |
| TypeScript | 5.5 | Tipagem |
| Vite | 6.3 | Build/Dev server |
| Tailwind CSS | 4.1 | Estilização |
| Lucide React | 0.487 | Ícones |
| navigator.mediaDevices | Web API | Câmera real |

---

## Próximas funcionalidades sugeridas

- [ ] **Mapa interativo** com localização dos monumentos (Leaflet.js ou Mapbox)
- [ ] **Modo offline** com Service Worker e cache dos dados
- [ ] **PWA** com instalação na tela inicial (manifest.json)
- [ ] **Favoritos** com persistência em localStorage
- [ ] **Integração TensorFlow.js** para reconhecimento real
- [ ] **Compartilhamento** via Web Share API
- [ ] **Acessibilidade** com narração automática (Web Speech API)
- [ ] **Múltiplos idiomas** (i18n) — português, inglês, espanhol

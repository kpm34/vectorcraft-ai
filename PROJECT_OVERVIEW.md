# VectorCraft AI - Comprehensive Project Overview

**Last Updated:** NOV 2025  
**Version:** 0.0.0  
**Status:** Active Development

---

## 📋 Executive Summary

**VectorCraft AI** is a comprehensive, multi-platform vector graphics ecosystem designed for 3D artists, game developers, and front-end designers. The project combines an advanced SVG editor with AI-powered vectorization, texture generation, and multiple deployment options (web app, CLI, API, and Blender integration).

### Core Value Proposition
> "Everything a 3D artist needs from vectors before they hit the viewport."

The platform enables users to create, edit, optimize, and export 3D-ready vector assets with AI assistance, supporting workflows from initial design through to game engine integration.

---

## 🏗️ Project Architecture

### High-Level Structure

```
vectorcraft-ai/
├── 📱 Web Application (Main)
│   ├── SVG Editor (App-SVG-Editor.tsx)
│   ├── Texture Generator (MatcapStudio.tsx)
│   └── Components & Services
│
├── 🖥️ CLI Tool (cli/)
│   └── Command-line SVG conversion
│
├── 🌐 REST API (api/)
│   └── Programmatic SVG conversion service
│
├── 🎨 Blender Add-on (blender-addon/)
│   └── Bridge for Blender integration
│
├── 🧪 MatCap & PBR GenAI (matcap-&-pbr-genai/)
│   └── Standalone texture generation app
│
└── 🔌 MCP Servers (mcp-servers/)
    ├── Dream Textures MCP
    ├── Hyper3D Texture MCP
    ├── Polyhaven MCP
    └── Scenario MCP
```

---

## 🎯 Core Applications

### 1. **VectorCraft SVG Editor** (Primary Application)

**File:** `App-SVG-Editor.tsx`  
**Purpose:** Interactive SVG editor with AI-powered features

#### Key Features

**Drawing & Editing Tools:**
- ✏️ **Pen Tool** - Freehand vector drawing
- 🖍️ **Crayon Tool** - Textured/stylized strokes with noise filters
- 🧹 **Eraser** - Customizable eraser with visual cursor feedback
- 🪣 **Fill Tool** - Paint bucket for closed paths
- 📝 **Text Tool** - Multi-line text with font customization
- ✋ **Hand Tool** - Canvas panning (middle mouse or tool)
- 🔲 **Shape Tools** - Rectangle, Square, Ellipse, Circle, Triangle, Star, Line
- 🎯 **Selection Tools** - Box selection, Lasso selection
- 🔄 **Transform Tools** - Move, Rotate, Scale, Flip (with visual handles)

**Advanced Features:**
- 🔄 **Undo/Redo** - Full history management
- 🎨 **Color Extraction** - Automatic color palette from canvas
- 📐 **Geometry Utilities** - Path smoothing, bounding box calculations, hit testing
- 🔍 **Zoom & Pan** - Infinite zoom with mouse wheel, viewBox management
- 📋 **Context Menu** - Right-click operations (duplicate, flip, delete)
- ⌨️ **Keyboard Shortcuts** - Delete, Ctrl+D (duplicate)

**AI Integration:**
- 🤖 **Gemini Smart Edit** - AI-powered SVG modification via prompts
- 🖼️ **Image Vectorization** - Convert PNG/JPG to SVG with complexity controls
- 🌐 **URL Import** - Import websites as reference layers (requires screenshot API)

**Export Options:**
- 📥 **SVG Export** - Standard SVG download
- 💻 **Code Export** - 7 formats:
  - Raw SVG
  - JSX
  - React Component
  - Animate (with duration control)
  - Reveal (4 animation styles)
  - Mask (3 formats)
  - Design Tokens (JSON)

**Technical Implementation:**
- **Framework:** React 19 + TypeScript
- **Rendering:** SVG-based canvas with custom coordinate system
- **State Management:** React hooks with undo/redo stacks
- **AI Service:** Google Gemini 2.0 Flash (via `services/gemini.ts`)
- **Styling:** Tailwind CSS (CDN in dev, should be built for production)

---

### 2. **MatCap & PBR Texture Generator**

**File:** `MatcapStudio.tsx` / `matcap-&-pbr-genai/App.tsx`  
**Purpose:** AI-powered texture generation for 3D workflows

#### Key Features

**Generation Modes:**
- 🎨 **MatCap Mode** - Material capture spheres (lighting baked into texture)
- 🌍 **PBR Mode** - Physically Based Rendering textures with:
  - Albedo map (base color)
  - Normal map (surface detail, auto-generated)
  - Roughness map (surface finish, auto-generated)

**Quality Options:**
- ⚡ **Fast Mode** - Gemini 2.5 Flash (quick iterations)
- 🎯 **High Quality** - Gemini 3 Pro (production-ready)

**Resolution:**
- 📐 **1K** - Fast initial generation (1024x1024)
- 📐 **2K** - Upscaled production (2048x2048)

**3D Preview:**
- 🎲 **Geometry Types:** Sphere, Box, Torus, Plane
- 🎬 **Auto-rotation** - MatCap mode
- 💡 **Dynamic Lighting** - PBR mode with environment maps
- 🎮 **Orbit Controls** - Interactive camera

**Technical Implementation:**
- **3D Engine:** React Three Fiber + Three.js
- **3D Helpers:** @react-three/drei (Stage, OrbitControls, useTexture)
- **Image Processing:** Client-side normal/roughness map generation
- **AI Service:** Google Gemini 3 Pro Image Preview (for 2K) / Gemini 2.5 Flash (for 1K)

---

### 3. **CLI Tool**

**Location:** `cli/`  
**Purpose:** Command-line SVG conversion for build pipelines and automation

#### Features

**Installation:**
```bash
npm install -g @vectorcraft/cli
```

**Usage:**
```bash
svgify input.png --mode logo-clean --out output.svg
```

**Modes:**
- `logo-clean` - Optimized for logos (minimal colors, clean paths)
- `icon` - UI icons (normalized viewBox, consistent strokes)
- `illustration` - Detailed artwork (more colors, gradients)
- `auto` - Automatic mode detection

**Options:**
- Output path specification
- Quality control (low/medium/high)
- Color limit configuration
- API key management (env var or flag)

**Use Cases:**
- Build pipeline integration
- Batch processing scripts
- CI/CD automation
- Asset optimization workflows

---

### 4. **REST API Server**

**Location:** `api/`  
**Purpose:** Programmatic SVG conversion service

#### Endpoints

**POST `/api/convert`**
- Converts base64-encoded images to SVG
- Supports multiple modes and quality settings
- Returns SVG string + metadata

**GET `/health`**
- Health check endpoint

**GET `/api/status`**
- API status and endpoint information

#### Features

- Rate limiting (10 requests/minute per IP)
- Error handling with descriptive messages
- TypeScript implementation
- Express.js backend
- Environment-based configuration

**Deployment Options:**
- Vercel (serverless)
- Docker container
- Traditional Node.js server

---

### 5. **Blender Add-on**

**Location:** `blender-addon/`  
**Purpose:** Bridge between Blender and VectorCraft

#### Workflow

1. Export Blender curves → VectorCraft
2. Clean/optimize SVG in VectorCraft
3. Import cleaned SVG back to Blender
4. Auto-extrude for 3D geometry

**Use Cases:**
- Logo placement on helmets/jerseys
- Stadium signage
- 3D text generation
- Decal workflows

---

### 6. **MCP Servers**

**Location:** `mcp-servers/`  
**Purpose:** Model Context Protocol integrations for various services

#### Available Servers

1. **Dream Textures MCP** - Texture generation integration
2. **Hyper3D Texture MCP** - 3D texture generation
3. **Polyhaven MCP** - Asset library integration
4. **Scenario MCP** - Scenario-based generation

**Status:** Under development (various stages of completion)

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 6** - Build tool and dev server
- **Tailwind CSS** - Styling (CDN in dev)
- **Lucide React** - Icon library

### 3D Graphics
- **Three.js 0.181** - 3D rendering engine
- **React Three Fiber 9.4** - React renderer for Three.js
- **@react-three/drei 10.7** - Useful helpers and abstractions

### AI Services
- **Google Gemini API** - AI-powered features
  - Gemini 2.0 Flash (fast operations)
  - Gemini 3 Pro Image Preview (high-quality generation)
- **@google/genai 1.30** - Official SDK

### Backend (API)
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Node.js 20+** - Runtime

### CLI
- **Commander** - CLI argument parsing
- **Chalk** - Terminal styling
- **Ora** - Loading spinners

### Development Tools
- **TypeScript 5.8** - Language
- **Vite** - Build tool
- **Git** - Version control

---

## 📁 File Structure Deep Dive

### Root Level

```
vectorcraft-ai/
├── App.tsx                    # Main texture generator app
├── App-SVG-Editor.tsx         # SVG editor application
├── MatcapStudio.tsx          # Texture studio (duplicate/alternative)
├── index.tsx                  # React entry point
├── index.html                 # HTML entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
├── types.ts                   # Shared TypeScript types
├── README.md                  # Main documentation
├── TEST_REPORT.md            # Test results and status
└── PROJECT_OVERVIEW.md        # This file
```

### Components Directory

```
components/
├── AiPromptModal.tsx         # AI editing modal
├── CodeExportModal.tsx      # Code export with 7 formats
├── ControlPanel.tsx          # Texture generator controls
├── Footer.tsx                # Bottom toolbar (import/export)
├── LandingPage.tsx           # Welcome/onboarding screen
├── ThreeDExportModal.tsx     # 3D export options
├── Toolbar.tsx               # Drawing tools sidebar
├── TopBar.tsx                # Top menu (undo/redo/import)
├── UrlImportModal.tsx        # Website import modal
├── VectorizationModal.tsx    # Image-to-SVG conversion modal
└── Viewer3D.tsx              # 3D texture preview
```

### Services Directory

```
services/
├── gemini.ts                 # Gemini API integration (SVG editor)
├── geminiService.ts          # Gemini API integration (texture gen)
└── imageProcessing.ts       # Normal/roughness map generation
```

### Utilities Directory

```
utils/
└── geometry.ts               # Geometry calculations
    - Path smoothing
    - Bounding box calculations
    - Hit testing
    - Point transformations
    - SVG parsing
```

### Sub-Projects

```
matcap-&-pbr-genai/          # Standalone texture generator
├── App.tsx
├── components/
│   ├── ControlPanel.tsx
│   └── Viewer3D.tsx
├── services/
│   ├── geminiService.ts
│   └── imageProcessing.ts
├── types.ts
├── vite.config.ts
└── package.json

cli/                          # Command-line tool
├── src/
│   └── index.ts
├── bin/
│   └── svgify.js
├── package.json
└── README.md

api/                          # REST API server
├── src/
│   ├── index.ts
│   └── screenshot.ts
├── package.json
└── README.md

blender-addon/                # Blender integration
├── __init__.py
└── README.md

mcp-servers/                  # MCP protocol servers
├── dream-textures-mcp/
├── hyper3d-texture-mcp/
├── polyhaven-mcp/
└── scenario-mcp/
```

---

## 🔑 Key Features Breakdown

### SVG Editor Features

#### Drawing Capabilities
- **Freehand Drawing** - Smooth path generation with configurable smoothing
- **Shape Tools** - 7 geometric shapes with live preview
- **Text Editing** - Inline text editing with font controls
- **Crayon Mode** - Stylized strokes with SVG filters

#### Editing Capabilities
- **Selection** - Multi-select with box/lasso tools
- **Transformations** - Move, rotate, scale with visual handles
- **Eraser** - Path-aware erasing with customizable size
- **Fill Tool** - Paint bucket for closed shapes
- **Context Menu** - Right-click operations

#### Advanced Features
- **Undo/Redo** - Full action history
- **Zoom/Pan** - Infinite zoom with mouse wheel
- **Color Extraction** - Automatic palette generation
- **Path Smoothing** - Configurable smoothing levels
- **ViewBox Management** - Dynamic canvas sizing

#### AI Features
- **Smart Edit** - AI-powered SVG modification
- **Vectorization** - PNG/JPG to SVG conversion
- **URL Import** - Website screenshot as reference layer

#### Export Options
- **SVG Download** - Standard export
- **Code Export** - 7 formats (JSX, React, Animate, Reveal, Mask, Tokens)
- **3D Export** - Blender-ready formats

---

### Texture Generator Features

#### Generation Modes
- **MatCap** - Material capture spheres (baked lighting)
- **PBR** - Full physically-based rendering workflow

#### Quality Options
- **Fast** - Gemini 2.5 Flash (quick iterations)
- **High** - Gemini 3 Pro (production quality)

#### Resolution Support
- **1K** - 1024x1024 (fast generation)
- **2K** - 2048x2048 (upscaled production)

#### 3D Preview
- **Multiple Geometries** - Sphere, Box, Torus, Plane
- **Interactive Camera** - Orbit controls
- **Auto-rotation** - MatCap mode
- **Environment Lighting** - PBR mode with HDR environments

#### Post-Processing
- **Normal Map Generation** - Client-side from albedo
- **Roughness Map Generation** - Client-side from albedo
- **Seamless Tiling** - Automatic texture wrapping

---

## 🔌 API Integration

### Gemini API Usage

**SVG Editor:**
- Model: Gemini 2.0 Flash
- Use Cases: SVG modification, image vectorization
- Endpoint: Direct API calls via `@google/genai`

**Texture Generator:**
- Models: Gemini 2.5 Flash (fast) / Gemini 3 Pro Image Preview (high quality)
- Use Cases: Texture generation from prompts
- Resolution: 1K (default) / 2K (upscale)

**Configuration:**
- API Key: `GEMINI_API_KEY` environment variable
- AI Studio Integration: Optional `window.aistudio` API for key management

---

## 📊 Project Status

### ✅ Completed Features

**SVG Editor:**
- ✅ All drawing tools implemented
- ✅ Selection and transformation system
- ✅ Undo/redo functionality
- ✅ Export options (SVG + 7 code formats)
- ✅ AI integration (Gemini Smart Edit)
- ✅ Image vectorization
- ✅ URL import modal
- ✅ Context menu
- ✅ Keyboard shortcuts

**Texture Generator:**
- ✅ MatCap generation
- ✅ PBR texture generation
- ✅ Normal/roughness map generation
- ✅ 3D preview with multiple geometries
- ✅ Quality/resolution options
- ✅ Upscale functionality

**Infrastructure:**
- ✅ CLI tool structure
- ✅ API server structure
- ✅ Blender add-on structure
- ✅ MCP server integrations started

### ⚠️ Partially Complete

- ⚠️ **URL Import** - Requires separate screenshot API service
- ⚠️ **MCP Servers** - Various stages of development
- ⚠️ **Blender Add-on** - Basic structure, needs testing
- ⚠️ **Production Build** - Tailwind CSS still using CDN

### 🔄 In Progress / Planned

- 🔄 **Testing** - Unit tests for geometry utilities
- 🔄 **Error Handling** - User-friendly error messages
- 🔄 **Documentation** - API documentation completion
- 🔄 **Performance** - Optimization for large SVGs
- 🔄 **Batch Processing** - CLI batch operations
- 🔄 **Sprite Sheet Generation** - Export feature
- 🔄 **Icon Font Generation** - Export feature

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** - Runtime environment
- **npm** - Package manager
- **Google Gemini API Key** - For AI features
- **Git** - Version control (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/kpm34/vectorcraft-ai.git
cd vectorcraft-ai

# Install dependencies
npm install

# Set up environment variables
echo "GEMINI_API_KEY=your-api-key-here" > .env.local
```

### Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running Sub-Projects

**CLI:**
```bash
cd cli
npm install
npm run build
npm link
svgify input.png --mode logo-clean
```

**API Server:**
```bash
cd api
npm install
echo "GEMINI_API_KEY=your-key" > .env
npm run dev
```

**Texture Generator (Standalone):**
```bash
cd matcap-&-pbr-genai
npm install
npm run dev
```

---

## 📝 Configuration

### Environment Variables

**Main Application:**
- `GEMINI_API_KEY` - Google Gemini API key (required for AI features)
- `VITE_GEMINI_API_KEY` - Alternative env var name

**API Server:**
- `GEMINI_API_KEY` - API key for conversions
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

**Vite Configuration:**
- Port: 3000
- Host: 0.0.0.0 (accessible on network)
- React plugin enabled
- TypeScript support

---

## 🎨 Design Philosophy

### User Experience

1. **Progressive Disclosure** - Show features as needed
2. **Visual Feedback** - Immediate response to user actions
3. **Keyboard Shortcuts** - Power user efficiency
4. **Context Menus** - Right-click for common operations
5. **Undo/Redo** - Non-destructive editing

### Code Architecture

1. **Component-Based** - Reusable React components
2. **Type Safety** - TypeScript throughout
3. **Separation of Concerns** - Services, components, utilities
4. **Performance** - Efficient rendering and state management
5. **Extensibility** - Easy to add new tools/features

---

## 🔒 Security Considerations

### Current Implementation

- ✅ API keys stored in environment variables
- ✅ No hardcoded secrets
- ✅ Client-side image processing (no server uploads for normal/roughness maps)
- ⚠️ API key exposed in client-side code (Vite define)

### Recommendations

- 🔒 Use backend proxy for API calls (hide API keys)
- 🔒 Implement rate limiting on API endpoints
- 🔒 Add input validation and sanitization
- 🔒 Implement CORS policies
- 🔒 Add authentication for API endpoints

---

## 📈 Performance Considerations

### Current Optimizations

- ✅ React Suspense for 3D texture loading
- ✅ Efficient path rendering (only visible paths)
- ✅ Debounced state updates
- ✅ Canvas-based image processing (no external libraries)

### Areas for Improvement

- 💡 Virtual scrolling for large SVG files
- 💡 Web Workers for heavy computations
- 💡 Lazy loading of components
- 💡 Image compression for exports
- 💡 Caching for repeated operations

---

## 🧪 Testing Status

### Test Coverage

**UI Components:** ✅ 26/27 features tested, 26 passed

**Tested Features:**
- ✅ All toolbar tools accessible
- ✅ All modals open/close correctly
- ✅ Canvas initialization
- ✅ Export functionality
- ✅ Import functionality

**Not Tested (Manual Required):**
- 🔄 Actual drawing interactions
- 🔄 Path selection and transformation
- 🔄 File upload workflows
- 🔄 Keyboard shortcuts
- 🔄 Context menu interactions

### Test Report

See `TEST_REPORT.md` for comprehensive test results.

---

## 🗺️ Roadmap

### Short Term (Next Release)

- [ ] Replace Tailwind CDN with build process
- [ ] Add error boundaries
- [ ] Improve error messages
- [ ] Complete MCP server integrations
- [ ] Add unit tests for geometry utilities

### Medium Term

- [ ] Batch processing CLI
- [ ] Sprite sheet generator
- [ ] Icon font generation
- [ ] WebSocket real-time conversion
- [ ] Team collaboration features

### Long Term

- [ ] Mobile app support
- [ ] Plugin system
- [ ] Marketplace for presets
- [ ] Advanced animation tools
- [ ] Collaborative editing

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- TypeScript strict mode
- React functional components with hooks
- Tailwind CSS for styling
- ESLint/Prettier (recommended)

---

## 📄 License

MIT © 2025 VectorCraft AI

---

## 🔗 Resources

### Documentation

- [Main README](./README.md)
- [CLI Documentation](./cli/README.md)
- [API Documentation](./api/README.md)
- [Test Report](./TEST_REPORT.md)

### External Links

- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs)
- [Vite Documentation](https://vitejs.dev)

---

## 👥 Credits

**Project:** VectorCraft AI  
**Author:** kpm34  
**Repository:** https://github.com/kpm34/vectorcraft-ai

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review test reports for known issues

---

**Made with ❤️ for makers, developers, and designers**


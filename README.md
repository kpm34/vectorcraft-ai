# VectorCraft AI

**A lightweight vector workstation for logos, icons, and makers.**

Convert images to SVG, normalize icon systems, and export production-ready code. Built for front-end developers and UI designers.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kpm34/vectorcraft-ai)

## 🎯 Features

### Web Workstation
- **Interactive SVG Editor** - Draw, edit, and manipulate vectors
- **AI Vectorization** - Convert PNG/JPG to SVG with Google Gemini
- **Icon Normalization** - Standardize viewBox, auto-center, enforce padding
- **Developer Exports** - React/Vue components, JSX, sprite sheets
- **SVG Optimizer** - Reduce file size, clean code output
- **Multi-format Export** - SVG, PNG, PDF, code

### CLI Tool
```bash
npm install -g @vectorcraft/cli

svgify logo.png --mode logo-clean
svgify icon.png --out dist/icon.svg --mode icon
```

### REST API
```bash
POST /api/convert
{
  "image": "base64...",
  "mode": "logo-clean"
}
```

## 🚀 Quick Start

### Web App

**Prerequisites:** Node.js 20+

1. **Clone & Install**
   ```bash
   git clone https://github.com/kpm34/vectorcraft-ai.git
   cd vectorcraft-ai
   npm install
   ```

2. **Set API Key**
   ```bash
   # .env.local
   VITE_GEMINI_API_KEY=your-api-key-here
   ```

3. **Run**
   ```bash
   npm run dev
   ```

4. **Build**
   ```bash
   npm run build
   ```

### CLI

See [`cli/README.md`](./cli/README.md) for full CLI documentation.

```bash
cd cli
npm install
npm run build
npm link

# Usage
svgify input.png --mode logo-clean --out output.svg
```

### API Server

See [`api/README.md`](./api/README.md) for full API documentation.

```bash
cd api
npm install

# Set environment
echo "GEMINI_API_KEY=your-key" > .env

npm run dev  # Development
npm start    # Production
```

## 📦 Project Structure

```
vectorcraft-ai/
├── components/          # React components (web app)
├── services/           # AI services (Gemini integration)
├── utils/             # Geometry utilities
├── cli/               # CLI package
│   ├── src/          # CLI source code
│   └── bin/          # Executable entry point
├── api/              # REST API server
│   └── src/         # API source code
├── App.tsx           # Main application
└── index.html        # Entry point
```

## 🎨 Use Cases

- **Logos & Brand Assets** - Convert and optimize logos for any platform
- **Icons & UI Assets** - Build consistent icon systems
- **SaaS Integration** - Embed SVG conversion in your product
- **Agency Workflows** - Script bulk asset conversions
- **Build Pipelines** - Automate asset optimization in CI/CD

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **AI:** Google Gemini 2.0 Flash
- **CLI:** Commander, Chalk, Ora
- **API:** Express, TypeScript
- **Deploy:** Vercel

## 📖 Documentation

- [CLI Documentation](./cli/README.md)
- [API Documentation](./api/README.md)
- [Live Demo](https://vectorcraft-hj4dk504j-kpm34s-projects.vercel.app)

## 🎯 Roadmap

- [ ] Icon font generation
- [ ] Batch processing CLI
- [ ] Sprite sheet generator
- [ ] WebSocket real-time conversion
- [ ] Team collaboration features

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

MIT © 2025 VectorCraft AI

---

**Made with ❤️ for makers, developers, and designers**

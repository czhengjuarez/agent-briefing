# Agent Briefing Tool

AI-powered agent delegation tool with smart objective composition, file context upload, and future agent chaining capabilities.

## ✨ Features

### 🎯 Core Features (MVP)
- **Agent Briefing Template**: Structured 6-field form for clear agent delegation
  - Objective (AI-enhanced)
  - Context (with file upload)
  - Boundaries
  - Escalation
  - Stakeholders
  - Success Criteria

### 🤖 AI-Powered Features
- **Smart Objective Composer**: AI asks clarifying questions to refine vague goals
- **File Summarization**: Upload PDFs/docs and get AI-generated summaries
- **Context Enhancement**: AI helps structure your briefing fields

### 📁 File Management
- **Supported Formats**: PDF, DOC, DOCX, TXT, MD, CSV, XLSX
- **Max File Size**: 10MB per file
- **Max Files**: 5 files per briefing
- **Storage**: Cloudflare R2 for scalable object storage

### 🎨 Design System
- **Color Palette**: Matches PromptLibrary aesthetic
  - Primary: `#8E1F5A`
  - Secondary: `#DD388B`
  - Dark Background: `#0D1533`
- **Dark Mode**: Full dark mode support with localStorage persistence
- **Responsive**: Mobile-first design
- **Accessible**: WCAG AA compliant

## 🏗️ Architecture

### Frontend
- **React 19** with Hooks
- **Vite** for fast development
- **Tailwind CSS 3.4.17** with custom theme
- **React Dropzone** for file uploads

### Backend (Cloudflare Workers)
- **Cloudflare Workers** for serverless API
- **Cloudflare KV** for briefing data storage
- **Cloudflare R2** for file storage
- **Cloudflare AI** for smart features
  - Model: `@cf/meta/llama-3.1-8b-instruct` or `@cf/mistral/mistral-7b-instruct-v0.1`

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with Workers, KV, R2, and AI enabled

### Local Development

1. **Clone and navigate to project**
   ```bash
   cd AgentBriefing/frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

4. **Set up backend worker** (in separate terminal)
   ```bash
   cd ../worker
   npm install
   
   # Create KV namespace
   wrangler kv:namespace create "AGENT_BRIEFING_KV"
   wrangler kv:namespace create "AGENT_BRIEFING_KV" --preview
   
   # Create R2 bucket
   wrangler r2 bucket create agent-briefing-files
   wrangler r2 bucket create agent-briefing-files-preview
   
   # Update wrangler.toml with your namespace IDs
   
   # Start worker dev server
   wrangler dev
   ```

## 🚀 Deployment

### Backend Worker
```bash
cd worker
wrangler deploy
```

### Frontend
```bash
cd frontend
npm run build

# Deploy using frontend worker (similar to PromptLibrary)
# Build script coming soon
```

## 📊 API Endpoints

### Briefings
- `GET /api/briefings` - List all briefings
- `GET /api/briefings/:id` - Get single briefing
- `POST /api/briefings` - Create briefing
- `PUT /api/briefings/:id` - Update briefing
- `DELETE /api/briefings/:id` - Delete briefing

### AI Features
- `POST /api/ai/refine-objective` - Smart objective composer
- `POST /api/ai/summarize-file` - Summarize uploaded file

### File Management
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Get file metadata
- `DELETE /api/files/:id` - Delete file

## 🎯 Roadmap

### Phase 1: MVP (Current)
- ✅ Project setup with reusable components from PromptLibrary
- ⏳ Basic briefing form with 6 fields
- ⏳ CRUD operations for briefings
- ⏳ Dark mode support
- ⏳ Responsive design

### Phase 2: AI Features
- ⏳ Smart Objective Composer
- ⏳ File upload and processing
- ⏳ AI file summarization
- ⏳ Context enhancement

### Phase 3: Integration
- 🔄 Cross-linking with PromptLibrary
- 🔄 Import prompts from PromptLibrary
- 🔄 Export briefings as prompts
- 🔄 Shared component library

### Phase 4: Advanced Features
- 🔄 Agent chaining workflows
- 🔄 Template marketplace
- 🔄 Team collaboration
- 🔄 Version history

## 🔗 Related Projects

- **[PromptLibrary](../PromptLibrary)**: AI Prompt management tool with shared design system

## 🛠️ Tech Stack

- React 19
- Vite
- Tailwind CSS 3.4.17
- Cloudflare Workers
- Cloudflare KV
- Cloudflare R2
- Cloudflare AI
- React Dropzone

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

*Built with ❤️ using React, Vite, Tailwind CSS, and Cloudflare*

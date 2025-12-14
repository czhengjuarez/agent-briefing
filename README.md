# Agent Briefing Tool

> **AI-powered delegation framework that transforms vague instructions into clear, actionable agent briefings.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://agent-briefing.coscient.workers.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

---

## 🎯 The Problem

When delegating tasks to AI agents, humans often provide **vague, incomplete instructions** that lead to:

- ❌ **Ambiguous objectives**: "Write a blog" → What audience? What tone? What outcome?
- ❌ **Missing context**: Agents lack critical background information and organizational history
- ❌ **Unclear boundaries**: No guidance on what the agent should/shouldn't do
- ❌ **No escalation path**: Agents don't know when to ask for help
- ❌ **Undefined success**: No clear criteria for what "done" looks like

**Result:** Wasted time, poor outputs, and frustration on both sides.

---

## 💡 The Solution

**Agent Briefing Tool** provides a **structured framework** for clear delegation:

1. **AI-Guided Objective Refinement**: Transforms "Write a blog" into "Write a 1500-word technical blog post for software developers about Cloudflare Workers, with code examples and a call-to-action to try the free tier"

2. **Rich Context Integration**: Upload documents, code files, and reports to provide comprehensive background

3. **Clear Boundaries & Escalation**: Define what the agent can/cannot do and when to escalate

4. **Measurable Success Criteria**: Set specific, verifiable outcomes

5. **Copy & Export**: Share briefings as Markdown, JSON, or plain text

---

## ✨ Features

### 🎯 Core Briefing System
- **Structured 6-Field Template**
  - ✅ **Objective** (AI-enhanced with smart refinement)
  - ✅ **Context** (with file upload support)
  - ✅ **Boundaries** (what agent can/cannot do)
  - ✅ **Escalation** (when to ask for help)
  - ✅ **Stakeholders** (who needs to know)
  - ✅ **Success Criteria** (measurable outcomes)

### 🤖 AI-Powered Features
- **Smart Objective Composer** (Cloudflare AI - Llama 3.1)
  - Analyzes vague objectives
  - Generates 3-5 clarifying questions
  - Refines objectives based on answers
  - Transforms ambiguity into clarity

### 📎 Context Integration
- **File Upload System**
  - Drag & drop interface
  - Supports: PDF, DOC, TXT, MD, CSV, Code files
  - Max 5 files, 10MB each
  - Automatic content extraction
  - File content appended to context

### 📋 Briefing Management
- **Full CRUD Operations**
  - Create new briefings
  - Edit existing briefings
  - Delete briefings
  - Duplicate briefings
  - View detailed briefings

### 📤 Export & Share
- **Copy to Clipboard**: One-click copy formatted briefing
- **Export Formats**:
  - 📝 Markdown (.md) - Formatted with headers
  - 💻 JSON (.json) - Full data structure
  - 📄 Plain Text (.txt) - Simple format

### 🎨 User Experience
- **Dark Mode**: Full dark mode support with localStorage persistence
- **Form Validation**: Real-time validation with error messages
- **Auto-Save**: Drafts saved to localStorage
- **Unsaved Changes Warning**: Prevents accidental data loss
- **Character Counters**: Track field lengths
- **Responsive Design**: Works on desktop and mobile

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

## 🚀 Live Demo

**Frontend**: https://agent-briefing.coscient.workers.dev  
**Backend API**: https://agent-briefing-api.coscient.workers.dev

### Try It Now:
1. Visit the live demo
2. Click "Create New Briefing"
3. Type "Write a blog" in the Objective field
4. Click "AI Refine" to see AI-powered clarification
5. Answer the questions and generate a refined objective
6. Upload context files (drag & drop)
7. Complete the form and save
8. View, copy, or export your briefing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Cloudflare Global Network            │
├─────────────────────────────────────────────┤
│                                               │
│  Frontend Worker (Workers Site)              │
│  ↓                                            │
│  Backend API Worker                           │
│  ↓                                            │
│  Cloudflare AI (Llama 3.1 8B)                │
│  ↓                                            │
│  KV Storage + R2 Bucket                       │
│                                               │
└─────────────────────────────────────────────┘
```

### Frontend
- **React 19** with Hooks
- **Vite** for fast development and HMR
- **Tailwind CSS 3.4.17** with custom theme
- **Workers Site** for static asset serving

### Backend (Cloudflare Workers)
- **Cloudflare Workers** for serverless API
- **Cloudflare KV** for briefing data storage (future)
- **Cloudflare R2** for file storage (future)
- **Cloudflare AI** for objective refinement
  - Model: `@cf/meta/llama-3.1-8b-instruct`
  - 10,000 neurons/day on free tier (~12-15 refinements)

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

### Health Check
- `GET /api/health` - Check API status and service availability

### AI Features (Live)
- `POST /api/ai/refine-objective` - Smart objective composer
  - **Input**: `{ "objective": "Write a blog" }`
  - **Output**: `{ "questions": [...] }` or `{ "refined": "..." }`

### Future Endpoints
- `GET /api/briefings` - List all briefings (KV storage)
- `POST /api/briefings` - Create briefing (KV storage)
- `POST /api/files/upload` - Upload file (R2 storage)
- `POST /api/ai/summarize-file` - Summarize uploaded file

---

## 🎯 Roadmap

### ✅ Phase 1: MVP (Complete)
- ✅ Project setup with reusable components from PromptLibrary
- ✅ 6-field briefing form with validation
- ✅ Full CRUD operations (localStorage)
- ✅ Dark mode support with persistence
- ✅ Responsive design
- ✅ Auto-save drafts
- ✅ Unsaved changes warning

### ✅ Phase 2: AI Features (Complete)
- ✅ Smart Objective Composer with Cloudflare AI
- ✅ File upload and processing (5 files, 10MB each)
- ✅ Context integration with uploaded files
- ✅ Copy & export (Markdown, JSON, Text)

### 🚧 Phase 3: Backend Storage (In Progress)
- ⏳ Save briefings to Cloudflare KV
- ⏳ Load briefings from KV
- ⏳ Upload files to Cloudflare R2
- ⏳ AI file summarization
- ⏳ Share briefings via URL

### 📋 Phase 4: Advanced Features (Planned)
- 🔄 User authentication
- 🔄 Agent chaining workflows
- 🔄 Template marketplace
- 🔄 Team collaboration
- 🔄 Version history
- 🔄 Cross-linking with PromptLibrary
- 🔄 Analytics and insights

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| Vite | 7.2.7 | Build tool & dev server |
| Tailwind CSS | 3.4.17 | Styling |
| React Dropzone | - | File uploads |

### Backend
| Technology | Purpose |
|-----------|---------|
| Cloudflare Workers | Serverless compute |
| Cloudflare AI | Llama 3.1 8B model |
| Cloudflare KV | Key-value storage |
| Cloudflare R2 | Object storage |
| Workers Sites | Static asset serving |

### Development
| Tool | Purpose |
|------|---------|
| Wrangler | Cloudflare CLI |
| ESLint | Code linting |
| Git | Version control |

---

## � Cost Estimate

### Cloudflare Workers Paid Plan: $5/month
**Includes:**
- 10M requests/month
- 10,000 AI neurons/day (~12-15 refinements)
- Unlimited KV reads
- 1M KV writes
- 50GB R2 storage

**Expected Monthly Cost:** $5-10 (with moderate usage)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md for guidelines.

---

## � Contact

- **GitHub**: [czhengjuarez/agent-briefing](https://github.com/czhengjuarez/agent-briefing)
- **Live Demo**: https://agent-briefing.coscient.workers.dev

---

## � Acknowledgments

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- AI powered by [Cloudflare AI](https://ai.cloudflare.com/)
- Design inspired by [PromptLibrary](https://github.com/czhengjuarez/prompt-library)

---

**Made with ❤️ for better AI delegation**

## 🔗 Related Projects

- **[PromptLibrary](https://github.com/czhengjuarez/prompt-library)**: AI Prompt management tool with shared design system

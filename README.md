# Agent Briefing Tool

> **AI-powered delegation framework that transforms vague instructions into clear, actionable agent briefings.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://agent-briefing.coscient.workers.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

**Live App:** https://agent-briefing.coscient.workers.dev  
**Backend API:** https://agent-briefing-api.coscient.workers.dev

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🎯 The Problem

### The Leadership Layer for AI

Reading [Jason Cyr's blog post](https://jasoncyr.com/leadership-layer-ai-agents) about experimenting with AI agents to manage his personal knowledge system made me realize: **everyone should understand this shift.**

Here's what most leaders haven't recognized yet: **Every designer working with AI is now doing management work.** They're just not calling it that, and nothing in their education or career development prepared them for it.

### From Prompting to Orchestration

In the past, I focused on **how to prompt**, how to **vibe code**. These were isolated acts. **Managing agents is orchestration**—coordinating how multiple agents work together, which depends heavily on context. As human managers, we accumulate context throughout the year. But AI agents aren't mind readers. When orchestrating agents, **context becomes everything**.

Jason's experience caught my attention:
- When an agent **misfiled something**, he didn't debug code; he **clarified his intent**
- When it **missed cross-links**, he didn't tweak parameters; he **provided more context** about how concepts relate
- When it **extracted the wrong action items**, he didn't adjust thresholds; he **taught it about his priorities**

This maps to a talk I gave two years ago at DesignOps Summit: when we stop treating AI as "tools" and start treating AI as "intelligence," **training, teaching, and coaching become the norm**.

### The Delegation Gap

When delegating tasks to AI agents, humans often provide **vague, incomplete instructions** that lead to:

- ❌ **Ambiguous objectives**: "Write a blog" → What audience? What tone? What outcome?
- ❌ **Missing context**: Agents lack critical background information and organizational history
- ❌ **Unclear boundaries**: No guidance on what the agent should/shouldn't do
- ❌ **No escalation path**: Agents don't know when to ask for help
- ❌ **Undefined success**: No measurable criteria for completion

**Result**: Wasted time, frustration, and suboptimal outcomes on both sides.

---

## 💡 The Solution

**Agent Briefing Tool** builds on Jason Cyr's original agent briefing concept with two key innovations:

### 1. Smart "Objective" Composer (Goal Refiner)

Instead of a blank box, we offer an **AI-powered Goal Refiner**. When a user types "Write a blog," the app prompts:
- "Who is the audience?"
- "What is the tone?"
- "What is the call to action?"

This transforms vague objectives into clear, actionable instructions: *"Write a 1500-word technical blog post for software developers about Cloudflare Workers, with code examples and a call-to-action to try the free tier"*

### 2. Context Integration (RAG)

For the Context section, users can **upload files** (PDFs, DOCX, code files, previous reports). The app:
- **Extracts text** from PDFs using PDF.js
- **Parses DOCX** files using Mammoth.js
- **Summarizes content** using Cloudflare AI
- **"Zips" this context** into the briefing so the agent has the necessary history

This solves the fundamental problem: **AI agents aren't mind readers**. By providing structured context and refined objectives, we enable effective agent orchestration.

---

**The result**: A **structured framework** for clear delegation that bridges the gap between human intent and AI execution.

3. **Clear Boundaries & Escalation**: Define what the agent can/cannot do and when to escalate

4. **Measurable Success Criteria**: Set specific, verifiable outcomes

5. **Copy & Export**: Share briefings as Markdown, JSON, or plain text

---

## ✨ Features

### 🎯 Core Briefing System
- **Structured 6-Field Template**
  - ✅ **Objective** (AI-enhanced with smart refinement)
  - ✅ **Context** (with file upload support)
  - ✅ **Boundaries** (what agent can/cannot do) - **NEW: Preset toggles**
  - ✅ **Escalation** (when to ask for help)
  - ✅ **Stakeholders** (who needs to know)
  - ✅ **Success Criteria** (measurable outcomes)

### 🚧 Boundary Presets
- **Smart Boundary Toggles** - Users often forget what not to do. Quick-add common constraints:
  - 🚫 "No external web browsing"
  - 📝 "Strict professional tone"
  - ✅ "Do not invent facts (No hallucinations)"
  - 🔒 "Do not access sensitive data"
  - 💰 "Do not make financial commitments"
  - 👤 "Do not impersonate humans"
  - 🔗 "Do not share external links without verification"
  - ⏰ "Complete within [X] timeframe"

### 🤖 AI-Powered Features
- **Smart Objective Composer** (Cloudflare AI - Llama 3.1)
  - Analyzes vague objectives
  - Generates 3-5 clarifying questions
  - Refines objectives based on answers
  - Transforms ambiguity into clarity

### 📎 Context Integration
- **Intelligent File Upload System**
  - Drag & drop interface
  - **PDF Parsing**: Full text extraction using PDF.js
  - **DOCX Parsing**: Full text extraction using Mammoth.js
  - **Text Files**: TXT, MD, JSON, CSV, Code files
  - Max 5 files, 10MB each
  - Automatic content extraction and AI summarization
  - Files stored in Cloudflare R2
  - Content automatically appended to context field

### 📋 Briefing Management
- **Full CRUD Operations with D1 Database**
  - Create new briefings → Saved to Cloudflare D1
  - Edit existing briefings → Updated in D1
  - Delete briefings → Removed from D1 and R2
  - Duplicate briefings → Creates new D1 entry
  - View detailed briefings → Loaded from D1
  - Multi-user ready (schema includes user authentication tables)

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

### 📁 File Processing & Storage
- **Supported Formats**: 
  - ✅ **PDF** - Full text extraction (PDF.js)
  - ✅ **DOCX** - Full text extraction (Mammoth.js)
  - ✅ **TXT, MD, JSON, CSV** - Direct content reading
  - ✅ **Code files** - JS, PY, JAVA, HTML, CSS
- **Processing**:
  - Client-side extraction (PDF.js, Mammoth.js)
  - Server-side AI summarization (>1000 chars)
  - Automatic content integration
- **Storage**:
  - File metadata → Cloudflare D1
  - File content → Cloudflare R2
  - Max 10MB per file, 5 files per briefing

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

## 📊 API Documentation

### Base URL
```
https://agent-briefing-api.coscient.workers.dev
```

### Briefing Endpoints (D1 Database)

#### List All Briefings
```http
GET /api/briefings
```
**Response**: Array of briefings with metadata

#### Get Single Briefing
```http
GET /api/briefings/:id
```
**Response**: Briefing with associated files

#### Create Briefing
```http
POST /api/briefings
Content-Type: application/json

{
  "title": "Q4 Marketing Campaign",
  "objective": "Create blog targeting developers...",
  "context": "Company background...",
  "boundaries": "Don't mention competitors",
  "escalation": "Contact @manager for budget",
  "stakeholders": "Marketing, Engineering",
  "successCriteria": "10K views, 100 signups"
}
```

#### Update Briefing
```http
PUT /api/briefings/:id
Content-Type: application/json
```

#### Delete Briefing
```http
DELETE /api/briefings/:id
```

### File Upload Endpoints (R2 Storage)

#### Upload File
```http
POST /api/files/upload
Content-Type: multipart/form-data

file: [binary]
briefingId: "briefing-123"
summarize: "true"
```
**Response**: File metadata with extracted text/summary

#### Download File
```http
GET /api/files/:id
```

### AI Endpoints

#### Refine Objective
```http
POST /api/ai/refine-objective
Content-Type: application/json

{
  "objective": "Write a blog",
  "answers": ["Developers", "Technical", "Try our product"]
}
```
**Response**: Clarifying questions or refined objective

### Health Check
```http
GET /api/health
```

For detailed API documentation, see [`worker/README.md`](./worker/README.md)

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
| Tailwind CSS | 3.4.17 | Styling & theming |
| Mammoth.js | 1.8.0 | DOCX text extraction |
| PDF.js | 4.10.38 | PDF text extraction |

### Backend (Cloudflare Workers)
| Technology | Purpose |
|-----------|---------|
| Cloudflare Workers | Serverless compute platform |
| Cloudflare D1 | SQLite database for briefings |
| Cloudflare R2 | Object storage for files |
| Cloudflare AI | Llama 3.1 8B for objective refinement |
| Workers Sites | Static asset serving from KV |

### Database Schema (D1)
| Table | Purpose |
|-------|---------|
| `users` | User authentication (future) |
| `briefings` | Briefing data storage |
| `files` | File metadata & R2 keys |
| `sessions` | User sessions (future) |

### Development Tools
| Tool | Purpose |
|------|---------|
| Wrangler CLI | Cloudflare deployment |
| ESLint | Code linting |
| Git | Version control |
| npm | Package management |

---

## 📁 Project Structure

```
AgentBriefing/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentBriefing.jsx      # Main app component
│   │   │   ├── BriefingForm.jsx       # Briefing creation form
│   │   │   ├── BriefingList.jsx       # Briefing list view
│   │   │   ├── BriefingDetailsModal.jsx # View/export modal
│   │   │   ├── ObjectiveComposer.jsx  # AI refinement UI
│   │   │   └── ContextUploader.jsx    # File upload with parsing
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx       # Dark mode state
│   │   ├── hooks/
│   │   │   └── useBriefings.js        # API integration hook
│   │   └── App.jsx
│   ├── public/
│   │   ├── favicon.svg
│   │   └── pdf.worker.min.mjs         # PDF.js worker
│   ├── wrangler.toml                  # Frontend worker config
│   └── package.json
│
├── worker/                      # Cloudflare Worker API
│   ├── src/
│   │   └── index.js                   # API routes & handlers
│   ├── migrations/
│   │   └── 001_remove_fk_constraint.sql
│   ├── schema.sql                     # D1 database schema
│   ├── wrangler.toml                  # Backend worker config
│   └── README.md                      # API documentation
│
├── README.md                    # This file
├── DEPLOYMENT_COMPLETE.md       # Deployment guide
├── FILE_UPLOAD_FEATURE.md       # File upload docs
└── PROJECT_SUMMARY.md           # Project overview
```

---

## 💰 Cost Estimate

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

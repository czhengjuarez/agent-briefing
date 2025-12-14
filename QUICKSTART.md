# Quick Start Guide

Get the Agent Briefing Tool running in 5 minutes.

## 🚀 Quick Setup

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Your app will be running at `http://localhost:5173` 🎉

## 📋 What You'll See

1. **Welcome Screen**: Landing page with "Create New Briefing" button
2. **Dark Mode Toggle**: Top-right corner (matches PromptLibrary)
3. **Feature Cards**: Overview of Smart Objective Composer, Context Upload, and Agent Chaining

## 🔧 Optional: Set Up Backend (for full functionality)

### 1. Install Worker Dependencies
```bash
cd ../worker
npm install
```

### 2. Create Cloudflare Resources
```bash
# KV Namespace
wrangler kv:namespace create "AGENT_BRIEFING_KV"
wrangler kv:namespace create "AGENT_BRIEFING_KV" --preview

# R2 Bucket
wrangler r2 bucket create agent-briefing-files
```

### 3. Update wrangler.toml
Copy the namespace IDs from the output above and update `worker/wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "AGENT_BRIEFING_KV"
id = "YOUR_NAMESPACE_ID_HERE"
preview_id = "YOUR_PREVIEW_ID_HERE"
```

### 4. Start Worker
```bash
wrangler dev
```

Worker will run at `http://localhost:8787`

## 📁 Project Structure

```
AgentBriefing/
├── frontend/              # React app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # ThemeContext (dark mode)
│   │   └── App.jsx        # Main app
│   └── package.json
│
├── worker/                # Cloudflare Worker API
│   ├── src/
│   │   └── index.js       # API endpoints
│   └── wrangler.toml      # Worker config
│
├── PLAN.md               # Full development plan
└── README.md             # Complete documentation
```

## ✅ Reused from PromptLibrary

- ✅ **Color Palette**: Same primary (#8E1F5A) and secondary (#DD388B) colors
- ✅ **ThemeContext**: Dark mode with localStorage persistence
- ✅ **Tailwind Config**: Identical styling setup
- ✅ **Base Styles**: System fonts and CSS reset
- ✅ **UI Patterns**: Modal behavior, button styles, card layouts

## 🎯 Next Steps

1. **Review PLAN.md**: See full feature roadmap
2. **Build Briefing Form**: Implement 6-field template
3. **Add AI Integration**: Smart Objective Composer
4. **Implement File Upload**: Context file support

## 🔗 Links

- **PromptLibrary**: `../PromptLibrary` (sibling project)
- **Full Plan**: `PLAN.md`
- **API Docs**: `worker/README.md`

---

Happy building! 🚀

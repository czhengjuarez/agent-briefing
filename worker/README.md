# Agent Briefing Worker API

Cloudflare Worker API for the Agent Briefing Tool.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create KV namespace**
   ```bash
   wrangler kv:namespace create "AGENT_BRIEFING_KV"
   wrangler kv:namespace create "AGENT_BRIEFING_KV" --preview
   ```

3. **Create R2 bucket**
   ```bash
   wrangler r2 bucket create agent-briefing-files
   wrangler r2 bucket create agent-briefing-files-preview
   ```

4. **Update wrangler.toml**
   - Replace `YOUR_KV_NAMESPACE_ID` with the production namespace ID
   - Replace `YOUR_PREVIEW_KV_NAMESPACE_ID` with the preview namespace ID

5. **Start development server**
   ```bash
   npm run dev
   ```

## Deployment

```bash
npm run deploy
```

## API Endpoints

See main README.md for full API documentation.

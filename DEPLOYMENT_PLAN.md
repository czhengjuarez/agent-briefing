# Cloudflare Deployment Plan

## Overview

Deploy Agent Briefing Tool with:
- **Frontend**: Cloudflare Pages (React app)
- **Backend**: Cloudflare Workers (API with AI)
- **Storage**: KV (briefings), R2 (files - future)
- **AI**: Cloudflare AI (Llama 3.1)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Network                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │ Cloudflare Pages │         │ Cloudflare Worker│          │
│  │                  │         │                  │          │
│  │  React Frontend  │────────▶│   API Backend    │          │
│  │  (Static Site)   │  HTTPS  │   + AI Service   │          │
│  │                  │         │                  │          │
│  └──────────────────┘         └────────┬─────────┘          │
│                                         │                     │
│                                         ▼                     │
│                              ┌──────────────────┐            │
│                              │  Cloudflare AI   │            │
│                              │  (Llama 3.1)     │            │
│                              └──────────────────┘            │
│                                         │                     │
│                                         ▼                     │
│                              ┌──────────────────┐            │
│                              │  KV Storage      │            │
│                              │  (Briefings)     │            │
│                              └──────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### 1. Cloudflare Account Setup
```bash
# Sign up at https://dash.cloudflare.com
# Verify email
# Add payment method (Workers Paid plan for AI)
```

### 2. Install Wrangler CLI
```bash
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### 3. Verify Authentication
```bash
wrangler whoami
# Should show your email and account ID
```

---

## Step 1: Create KV Namespace

### Production KV
```bash
cd worker

# Create production KV namespace
wrangler kv:namespace create "AGENT_BRIEFING_KV"

# Output example:
# 🌀 Creating namespace with title "agent-briefing-api-AGENT_BRIEFING_KV"
# ✨ Success!
# Add the following to your configuration file:
# kv_namespaces = [
#   { binding = "AGENT_BRIEFING_KV", id = "abc123..." }
# ]
```

### Preview KV (for testing)
```bash
wrangler kv:namespace create "AGENT_BRIEFING_KV" --preview

# Output example:
# 🌀 Creating namespace with title "agent-briefing-api-AGENT_BRIEFING_KV_preview"
# ✨ Success!
# Add the following to your configuration file:
# kv_namespaces = [
#   { binding = "AGENT_BRIEFING_KV", preview_id = "xyz789..." }
# ]
```

### Update wrangler.toml
```toml
[[kv_namespaces]]
binding = "AGENT_BRIEFING_KV"
id = "abc123..."              # Replace with your production ID
preview_id = "xyz789..."      # Replace with your preview ID
```

---

## Step 2: Create R2 Bucket (Optional - Future Use)

```bash
# Create R2 bucket for file storage
wrangler r2 bucket create agent-briefing-files

# Create preview bucket
wrangler r2 bucket create agent-briefing-files-preview

# Update wrangler.toml
[[r2_buckets]]
binding = "BRIEFING_FILES"
bucket_name = "agent-briefing-files"
preview_bucket_name = "agent-briefing-files-preview"
```

---

## Step 3: Configure Worker

### Update wrangler.toml
```toml
name = "agent-briefing-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

# Account ID (get from dashboard or wrangler whoami)
account_id = "YOUR_ACCOUNT_ID"

[vars]
ENVIRONMENT = "production"

# KV Namespace
[[kv_namespaces]]
binding = "AGENT_BRIEFING_KV"
id = "YOUR_KV_NAMESPACE_ID"
preview_id = "YOUR_PREVIEW_KV_NAMESPACE_ID"

# R2 Bucket (optional for now)
[[r2_buckets]]
binding = "BRIEFING_FILES"
bucket_name = "agent-briefing-files"
preview_bucket_name = "agent-briefing-files-preview"

# AI Binding
[ai]
binding = "AI"

# Routes (optional - custom domain)
# routes = [
#   { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
# ]

[env.production.vars]
ENVIRONMENT = "production"

[env.staging.vars]
ENVIRONMENT = "staging"
```

---

## Step 4: Deploy Worker

### Test Locally First
```bash
cd worker

# Install dependencies
npm install

# Test locally
npm run dev

# Visit http://localhost:8787
# Test endpoints:
# - GET  /api/health
# - POST /api/ai/refine-objective
```

### Deploy to Production
```bash
# Deploy worker
wrangler deploy

# Output example:
# ⛅️ wrangler 4.49.0
# ------------------
# Total Upload: 5.23 KiB / gzip: 1.89 KiB
# Uploaded agent-briefing-api (2.34 sec)
# Published agent-briefing-api (0.28 sec)
#   https://agent-briefing-api.YOUR_SUBDOMAIN.workers.dev
# Current Deployment ID: abc-123-def
```

### Verify Worker
```bash
# Test health endpoint
curl https://agent-briefing-api.YOUR_SUBDOMAIN.workers.dev/api/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-12-14T...",
#   "services": {
#     "kv": true,
#     "r2": true,
#     "ai": true
#   }
# }
```

---

## Step 5: Deploy Frontend to Cloudflare Pages

### Option A: Deploy via Wrangler (Recommended)

```bash
cd frontend

# Build production assets
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=agent-briefing

# Output example:
# ✨ Success! Uploaded 3 files (2.34 sec)
# ✨ Deployment complete! Take a peek over at
#    https://abc123.agent-briefing.pages.dev
```

### Option B: Deploy via Dashboard

1. **Go to Cloudflare Dashboard**
   - Navigate to Pages
   - Click "Create a project"

2. **Connect to Git**
   - Select "Connect to Git"
   - Choose GitHub
   - Select `czhengjuarez/agent-briefing` repository
   - Authorize Cloudflare

3. **Configure Build Settings**
   ```
   Project name: agent-briefing
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   Root directory: frontend
   ```

4. **Environment Variables**
   ```
   VITE_API_URL = https://agent-briefing-api.YOUR_SUBDOMAIN.workers.dev
   ```

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (~2-3 minutes)

---

## Step 6: Configure Environment Variables

### Frontend Environment Variables

**In Cloudflare Pages Dashboard:**
1. Go to Pages → agent-briefing → Settings → Environment variables
2. Add production variable:
   ```
   VITE_API_URL = https://agent-briefing-api.YOUR_SUBDOMAIN.workers.dev
   ```
3. Save and redeploy

**For local development:**
```bash
# frontend/.env
VITE_API_URL=http://localhost:8787
```

### Worker Environment Variables

**In wrangler.toml:**
```toml
[vars]
ENVIRONMENT = "production"
CORS_ORIGIN = "https://agent-briefing.pages.dev"
```

**Or via Dashboard:**
1. Go to Workers & Pages → agent-briefing-api → Settings → Variables
2. Add variables as needed

---

## Step 7: Configure CORS

### Update Worker CORS Headers

```javascript
// worker/src/index.js
const corsHeaders = {
  'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### For Production (Recommended)
```toml
# wrangler.toml
[vars]
CORS_ORIGIN = "https://agent-briefing.pages.dev"
```

---

## Step 8: Custom Domain (Optional)

### For Worker API

1. **Add Custom Domain in Dashboard**
   - Workers & Pages → agent-briefing-api → Settings → Domains & Routes
   - Click "Add Custom Domain"
   - Enter: `api.yourdomain.com`
   - Follow DNS setup instructions

2. **Update Frontend Environment**
   ```
   VITE_API_URL = https://api.yourdomain.com
   ```

### For Pages Frontend

1. **Add Custom Domain in Dashboard**
   - Pages → agent-briefing → Custom domains
   - Click "Set up a custom domain"
   - Enter: `briefing.yourdomain.com` or `yourdomain.com`
   - Follow DNS setup instructions

---

## Step 9: Enable AI (Workers Paid Plan Required)

### Upgrade to Workers Paid Plan

1. **Go to Cloudflare Dashboard**
   - Workers & Pages → Plans
   - Click "Upgrade to Paid"
   - Select "Workers Paid" ($5/month)

2. **Verify AI Access**
   ```bash
   # Test AI endpoint
   curl -X POST https://agent-briefing-api.YOUR_SUBDOMAIN.workers.dev/api/ai/refine-objective \
     -H "Content-Type: application/json" \
     -d '{"objective": "Write a blog"}'
   ```

### AI Pricing
- **Included**: 10,000 neurons/day
- **Overage**: $0.011 per 1,000 neurons
- **Estimated**: ~12-15 refinements/day on free tier

---

## Step 10: Monitoring & Logs

### View Worker Logs

**Via Dashboard:**
1. Workers & Pages → agent-briefing-api
2. Click "Logs" tab
3. View real-time logs

**Via Wrangler:**
```bash
wrangler tail
```

### View Pages Deployment Logs

1. Pages → agent-briefing
2. Click on latest deployment
3. View build logs

### Set Up Alerts (Optional)

1. Go to Notifications
2. Create alert for:
   - Worker errors
   - High CPU usage
   - Failed deployments

---

## Deployment Checklist

### Pre-Deployment
- [ ] Cloudflare account created and verified
- [ ] Payment method added (for Workers Paid)
- [ ] Wrangler CLI installed and authenticated
- [ ] Code pushed to GitHub

### Worker Deployment
- [ ] KV namespace created (production + preview)
- [ ] R2 bucket created (optional)
- [ ] wrangler.toml configured with IDs
- [ ] Worker tested locally
- [ ] Worker deployed to production
- [ ] Health endpoint verified
- [ ] AI endpoint tested

### Frontend Deployment
- [ ] Build tested locally (`npm run build`)
- [ ] Deployed to Cloudflare Pages
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Frontend can reach worker API
- [ ] AI refinement feature works

### Post-Deployment
- [ ] Custom domains configured (optional)
- [ ] SSL certificates active
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] Documentation updated with URLs

---

## Testing Production Deployment

### 1. Test Frontend
```bash
# Visit your Pages URL
https://agent-briefing.pages.dev

# Or custom domain
https://briefing.yourdomain.com
```

**Test Flow:**
1. Create new briefing
2. Fill out title and objective
3. Click "AI Refine" → Should get questions
4. Answer questions → Should get refined objective
5. Upload a file → Should process and add to context
6. Save briefing → Should persist
7. Refresh page → Should load from localStorage
8. View briefing details → Should show all data

### 2. Test Worker API
```bash
# Health check
curl https://agent-briefing-api.YOUR_SUBDOMAIN.workers.dev/api/health

# AI refinement
curl -X POST https://agent-briefing-api.YOUR_SUBDOMAIN.workers.dev/api/ai/refine-objective \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Write a blog post"
  }'
```

### 3. Test CORS
```bash
# Should allow requests from Pages domain
curl -H "Origin: https://agent-briefing.pages.dev" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://agent-briefing-api.YOUR_SUBDOMAIN.workers.dev/api/ai/refine-objective
```

---

## Continuous Deployment

### Automatic Deployments

**Pages (Frontend):**
- Automatically deploys on push to `main` branch
- Preview deployments for pull requests
- Rollback available in dashboard

**Worker (Backend):**
```bash
# Manual deployment
wrangler deploy

# Or set up GitHub Actions (see below)
```

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy-worker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd worker
          npm install
      
      - name: Deploy Worker
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: 'worker'

  deploy-pages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install and Build
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: agent-briefing
          directory: frontend/dist
```

**Setup Secrets:**
1. Go to GitHub repo → Settings → Secrets
2. Add:
   - `CLOUDFLARE_API_TOKEN` (from Cloudflare dashboard)
   - `CLOUDFLARE_ACCOUNT_ID` (from `wrangler whoami`)

---

## Rollback Strategy

### Pages Rollback
1. Go to Pages → agent-briefing → Deployments
2. Find previous successful deployment
3. Click "..." → "Rollback to this deployment"

### Worker Rollback
```bash
# List deployments
wrangler deployments list

# Rollback to previous version
wrangler rollback [deployment-id]
```

---

## Cost Estimation

### Workers Paid Plan
- **Base**: $5/month
- **Includes**: 
  - 10M requests/month
  - 10,000 AI neurons/day
  - Unlimited KV reads
  - 1M KV writes

### Cloudflare Pages
- **Free**: Unlimited requests
- **Bandwidth**: Unlimited
- **Builds**: 500/month (free)

### Total Monthly Cost
- **Minimum**: $5/month (Workers Paid)
- **Expected**: $5-10/month (with moderate AI usage)

---

## Troubleshooting

### Issue: Worker not accessible
```bash
# Check deployment status
wrangler deployments list

# View logs
wrangler tail

# Redeploy
wrangler deploy
```

### Issue: AI not working
- Verify Workers Paid plan is active
- Check AI binding in wrangler.toml
- Test with simple prompt
- Check worker logs for errors

### Issue: CORS errors
- Verify CORS_ORIGIN in worker
- Check Access-Control headers
- Test with curl
- Verify frontend URL matches

### Issue: Pages build failing
- Check build command in Pages settings
- Verify Node version compatibility
- Check environment variables
- Review build logs

---

## Security Best Practices

### 1. API Security
```javascript
// Add rate limiting
// Add API key authentication (future)
// Validate all inputs
// Sanitize file uploads
```

### 2. Environment Variables
- Never commit `.env` files
- Use Cloudflare dashboard for secrets
- Rotate API tokens regularly

### 3. CORS Configuration
```javascript
// Production: Specific origin
CORS_ORIGIN = "https://agent-briefing.pages.dev"

// Development: Localhost
CORS_ORIGIN = "http://localhost:5173"
```

---

## Next Steps After Deployment

1. **Monitor Usage**
   - Check AI neuron usage daily
   - Monitor worker requests
   - Review error rates

2. **Optimize Performance**
   - Enable caching where appropriate
   - Optimize bundle size
   - Compress assets

3. **Add Features**
   - Backend briefing storage (KV)
   - File upload to R2
   - User authentication
   - Sharing functionality

4. **Documentation**
   - Update README with live URLs
   - Add API documentation
   - Create user guide

---

## Quick Deploy Commands

```bash
# 1. Create KV namespace
cd worker
wrangler kv:namespace create "AGENT_BRIEFING_KV"
wrangler kv:namespace create "AGENT_BRIEFING_KV" --preview

# 2. Update wrangler.toml with IDs

# 3. Deploy worker
wrangler deploy

# 4. Build and deploy frontend
cd ../frontend
npm run build
npx wrangler pages deploy dist --project-name=agent-briefing

# 5. Test
curl https://agent-briefing-api.YOUR_SUBDOMAIN.workers.dev/api/health
```

---

## Support & Resources

- **Cloudflare Docs**: https://developers.cloudflare.com
- **Workers Docs**: https://developers.cloudflare.com/workers
- **Pages Docs**: https://developers.cloudflare.com/pages
- **AI Docs**: https://developers.cloudflare.com/workers-ai
- **Discord**: https://discord.cloudflare.com

---

**Ready to deploy! 🚀**

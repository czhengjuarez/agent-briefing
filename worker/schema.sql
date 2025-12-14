-- Agent Briefing Tool Database Schema
-- Cloudflare D1 (SQLite)

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Briefings table
CREATE TABLE IF NOT EXISTS briefings (
    id TEXT PRIMARY KEY,
    user_id TEXT DEFAULT 'anonymous', -- Will be linked to users.id after auth
    title TEXT NOT NULL,
    objective TEXT NOT NULL,
    context TEXT NOT NULL,
    boundaries TEXT NOT NULL,
    escalation TEXT NOT NULL,
    stakeholders TEXT,
    success_criteria TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Files table (metadata for R2 storage)
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    briefing_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    r2_key TEXT NOT NULL, -- Key in R2 bucket
    preview TEXT, -- Short preview of content
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (briefing_id) REFERENCES briefings(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_briefings_user_id ON briefings(user_id);
CREATE INDEX IF NOT EXISTS idx_briefings_created_at ON briefings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_briefing_id ON files(briefing_id);

-- Sessions table (for future authentication)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

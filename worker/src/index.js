/**
 * Agent Briefing Tool Cloudflare Worker API
 * Provides REST endpoints for managing briefings with KV storage, R2 file storage, and AI features
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (path.startsWith('/api/briefings')) {
        return await handleBriefings(request, env, path, method, corsHeaders);
      } else if (path.startsWith('/api/ai')) {
        return await handleAI(request, env, path, method, corsHeaders);
      } else if (path.startsWith('/api/files')) {
        return await handleFiles(request, env, path, method, corsHeaders);
      } else if (path === '/api/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          services: {
            kv: !!env.AGENT_BRIEFING_KV,
            r2: !!env.BRIEFING_FILES,
            ai: !!env.AI
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else if (path === '/') {
        return new Response(JSON.stringify({ 
          name: 'Agent Briefing Tool API',
          version: '1.0.0',
          endpoints: {
            health: '/api/health',
            briefings: '/api/briefings',
            ai: '/api/ai',
            files: '/api/files'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error', message: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

/**
 * Handle briefing CRUD operations
 */
async function handleBriefings(request, env, path, method, corsHeaders) {
  const db = env.DB;
  
  try {
    // GET /api/briefings - List all briefings
    if (path === '/api/briefings' && method === 'GET') {
      const { results } = await db.prepare(
        'SELECT * FROM briefings ORDER BY created_at DESC'
      ).all();
      
      // Transform snake_case to camelCase for frontend
      const briefings = results.map(b => ({
        id: b.id,
        userId: b.user_id,
        title: b.title,
        objective: b.objective,
        context: b.context,
        boundaries: b.boundaries,
        escalation: b.escalation,
        stakeholders: b.stakeholders,
        successCriteria: b.success_criteria,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
        contextFiles: [] // Will be populated when viewing individual briefing
      }));
      
      return new Response(JSON.stringify({ briefings }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // GET /api/briefings/:id - Get single briefing
    if (path.match(/^\/api\/briefings\/[^/]+$/) && method === 'GET') {
      const id = path.split('/').pop();
      
      const b = await db.prepare(
        'SELECT * FROM briefings WHERE id = ?'
      ).bind(id).first();
      
      if (!b) {
        return new Response(JSON.stringify({ error: 'Briefing not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Get associated files
      const { results: files } = await db.prepare(
        'SELECT * FROM files WHERE briefing_id = ?'
      ).bind(id).all();
      
      // Transform to camelCase
      const briefing = {
        id: b.id,
        userId: b.user_id,
        title: b.title,
        objective: b.objective,
        context: b.context,
        boundaries: b.boundaries,
        escalation: b.escalation,
        stakeholders: b.stakeholders,
        successCriteria: b.success_criteria,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
        contextFiles: files.map(f => ({
          id: f.id,
          name: f.filename,
          type: f.file_type,
          size: f.file_size,
          preview: f.preview,
          uploadedAt: f.created_at
        }))
      };
      
      return new Response(JSON.stringify({ briefing }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // POST /api/briefings - Create briefing
    if (path === '/api/briefings' && method === 'POST') {
      const data = await request.json();
      const { 
        id, title, objective, context, boundaries, 
        escalation, stakeholders, successCriteria, contextFiles 
      } = data;
      
      // Validate required fields
      if (!title || !objective || !context || !boundaries || !escalation || !successCriteria) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const briefingId = id || `briefing-${Date.now()}`;
      const now = new Date().toISOString();
      
      // Insert briefing
      await db.prepare(`
        INSERT INTO briefings (
          id, user_id, title, objective, context, boundaries, 
          escalation, stakeholders, success_criteria, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        briefingId, 'anonymous', title, objective, context, boundaries,
        escalation, stakeholders || null, successCriteria, now, now
      ).run();
      
      // Insert files if any
      if (contextFiles && contextFiles.length > 0) {
        for (const file of contextFiles) {
          await db.prepare(`
            INSERT INTO files (
              id, briefing_id, filename, file_type, file_size, 
              r2_key, preview, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            file.id, briefingId, file.name, file.type, file.size,
            file.id, file.preview, now
          ).run();
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        id: briefingId 
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // PUT /api/briefings/:id - Update briefing
    if (path.match(/^\/api\/briefings\/[^/]+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      const data = await request.json();
      const { 
        title, objective, context, boundaries, 
        escalation, stakeholders, successCriteria, contextFiles 
      } = data;
      
      const now = new Date().toISOString();
      
      // Update briefing
      await db.prepare(`
        UPDATE briefings 
        SET title = ?, objective = ?, context = ?, boundaries = ?,
            escalation = ?, stakeholders = ?, success_criteria = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        title, objective, context, boundaries,
        escalation, stakeholders || null, successCriteria, now, id
      ).run();
      
      // Delete old files and insert new ones
      await db.prepare('DELETE FROM files WHERE briefing_id = ?').bind(id).run();
      
      if (contextFiles && contextFiles.length > 0) {
        for (const file of contextFiles) {
          await db.prepare(`
            INSERT INTO files (
              id, briefing_id, filename, file_type, file_size, 
              r2_key, preview, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            file.id, id, file.name, file.type, file.size,
            file.id, file.preview, now
          ).run();
        }
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // DELETE /api/briefings/:id - Delete briefing
    if (path.match(/^\/api\/briefings\/[^/]+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      
      // Delete files first (cascade should handle this, but being explicit)
      await db.prepare('DELETE FROM files WHERE briefing_id = ?').bind(id).run();
      
      // Delete briefing
      await db.prepare('DELETE FROM briefings WHERE id = ?').bind(id).run();
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Briefing handler error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database error', 
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle AI operations (objective refinement, file summarization)
 */
async function handleAI(request, env, path, method, corsHeaders) {
  if (path === '/api/ai/refine-objective' && method === 'POST') {
    try {
      const { objective, answers } = await request.json();
      
      if (!objective || objective.trim().length === 0) {
        return new Response(JSON.stringify({ error: 'Objective is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // If no answers provided, generate clarifying questions
      if (!answers) {
        const questionsPrompt = `You are an AI assistant helping users clarify their objectives for delegating tasks to AI agents.

User's initial objective: "${objective}"

Analyze this objective and identify what critical details are missing to make it specific and actionable.

Generate 3-5 clarifying questions that will help flesh out this objective. Focus on:
- Target audience or stakeholders
- Tone, style, or approach
- Specific deliverables or outcomes
- Constraints or requirements
- Success metrics or call-to-action

Return ONLY a JSON object with this structure:
{
  "questions": ["Question 1?", "Question 2?", "Question 3?"]
}

Do not include any other text or explanation.`;

        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: 'You are a helpful assistant that generates clarifying questions. Always respond with valid JSON only.' },
            { role: 'user', content: questionsPrompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        });
        
        // Parse AI response
        let questions = [];
        try {
          const responseText = aiResponse.response || '';
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            questions = parsed.questions || [];
          }
        } catch (e) {
          console.error('Failed to parse AI response:', e);
          // Fallback questions
          questions = [
            "Who is the target audience?",
            "What tone or style should be used?",
            "What is the desired outcome or call-to-action?"
          ];
        }
        
        return new Response(JSON.stringify({ questions }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // If answers provided, generate refined objective
      const answersText = Object.entries(answers)
        .map(([q, a]) => `Q: ${q}\nA: ${a}`)
        .join('\n\n');
      
      const refinementPrompt = `You are an AI assistant helping users create clear, specific, actionable objectives.

Original objective: "${objective}"

User's answers to clarifying questions:
${answersText}

Based on the original objective and the user's answers, generate a refined, specific, and actionable objective statement. The refined objective should:
- Be clear and specific
- Include relevant details from the answers
- Be actionable and measurable
- Be 1-3 sentences long
- Maintain the user's intent

Return ONLY the refined objective text, nothing else.`;

      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a helpful assistant that refines objectives. Return only the refined objective text.' },
          { role: 'user', content: refinementPrompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      });
      
      const refined = (aiResponse.response || objective).trim();
      
      return new Response(JSON.stringify({ refined }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('AI refinement error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to refine objective', 
        message: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

/**
 * Handle file operations (upload, download, delete)
 */
async function handleFiles(request, env, path, method, corsHeaders) {
  const r2 = env.BRIEFING_FILES;
  const db = env.DB;
  
  try {
    // POST /api/files/upload - Upload file to R2 and optionally summarize
    if (path === '/api/files/upload' && method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file');
      const briefingId = formData.get('briefingId');
      const summarize = formData.get('summarize') === 'true';
      
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Generate unique file key
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const r2Key = `${briefingId || 'temp'}/${fileId}`;
      
      // Read file content first (before streaming to R2)
      const arrayBuffer = await file.arrayBuffer();
      
      // Extract text content for summarization
      let preview = `File: ${file.name}`;
      let summary = null;
      
      if (summarize) {
        try {
          const text = await extractTextFromFile(arrayBuffer, file.type, file.name);
          
          if (text && !text.startsWith('Binary file:')) {
            // For short text, use as-is; for longer text, summarize with AI
            if (text.length > 1000) {
              summary = await summarizeWithAI(env.AI, text, file.name);
              preview = summary || text.substring(0, 500);
            } else {
              // Short enough to use directly
              preview = text;
              summary = text;
            }
          } else {
            preview = text || `Binary file: ${file.name}`;
          }
        } catch (err) {
          console.error('Summarization error:', err);
          preview = `File uploaded: ${file.name}`;
        }
      }
      
      // Upload to R2 (using arrayBuffer since stream was consumed)
      await r2.put(r2Key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      });
      
      return new Response(JSON.stringify({
        success: true,
        file: {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          r2Key: r2Key,
          preview: preview,
          summary: summary
        }
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // GET /api/files/:id - Download file from R2
    if (path.match(/^\/api\/files\/[^/]+$/) && method === 'GET') {
      const fileId = path.split('/').pop();
      
      // Get file metadata from DB
      const fileRecord = await db.prepare(
        'SELECT * FROM files WHERE id = ?'
      ).bind(fileId).first();
      
      if (!fileRecord) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Get file from R2
      const object = await r2.get(fileRecord.r2_key);
      
      if (!object) {
        return new Response(JSON.stringify({ error: 'File not found in storage' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(object.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': object.httpMetadata.contentType,
          'Content-Disposition': `attachment; filename="${fileRecord.filename}"`
        }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('File handler error:', error);
    return new Response(JSON.stringify({ 
      error: 'File operation failed', 
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Extract text from various file types
 */
async function extractTextFromFile(arrayBuffer, mimeType, filename) {
  const decoder = new TextDecoder('utf-8');
  
  // Handle text files
  if (mimeType.startsWith('text/') || 
      filename.endsWith('.txt') || 
      filename.endsWith('.md') ||
      filename.endsWith('.json') ||
      filename.endsWith('.js') ||
      filename.endsWith('.py') ||
      filename.endsWith('.java')) {
    return decoder.decode(arrayBuffer);
  }
  
  // Handle .docx files - extract text from XML
  if (filename.endsWith('.docx') || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      // .docx is a zip file containing XML
      // We'll extract the main document.xml content
      const text = await extractDocxText(arrayBuffer);
      if (text && text.length > 0) {
        return text;
      }
    } catch (err) {
      console.error('DOCX extraction error:', err);
    }
  }
  
  // For other binary files, return indication
  return `Binary file: ${filename} (${(arrayBuffer.byteLength / 1024).toFixed(1)} KB)`;
}

/**
 * Extract text from .docx file
 * .docx files are ZIP archives containing XML files
 */
async function extractDocxText(arrayBuffer) {
  try {
    // Convert ArrayBuffer to Uint8Array for processing
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Look for the document.xml file signature in the ZIP
    // This is a simplified extraction - just get readable text
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const fullText = decoder.decode(uint8Array);
    
    // Extract text between XML tags (simplified approach)
    // Look for <w:t> tags which contain the actual text in Word documents
    const textMatches = fullText.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    
    if (textMatches && textMatches.length > 0) {
      const extractedText = textMatches
        .map(match => {
          const textContent = match.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
          return textContent;
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return extractedText;
    }
    
    return null;
  } catch (err) {
    console.error('DOCX text extraction failed:', err);
    return null;
  }
}

/**
 * Summarize text content using Cloudflare AI
 */
async function summarizeWithAI(ai, text, filename) {
  try {
    // Truncate text if too long (AI has token limits)
    const maxChars = 10000;
    const truncatedText = text.length > maxChars 
      ? text.substring(0, maxChars) + '...' 
      : text;
    
    const prompt = `Summarize the following document content in 2-3 sentences. Focus on the main topics and key information.

Document: ${filename}

Content:
${truncatedText}

Summary:`;
    
    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 200
    });
    
    return response.response || text.substring(0, 500);
  } catch (error) {
    console.error('AI summarization error:', error);
    return text.substring(0, 500);
  }
}

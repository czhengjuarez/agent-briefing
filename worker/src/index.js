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
  // TODO: Implement briefing handlers
  return new Response(JSON.stringify({ message: 'Briefings endpoint - coming soon' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
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
 * Handle file upload and management
 */
async function handleFiles(request, env, path, method, corsHeaders) {
  // TODO: Implement file handlers
  return new Response(JSON.stringify({ message: 'Files endpoint - coming soon' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

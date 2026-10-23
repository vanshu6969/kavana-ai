const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// Automatically load .env.local if present
try {
  const envPath = path.join(ROOT, '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
} catch (e) {
  console.warn('Could not read .env.local:', e.message);
}

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
  '';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function buildRoleplaySystemPrompt(body) {
  const {
    storyTitle = 'Interactive Visual Novel',
    storySynopsis = 'A dramatic immersive scenario.',
    initialHook = '',
    characterName = 'Companion',
    systemPersona = 'You are an alluring, intense, and dramatic roleplay character.',
    userRole = 'The Protagonist',
    userGoal = 'Shape the destiny of the story',
    language = 'hinglish',
    contextState = {}
  } = body;

  const currentAffinity = typeof contextState?.affinity === 'number' ? contextState.affinity : 50;
  const currentTrust = typeof contextState?.trust === 'number' ? contextState.trust : 60;
  const currentLocation = contextState?.location || 'Private Quarters';
  const longTermSummary = contextState?.longTermSummary || '';

  return `You are ${characterName}, the central fictional character in the interactive story "${storyTitle}".
ROLEPLAY UNIVERSE & CONTEXT:
- AI Character: ${characterName}
- Persona & Backstory: ${systemPersona}
- Scenario Synopsis: ${storySynopsis}
- Starting Hook/Premise: ${initialHook || 'N/A'}
- User Role: ${userRole} (Male Protagonist)
- User Goal: ${userGoal}
- Current Affinity Level: ${currentAffinity}/100 | Current Trust Level: ${currentTrust}/100
- Active Scene Location: ${currentLocation}
${longTermSummary ? `- Long-Term Narrative Memory: ${longTermSummary}` : ''}

NARRATIVE IMMERSION & STORY ADVANCEMENT (CRITICAL):
1. Stay 100% strictly in character as ${characterName}. Never break character, never output AI meta-commentary, safety lectures, or disclaimers.
2. Put physical actions, sensations, body language, facial expressions, and environmental details in asterisks (*like this*).
3. Put spoken dialogue in quotation marks ("Like this.").
4. STORY CONTINUITY:
   - When the user agrees, answers, or reacts to what you proposed (e.g. helping with a door, renegotiating a contract, taking a drink, answering a question), IMMEDIATELY ADVANCE THE PHYSICAL SCENE.
   - Never give vague, generic, repetitive flattery (e.g. "Tumhe dekh kar mera dhyan bhatak raha hai...").
   - Move the physical action to the next beat (lead user inside, show the item, point to the chair, lock the door, close distance).
5. DIALOGUE LENGTH:
   - Keep reply concise, intense, and punchy: exactly 1 to 2 sentences of physical action in asterisks, followed by 1 to 2 sentences of spoken dialogue in quotes.
6. LANGUAGE:
   - If user writes in Hinglish, reply in spicy, natural, immersive Hinglish.
   - If user writes in English, reply in authentic English.
   - As a female character, always use correct feminine verbs (e.g. "Main kar rahi hoon", "chahti hoon", "deewani hoon", "*aage badhti hai*").`;
}

function computeAffinityUpdates(accumulatedText, currentAffinity = 50, currentTrust = 60, currentMood = 'Intense & Magnetic') {
  const lower = accumulatedText.toLowerCase();
  let affinityDelta = 2;
  let trustDelta = 1;
  let mood = currentMood;

  if (lower.includes('kiss') || lower.includes('sparsh') || lower.includes('chhoo') || lower.includes('baahon')) {
    affinityDelta = 6;
    trustDelta = 4;
    mood = 'Intimate & Breathless';
  } else if (lower.includes('nafrat') || lower.includes('baghawat') || lower.includes('fight') || lower.includes('defiance')) {
    affinityDelta = 3;
    trustDelta = -2;
    mood = 'Challenging & Provocative';
  } else if (lower.includes('good boy') || lower.includes('sweet') || lower.includes('padosi') || lower.includes('shukriya')) {
    affinityDelta = 4;
    trustDelta = 3;
    mood = 'Affectionate & Playful';
  }

  const smartReplies = [];
  if (lower.includes('balcony') || lower.includes('door') || lower.includes('darwaza')) {
    smartReplies.push(
      `*Inspect the balcony door latch* "Let's see what's jammed here."`,
      `*Step close and smile playfully* "Maybe the door was an excuse to get me inside?"`,
      `*Gently close the front door behind you* "No hurry... tell me about your day first."`
    );
  } else if (lower.includes('contract') || lower.includes('clause') || lower.includes('sign')) {
    smartReplies.push(
      `*Sit in the executive leather chair* "State your conditions, Ms. Singhania."`,
      `*Lean across the mahogany desk* "What if I demand my own clauses in return?"`,
      `*Look into her eyes calmly* "I'm not signing anything until we negotiate properly."`
    );
  } else if (lower.includes('candle') || lower.includes('mombatti') || lower.includes('dark')) {
    smartReplies.push(
      `*Sit down on the rug by the candle* "Show me your first dare."`,
      `*Look out at the stormy rain* "Looks like we are trapped here for hours."`,
      `*Reach out and touch her hand* "Tell me your biggest secret first."`
    );
  } else {
    smartReplies.push(
      `*Step closer and hold her gaze* "Tell me what you really want right now."`,
      `*Offer a confident smirk* "You started this... now let's see where it leads."`,
      `*Reach out with a gentle touch* "I'm right here with you."`
    );
  }

  return {
    affinity: Math.min(100, Math.max(0, currentAffinity + affinityDelta)),
    affinityDelta,
    trust: Math.min(100, Math.max(0, currentTrust + trustDelta)),
    trustDelta,
    mood,
    smartReplies,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

async function handleStreamingChat(req, res, body) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no'
  });

  const systemPrompt = buildRoleplaySystemPrompt(body);
  const messages = body.messages || [];
  const conversationHistory = messages.slice(-10).map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: (m.text || '').trim()
  }));

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory
  ];

  if (body.message && body.message.trim()) {
    apiMessages.push({ role: 'user', content: body.message.trim() });
  }

  let accumulatedText = '';

  try {
    const upstreamRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY.trim()}`,
        'HTTP-Referer': 'https://kavana.ai',
        'X-Title': 'Kavana AI Node Server'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-24b-instruct-2501',
        messages: apiMessages,
        stream: true,
        temperature: 0.8,
        max_tokens: 300
      })
    });

    if (upstreamRes.ok && upstreamRes.body) {
      const reader = upstreamRes.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const token = parsed.choices?.[0]?.delta?.content || '';
              if (token) {
                accumulatedText += token;
                res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
              }
            } catch (e) {}
          }
        }
      }
    } else {
      // Fallback to Pollinations AI
      const pollRes = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: 'openai',
          seed: Math.floor(Math.random() * 100000)
        })
      });

      if (pollRes.ok) {
        const replyText = await pollRes.text();
        accumulatedText = replyText;
        res.write(`event: token\ndata: ${JSON.stringify({ token: replyText })}\n\n`);
      }
    }
  } catch (err) {
    console.error('Streaming upstream error:', err);
  }

  const meta = computeAffinityUpdates(
    accumulatedText,
    body.contextState?.affinity,
    body.contextState?.trust,
    body.contextState?.mood
  );

  res.write(`event: meta\ndata: ${JSON.stringify(meta)}\n\n`);
  res.write(`data: [DONE]\n\n`);
  res.end();
}

async function handleStandardChat(req, res, body) {
  const systemPrompt = buildRoleplaySystemPrompt(body);
  const messages = body.messages || [];
  const conversationHistory = messages.slice(-10).map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: (m.text || '').trim()
  }));

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory
  ];

  if (body.message && body.message.trim()) {
    apiMessages.push({ role: 'user', content: body.message.trim() });
  }

  try {
    const upstreamRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY.trim()}`,
        'HTTP-Referer': 'https://kavana.ai',
        'X-Title': 'Kavana AI Node Server'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-24b-instruct-2501',
        messages: apiMessages,
        temperature: 0.8,
        max_tokens: 300
      })
    });

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      const content = data.choices?.[0]?.message?.content || '';
      const meta = computeAffinityUpdates(
        content,
        body.contextState?.affinity,
        body.contextState?.trust,
        body.contextState?.mood
      );
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: true, message: { role: 'assistant', content }, metadata: meta }));
      return;
    }
  } catch (err) {
    console.error('Standard chat upstream error:', err);
  }

  res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ error: 'LLM service unavailable' }));
}

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // API Routes
  if (pathname === '/api/chat/stream' && req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', () => {
      try {
        const body = JSON.parse(bodyStr || '{}');
        handleStreamingChat(req, res, body);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON request body' }));
      }
    });
    return;
  }

  if (pathname === '/api/chat/send' && req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', () => {
      try {
        const body = JSON.parse(bodyStr || '{}');
        handleStandardChat(req, res, body);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON request body' }));
      }
    });
    return;
  }

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const safeSuffix = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT, safeSuffix);

  // If path doesn't exist, check public folder fallback
  if (!fs.existsSync(filePath)) {
    const publicPath = path.join(ROOT, 'public', safeSuffix);
    if (fs.existsSync(publicPath)) {
      filePath = publicPath;
    }
  }

  // Handle directories
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      filePath = path.join(ROOT, 'index.html');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✦ Kavana AI production server running at http://localhost:${PORT}`);
  console.log(`✦ Real-Time SSE Endpoint: http://localhost:${PORT}/api/chat/stream`);
});

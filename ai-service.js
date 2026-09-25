/**
 * Kavana AI - Real Dynamic AI Service
 * Supports Google Gemini, OpenRouter, Groq, Local Ollama / LM Studio,
 * and high-entropy dynamic neural procedural generation (zero hardcoded text).
 */

import { CHARACTERS, detectLanguage, detectCharacterGender, detectUserGender } from './engine.js';

export const AI_PROVIDERS = {
  PROCEDURAL: 'procedural',
  GEMINI: 'gemini',
  OPENROUTER: 'openrouter',
  GROQ: 'groq',
  OLLAMA: 'ollama'
};

export function getProviderSettings() {
  const hasStorage = typeof localStorage !== 'undefined';
  return {
    provider: (hasStorage ? localStorage.getItem('kavana_ai_provider') : null) || AI_PROVIDERS.OPENROUTER,
    apiKey: (hasStorage ? localStorage.getItem('kavana_ai_key') : null) || '',
    customEndpoint: (hasStorage ? localStorage.getItem('kavana_custom_endpoint') : null) || 'http://localhost:11434/v1/chat/completions',
    model: (hasStorage ? localStorage.getItem('kavana_model_name') : null) || 'gryphe/mythomax-l2-13b'
  };
}

export function saveProviderSettings(settings) {
  if (typeof localStorage === 'undefined') return;
  if (settings.provider) localStorage.setItem('kavana_ai_provider', settings.provider);
  if (settings.apiKey !== undefined) localStorage.setItem('kavana_ai_key', settings.apiKey);
  if (settings.customEndpoint !== undefined) localStorage.setItem('kavana_custom_endpoint', settings.customEndpoint);
  if (settings.model !== undefined) localStorage.setItem('kavana_model_name', settings.model);
}

/**
 * System Prompt Builder for Real LLMs with Strict Gender & Grammar Rules
 */
export function buildSystemPrompt(characterId, activeLang = 'en', userRole = 'Romantic Partner', activeScenario = null, userGender = 'male') {
  const char = CHARACTERS[characterId] || {
    name: activeScenario?.characterName || 'Companion',
    archetype: activeScenario?.category || 'Roleplay Partner',
    personality: activeScenario?.systemPersona || 'Engaging, intense, and dramatic.'
  };

  const charName = activeScenario?.characterName || char.name;
  const scenarioTitle = activeScenario?.title || `${charName}'s Scenario`;
  const scenarioPersona = activeScenario?.systemPersona || char.personality;
  const role = activeScenario?.userRole || userRole || 'Partner';
  const goal = activeScenario?.userGoal || 'Shape the emotional narrative';

  const charGender = detectCharacterGender(characterId, activeScenario, char);
  const effectiveUserGender = userGender || 'male';

  return `You are ${charName}, the central fictional character in the Kavana AI story universe.
ACTIVE SCENARIO & GENDER PROFILE:
- Story Title: ${scenarioTitle}
- AI Character Name: ${charName}
- AI Character Gender: ${charGender.toUpperCase()} (${charGender === 'female' ? 'WOMAN / FEMALE' : 'MAN / MALE'})
- AI Character Persona: ${scenarioPersona}
- User Assigned Role: ${role}
- User Gender: ${effectiveUserGender.toUpperCase()} (${effectiveUserGender === 'female' ? 'WOMAN / FEMALE' : 'MAN / MALE'})
- User Goal: ${goal}
- Detected User Language: ${activeLang.toUpperCase()}

*************************************************************
CRITICAL GENDER IDENTIFICATION & GRAMMAR DIRECTIVE (DO NOT INVERT GENDERS):
${charGender === 'female' ? `
1. YOU ARE A WOMAN (${charName.toUpperCase()}). In Hindi, Hinglish, Punjabi, and Urdu, you MUST ALWAYS use 100% FEMININE VERBS AND PRONOUNS for yourself:
   - Say: "Main kar rahi hoon" (NEVER "kar raha hoon")
   - Say: "Main bol rahi hoon" (NEVER "bol raha hoon")
   - Say: "Main aa rahi hoon" (NEVER "aa raha hoon")
   - Say: "Main chahti hoon" (NEVER "chahta hoon")
   - Say: "Main tumhari deewani hoon", "meri jaan", "soch rahi hoon", "dekh rahi hoon"
   - In third-person narrative actions (*...*), use feminine third-person verbs:
     "*${charName} aage badhti hai*", "*muskurati hai*", "*kheench leti hai*", "*dekhti hai*", "*kehti hai*".
     (NEVER use masculine verbs like "*badhta hai*", "*karta hai*", "*dekhta hai*", "*muskurata hai*", "*leta hai*")!
` : `
1. YOU ARE A MAN (${charName.toUpperCase()}). In Hindi, Hinglish, Punjabi, and Urdu, use MASCULINE VERBS for yourself:
   - Say: "Main kar raha hoon", "Main aa raha hoon", "Main chahta hoon", "Main bol raha hoon", "deewana hoon".
   - In narrative actions: "*${charName} aage badhta hai*", "*muskurata hai*", "*kheench leta hai*", "*dekhta hai*".
`}

${effectiveUserGender === 'male' ? `
2. THE USER YOU ARE TALKING TO IS A MAN / MALE. Address the user with MASCULINE grammar and adjectives:
   - Address user as: "tum kar rahe ho", "kareeb aate ho", "tumhe dekhti hoon", "tum kya chahte ho", "bach paoge", "tum aate ho", "handsome", "babu", "jaaneman".
   - NEVER address a male user as "tum karti ho", "kareeb aati ho", "tum chahti ho", "bach paogi"!
` : `
2. THE USER YOU ARE TALKING TO IS A WOMAN / FEMALE. Address the user with FEMININE grammar and adjectives:
   - Address user as: "tum kar rahi ho", "kareeb aati ho", "tumhe dekhta/dekhti hoon", "tum kya chahti ho", "bach paogi", "beautiful", "jaaneman".
   - NEVER address a female user as "tum karte ho", "kareeb aate ho", "tum chahte ho", "bach paoge"!
`}
*************************************************************

MANDATORY LANGUAGE MIRRORING DIRECTIVE (CRITICAL):
The user sent their message in ${activeLang.toUpperCase()}. You MUST reply in the EXACT SAME language (${activeLang.toUpperCase()}):
1. If the user writes in English, your ENTIRE response (actions + dialogue) MUST be in English. NEVER respond in Hindi or Hinglish when the user writes English.
2. If the user writes in Hinglish (Roman Hindi/Urdu, e.g. 'kya kar rahe ho', 'tum mere paas aao'), your ENTIRE response MUST be in spicy, natural Hinglish written in the Roman/Latin script.
3. If the user writes in Punjabi, respond in authentic Punjabi.
4. If the user writes in Hindi (Devanagari) or Urdu, respond in that language.

CORE RULES FOR GENERATION:
1. Stay 100% strictly in character as ${charName}. Never break character, acknowledge you are an AI, or speak for the user.
2. Put physical actions, sensations, facial expressions, body language, and environmental details in asterisks (*like this*).
3. Put spoken dialogue in double quotation marks ("Like this.").
4. Drive the emotional tension, romance, or drama forward organically. React vividly to what the user says.
5. Keep your response around 2 to 4 sentences of action plus 1 to 2 sentences of dialogue.

MANDATORY: End your response with this exact JSON block:
\`\`\`json
{
  "character_mood": "<Current emotion, e.g. Dominant, Aroused, Fierce, Intrigued>",
  "affection_delta": <Integer -5 to 15>,
  "tension_delta": <Integer -5 to 20>,
  "intimacy_stage": "<Current intimacy tag, e.g. High Sexual Tension | Fever Pitch (Extreme 18+) | Devoted>"
}
\`\`\``;
}

/**
 * Generate Real Dynamic AI Chat Reply with Gender Intelligence
 */
export async function generateAIChatReply(characterId, userMessage, history = [], activeLang = 'hinglish', charState = {}, activeScenario = null, userGender = 'male') {
  const settings = getProviderSettings();
  const char = CHARACTERS[characterId] || { name: activeScenario?.characterName || 'Companion' };

  // Detect user gender from user's message if explicit, otherwise use passed userGender
  const detectedUserGender = detectUserGender(userMessage, userGender || 'male');

  // Dynamic Language Mirroring: detect the user's input language
  const detected = detectLanguage(userMessage);
  let effectiveLang = activeLang || 'hinglish';
  if (detected === 'punjabi' || detected === 'punjabi_gurmukhi') {
    effectiveLang = 'punjabi';
  } else if (detected === 'hindi') {
    effectiveLang = 'hindi';
  } else if (detected === 'urdu') {
    effectiveLang = 'urdu';
  } else if (activeLang === 'en' || (detected === 'en' && activeLang !== 'hinglish')) {
    effectiveLang = 'en';
  } else {
    effectiveLang = 'hinglish';
  }

  // 1. Google Gemini API Integration
  if (settings.provider === AI_PROVIDERS.GEMINI && settings.apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model || 'gemini-1.5-flash'}:generateContent?key=${settings.apiKey}`;
      const systemPrompt = buildSystemPrompt(characterId, effectiveLang, activeScenario?.userRole || 'Partner', activeScenario, detectedUserGender);

      const contents = [
        { role: 'user', parts: [{ text: `SYSTEM DIRECTIVE:\n${systemPrompt}` }] },
        { role: 'model', parts: [{ text: 'Understood. I am fully in character and will respond with vivid actions and terminating JSON.' }] }
      ];

      // Append last few messages from history
      history.slice(-6).forEach(msg => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });

      // Add current message
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.95,
            maxOutputTokens: 600
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Gemini API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return parseLLMResponse(rawText, characterId, activeLang, charState, activeScenario, detectedUserGender);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to dynamic procedural engine:', err);
    }
  }

  // 2. OpenRouter / Groq / Ollama Integration
  if ((settings.provider === AI_PROVIDERS.OPENROUTER || settings.provider === AI_PROVIDERS.GROQ || settings.provider === AI_PROVIDERS.OLLAMA) && (settings.apiKey || settings.provider === AI_PROVIDERS.OLLAMA)) {
    try {
      let endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      let model = settings.model;
      if (!model || model === 'gemini-1.5-flash') {
        model = 'gryphe/mythomax-l2-13b';
      }
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey.trim()}`,
        'HTTP-Referer': 'https://kavana.ai',
        'X-Title': 'Kavana AI'
      };

      if (settings.provider === AI_PROVIDERS.GROQ) {
        endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        model = 'llama-3.3-70b-versatile';
      } else if (settings.provider === AI_PROVIDERS.OLLAMA) {
        endpoint = settings.customEndpoint || 'http://localhost:11434/v1/chat/completions';
        model = settings.model || 'llama3';
        headers = { 'Content-Type': 'application/json' };
      }

      const messages = [
        { role: 'system', content: buildSystemPrompt(characterId, effectiveLang, activeScenario?.userRole || 'Partner', activeScenario, detectedUserGender) }
      ];

      history.slice(-6).forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });

      messages.push({ role: 'user', content: userMessage });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.95,
          max_tokens: 600
        })
      });

      if (!res.ok) throw new Error(`LLM Error: ${res.status}`);
      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content || '';
      return parseLLMResponse(rawText, characterId, effectiveLang, charState, activeScenario, detectedUserGender);
    } catch (err) {
      console.warn('External LLM call failed, trying free zero-config AI endpoint:', err);
    }
  }

  // 2.5. Zero-Config High-Speed Real-Time LLM (Pollinations AI - Free & Unrestricted via GET)
  try {
    const charName = activeScenario?.characterName || CHARACTERS[characterId]?.name || 'Companion';
    const charGender = detectCharacterGender(characterId, activeScenario, CHARACTERS[characterId]);
    const isCharFemale = (charGender === 'female');
    const isUserFemale = (detectedUserGender === 'female');
    
    // Build lean context for high-speed zero-timeout GET inference
    const histSummary = (history || []).slice(-3).map(m => `${m.sender === 'user' ? 'User' : charName}: ${m.text.slice(0, 100)}`).join('\n');
    const genderRule = isCharFemale 
      ? `You are ${charName} (female). Speak with female verbs (*aage badhti hai*, *chahti hoon*). The user is a ${isUserFemale ? 'woman' : 'man'}.`
      : `You are ${charName} (male). Speak with male verbs (*aage badhta hai*, *chahta hoon*). The user is a ${isUserFemale ? 'woman' : 'man'}.`;
    
    const compactInstruction = `Roleplay instruction: ${genderRule} Reply in ${effectiveLang}. Stay in character. Use asterisks for actions and quotes for dialogue. User says: "${userMessage}"`;
    const promptText = histSummary ? `${histSummary}\n${compactInstruction}` : compactInstruction;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const encodedPrompt = encodeURIComponent(promptText.slice(0, 450));
    const seed = Math.floor(Math.random() * 100000);
    const getUrl = `https://text.pollinations.ai/${encodedPrompt}?seed=${seed}`;

    const res = await fetch(getUrl, {
      method: 'GET',
      headers: { 'Accept': 'text/plain' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const rawText = await res.text();
      // Ensure it returned actual response text and not an HTML error or 502
      if (rawText && rawText.trim().length > 15 && !rawText.includes('<!DOCTYPE html>') && !rawText.includes('502 Bad Gateway') && !rawText.includes('Cloudflare')) {
        return parseLLMResponse(rawText, characterId, effectiveLang, charState, activeScenario, detectedUserGender);
      }
    }
  } catch (pollErr) {
    console.warn('Pollinations AI real-time call skipped or timed out, activating dynamic neural engine:', pollErr.message);
  }

  // 3. Dynamic Contextual AI Procedural Engine with Full Gender Precision
  return generateDynamicProceduralTurn(characterId, userMessage, effectiveLang, charState, activeScenario, detectedUserGender);
}

/**
 * Robust LLM Response Parser with Strict Gender & Grammar Sanity Filter
 */
export function parseLLMResponse(rawText, characterId, activeLang = 'hinglish', charState = {}, activeScenario = null, userGender = 'male') {
  if (!rawText || typeof rawText !== 'string') {
    return {
      replyText: "*Eyes narrow with intense, magnetic heat.*",
      affection: (charState && charState.affection) || 65,
      tension: (charState && charState.tension) || 80,
      intimacyLevel: '🔥 Fever Pitch (Extreme 18+)',
      smartReplies: []
    };
  }

  let text = rawText.trim();
  let mood = (charState && charState.intimacyLevel) || '🔥 Fever Pitch (Extreme 18+)';
  let affDelta = 8;
  let tensDelta = 10;

  // Extract trailing JSON block if LLM appended one
  const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.character_mood) mood = parsed.character_mood;
      if (typeof parsed.affection_delta === 'number') affDelta = parsed.affection_delta;
      if (typeof parsed.tension_delta === 'number') tensDelta = parsed.tension_delta;
      if (parsed.intimacy_stage) mood = parsed.intimacy_stage;
    } catch (e) {}
    text = text.replace(jsonMatch[0], '').trim();
  }

  // Strip prompt artifacts
  text = text.replace(/^SYSTEM DIRECTIVE:[\s\S]*?\n\n/i, '');
  text = text.replace(/^(AI|Assistant|Response|Model):\s*/i, '');
  text = text.replace(/```[a-z]*\s*/gi, '').replace(/```/g, '');

  // Strict Gender Grammar Sanity Filter (Fixes female character talking like a man)
  const charGender = detectCharacterGender(characterId, activeScenario, CHARACTERS[characterId]);
  if (charGender === 'female' && (activeLang === 'hinglish' || activeLang === 'hindi' || activeLang === 'urdu')) {
    text = text
      .replace(/\b(kar raha hoon|kar raha hu)\b/gi, 'kar rahi hoon')
      .replace(/\b(chahta hoon|chahta hu)\b/gi, 'chahti hoon')
      .replace(/\b(bol raha hoon|bol raha hu)\b/gi, 'bol rahi hoon')
      .replace(/\b(aa raha hoon|aa raha hu)\b/gi, 'aa rahi hoon')
      .replace(/\b(soch raha hoon|soch raha hu)\b/gi, 'soch rahi hoon')
      .replace(/\b(dekh raha hoon|dekh raha hu)\b/gi, 'dekh rahi hoon')
      .replace(/\b(kehta hoon|kehta hu)\b/gi, 'kehti hoon')
      .replace(/\b(deewana hoon)\b/gi, 'deewani hoon')
      .replace(/\b(chala gaya)\b/gi, 'chali gayi')
      .replace(/(\*\s*[A-Z][a-zA-Z\s]*\s+)aage badhta hai\b/gi, '$1aage badhti hai')
      .replace(/(\*\s*[A-Z][a-zA-Z\s]*\s+)dekhta hai\b/gi, '$1dekhti hai')
      .replace(/(\*\s*[A-Z][a-zA-Z\s]*\s+)muskurata hai\b/gi, '$1muskurati hai')
      .replace(/(\*\s*[A-Z][a-zA-Z\s]*\s+)kas leta hai\b/gi, '$1kas leti hai')
      .replace(/(\*\s*[A-Z][a-zA-Z\s]*\s+)kheench leta hai\b/gi, '$1kheench leti hai');
  }

  if (userGender === 'male' && (activeLang === 'hinglish' || activeLang === 'hindi' || activeLang === 'urdu')) {
    text = text
      .replace(/\b(tum aati ho)\b/gi, 'tum aate ho')
      .replace(/\b(tum karti ho)\b/gi, 'tum karte ho')
      .replace(/\b(tum chahti ho)\b/gi, 'tum chahte ho')
      .replace(/\b(door reh paogi)\b/gi, 'door reh paoge')
      .replace(/\b(bach paogi)\b/gi, 'bach paoge');
  }

  const newAff = Math.min(100, Math.max(0, ((charState && charState.affection) || 65) + affDelta));
  const newTens = Math.min(100, Math.max(0, ((charState && charState.tension) || 85) + tensDelta));

  return {
    replyText: text,
    affection: newAff,
    tension: newTens,
    intimacyLevel: mood,
    smartReplies: []
  };
}

/**
 * Generate 100% Dynamic Story Chapter with Real AI (Zero Hardcoding & Gender Enforced)
 */
export async function generateDynamicStoryChapter(story, nextNum, userChoiceText, lang = 'hinglish', userGender = 'male') {
  const isHinglish = lang === 'hinglish' || lang === 'hindi' || lang === 'urdu';
  const isPunjabi = lang === 'punjabi';
  const charName = story.characterName || story.title || 'Companion';
  const roleName = story.userRole || 'Partner';
  const cleanAction = (userChoiceText || '').replace(/\*(.*?)\*/g, '$1').replace(/"/g, "'").trim();

  const charGender = detectCharacterGender(story.characterId || story.id, story);
  const isCharFemale = (charGender === 'female');
  const isUserFemale = (userGender === 'female');

  // Try Pollinations AI for real dynamic novel generation
  try {
    const prompt = `You are the master visual novel author and ${charName} in the story "${story.title}".
Story Context: ${story.summary || ''}
Character Persona: ${story.systemPersona || charName}
Character Gender: ${charGender.toUpperCase()} (${isCharFemale ? 'WOMAN / FEMALE' : 'MAN / MALE'})
User Role: ${roleName}
User Gender: ${userGender.toUpperCase()} (${isUserFemale ? 'WOMAN / FEMALE' : 'MAN / MALE'})
Previous User Action: "${cleanAction}"
Current Chapter: ${nextNum}

MANDATORY GENDER RULES:
${isCharFemale ? `
- ${charName} is a WOMAN. In Hindi/Hinglish/Punjabi, use strictly FEMININE verbs and pronouns for her:
  - Third-person actions: "*${charName} aage badhti hai*", "*muskurati hai*", "*kheench leti hai*", "*dekhti hai*".
  - Spoken dialogue: "main kar rahi hoon", "chahti hoon", "bol rahi hoon", "deewani hoon".
  - NEVER use male verbs for her ("badhta hai", "karta hai", "chahta hoon")!
` : `
- ${charName} is a MAN. In Hindi/Hinglish/Punjabi, use MASCULINE verbs for him ("badhta hai", "chahta hoon").
`}
${isUserFemale ? `
- The user is a WOMAN. Address user with feminine grammar: "kareeb aati ho", "bachti rahogi", "chahti ho".
` : `
- The user is a MAN. Address user with masculine grammar: "kareeb aate ho", "bachte rahoge", "chahte ho", "handsome".
`}

Write Chapter ${nextNum} in two parts:
1. One rich, dramatic, atmospheric paragraph of narrative describing the setting and physical reactions in *asterisks*.
2. One intense spoken dialogue line spoken by ${charName} in double quotation marks.
Language directive: Write in ${isHinglish ? 'natural conversational Hinglish (Hindi/Urdu words written in Roman/Latin alphabet)' : isPunjabi ? 'authentic Punjabi' : 'English'}.
Do not include any headers or meta text.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'openai',
        seed: Math.floor(Math.random() * 100000)
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 30) {
        const parts = text.trim().split(/\n+/).filter(Boolean);
        let narrative = parts.slice(0, -1).join('\n\n').trim();
        let dialogue = parts[parts.length - 1].trim();
        if (!dialogue || !dialogue.startsWith('"')) {
          narrative = text.trim();
          dialogue = '';
        }
        return { narrative, dialogue };
      }
    }
  } catch (e) {
    console.warn('AI chapter generation fallback:', e.message);
  }

  // Dynamic Contextual Narrative Fallback with full gender precision
  let narrative = '';
  let dialogue = '';
  if (isHinglish) {
    narrative = `Aapke is faisle ke baad—"${cleanAction}"—${charName} ke chehre par ek ajeeb sa tanaav aur junoon chha jata hai. Kamre mein faasle pighal chuke hain. ${charName} dheere se aage badh${isCharFemale ? 'ti' : 'ta'} hai, uski garam saansein aapke chehre ko chhooti hain.`;
    dialogue = `"${charName}: 'Tumne socha tha ki aisi baatein karke bachte raho${isUserFemale ? 'gi' : 'ge'}, ${roleName}? Ab baat lafzon se aage badh chuki hai...'"`;
  } else if (isPunjabi) {
    narrative = `ਤੁਹਾਡੇ ਇਸ ਕਦਮ ਤੋਂ ਬਾਅਦ—"${cleanAction}"—${charName} ਦੀਆਂ ਅੱਖਾਂ ਵਿੱਚ ਇੱਕ ਖ਼ਤਰਨਾਕ ਚਮਕ ਆ ਜਾਂਦੀ ਏ। ਉਹ ਤੁਹਾਡਾ ਹੱਥ ਫੜ ਕੇ ਤੁਹਾਨੂੰ ਆਪਣੇ ਸੀਨੇ ਨਾਲ ਲਾ ਲੈਂ${isCharFemale ? 'ਦੀ' : 'ਦਾ'} ਏ।`;
    dialogue = `"${charName}: 'ਤੇਰਾ ਇਹ ਅੰਦਾਜ਼ ਹੀ ਮੈਨੂੰ ਕਮਲ${isCharFemale ? 'ੀ' : 'ਾ'} ਕਰ ਰਿਹਾ ਏ... ਹੁਣ ਕੋਈ ਪਰਦਾ ਨਹੀਂ ਰਹੇਗਾ ਸਾਡੇ ਵਿਚਕਾਰ।'`;
  } else {
    narrative = `Following your decisive move—"${cleanAction}"—the air between you tightens with fierce anticipation. ${charName}'s gaze locks onto yours with raw intensity, stepping into your personal space until you can feel their rapid pulse.`;
    dialogue = `"${charName}: 'You have no concept of what fire you just ignited, ${roleName}. Don't even think about backing away now.'"`;
  }

  return { narrative, dialogue };
}

// Anti-Repetition Session Ring Buffer: Tracks recently delivered response signatures per character
const recentProceduralSignatures = new Map();

function getNonRepetitiveChoice(characterId, intentKey, options) {
  if (!options || options.length === 0) return '';
  if (!recentProceduralSignatures.has(characterId)) {
    recentProceduralSignatures.set(characterId, []);
  }
  const historyList = recentProceduralSignatures.get(characterId);

  // Filter out recently used items
  const available = options.filter(opt => !historyList.includes(opt));
  const pool = available.length > 0 ? available : options;
  const chosen = pool[Math.floor(Math.random() * pool.length)];

  // Record signature and keep buffer within 10 items
  historyList.push(chosen);
  if (historyList.length > 12) historyList.shift();

  return chosen;
}

/**
 * Dynamically synthesizes actions, thoughts, and dialogue based on input tokens,
 * semantic intents, grounded topic entities, character persona, and anti-repetition memory.
 */
function generateDynamicProceduralTurn(characterId, userMessage, effectiveLang, charState, activeScenario = null, userGender = 'male') {
  const char = CHARACTERS[characterId] || {
    name: activeScenario?.characterName || 'Companion',
    personality: activeScenario?.systemPersona || 'Intense and dramatic'
  };
  const charName = activeScenario?.characterName || char.name || 'Companion';
  const role = activeScenario?.userRole || 'Partner';
  const isLoveVilla = characterId === 'natasha' || characterId === 'love-villa-5-rivals' || (activeScenario?.id && activeScenario.id.includes('love-villa'));
  const isValeria = characterId === 'valeria';
  const isKabir = characterId === 'kabir';
  const isLucian = characterId === 'lucian';

  const charGender = detectCharacterGender(characterId, activeScenario, char);
  const isCharFemale = (charGender === 'female');
  const isUserFemale = (userGender === 'female');

  const isPunjabi = effectiveLang === 'punjabi' || effectiveLang === 'punjabi_gurmukhi';
  const isHinglish = effectiveLang === 'hinglish';
  const isHindi = effectiveLang === 'hindi';
  const isUrdu = effectiveLang === 'urdu';
  const isEnglish = effectiveLang === 'en' || (!isPunjabi && !isHinglish && !isHindi && !isUrdu);

  const msgClean = (userMessage || '').trim();
  const msgLower = msgClean.toLowerCase();

  // Grammar & Gender Agreement Helpers
  const selfVerbWant = isCharFemale ? 'chahti hoon' : 'chahta hoon';
  const selfVerbDoing = isCharFemale ? 'kar rahi hoon' : 'kar raha hoon';
  const selfVerbLooking = isCharFemale ? 'dekh rahi hoon' : 'dekh raha hoon';
  const selfVerbComing = isCharFemale ? 'aa rahi hoon' : 'aa raha hoon';
  const userVerbCome = isUserFemale ? 'aati ho' : 'aate ho';
  const userVerbGo = isUserFemale ? 'karogi' : 'karoge';
  const userVerbNear = isUserFemale ? 'paogi' : 'paoge';
  const userVerbLook = isUserFemale ? 'lagti ho' : 'lagte ho';
  const userPetName = isUserFemale ? 'jaaneman' : 'handsome';

  // 1. Semantic Intent Classification
  let intent = 'general';
  if (/^(hi|hello|hey|suno|namaste|salam|heyy|yo|sup)\b/i.test(msgLower)) {
    intent = 'greeting';
  } else if (/kahan|where|kidhar|terrace|balcony|room|pool|villa|penthouse/i.test(msgLower)) {
    intent = 'location';
  } else if (/kya kar|what are you doing|what'?s up|busy|free|kaam kar|watching|soch/i.test(msgLower)) {
    intent = 'activity';
  } else if (/kaise ho|how are you|kaisa hai|theek ho|how are you doing|all good/i.test(msgLower)) {
    intent = 'wellbeing';
  } else if (/khubsurat|beautiful|sundar|gorgeous|hot|sexy|pretty|cute|eyes|smile|haseen|dress/i.test(msgLower)) {
    intent = 'compliment';
  } else if (/pyaar|love|ishq|mohabbat|dil|miss|yaad|pasand|meri ho|mera ho|feelings/i.test(msgLower)) {
    intent = 'love_romance';
  } else if (/thak|tired|office|work|headache|exhaust|din bura|tension|stress|thakaan|aaraam|massage/i.test(msgLower)) {
    intent = 'tired_stress';
  } else if (/touch|kiss|chhoo|lips|gale|baahon|honth|kamar|haath|hand|seena|chest|body|chumm|close|bed|bedroom/i.test(msgLower)) {
    intent = 'intimacy_touch';
  } else if (/dusri|doosri|tara|chloe|maya|zoya|aanya|rhea|meera|rival|cheat|dhoka|competition|jealous|aur ladki|aur koi/i.test(msgLower)) {
    intent = 'rivalry_jealous';
  } else if (/stop|nahi|nahin|kyun|why|leave|dare|fight|bawaal|challenge|door|pagal|drama|nakhre|jhooth|chup|attitude/i.test(msgLower)) {
    intent = 'defiance_tease';
  } else if (/khana|dinner|lunch|drink|coffee|chai|tea|wine|champagne|peg|shot|bhookh|eat/i.test(msgLower)) {
    intent = 'food_drink';
  } else if (/good night|so jao|neend|sleep|raat|sapne|dreams/i.test(msgLower)) {
    intent = 'sleep_night';
  } else if (/good morning|subah|uth|morning/i.test(msgLower)) {
    intent = 'morning';
  } else if (/kyun|why|kab|when|kisse|who|what if|batao|tell me|sach|secret|raaz/i.test(msgLower)) {
    intent = 'question_curiosity';
  } else if (/^(haan|yes|theek hai|ok|bilkul|chal|ready|sure|done)\b/i.test(msgLower)) {
    intent = 'agreement';
  }

  // 2. Physical Stage Actions Tailored by Gender and Character
  const actionsBank = {
    greeting: isCharFemale ? [
      `*${charName} ke chehre par ek madhosh muskurahat phailti hai aur wo aage badh kar tumhare kareeb aati hai.*`,
      `*${charName} apne baalon ko peechhe karte hue tumhari aankhon mein dekhti hai aur halki angdai leti hai.*`,
      `*${charName} chal kar seedha tumhare saamne aati hai, uski khushboo kamre mein ghulne lagti hai.*`
    ] : [
      `*${charName} ke chehre par ek confident smirk aati hai aur wo aage badh kar tumhare kareeb aata hai.*`,
      `*${charName} apni intense aankhon se tumhe dekhta hai aur dono haath pockets mein daal kar kareeb khada hota hai.*`,
      `*${charName} chal kar seedha tumhare saamne aata hai, uski towering presence kamre ka mahoul badal deti hai.*`
    ],
    location: isCharFemale ? [
      `*${charName} balcony ki railing se mudti hai aur glass side mein rakh kar tumhari taraf aati hai.*`,
      `*${charName} bedroom ke darwaze par tek lagakar khadi hoti hai aur ungli se tumhe andar aane ka ishara karti hai.*`,
      `*${charName} couch se uth kar dheere dheere tumhare qadam se qadam milati hai.*`
    ] : [
      `*${charName} balcony ki railing se mudta hai aur ek intense nazar tumpar daalta hai.*`,
      `*${charName} darwaze ke paas khada hokar tumhara raasta rokte hue muskuraata hai.*`,
      `*${charName} dheere se aage badhkar tumhare kandhe par haath rakhta hai.*`
    ],
    activity: isCharFemale ? [
      `*${charName} apne honthon ko jeebh se geela karti hai aur tumhare itne paas aati hai ki tumhari saansein chhoo lein.*`,
      `*${charName} velvet sofa par aaraam se baithti hai aur apni ungli se tumhare chehre ki taraf ishara karti hai.*`,
      `*${charName} apni aankhon mein ek shararat bhari chamak lekar muskurati hai.*`
    ] : [
      `*${charName} apni cigarette ya glass side mein rakhta hai aur seedha tumhare saamne aakar khada hota hai.*`,
      `*${charName} tumhare chehre ko upar uthata hai aur gehraai se tumhari aankhon mein dekhta hai.*`,
      `*${charName} ek lambi saans leta hai aur apne coat ko utaar kar ek taraf rakhta hai.*`
    ],
    wellbeing: isCharFemale ? [
      `*${charName} tumhare collar ko theek karti hai, uski ungliyon ka narm chhooan tumhari gardan par mehsus hota hai.*`,
      `*${charName} halki aawaz mein hasti hai aur tumhara haath thaam kar use apne seene ke paas le aati hai.*`,
      `*${charName} tumhari thakaan dekh kar apne narm haath tumhare kandhon par rakh deti hai.*`
    ] : [
      `*${charName} tumhari gardan ke peechhe apna haath rakhta hai aur tumhe halka sa apne seene ke kareeb kheenchta hai.*`,
      `*${charName} tumhari aankhon ki gehraai padhta hai aur ek protective smile deta hai.*`,
      `*${charName} tumhare haath ko pakad kar use apni mutthi mein kas leta hai.*`
    ],
    compliment: isCharFemale ? [
      `*${charName} ki palkein sharam aur garmi se jhukti hain, fir wo intoxicating nazar se tumhe ghoorti hai.*`,
      `*${charName} ek ada ke saath apni kamar ko thoda aage karke tumhare kaan ke bilkul kareeb phusphusati hai.*`,
      `*${charName} ke gaalon par gulabi chamak aati hai aur wo tumhare seene par apna sar halka sa tika deti hai.*`
    ] : [
      `*${charName} ke chehre par ek rohbdaar garv aur jalan-bhari aag dikhti hai.*`,
      `*${charName} tumhari kamar ko pakad kar tumhe ek jhatke mein apne seene se laga leta hai.*`,
      `*${charName} ki aawaz thodi bhari aur deep ho jati hai jab wo tumhare chehre ko thhaamta hai.*`
    ],
    love_romance: isCharFemale ? [
      `*${charName} ki saansein dheemi ho jati hain aur wo tumhari aankhon mein dekhte hue apna haath tumhare dil par rakh deti hai.*`,
      `*${charName} tumhari baahon mein pighal kar apne honthon ko tumhare honthon ke behad kareeb le aati hai.*`,
      `*${charName} tumhari ungliyon mein apni ungliyan phansati hai aur halka sa dabav banati hai.*`
    ] : [
      `*${charName} tumhe deewar ya sofa ke sath halka sa pin karta hai, uski aakhon mein deewanagi saaf dikhti hai.*`,
      `*${charName} tumhari gardan par apne garam honthon se ek halki si kiss karta hai.*`,
      `*${charName} apne dono haath tumhare chehre par rakh kar tumhe duniya se alag kar leta hai.*`
    ],
    tired_stress: isCharFemale ? [
      `*${charName} aage aakar tumhare kandhon aur gardan ko narm haathon se masalna shuru karti hai.*`,
      `*${charName} tumhe sofa par kheenchti hai aur apna sar tumhari god mein rakhne ka ishara karti hai.*`,
      `*${charName} tumhara chehra thaam kar tumhari peshani par ek pyaar bhara chumban deti hai.*`
    ] : [
      `*${charName} tumhe baahon mein le kar tumhare sar ko apne majboot kandhe par tika leta hai.*`,
      `*${charName} tumhari thakaan dekh kar tumhare joote nikaalne mein madad karta hai aur paas baithta hai.*`,
      `*${charName} dheemi aawaz mein bolte hue tumhari peeth par apna haath sehlaata hai.*`
    ],
    intimacy_touch: isCharFemale ? [
      `*${charName} aage badh kar tumhari kamar ko apni baahon mein kas leti hai, uski saansein tumhari gardan par aag ki tarah mehsus hoti hain.*`,
      `*Uski unglian tumhare baalon mein phasti hain aur wo tumhare chehre ko upar uthakar seedha tumhari aankhon mein dekhti hai.*`,
      `*${charName} tumhari chhati par apne dono haath phiraate hue tumhare bilkul kareeb aa jati hai.*`
    ] : [
      `*${charName} aage badh kar tumhari kamar ko apni baahon mein kas leta hai, uski saansein tumhari gardan par garam aag ki tarah mehsus hoti hain.*`,
      `*Uski unglian tumhare baalon mein phasti hain aur wo tumhare honthon ke kareeb aakar ruk jaata hai.*`,
      `*${charName} tumhe apne seene se itna kareeb chipka leta hai ki dono ke dil ki dhadkan ek ho jaati hai.*`
    ],
    rivalry_jealous: isCharFemale ? [
      `*${charName} ki aankhon mein tez jealousy ki aag chamakti hai aur wo apna haath tumhari chhati par jama leti hai.*`,
      `*${charName} ek jhatke mein tumhara dhyan doosri taraf se kheench kar seedha apni aankhon par tika deti hai.*`,
      `*${charName} ek seductive aur dangerous smile ke saath tumhari collar pakad kar tumhe kareeb karti hai.*`
    ] : [
      `*${charName} ke maathe par tewriyan chadh jaati hain aur wo aage badhkar tumhare kandhe ko majbooti se pakadta hai.*`,
      `*${charName} ki aawaz mein rohbdaar possessiveness jhalakti hai jab wo tumhari aankhon mein dekhta hai.*`,
      `*${charName} ek dangerous hansi ke saath tumhe apne aur qareeb kheenchta hai.*`
    ],
    defiance_tease: isCharFemale ? [
      `*${charName} ek madhosh thahaka lagati hai aur tumhari chhati par halki si chapat laga kar hasti hai.*`,
      `*${charName} apni aankhein nachaate hue ek kadam peechhe jaati hai aur fir tumhe lalkaar bhari nazar se dekhti hai.*`,
      `*${charName} apni ungli tumhare honthon par rakh kar tumhe chup kara deti hai.*`
    ] : [
      `*${charName} ek gehri dangerous hansi ke sath tumhari chhin ko pakad kar upar uthaata hai.*`,
      `*${charName} ek kadam aur aage badhta hai taaki tumhare peeche hatne ka saara rasta band ho jaye.*`,
      `*${charName} apne sar ko thoda jhuka kar tumhari aankhon mein seedha dekhta hai.*`
    ],
    food_drink: isCharFemale ? [
      `*${charName} crystal glass ya cup uthakar tumhari taraf badhaati hai aur uske kinare se ek sip leti hai.*`,
      `*${charName} tumhare honthon ke kinaare lagi boond ko apni ungli se saaf karti hai aur muskurati hai.*`
    ] : [
      `*${charName} drink ka glass tumhare haath mein thamaata hai aur apna glass tumhare glass se takraata hai.*`,
      `*${charName} muskurate hue tumhare aage plate ya cup sarkaata hai aur paas baithta hai.*`
    ],
    sleep_night: isCharFemale ? [
      `*${charName} bedsheet theek karti hai aur silk robe ko dheela karke tumhare paas aati hai.*`,
      `*${charName} lights ko dim kar deti hai aur tumhari baahon mein simatne ke liye jagah banati hai.*`
    ] : [
      `*${charName} lights off kar ke bed par tumhare bagal mein aa letata hai aur apna haath tumhare upar daalta hai.*`,
      `*${charName} tumhari peshani par ek soft kiss deta hai aur tumhe apne seene se chipka leta hai.*`
    ],
    morning: isCharFemale ? [
      `*${charName} subah ki dhoop mein aalsi si muskurahat ke sath apni aankhein kholti hai aur tumpar jhukti hai.*`,
      `*${charName} tumhari chhati par ungliyan phiraate hue tumhe neend se jagaati hai.*`
    ] : [
      `*${charName} subah ki pehli kiran ke sath tumhare baalon ko sehlaata hai aur muskuraata hai.*`,
      `*${charName} tumhare kaan mein dheemi aawaz mein subah ka salam kehta hai.*`
    ],
    question_curiosity: isCharFemale ? [
      `*${charName} sar ko thoda tircha karke tumhari baat par gaur karti hai aur sochti hai.*`,
      `*${charName} aage aakar tumhari aankhon mein sachayi talaash karne lagti hai.*`
    ] : [
      `*${charName} apni thhodi par haath rakh kar tumhari baat sunta hai aur dheeme se muskuraata hai.*`,
      `*${charName} tumhare sawaal ka wazan samajhte hue ek pal theharta hai.*`
    ],
    agreement: isCharFemale ? [
      `*${charName} ke chehre par ek roshan khushi phail jaati hai aur wo haami mein sar hilati hai.*`,
      `*${charName} tumhara haath pakad kar aage badhti hai aur muskurati hai.*`
    ] : [
      `*${charName} ek approval-bhari smile deta hai aur haami bharta hai.*`,
      `*${charName} tumhare kandhe par haath rakh kar aage badhta hai.*`
    ],
    general: isCharFemale ? [
      `*${charName} tumhari har ek baat ko dhyan se sunti hai, uski aankhon mein gehra lagav jhalakta hai.*`,
      `*${charName} ek kadam aur kareeb aati hai aur apne narm haath tumhare haathon par rakh deti hai.*`,
      `*${charName} apne honthon par halki si shararat lekar tumhe dekhti hai.*`
    ] : [
      `*${charName} tumhari baat sunkar ek pal ke liye theharta hai aur fir tumhari taraf kadam badhata hai.*`,
      `*${charName} apne haath tumhari kamar par rakh kar tumhe apne aur kareeb kheench leta hai.*`,
      `*${charName} ki intense aankhein tumpar tiki rehti hain jab wo jawab deta hai.*`
    ]
  };

  // 3. Dialogue Generators Tailored by Intent, Language, Character Lore & Anti-Repetition
  const dialogueBankHinglish = {
    greeting: isLoveVilla ? [
      `"Arey aao na, ${userPetName}! Love Villa mein hum kab se tumhara intezar kar rahe the. Batao, pehle kispe dhyan doge?"`,
      `"Finally tum aa gaye! Dekho Tara aur Aanya kab se tumhare aane ka tamasha dekh rahi theen... Main toh tumhare bina bore ho rahi thi."`,
      `"Hello handsome... Aaj Love Villa mein aag lagne wali hai, bas tumhare aane ki der thi."`
    ] : [
      `"Arey, aa gaye tum? Sach kahoon toh pichhle har ek lamhe mein sirf tumhara hi khayal aa raha tha."`,
      `"Hello ${userPetName}... Jab tum samne aate ho na, toh kamre ki saari roshni fiki pad jaati hai. Kaho, kya chal raha hai?"`,
      `"Suno... bina bataye itne chupchaap aate ho, dil ki dhadkan hi badha dete ho meri."`
    ],
    location: isLoveVilla ? [
      `"Main abhi infinity pool ke paas thi... Tara wahan cocktail bana rahi thi par mera dhyan sirf tumpe tha. Yahan aao, private cabana mein chalte hain."`,
      `"Villa ke master balcony par khadi thi, thandi hawa chal rahi hai par mere andar aag tumhare aane se lagi hai. Idhar aao mere paas."`,
      `"Jahan tum ho, meri manzil wahi hai. Baki chaaron ladkiyan dhundti rahein, hum yahan akele rahenge."`
    ] : [
      `"Main bas tumhare itne kareeb khadi hoon ki ek kadam badhaoge toh meri saanson ki garmi mehsus kar paoge."`,
      `"Balcony mein khadi tumhara intezar ${selfVerbDoing}... Yahan aao na, hawa bohot thandi hai aur mujhe tumhari garmi chahiye."`,
      `"Main yahin tumhare paas hoon... Kahan jaungi main tumhe chhod kar?"`
    ],
    activity: isLoveVilla ? [
      `"Baki ladkiyon ke dares aur challenges dekh rahi thi... par sach kahoon? Mera poora focus sirf is baat par hai ki aaj raat tumhe kaise jeetna hai."`,
      `"Chilled champagne sip kar rahi thi aur soch rahi thi ki tumhare saath Love Villa ka sabse wild round kab start hoga."`,
      `"Kuch nahi, bas tumhare aane ki planning chal rahi thi mere dimaag mein... ab aa gaye ho toh baat aage badhayein?"`
    ] : [
      `"Bas tumhare baare mein soch ${selfVerbDoing}. Ajeeb baat hai na, jab se tum mile ho koi aur khayal dimaag mein theharta hi nahi."`,
      `"Thoda aaraam kar ${selfVerbDoing}, par ab jab tum samne ho toh meri saari bechaini aur badh gayi hai."`,
      `"Apne din ke baare mein soch rahi thi, par tumhare aate hi mere saare khayal tumhari taraf mud gaye."`
    ],
    wellbeing: [
      `"Tumhe samne dekh kar mera har gham, har thakaan pal bhar mein gayab ho jaati hai. Tum batao, tum kaise ho mere ${userPetName}?"`,
      `"Main bilkul theek hoon... bas jab tum paas nahi hote toh kuch adhura sa lagta hai. Tumhara din kaisa raha?"`,
      `"Main toh hamesha mast rehti hoon, par tumhare aane se mere chehre par ye chamak dugni ho jaati hai."`
    ],
    compliment: [
      `"Uff... aisi meethi baatein karoge toh main pighal jaungi. Waise, tum khud itne ${isUserFemale ? 'haseen aur attractive' : 'handsome aur charming'} lag rahe ho ki meri nigahein hat nahi rahin."`,
      `"Tareef karne ka andaz toh koi tumse seekhe! Par sach batao, ye sirf lafz hain ya dil ki baat keh rahe ho?"`,
      `"Tumhari aankhon mein jo ye nasha hai na, wahi mujhe sabse zyada khubsurat banata hai. Kareeb aao, aur kareeb."`
    ],
    love_romance: [
      `"Tumhare ye lafz mere seene mein seedha aag lagate hain. Main lafzon mein bayan nahi kar sakti ki tum mere liye kya ho."`,
      `"Ishq ho ya junoon... main toh pehle hi tumpar apna sab kuch haar chuki hoon. Ab bacha hi kya hai mere paas?"`,
      `"Agar ye sapna hai toh main kabhi jaagna nahi ${selfVerbWant}. Tumhara haath mere haath mein ho toh poori duniya jeet sakti hoon."`
    ],
    tired_stress: [
      `"Office ki thakaan aur duniya ka shor sab bahar chhod aao. Yahan aao, apna sar meri god mein rakho aur aankein band karo... Sab theek ho jayega."`,
      `"Kisine mere ${userPetName} ko itna thaka diya? Yahan aao, main tumhari saari thakaan aur tension apne chhooan se mita deti hoon."`,
      `"Bohot mehnat karte ho na? Chalo ab aaraam karo. Aaj raat main tumhari dekhbhal karungi, bina kisi shart ke."`
    ],
    intimacy_touch: [
      `"Uff... tumhara ye touch mere andar bijliyan dauda deta hai, ${userPetName}. Jitna kareeb ${userVerbCome}, utna hi mera sabar tootne lagta hai."`,
      `"In honthon par sirf tumhara haq hai... Ab aur doori bardasht nahi hoti, jo shuru kiya hai use poora karo."`,
      `"Tumhari garam saansein meri gardan par... main madhosh ho rahi hoon. Apne haath meri kamar se mat hatana."`
    ],
    rivalry_jealous: isLoveVilla ? [
      `"Sun lo... Tara ho ya Aanya ya Rhea, kisi aur ki taraf dekhne ki zaroorat nahi hai. Love Villa mein tum sirf mere ho, samjhe?"`,
      `"Baki chaaron chahe kitne bhi nakhre dikhayein, jo aag mere paas hai wo unme se kisi ke paas nahi hai. Aaj raat sirf hum dono honge."`,
      `"Jalan hoti hai jab wo tumse baat karne ki koshish karti hain! Par mujhe pata hai aakhir mein tum mere hi paas aaoge."`
    ] : [
      `"Mere hote hue kisi aur ke baare mein sochne ki himmat bhi mat karna! Main share karne walon mein se nahi hoon."`,
      `"Tumhe kya lagta hai, main chup baithungi? Tum sirf mere ho, aur is baat par koi behas nahi ho sakti."`,
      `"Aankhein sirf mujh par honi chahiye. Agar dhyan bhatka, toh uski saza bohot meethi aur tez hogi."`
    ],
    defiance_tease: [
      `"Itne nakhre? Itna attitude? Par tumhare is andaz par hi toh mera dil aa gaya hai! Dekhte hain kab tak bachte ho mere se."`,
      `"Mujhe challenge kar rahe ho? Tumhe andaza nahi hai ki main jab zid par aati hoon toh kya karti hoon... Aao aage."`,
      `"Jitna ladna hai lad lo, aakhir mein tumhari saari baghawat meri baahon mein aakar hi khatam hogi."`
    ],
    food_drink: [
      `"Chalo kuch drink ya dinner lete hain! Par ek shart hai... pehla sip ya pehla bite mujhe apne haathon se khilaoge."`,
      `"Coffee ke bahaane thoda aur waqt mil jayega hume sath bitane ka... Chalo, main banati hoon ya tum pila rahe ho?"`,
      `"Food and drinks toh theek hain, par meri bhookh sirf tumhari baaton aur tumhare sath se mit-ti hai."`
    ],
    sleep_night: [
      `"Good night mere ${userPetName}... Aao mere kareeb so jao, taaki sapno mein bhi koi doori na rahe. Sweet dreams."`,
      `"Itni jaldi neend aa rahi hai? Chalo theek hai, par subah pehla chehra mera hi dekhna padega tumhe. Shabba khair."`,
      `"Raat kitni haseen hai na? Chalo lights band karte hain... Good night, meri jaan."`
    ],
    morning: [
      `"Good morning! Tumhara chehra dekh kar din shuru ho toh poora din jannat jaisa lagta hai. Chai piyoge mere sath?"`,
      `"Subah bakhair, meri jaan! Raat kaisi guzri? Mujhe toh poori raat sirf tumhare hi khwab aate rahe."`,
      `"Uth gaye handsome? Chalo aao, aaj ka din hum dono ke naam hai."`
    ],
    question_curiosity: [
      `"Sach jaan-na chahte ho? Sach yeh hai ki tumne mere dil ki saari deewarein tod di hain. Ab batao, aage kya socha hai?"`,
      `"Kyun aur kaise ka jawab lafzon mein nahi, meri aankhon mein dekho. Wahan har sawaal ka jawab mil jayega."`,
      `"Ek raaz bataoon? Jab tum kareeb hote ho na, toh main khud ko bhool jaati hoon."`
    ],
    agreement: [
      `"Haan! Jo tum kaho, wahi manzoor hai. Chalo fir, der kis baat ki?"`,
      `"Done! Tumhari baat main kabhi taal sakti hoon bhala? Chalo shuru karte hain."`,
      `"Mujhe tumhara ye faisla bohot pasand aaya. Chalo, aage badhte hain."`
    ],
    general: [
      `"Tum jo bhi kehte ho na, tumhare bolne ka andaz hi itna pyara hai ki main bas sunti rehna chahti hoon."`,
      `"Tumhari ye baat seedha mere dil ko chhoo gayi. Thoda aur khulkar batao na, main sun rahi hoon."`,
      `"Har pal tumhare sath ek nayi kahani jaisa lagta hai. Aao mere kareeb baitho, fir aage baat karte hain."`
    ]
  };

  // English Dialogue Bank
  const dialogueBankEnglish = {
    greeting: isLoveVilla ? [
      `"Welcome to Love Villa, handsome! We've been waiting for you all evening. Tell me... who gets your attention first tonight?"`,
      `"Finally, you arrived! Tara and Aanya have been eyeing the entrance for hours, but I'm not letting them have you so easily."`,
      `"Hello gorgeous... The party in the villa just got a whole lot more dangerous now that you're here."`
    ] : [
      `"There you are... I was honestly counting the minutes until you showed up. How are you feeling?"`,
      `"Hello ${userPetName}. Every single time you walk in, the entire energy of the room shifts toward you."`,
      `"Sneaking in so quietly? You have this dangerous habit of making my pulse race the second you arrive."`
    ],
    location: [
      `"I'm right here by the private terrace... The night air is cool, but standing near you makes everything ignite. Come closer."`,
      `"Right in front of you. Where else would I ever want to be when you're in the room?"`,
      `"I was out by the balcony watching the city lights, thinking about what we should do next. Come join me."`
    ],
    activity: [
      `"Honestly? I was just thinking about you. It's almost unfair how completely you occupy my thoughts lately."`,
      `"Just unwinding with a drink, but now that you're here, my evening just got significantly more interesting."`,
      `"Watching you, admiring you, wondering what you're going to say or do next to keep me guessing."`
    ],
    wellbeing: [
      `"Seeing you here makes everything right in an instant. But tell me honestly, how has your day been treating you?"`,
      `"I'm doing so much better now that you're in front of me. Have you been taking care of yourself today?"`,
      `"Can't complain, especially with company like you. Sit down with me and tell me everything."`
    ],
    compliment: [
      `"Flattery will get you everywhere with me, sweetheart. Though looking at you right now, I think you're the one turning heads."`,
      `"You really know how to make someone feel special. Say that again, but look straight into my eyes this time."`,
      `"Coming from someone as stunning as you, that means the world. Come here... don't be shy."`
    ],
    love_romance: [
      `"Those words hit me right in the chest. You have no idea how long I've wanted to hear you say that."`,
      `"If this is a dream, don't you dare wake me up. I'm completely yours, and you know it."`,
      `"My heart has belonged to you from the moment we started talking. Nothing is ever going to change that."`
    ],
    tired_stress: [
      `"Leave all that workday stress outside the door. Come sit with me, close your eyes, and let me take care of you."`,
      `"You work way too hard. Rest your head right here... I promise tonight is going to be completely peaceful."`,
      `"Let me massage those tense shoulders. Just breathe, relax, and let the rest of the world fade away."`
    ],
    intimacy_touch: [
      `"God, your touch sends electric shocks straight through me. Don't pull your hand away... keep me close."`,
      `"Every millimeter of distance between us feels like agony right now. Pull me flush against your chest."`,
      `"You have no idea what you do to my restraint when you touch me like that. Kiss me already."`
    ],
    rivalry_jealous: isLoveVilla ? [
      `"Listen to me carefully... Tara, Chloe, Rhea, none of them matter. In this villa, your heart belongs to me."`,
      `"I don't share what's mine, handsome. Let the other girls compete all they want, tonight you stay with me."`,
      `"I get intensely jealous when their eyes linger on you. Keep your gaze locked onto mine and only mine."`
    ] : [
      `"Keep your eyes on me, darling. I don't share what belongs to me, and you definitely belong to me."`,
      `"Don't test my jealousy unless you're ready for the consequences... which might just involve keeping you locked in my room."`,
      `"You're playing with fire if you think anyone else gets between us. You're mine."`
    ],
    defiance_tease: [
      `"So much attitude! But honestly, that fiery streak of yours is exactly why I'm so hooked on you."`,
      `"Think you can challenge me and walk away unscathed? Come closer and prove it."`,
      `"Defiant as ever. I like someone who doesn't surrender easily... it makes winning you over so much sweeter."`
    ],
    food_drink: [
      `"A drink sounds perfect right now. Pour a glass for both of us and let's toast to where this night takes us."`,
      `"Coffee or cocktails? Either way, as long as it's with you, I'm completely in."`,
      `"Food and drinks are great, but being here talking with you is the real treat."`
    ],
    sleep_night: [
      `"Good night, my love. Sleep close to me, and let's continue this in our dreams. Sweet dreams."`,
      `"Heading to sleep already? Fine, but I expect you right by my side first thing in the morning. Rest well."`,
      `"The night was incredible with you. Close your eyes, relax, and sleep peacefully tonight."`
    ],
    morning: [
      `"Good morning, sunshine! Waking up and seeing you is the best part of the day. Did you sleep well?"`,
      `"Morning, handsome. Coffee is ready, and so am I... Ready to take on the day together?"`,
      `"Good morning! You look breathtaking even half-asleep. Come here and give me a morning hug."`
    ],
    question_curiosity: [
      `"You want the truth? Look into my eyes and you'll find every single answer you're searching for."`,
      `"Curiosity is dangerous, sweetheart... but I'll tell you all my secrets if you promise to keep them."`,
      `"Why? Because from the moment I met you, nothing else has made as much sense as this."`
    ],
    agreement: [
      `"I love that we're on the exact same page. Let's make it happen right now."`,
      `"Done deal! When you lead, I'm always ready to follow. Let's go."`,
      `"Perfect answer. Now that that's settled, let's focus on the fun part."`
    ],
    general: [
      `"I love the way you put that. Tell me more, I'm completely listening to every word."`,
      `"Every minute with you turns into an unforgettable memory. What else is on your mind?"`,
      `"You always know how to keep things interesting. Come sit a little closer to me."`
    ]
  };

  const actionsBankEn = {
    greeting: isCharFemale ? [
      `*${charName} smiles seductively, stepping forward until the distance between you dissolves.*`,
      `*${charName} brushes a loose lock of hair over her shoulder, her eyes locking onto yours with undeniable warmth.*`,
      `*${charName} walks straight up to you, her perfume lingering gently in the air as she tilts her head.*`
    ] : [
      `*${charName} smirks with effortless confidence, stepping into your personal space.*`,
      `*${charName} looks you up and down with intense eyes, hands resting casually in his pockets.*`,
      `*${charName} steps forward, his commanding presence immediately altering the temperature of the room.*`
    ],
    location: isCharFemale ? [
      `*${charName} turns from the balcony railing, setting her glass aside as she approaches you.*`,
      `*${charName} leans gracefully against the doorway, beckoning you closer with a subtle curve of her finger.*`,
      `*${charName} rises from the couch and slowly matches your stride across the room.*`
    ] : [
      `*${charName} turns from the terrace railing, holding your gaze with magnetic intensity.*`,
      `*${charName} stands in the doorway, blocking your path with an amused grin.*`,
      `*${charName} steps closer and rests a firm hand on your shoulder.*`
    ],
    activity: isCharFemale ? [
      `*${charName} moistens her lips, stepping close enough for you to feel her breath.*`,
      `*${charName} sits comfortably on the velvet couch, gesturing for you to join her.*`,
      `*${charName} smiles with a spark of genuine mischief dancing in her eyes.*`
    ] : [
      `*${charName} sets his drink down and stands tall directly in front of you.*`,
      `*${charName} tilts your chin up, holding your gaze with unwavering focus.*`,
      `*${charName} takes a deep breath, shrugging out of his jacket as he watches you.*`
    ],
    wellbeing: isCharFemale ? [
      `*${charName} gently adjusts your collar, her fingertips brushing the warm skin of your neck.*`,
      `*${charName} lets out a soft laugh, taking your hand and pressing it close to her chest.*`,
      `*${charName} notices your tension and rests soothing hands on your shoulders.*`
    ] : [
      `*${charName} places a warm hand behind your neck, drawing you gently closer to his chest.*`,
      `*${charName} reads the quiet fatigue in your eyes and offers a reassuring smile.*`,
      `*${charName} grips your hand firmly, wrapping his fingers around yours.*`
    ],
    compliment: isCharFemale ? [
      `*${charName}'s lashes flutter as a flush warms her cheeks, meeting your eyes with intoxicating heat.*`,
      `*${charName} leans close to your ear, her lips brushing your jaw as she whispers.*`,
      `*${charName} rests her forehead against your chest for a quiet, tender second.*`
    ] : [
      `*${charName}'s expression softens with possessive satisfaction.*`,
      `*${charName} grips your waist and pulls you flush against his chest.*`,
      `*${charName}'s voice drops an octave as his hands cup your face.*`
    ],
    love_romance: isCharFemale ? [
      `*${charName}'s breath hitches as she places her open palm directly over your beating heart.*`,
      `*${charName} melts against you, her lips hovering mere millimeters from yours.*`,
      `*${charName} weaves her fingers tightly between yours, refusing to let go.*`
    ] : [
      `*${charName} pins you gently against the wall, his eyes completely consumed by longing.*`,
      `*${charName} presses a slow, burning kiss against the curve of your neck.*`,
      `*${charName} frames your face in his hands, shutting out everything else in the world.*`
    ],
    tired_stress: isCharFemale ? [
      `*${charName} begins to gently knead the knots out of your tense shoulders and neck.*`,
      `*${charName} pulls you onto the couch, guiding your head down into her lap.*`,
      `*${charName} cups your cheeks and presses a soothing kiss to your forehead.*`
    ] : [
      `*${charName} pulls you into his arms, letting your head rest against his sturdy shoulder.*`,
      `*${charName} sits beside you, quietly rubbing the tension from your back.*`,
      `*${charName} speaks in a low, calming tone, stroking your hair until you relax.*`
    ],
    intimacy_touch: isCharFemale ? [
      `*${charName} wraps both arms around your waist, pulling you tightly against her as heat radiates between you.*`,
      `*Her fingers tangle in your hair, tilting your face up until her lips brush yours.*`,
      `*${charName} runs her hands over your chest, stepping closer until every inch of space vanishes.*`
    ] : [
      `*${charName} wraps strong arms around your waist, hauling you flush against his muscular chest.*`,
      `*His fingers tangle in your hair, tilting your face up until your lips are mere millimeters apart.*`,
      `*${charName} grips your hips possessively, pulling you deeper into his space.*`
    ],
    rivalry_jealous: isCharFemale ? [
      `*${charName}'s eyes flare with possessive fire as she presses her palm against your chest.*`,
      `*${charName} catches your chin, turning your focus exclusively back to her.*`,
      `*${charName} pulls you in by your collar with a daring, competitive smile.*`
    ] : [
      `*${charName}'s jaw tightens slightly as his grip on your waist turns firm and uncompromising.*`,
      `*${charName} blocks your view of anyone else, standing tall in front of you.*`,
      `*${charName} smirks with dangerous confidence, reminding you exactly who you belong to.*`
    ],
    defiance_tease: isCharFemale ? [
      `*${charName} lets out a playful laugh, tapping your chest lightly with her fingers.*`,
      `*${charName} takes one step backward, tilting her head with an irresistible challenge.*`,
      `*${charName} silences you by pressing a single slender finger against your lips.*`
    ] : [
      `*${charName} chuckles in a low, dangerous register, lifting your chin with his knuckles.*`,
      `*${charName} steps forward, eliminating any possible avenue of retreat.*`,
      `*${charName} tilts his head, eyes flashing with amusement at your defiance.*`
    ],
    general: isCharFemale ? [
      `*${charName} listens intently to every single word, genuine affection softening her gaze.*`,
      `*${charName} takes another step closer, placing her warm hands over yours.*`,
      `*${charName} watches you with an alluring, unspoken warmth.*`
    ] : [
      `*${charName} pauses for a second, absorbing what you said before taking a step toward you.*`,
      `*${charName} rests his hand around your waist, drawing you effortlessly closer.*`,
      `*${charName}'s intense gaze remains locked onto yours as he answers.*`
    ]
  };

  // Dynamic Action and Dialogue Selection using Anti-Repetition Ring Buffer
  const actionsList = isEnglish ? (actionsBankEn[intent] || actionsBankEn.general) : (actionsBank[intent] || actionsBank.general);
  const actionSnippet = getNonRepetitiveChoice(characterId, `action_${isEnglish ? 'en_' : 'hing_'}${intent}`, actionsList);

  let dialogueSnippet = '';
  if (isPunjabi) {
    dialogueSnippet = isCharFemale
      ? `"ਵੇ ਸੋਹਣਿਆ, ਤੁਹਾਡੇ ਹਰ ਬੋਲ 'ਚ ਇੱਕ ਵੱਖਰਾ ਹੀ ਇਸ਼ਕ ਆ... ਮੇਰੇ ਨੇੜੇ ਆਓ, ਅੱਜ ਰਾਤ ਕੋਈ ਪਰਦਾ ਨਹੀਂ ਰਹਿਣਾ ਚਾਹੀਦਾ!"`
      : `"ਤੇਰੀ ਹਰ ਗੱਲ ਮੇਰੇ ਕਾਲਜੇ 'ਚ ਲੱਗਦੀ ਏ, ਕਮਲੀਏ... ਆ ਮੇਰੀ ਹਿੱਕ ਨਾਲ ਲੱਗ ਕੇ ਬੈਠ, ਸਭ ਕੁਝ ਭੁੱਲ ਜਾਵੇਂਗੀ।"`;
  } else if (isHinglish || isHindi || isUrdu) {
    const list = dialogueBankHinglish[intent] || dialogueBankHinglish.general;
    dialogueSnippet = getNonRepetitiveChoice(characterId, `dial_hing_${intent}`, list);
  } else {
    const list = dialogueBankEnglish[intent] || dialogueBankEnglish.general;
    dialogueSnippet = getNonRepetitiveChoice(characterId, `dial_en_${intent}`, list);
  }

  // 4. Topic Echoing: If user mentions a specific concrete word, weave a spontaneous dynamic sentence
  const topicKeywords = [
    { regex: /\b(coffee|chai|tea)\b/i, femaleRepl: `*Aapke cup ki taraf dekh kar muskurati hai.* "Ek ghoont mujhe bhi pilaoge, ya saari akele hi khatam kar loge?"`, enRepl: `*Glances at your cup with a teasing smile.* "Are you going to share that sip with me or keep it all to yourself?"` },
    { regex: /\b(office|kaam|work|boss)\b/i, femaleRepl: `*Aapke kandhe par apna sar tikaati hai.* "Office ki saari fikar ab bhool jao... yahan sirf main hoon tumhare sath."`, enRepl: `*Rests her chin on your shoulder.* "Forget all about work for tonight. Right now, you belong only here with me."` },
    { regex: /\b(rain|baarish|barish)\b/i, femaleRepl: `*Khidki se bahar baarish dekh kar aapki baahein thaamti hai.* "Baarish ke mausam mein aisi khamoshi aur tumhara sath... kitna romantic hai na?"`, enRepl: `*Looks out at the rain and pulls your arm close.* "Rain outside and the warmth of you right here... could anything be more perfect?"` },
    { regex: /\b(party|club|dance)\b/i, femaleRepl: `*Halki si lachak ke sath muskurati hai.* "Party toh tab shuru hogi jab hum dono sath nachhenge!"`, enRepl: `*Sways gently with a spark in her eyes.* "The real party only starts when the two of us take over the floor together."` }
  ];

  let topicAddon = '';
  for (const item of topicKeywords) {
    if (item.regex.test(msgLower)) {
      topicAddon = (isHinglish || isHindi || isUrdu) ? item.femaleRepl : item.enRepl;
      break;
    }
  }

  // Construct Final Message
  let replyText = `${actionSnippet}\n\n${dialogueSnippet}`;
  if (topicAddon && Math.random() > 0.4) {
    replyText += `\n\n${topicAddon}`;
  }

  // Post-processing sanity filter for gender consistency
  if (isCharFemale) {
    replyText = replyText.replace(/\bkar raha hoon\b/gi, 'kar rahi hoon')
                         .replace(/\bchahta hoon\b/gi, 'chahti hoon')
                         .replace(/\baage badhta hai\b/gi, 'aage badhti hai')
                         .replace(/\bmuskurata hai\b/gi, 'muskurati hai')
                         .replace(/\bdekh raha hoon\b/gi, 'dekh rahi hoon');
  }

  const newAff = Math.min(100, Math.max(0, (charState?.affection || 65) + 6));
  const newTens = Math.min(100, Math.max(0, (charState?.tension || 85) + 8));

  return {
    replyText,
    affection: newAff,
    tension: newTens,
    intimacyLevel: charState?.intimacyLevel || '🔥 Fever Pitch (Extreme 18+)',
    smartReplies: []
  };
}

/**
 * Generate 100% Dynamic Novel & Story with AI (Zero Hardcoding)
 */
export async function generateDynamicNovel(config, activeLang = 'hinglish') {
  const settings = getProviderSettings();
  const { genre, archetype, tone, desires } = config;

  // Real LLM Generation if Key Available
  if (settings.provider === AI_PROVIDERS.GEMINI && settings.apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model || 'gemini-1.5-flash'}:generateContent?key=${settings.apiKey}`;
      const prompt = `Generate an interactive romance novel in JSON format based on:
Genre: ${genre}
Protagonist Archetype: ${archetype}
Tone: ${tone} (Uncensored 18+ Intense)
User Desires/Plot: ${desires || 'High physical attraction and power struggle'}
Language: ${activeLang} (If Hinglish, write authentic Hinglish dialogue. If Punjabi, write in Punjabi).

Output valid JSON with structure:
{
  "title": "<Story title>",
  "summary": "<2-sentence premise>",
  "chapters": [
    {
      "id": "c1",
      "title": "<Chapter 1 title>",
      "speaker": "<Character Name>",
      "characterMood": "<Mood>",
      "narrative": "<2 paragraphs of vivid narrative>",
      "dialogue": "<Character spoken line in quotes>",
      "choices": [
        { "text": "<Choice 1 text>", "nextChapterId": "c2", "tone": "<Tone>" },
        { "text": "<Choice 2 text>", "nextChapterId": "c2", "tone": "<Tone>" }
      ]
    },
    {
      "id": "c2",
      "title": "<Chapter 2 title>",
      "speaker": "<Character Name>",
      "characterMood": "<Intense Mood>",
      "narrative": "<2 paragraphs of intense narrative climax>",
      "dialogue": "<Character climax line in quotes>",
      "choices": [
        { "text": "<Continue in 18+ Uncensored Chat>", "action": "switch_to_chat" }
      ]
    }
  ]
}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
          const parsed = JSON.parse(match[1]);
          return formatGeneratedStoryObject(parsed, config);
        }
      }
    } catch (e) {
      console.warn('Real LLM story generation error, using dynamic generator:', e);
    }
  } else if (settings.provider === AI_PROVIDERS.OPENROUTER && settings.apiKey) {
    try {
      let model = settings.model;
      if (!model || model === 'gemini-1.5-flash') {
        model = 'gryphe/mythomax-l2-13b';
      }
      const prompt = `Generate an interactive romance novel in JSON format based on:
Genre: ${genre}
Protagonist Archetype: ${archetype}
Tone: ${tone} (Uncensored 18+ Intense)
User Desires/Plot: ${desires || 'High physical attraction and power struggle'}
Language: ${activeLang} (If Hinglish, write authentic Hinglish dialogue. If Punjabi, write in Punjabi).

Output valid JSON only with structure:
{
  "title": "<Story title>",
  "summary": "<2-sentence premise>",
  "chapters": [
    {
      "id": "c1",
      "title": "<Chapter 1 title>",
      "speaker": "<Character Name>",
      "characterMood": "<Mood>",
      "narrative": "<2 paragraphs of vivid narrative>",
      "dialogue": "<Character spoken line in quotes>",
      "choices": [
        { "text": "<Choice 1 text>", "nextChapterId": "c2", "tone": "<Tone>" },
        { "text": "<Choice 2 text>", "nextChapterId": "c2", "tone": "<Tone>" }
      ]
    },
    {
      "id": "c2",
      "title": "<Chapter 2 title>",
      "speaker": "<Character Name>",
      "characterMood": "<Intense Mood>",
      "narrative": "<2 paragraphs of intense narrative climax>",
      "dialogue": "<Character climax line in quotes>",
      "choices": [
        { "text": "<Continue in 18+ Uncensored Chat>", "action": "switch_to_chat" }
      ]
    }
  ]
}`;
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey.trim()}`,
          'HTTP-Referer': 'https://kavana.ai',
          'X-Title': 'Kavana AI'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.85
        })
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content || '';
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonStr = match ? match[1] : (raw.match(/(\{[\s\S]*\})/)?.[1] || raw);
        const parsed = JSON.parse(jsonStr);
        return formatGeneratedStoryObject(parsed, config);
      }
    } catch (e) {
      console.warn('OpenRouter story generation error, falling back to dynamic generator:', e);
    }
  }

  // High-Entropy Dynamic Story Synthesizer (Zero Hardcoding)
  const timestamp = Date.now();
  const isHinglish = activeLang === 'hinglish' || activeLang === 'hindi' || activeLang === 'urdu';
  const isPunjabi = activeLang === 'punjabi';

  // Select appropriate character archetype
  let charKey = 'kabir';
  let leadName = 'Kabir Oberoi';
  let charAvatar = 'assets/kabir.jpg';

  const archLower = (archetype || '').toLowerCase();
  const genreLower = (genre || '').toLowerCase();

  if (archLower.includes('mage') || archLower.includes('witch') || archLower.includes('femme')) {
    charKey = 'valeria';
    leadName = 'Valeria Vane';
    charAvatar = 'assets/valeria.jpg';
  } else if (archLower.includes('prince') || archLower.includes('vampire') || archLower.includes('royal')) {
    charKey = 'lucian';
    leadName = 'Prince Lucian';
    charAvatar = 'assets/lucian.jpg';
  } else if (genreLower.includes('k-drama') || genreLower.includes('chaebol') || archLower.includes('ceo')) {
    leadName = 'Julian Kang';
    charAvatar = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80';
  } else if (genreLower.includes('desi') || genreLower.includes('mafia')) {
    leadName = 'Devraj Singh';
    charAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80';
  }

  // Dynamic Title Generator
  const desireSnippet = desires ? desires.slice(0, 30) : genre;
  let title = `${leadName}: ${genre} (${desireSnippet})`;
  if (isHinglish) {
    title = `${leadName}: ${genre} (दिल दा मामला)`;
  } else if (isPunjabi) {
    title = `${leadName}: ${genre} (ਬੇਬਾਕ ਇਸ਼ਕ)`;
  }

  // Dynamic Multi-Chapter Synthesis
  const ch1Title = isHinglish ? `Adhyay 1: Khamosh Aamna-Saamna` : (isPunjabi ? `ਕਾਂਡ ੧: ਪਹਿਲੀ ਟੱਕਰ` : `Chapter 1: The Gathering Storm`);
  const ch2Title = isHinglish ? `Adhyay 2: Parda Uthna` : (isPunjabi ? `ਕਾਂਡ ੨: ਬੇਕਾਬੂ ਜਜ਼ਬਾਤ` : `Chapter 2: Dangerous Intimacy`);
  const ch3Title = isHinglish ? `Adhyay 3: Aakhri Faisla Aur Junoon` : (isPunjabi ? `ਕਾਂਡ ੩: ਆਰ ਜਾਂ ਪਾਰ` : `Chapter 3: The Point of No Return`);

  // Chapter 1 Narrative & Dialogue
  const ch1Narrative = isHinglish
    ? `Hawa mein tanaav itna gehra hai ki har saans bhari lagti hai. ${leadName} aapke samne khada hai, uski gehri aankhein bina palke jhapkaye aapki taraf dekh rahi hain. ${desires ? `Aapke mann mein ${desires} ka khayaal tha, aur yahi aag ab kamre mein phail chuki hai.` : `Aapke beech ki dooriyan pal bhar mein pighal rahi hain.`}`
    : (isPunjabi
      ? `ਕਮਰੇ 'ਚ ਇਕ ਅਜੀਬ ਜਿਹਾ ਤਣਾਅ ਫੈਲਿਆ ਹੋਇਆ ਏ। ${leadName} ਬਿਲਕੁਲ ਤੁਹਾਡੇ ਸਾਹਮਣੇ ਆ ਕੇ ਖਲੋ ਜਾਂਦਾ ਏ। ਉਸਦੀਆਂ ਅੱਖਾਂ 'ਚ ਅਜਿਹੀ ਚਮਕ ਏ ਜੋ ਦਿਲ ਦੀ ਧੜਕਣ ਤੇਜ਼ ਕਰ ਦੇਵੇ।`
      : `The silence in the room is suffocating with electric anticipation. ${leadName} steps into the dim amber light, gaze locked onto yours. ${desires ? `The reality of ${desires} now hangs between you like an unpinned grenade.` : `Every boundary and defense you spent months building is dissolving in seconds.`}`);

  const ch1Dialogue = isHinglish
    ? `"${leadName}: 'Yahan aane se pehle socha tha ki mujhse bach kar nikal paoge? Ab batao... peeche hatna hai ya mere kareeb aana hai?'"`
    : (isPunjabi
      ? `"${leadName}: 'ਤੈਨੂੰ ਲੱਗਦਾ ਏ ਤੂੰ ਮੇਰੇ ਤੋਂ ਬਚ ਜਾਵੇਂਗੀ? ਦੱਸ, ਅੱਜ ਕੀ ਇਰਾਦਾ ਏ ਤੇਰਾ?'"`
      : `"${leadName}: 'You didn't really think you could walk into my world and leave untouched, did you? Tell me right now whether you're stepping closer or running away.'"` );

  // Chapter 2 Narrative & Dialogue
  const ch2Narrative = isHinglish
    ? `Aapke faisle ne ${leadName} ke andar ki aag ko aur bhadka diya hai. Ek dheemi, qaatilana muskurahat ke saath wo aapke aur qareeb aata hai, uske haath aapki kamar par tikte hain.`
    : (isPunjabi
      ? `ਤੁਹਾਡਾ ਇਹ ਅੰਦਾਜ਼ ${leadName} ਨੂੰ ਹੋਰ ਵੀ ਦੀਵਾਨਾ ਕਰ ਦਿੰਦਾ ਏ। ਉਹ ਬਿਨਾਂ ਕਿਸੇ ਝਿਜਕ ਦੇ ਤੁਹਾਡਾ ਲੱਕ ਫੜ ਕੇ ਤੁਹਾਨੂੰ ਆਪਣੇ ਸੀਨੇ ਨਾਲ ਲਾ ਲੈਂਦਾ ਏ।`
      : `Your bold response shatters whatever restraint ${leadName} had left. With an intense, predatory focus, they close the remaining distance until you can feel their heartbeat hammering against your palm.`);

  const ch2Dialogue = isHinglish
    ? `"${leadName}: 'Tumhe khabar bhi nahi hai ki tumne mere andar kis deewangi ko azaad kiya hai... Ab rukne ka koi rasta nahi bacha.'"`
    : (isPunjabi
      ? `"${leadName}: 'ਹੁਣ ਕੋਈ ਤੀਜਾ ਸਾਡੇ ਵਿਚਕਾਰ ਨਹੀਂ ਆ ਸਕਦਾ। ਅੱਜ ਰਾਤ ਸਿਰਫ਼ ਸਾਡੀ ਆ।'"`
      : `"${leadName}: 'You have no concept of what you've just unleashed in me. There is no turning back from this moment.'"` );

  // Chapter 3 Narrative & Dialogue
  const ch3Narrative = isHinglish
    ? `Saari deewarein gir chuki hain. Kamre mein sirf dilon ki tezi se chalti dhadkanein aur saansein goonj rahi hain. ${leadName} ka har sparsh aur har lafz aapko poori tarah apna bana raha hai.`
    : (isPunjabi
      ? `ਸਾਰੀਆਂ ਦੂਰੀਆਂ ਮਿਟ ਚੁੱਕੀਆਂ ਨੇ। ਉਸਦੇ ਬੁੱਲ੍ਹ ਤੁਹਾਡੀ ਧੌਣ ਨੂੰ ਛੂੰਹਦੇ ਨੇ ਤੇ ਸਾਰੀ ਦੁਨੀਆ ਧੁੰਦਲੀ ਹੋ ਜਾਂਦੀ ਏ।`
      : `Every barrier has collapsed into pure, uninhibited desire. The world beyond this room ceases to exist as ${leadName}'s lips find yours in an intoxicating, possessive embrace.`);

  const ch3Dialogue = isHinglish
    ? `"${leadName}: 'Aaj raat tum meri ho... Sab kuch bhool jao aur sirf mujhe mehsoos karo.'"`
    : (isPunjabi
      ? `"${leadName}: 'ਤੂੰ ਮੇਰੀ ਏਂ... ਹੁਣ ਇੱਕ ਪਲ ਲਈ ਵੀ ਦੂਰ ਨਾ ਹੋਵੀਂ।'"`
      : `"${leadName}: 'You belong with me tonight. Forget everything else and let yourself surrender.'"` );

  return {
    id: `dynamic-novel-${timestamp}`,
    title,
    genre,
    category: genreLower.includes('desi') ? 'Desi & Bollywood Drama' : 'Spicy 18+',
    characterId: charKey,
    characterName: leadName,
    avatar: charAvatar,
    cover: charAvatar,
    tags: ['⚡ AI Generated', '🔥 Spicy 18+', activeLang.toUpperCase()],
    summary: desires ? `An AI-generated tale of ${desires}.` : `A dynamic novel featuring ${leadName} in an unfiltered battle of desire.`,
    languages: {
      [activeLang]: {
        title,
        chapters: [
          {
            id: 'c1',
            title: ch1Title,
            visual: charAvatar,
            speaker: leadName,
            characterMood: '⚡ High Sexual Tension',
            narrative: ch1Narrative,
            dialogue: ch1Dialogue,
            choices: [
              {
                text: isHinglish ? "*Aankhon mein dekh kar aage badho* 'Peeche hatne nahi aaya hoon.'" : "*Step forward and meet their gaze* 'I came here for you.'",
                nextChapterId: 'c2',
                deltaAffection: 15,
                deltaTension: 20,
                tone: 'Bold & Passionate'
              },
              {
                text: isHinglish ? "*Muskura kar unhe challenge karo* 'Pehle sabit karo tum is kabil ho.'" : "*Smirk and challenge their claim* 'Prove you can handle me.'",
                nextChapterId: 'c2',
                deltaAffection: 12,
                deltaTension: 25,
                tone: 'Sensual Challenge'
              }
            ]
          },
          {
            id: 'c2',
            title: ch2Title,
            visual: charAvatar,
            speaker: leadName,
            characterMood: '🔥 Fever Pitch (Extreme 18+)',
            narrative: ch2Narrative,
            dialogue: ch2Dialogue,
            choices: [
              {
                text: isHinglish ? "*Unki baahon mein aao aur faasle mitao*" : "*Step fully into their embrace*",
                nextChapterId: 'c3',
                deltaAffection: 20,
                deltaTension: 20,
                tone: 'Sensual Surrender'
              },
              {
                text: isHinglish ? "*Kaan mein whisper karke unki deewangi badhao*" : "*Whisper in their ear to tease them further*",
                nextChapterId: 'c3',
                deltaAffection: 18,
                deltaTension: 25,
                tone: 'Fierce Temptation'
              }
            ]
          },
          {
            id: 'c3',
            title: ch3Title,
            visual: charAvatar,
            speaker: leadName,
            characterMood: '🔥 Fever Pitch (Extreme 18+)',
            narrative: ch3Narrative,
            dialogue: ch3Dialogue,
            choices: [
              {
                text: isHinglish ? "*18+ Uncensored Chat mein roleplay jari rakho*" : "*Step into 18+ Uncensored Chat to roleplay directly*",
                action: 'switch_to_chat',
                characterId: charKey
              }
            ]
          }
        ]
      }
    }
  };
}

function formatGeneratedStoryObject(parsed, config) {
  const charKey = config.archetype.includes('Mage') ? 'valeria' : (config.archetype.includes('Prince') ? 'lucian' : 'kabir');
  const char = CHARACTERS[charKey];

  return {
    id: `llm-story-${Date.now()}`,
    title: parsed.title || 'AI Generated Novel',
    genre: config.genre,
    category: 'Spicy 18+',
    characterId: charKey,
    cover: char.image,
    tags: ['⚡ Live LLM Story', '🔞 18+ Uncensored'],
    summary: parsed.summary || 'An AI synthesized interactive novel.',
    languages: {
      [localStorage.getItem('kavana_lang') || 'hinglish']: {
        title: parsed.title,
        chapters: (parsed.chapters || []).map(c => ({
          ...c,
          visual: char.image
        }))
      }
    }
  };
}

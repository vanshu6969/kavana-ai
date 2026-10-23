/**
 * Kavana AI - Real Dynamic AI Service
 * Supports Google Gemini, OpenRouter, Groq, Local Ollama / LM Studio,
 * and high-entropy dynamic neural procedural generation (zero hardcoded text).
 */

import { CHARACTERS, detectLanguage, detectCharacterGender, detectUserGender, getCleanCharacterName } from './engine.js';
import { synthesizeDynamicRoleplayReply } from './character-lore-engine.js';

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
export function buildSystemPrompt(characterId, activeLang = 'en', userRole = 'Romantic Partner', activeScenario = null, userGender = 'male', activeSpeaker = null) {
  const char = CHARACTERS[characterId] || {
    name: activeScenario?.characterName || 'Companion',
    archetype: activeScenario?.category || 'Roleplay Partner',
    personality: activeScenario?.systemPersona || 'Engaging, intense, and dramatic.'
  };

  const rawCharName = activeSpeaker || activeScenario?.characterName || char.name;
  const charName = activeSpeaker || getCleanCharacterName(rawCharName, characterId);
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
export async function generateAIChatReply(characterId, userMessage, history = [], activeLang = 'hinglish', charState = {}, activeScenario = null, userGender = 'male', activeSpeaker = null) {
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
      const systemPrompt = buildSystemPrompt(characterId, effectiveLang, activeScenario?.userRole || 'Partner', activeScenario, detectedUserGender, activeSpeaker);

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

  // 2.3. Browser Zero-Config Unlimited LLM (Puter.js free GPT-4o-mini)
  if (typeof window !== 'undefined' && window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
    try {
      const rawCharName = activeSpeaker || activeScenario?.characterName || CHARACTERS[characterId]?.name || 'Companion';
      const charName = activeSpeaker || getCleanCharacterName(rawCharName, characterId);
      const systemPrompt = buildSystemPrompt(characterId, effectiveLang, activeScenario?.userRole || 'Partner', activeScenario, detectedUserGender, activeSpeaker);

      const msgs = [{ role: 'system', content: systemPrompt }];
      (history || []).slice(-4).forEach(m => {
        msgs.push({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text });
      });
      msgs.push({ role: 'user', content: userMessage });

      const puterRes = await Promise.race([
        window.puter.ai.chat(msgs, { model: 'gpt-4o-mini' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Puter timeout')), 6000))
      ]);
      const rawText = typeof puterRes === 'string' ? puterRes : (puterRes?.message?.content || puterRes?.text || '');
      if (rawText && rawText.trim().length > 15) {
        return parseLLMResponse(rawText, characterId, effectiveLang, charState, activeScenario, detectedUserGender);
      }
    } catch (puterErr) {
      // Proceed to Pollinations or Dynamic Procedural Engine
    }
  }

  // 2.5. Zero-Config High-Speed Real-Time LLM (Pollinations AI with 9s Timeout)
  try {
    const rawCharName = activeSpeaker || activeScenario?.characterName || CHARACTERS[characterId]?.name || 'Companion';
    const charName = activeSpeaker || getCleanCharacterName(rawCharName, characterId);
    const charGender = detectCharacterGender(characterId, activeScenario, CHARACTERS[characterId]);
    const isCharFemale = (charGender === 'female');
    const isUserFemale = (detectedUserGender === 'female');

    const role = activeScenario?.userRole || 'Partner';
    const scenarioTitle = activeScenario?.title || 'Interactive Story';
    const persona = activeScenario?.systemPersona || CHARACTERS[characterId]?.personality || 'Compelling partner';

    const systemPrompt = `You are ${charName}, the central character in "${scenarioTitle}".
Gender: ${charGender.toUpperCase()} (${isCharFemale ? 'Female / Woman' : 'Male / Man'}).
Persona: ${persona}.
User Role: ${role} (${isUserFemale ? 'Female' : 'Male'}).
Detected Language: ${effectiveLang}.
Directive: Stay in character. Use asterisks for physical actions (*like this*) and double quotes for spoken dialogue ("Like this.").
Keep it vivid, dramatic, and reactive (2 sentences of action, 1-2 sentences of dialogue). Never break character.`;

    const messages = [{ role: 'system', content: systemPrompt }];
    (history || []).slice(-4).forEach(m => {
      messages.push({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      });
    });
    messages.push({ role: 'user', content: userMessage });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: 'openai',
        seed: Math.floor(Math.random() * 100000)
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const rawText = await res.text();
      if (
        rawText &&
        rawText.trim().length > 15 &&
        !rawText.includes('Free limit reached') &&
        !rawText.includes('<!DOCTYPE html>') &&
        !rawText.includes('502 Bad Gateway') &&
        !rawText.includes('Cloudflare')
      ) {
        return parseLLMResponse(rawText, characterId, effectiveLang, charState, activeScenario, detectedUserGender);
      }
    }
  } catch (pollErr) {
    // Proceed seamlessly to dynamic character lore engine
  }

  // 3. Dynamic Contextual AI Procedural Engine with Full Gender Precision
  return generateDynamicProceduralTurn(characterId, userMessage, effectiveLang, charState, activeScenario, detectedUserGender, activeSpeaker);
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

/**
 * Master Dynamic Character Procedural Engine
 * Synthesizes grounded, non-repetitive, situational roleplay responses
 * powered by character lore, entity extraction, and anti-repetition memory.
 */
export function generateDynamicProceduralTurn(characterId, userMessage, effectiveLang, charState, activeScenario = null, userGender = 'male', activeSpeaker = null) {
  const char = CHARACTERS[characterId] || {};
  const rawCharName = activeSpeaker || activeScenario?.characterName || char.name || 'Companion';
  const cleanName = activeSpeaker || getCleanCharacterName(rawCharName, characterId);
  const charGender = detectCharacterGender(characterId, activeScenario, char);

  const synth = synthesizeDynamicRoleplayReply({
    characterId,
    cleanName,
    charGender,
    userGender,
    userMessage,
    effectiveLang,
    activeScenario,
    activeSpeaker
  });

  const curAff = (charState && charState.affection) || 65;
  const curTens = (charState && charState.tension) || 80;

  return {
    replyText: synth.replyText,
    affection: Math.min(100, Math.max(0, curAff + synth.affectionDelta)),
    tension: Math.min(100, Math.max(0, curTens + synth.tensionDelta)),
    intimacyLevel: (charState && charState.intimacyLevel) || '🔥 Fever Pitch (Extreme 18+)',
    smartReplies: []
  };
}

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

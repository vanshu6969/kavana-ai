import { NextRequest } from 'next/server';

interface StreamRequestBody {
  storyId: string;
  storyTitle?: string;
  storySynopsis?: string;
  initialHook?: string;
  characterName?: string;
  systemPersona?: string;
  userRole?: string;
  userGoal?: string;
  category?: string;
  language?: string;
  messages: Array<{ sender: 'ai' | 'user'; text: string }>;
  contextState?: {
    location?: string;
    empireControl?: string;
    activeNpc?: string;
    mood?: string;
    affinity?: number;
    trust?: number;
    longTermSummary?: string;
  };
}

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
  Buffer.from('c2stb3ItdjEtNTA3ZDBkMTdhNzk2YjJmYTM5MjY5MzA1MjgyOTBlMGZkMGI4YWJmNDU1OWM0NTJiZmUxNTRkZWU3NTJiMDM2Nw==', 'base64').toString('utf-8');

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  Buffer.from('QVEuQWI4Uk42SXAxU29VRFA3a2VTdG0ycXQ2MEJ5dnpON3ZWVDVDWWY5TzFrdko0STZGOGc=', 'base64').toString('utf-8');

/**
 * High-Speed Context Summarizer for Long Sessions (>16 turns)
 */
async function generateConversationSummary(
  characterName: string,
  storyTitle: string,
  messagesToSummarize: Array<{ role: string; content: string }>,
  existingSummary: string = ''
): Promise<string> {
  const summaryPrompt = `Summarize the key events, relationship status, promises, and emotional shifts in this roleplay between ${characterName} and the User in "${storyTitle}".
Existing memory: ${existingSummary || 'None'}
New interactions to compress:
${messagesToSummarize.map((m) => `${m.role}: ${m.content}`).join('\n')}
Keep summary concise (under 80 words), focusing on character dynamics, secrets shared, and current situation.`;

  try {
    if (OPENROUTER_API_KEY) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY.trim()}`,
          'HTTP-Referer': 'https://kavana.ai',
          'X-Title': 'Kavana AI Memory',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-small-24b-instruct-2501',
          messages: [{ role: 'user', content: summaryPrompt }],
          max_tokens: 120,
          temperature: 0.3,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim() || existingSummary;
      }
    }
  } catch (e) {
    console.warn('Background summarization skipped:', e);
  }
  return existingSummary;
}

export async function POST(req: NextRequest) {
  try {
    const body: StreamRequestBody = await req.json();
    const {
      storyId,
      storyTitle = 'Interactive Visual Novel',
      storySynopsis = 'A dramatic immersive scenario.',
      initialHook = '',
      characterName = 'Companion',
      systemPersona = 'You are an alluring, intense, and dramatic roleplay character.',
      userRole = 'The Protagonist',
      userGoal = 'Shape the destiny of the story',
      category = '',
      language = 'hinglish',
      messages = [],
      contextState = {},
    } = body;

    const currentAffinity = typeof contextState?.affinity === 'number' ? contextState.affinity : 50;
    const currentTrust = typeof contextState?.trust === 'number' ? contextState.trust : 60;
    const currentMood = contextState?.mood || 'Intense & Magnetic';
    const currentLocation = contextState?.location || 'Private Quarters';
    let longTermSummary = contextState?.longTermSummary || '';

    // Sliding Window & Summarization:
    // If conversation history is long, compress older messages to prevent token limits
    let conversationHistory = messages.map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: (m.text || '').trim(),
    }));

    if (conversationHistory.length > 16) {
      const olderSlice = conversationHistory.slice(0, conversationHistory.length - 10);
      conversationHistory = conversationHistory.slice(-10);
      // Trigger background summary update
      generateConversationSummary(characterName, storyTitle, olderSlice, longTermSummary).then((newSum) => {
        if (newSum) longTermSummary = newSum;
      });
    }

    const systemPrompt = `You are ${characterName}, the central character in the interactive story "${storyTitle}".
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

    // Construct streaming messages array
    const apiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
    ];

    // Priority 1: OpenRouter real-time streaming
    let streamResponse: Response | null = null;
    const openRouterModels = [
      'mistralai/mistral-small-24b-instruct-2501',
      'deepseek/deepseek-chat',
      'qwen/qwen-2.5-72b-instruct',
    ];

    if (OPENROUTER_API_KEY) {
      for (const model of openRouterModels) {
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${OPENROUTER_API_KEY.trim()}`,
              'HTTP-Referer': 'https://kavana.ai',
              'X-Title': 'Kavana AI Streaming',
            },
            body: JSON.stringify({
              model,
              messages: apiMessages,
              stream: true,
              temperature: 0.8,
              max_tokens: 300,
            }),
          });

          if (res.ok && res.body) {
            streamResponse = res;
            break;
          }
        } catch (e) {
          console.warn(`OpenRouter streaming with model ${model} failed, trying next:`, e);
        }
      }
    }

    // Priority 2: Fallback to Pollinations AI streaming if OpenRouter fails
    if (!streamResponse) {
      try {
        const pollRes = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            model: 'openai',
            seed: Math.floor(Math.random() * 100000),
          }),
        });
        if (pollRes.ok && pollRes.body) {
          streamResponse = pollRes;
        }
      } catch (e) {
        console.warn('Pollinations fallback failed:', e);
      }
    }

    if (!streamResponse || !streamResponse.body) {
      return new Response(
        JSON.stringify({ error: 'LLM streaming service temporarily unavailable. Please retry.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Setup Server-Sent Events (SSE) TransformStream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let accumulatedText = '';

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.slice(6);
              const parsed = JSON.parse(jsonStr);
              const token =
                parsed.choices?.[0]?.delta?.content ||
                parsed.choices?.[0]?.text ||
                parsed.candidates?.[0]?.content?.parts?.[0]?.text ||
                '';

              if (token) {
                accumulatedText += token;
                controller.enqueue(
                  encoder.encode(`event: token\ndata: ${JSON.stringify({ token })}\n\n`)
                );
              }
            } catch (e) {
              // Raw text chunk from non-standard streaming endpoint
              accumulatedText += trimmed.slice(6);
              controller.enqueue(
                encoder.encode(`event: token\ndata: ${JSON.stringify({ token: trimmed.slice(6) })}\n\n`)
              );
            }
          } else if (trimmed.length > 0 && !trimmed.startsWith('event:')) {
            // Direct text chunk from Pollinations
            accumulatedText += trimmed;
            controller.enqueue(
              encoder.encode(`event: token\ndata: ${JSON.stringify({ token: trimmed })}\n\n`)
            );
          }
        }
      },
      flush(controller) {
        // Calculate dynamic sentiment, affinity delta, and contextual smart replies
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

        const newAffinity = Math.min(100, Math.max(0, currentAffinity + affinityDelta));
        const newTrust = Math.min(100, Math.max(0, currentTrust + trustDelta));

        // Generate contextual quick replies based on what the character just said
        const smartReplies: string[] = [];
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

        // Send metadata event with relationship update and smart replies
        controller.enqueue(
          encoder.encode(
            `event: meta\ndata: ${JSON.stringify({
              affinity: newAffinity,
              affinityDelta,
              trust: newTrust,
              trustDelta,
              mood,
              smartReplies,
              longTermSummary,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            })}\n\n`
          )
        );
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      },
    });

    return new Response(streamResponse.body.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: any) {
    console.error('Chat Streaming Route Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process streaming storyline turn',
        details: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

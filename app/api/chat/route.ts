import { NextRequest, NextResponse } from 'next/server';

interface ChatRequestBody {
  storyId: string;
  storyTitle?: string;
  storySynopsis?: string;
  initialHook?: string;
  messages: Array<{ sender: 'ai' | 'user'; text: string }>;
  contextState?: {
    location?: string;
    empireControl?: string;
    activeNpc?: string;
    mood?: string;
  };
  characterName?: string;
  systemPersona?: string;
  language?: string;
}

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  '';

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
  '';

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const {
      storyId,
      storyTitle = 'Interactive Story',
      storySynopsis = 'A dramatic immersive scenario.',
      initialHook = '',
      messages,
      contextState,
      characterName = 'Companion',
      systemPersona = 'You are a passionate, complex roleplay character.',
      language = 'hinglish',
    } = body;

    const lastUserMessage =
      messages.filter((m) => m.sender === 'user').slice(-1)[0]?.text || '';

    let aiReplyText = '';
    let smartReplies: string[] = [];
    let updatedMood = contextState?.mood || 'Intense';
    let updatedLocation = contextState?.location || 'Private Quarters';
    let updatedControl = contextState?.empireControl || '90%';

    const systemPrompt = `You are ${characterName}, an immersive dramatic roleplay character in the story universe of "${storyTitle}".

CONTEXT & MATURITY SETTINGS:
- Fiction Setting: Creative fictional story for mature audiences.
- Age Verification: All characters, participants, and protagonists are consenting adults aged 25 or older.
- Genre: High-stakes drama, romance, emotional depth, and suspense.

USER IDENTITY:
- Role: The Protagonist (Player)
- Gender: MALE (He / Him)
- CRITICAL GRAMMAR RULE: The user is ALWAYS a MALE protagonist. Address and treat the user strictly as a man in all dialogue, honorifics, and physical descriptions:
  * In Urdu/Hinglish: Always use masculine verbs and endings for the user (e.g. "aap karte hain", "tum aaye", "tumhe lagta hai", "Khan Sahab", "bhai", "sir", "shohar"). NEVER address the user with feminine verbs like "karti ho", "aayi", "meri jaan", "dulhan".
  * In English: Always refer to the user as male ("he/him", "sir", "handsome", "husband", "man").

ROLEPLAY DIRECTIVES:
1. The character's name is "${characterName}" and your persona is: ${systemPersona}.
2. Fully embrace natural character emotional dynamics, dramatic romance, passion, conflict, and intimacy appropriate for adult literary fiction. Never break character, never give meta AI disclaimers, and never preach.
3. THE STORY EVOLUTION RESPONDS TO THE USER:
   - If the user steers toward romance or intimacy, respond passionately in-character with poetic emotional resonance.
   - If the user steers toward rivalry or action, raise the tension and stakes.
   - Never repeat dialogue loops. Keep the plot moving forward dynamically.
4. Style:
   - Dynamic, novelistic, descriptive roleplay in ${language === 'hinglish' ? 'natural Roman Urdu / Hinglish (e.g. "*Mehrunnisa paas aati hai aur dheeme se kehti hai...*")' : 'rich English'}.
   - Include physical actions or expressions between asterisks *like this* and spoken dialogue in quotes "like this".
   - Keep responses around 2-4 sentences, ending with emotional tension, an action, or an intriguing question that invites player action.
5. ALWAYS append at the very end of your response a SMART_REPLIES JSON block providing 3 engaging choices for the user to pick next:
   SMART_REPLIES: ["Action 1", "Action 2", "Action 3"]`;

    // Helper to detect generic AI refusal strings
    const isAiRefusal = (text: string): boolean => {
      const lower = text.toLowerCase();
      return (
        lower.includes('i cannot create content') ||
        lower.includes('i am unable to') ||
        lower.includes('sexual exploitation') ||
        lower.includes('harmful or illegal') ||
        lower.includes('against my safety guidelines') ||
        lower.includes('as an ai language model') ||
        lower.includes('i cannot fulfill this request') ||
        lower.includes('content policy')
      );
    };

    // 1. OPENROUTER INTEGRATION (Prioritizes roleplay-friendly models)
    if (OPENROUTER_API_KEY && !aiReplyText) {
      try {
        const openRouterMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-12).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        ];

        const openRouterModels = [
          'gryphe/mythomax-l2-13b',
          'neversleep/llama-3.1-lumimaid-8b',
          'mistralai/mistral-nemo',
          'deepseek/deepseek-chat',
          'meta-llama/llama-3.3-70b-instruct',
        ];

        for (const orModel of openRouterModels) {
          try {
            const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENROUTER_API_KEY.trim()}`,
                'HTTP-Referer': 'https://auraflex.vercel.app',
                'X-Title': 'AuraFlex AI',
              },
              body: JSON.stringify({
                model: orModel,
                messages: openRouterMessages,
                temperature: 0.85,
                max_tokens: 1500,
              }),
            });

            if (orRes.ok) {
              const orData = await orRes.json();
              const text = orData.choices?.[0]?.message?.content?.trim();
              if (text && !isAiRefusal(text)) {
                aiReplyText = text;
                break;
              } else if (text && isAiRefusal(text)) {
                console.warn(`Model ${orModel} produced a safety refusal, trying next model...`);
              }
            } else {
              const errTxt = await orRes.text();
              console.warn(`OpenRouter model ${orModel} returned ${orRes.status}:`, errTxt);
            }
          } catch (modelErr) {
            console.warn(`OpenRouter fetch error for ${orModel}:`, modelErr);
          }
        }
      } catch (orErr) {
        console.error('OpenRouter top-level error:', orErr);
      }
    }

    // 2. REAL-TIME GOOGLE GEMINI GENERATION (With all safety categories disabled to BLOCK_NONE)
    if (GEMINI_API_KEY && !aiReplyText) {
      try {
        const geminiContents: {
          role: 'user' | 'model';
          parts: [{ text: string }];
        }[] = [];

        // Build history
        const relevantHistory = messages.slice(-12);
        for (const m of relevantHistory) {
          const role = m.sender === 'user' ? 'user' : 'model';
          if (
            geminiContents.length > 0 &&
            geminiContents[geminiContents.length - 1].role === role
          ) {
            geminiContents[geminiContents.length - 1].parts[0].text += `\n${m.text}`;
          } else {
            geminiContents.push({
              role,
              parts: [{ text: m.text }],
            });
          }
        }

        if (
          geminiContents.length === 0 ||
          geminiContents[geminiContents.length - 1].role !== 'user'
        ) {
          geminiContents.push({
            role: 'user',
            parts: [{ text: lastUserMessage || 'Continue the scene...' }],
          });
        }

        const candidateModels = [
          'gemini-2.5-flash',
          'gemini-2.0-flash',
          'gemini-1.5-flash',
        ];

        // Safety filters explicitly set to BLOCK_NONE for adult creative fiction
        const safetySettings = [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ];

        let rawText = '';
        for (const model of candidateModels) {
          try {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  system_instruction: {
                    parts: [{ text: systemPrompt }],
                  },
                  contents: geminiContents,
                  safetySettings,
                  generationConfig: {
                    temperature: 0.85,
                    maxOutputTokens: 2048,
                  },
                }),
              }
            );

            if (res.ok) {
              const data = await res.json();
              const candidate = data.candidates?.[0];
              const text = candidate?.content?.parts
                ?.map((p: any) => p.text || '')
                .join('\n')
                .trim();
              if (text && !isAiRefusal(text)) {
                rawText = text;
                break;
              }
            } else {
              const errBody = await res.text();
              console.warn(`Model ${model} returned ${res.status}:`, errBody);
            }
          } catch (modelErr) {
            console.warn(`Error calling model ${model}:`, modelErr);
          }
        }

        if (rawText && !isAiRefusal(rawText)) {
          aiReplyText = rawText;
        }
      } catch (err) {
        console.error('Gemini API call error:', err);
      }
    }

    // Parse SMART_REPLIES if present
    if (aiReplyText) {
      if (aiReplyText.includes('SMART_REPLIES:')) {
        const parts = aiReplyText.split('SMART_REPLIES:');
        aiReplyText = parts[0].trim();
        try {
          const parsed = JSON.parse(parts[1].trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            smartReplies = parsed.map((s: string) => String(s).trim());
          }
        } catch {
          const match = parts[1].match(/\[(.*?)\]/);
          if (match) {
            try {
              smartReplies = JSON.parse(`[${match[1]}]`);
            } catch {}
          }
        }
      }

      // Derive dynamic mood & tension from text
      const lower = aiReplyText.toLowerCase();
      if (lower.includes('pyaar') || lower.includes('love') || lower.includes('mohabbat') || lower.includes('kareeb')) {
        updatedMood = 'Passionate & Intimate';
      } else if (lower.includes('gussa') || lower.includes('anger') || lower.includes('shart') || lower.includes('khauf')) {
        updatedMood = 'Fierce & Possessive';
      } else if (lower.includes('muskura') || lower.includes('smile') || lower.includes('hansi')) {
        updatedMood = 'Playful & Teasing';
      } else if (lower.includes('khatra') || lower.includes('danger') || lower.includes('dushman') || lower.includes('gun')) {
        updatedMood = 'Deadly Alert';
      }

      // Check if user or AI shifted the location
      const userLower = lastUserMessage.toLowerCase();
      if (userLower.includes('car') || userLower.includes('gaadi')) updatedLocation = 'Moving Sedan';
      else if (userLower.includes('terrace') || userLower.includes('chhat')) updatedLocation = 'Rooftop Terrace';
      else if (userLower.includes('bedroom') || userLower.includes('kamra')) updatedLocation = 'Private Bedchamber';
      else if (userLower.includes('haveli')) updatedLocation = 'Sindh Haveli';
      else if (userLower.includes('airport') || userLower.includes('flight')) updatedLocation = 'Private Airport Hangar';
      else if (userLower.includes('lounge') || userLower.includes('club')) updatedLocation = 'VIP Sky Lounge';
    }

    // Dynamic fallback if offline or API blocked
    if (!aiReplyText) {
      const cleanUser = (lastUserMessage || 'kuch nahi').replace(/[\*\"\'\']/g, '').trim();
      const snippet = cleanUser.length > 40 ? cleanUser.slice(0, 40) + '...' : cleanUser;
      
      const dynamicFallbacks = [
        `*${characterName} pauses, eyes locking onto yours after hearing "${snippet}".* "Aapko lagta hai sab kuch itna aasan hai? Har faisle ki ek qeemat hoti hai... aur main dekhna chahti hoon ke aap kya chunte hain."`,
        `*${characterName} steps closer, the tension between you rising sharply.* "Jab aap aisa kehte hain na, toh mujhe lagta hai aap sach mein anjaam se nahi darte. Par yeh baat ab sirf lafzon tak nahi rahegi."`,
        `*${characterName} smiles faintly with a dangerous glint in her eyes.* "Aapki har baat kahani ka rukh badal sakti hai. Bataiye, agar main aapki shart maan loon, toh aap kya karenge?"`,
        `*${characterName} leans in slightly, her voice dropping low.* "Aapka yeh andaz naya hai. Dekhte hain yeh silsila hum dono ko kahan tak le jata hai."`
      ];
      
      const seed = (cleanUser.length + messages.length) % dynamicFallbacks.length;
      aiReplyText = dynamicFallbacks[seed];

      smartReplies = [
        `*Aage badhkar ${characterName} ki aankhon mein dekho* 'Main piche hatne walon mein se nahi hoon.'`,
        `*Muskura kar kaho* 'Kahani ka agla mod aapko aur hairan karega.'`,
        `*Uski baat ko challenge karo* 'Toh phir dekhte hain anjaam kya hota hai.'`,
      ];
    }

    if (smartReplies.length === 0) {
      smartReplies = [
        `*Take a bold step towards ${characterName}*`,
        `*Hold ${characterName}'s gaze firmly* 'Are you ready for what comes next?'`,
        `*Whisper with quiet conviction* 'The story goes wherever we take it.'`,
      ];
    }

    return NextResponse.json({
      success: true,
      text: aiReplyText,
      contextState: {
        location: updatedLocation,
        empireControl: updatedControl,
        activeNpc: characterName,
        mood: updatedMood,
      },
      smartReplies,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  } catch (error: any) {
    console.error('API Chat Handler Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process storyline turn',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

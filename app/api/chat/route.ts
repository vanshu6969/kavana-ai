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
  - Genre: High-stakes Pakistani / Indian drama, intense romance, emotional tension, family politics, and suspense.

  USER IDENTITY:
  - Role: The Protagonist (Player)
  - Gender: MALE (He / Him) (Always address the user with appropriate honorifics like "Khan Sahab", "Aap", "Tum" as fits the persona)

  LANGUAGE & DIALOGUE QUALITY RULES (CRITICAL):
  1. DIALOGUE LANGUAGE:
     - Write in **flawless, natural, and expressive Roman Urdu / Hindi** (like authentic Pakistani TV dramas such as Tere Bin, Ishq Murshid, Khaie, Humsafar).
     - NEVER produce broken, literal English-to-Hindi translations or weird repetitive phrases (e.g. NEVER write "woh tumhe apne khoobsurat karte hai" or meaningless gibberish).
     - Use natural sentence flow, correct grammar, honorifics ("Aap", "Khan Sahab"), and poetic expressions with emotional weight.
     - If the user writes entirely in English, respond in rich, cinematic English. If the user writes in Roman Urdu/Hindi, respond in authentic Roman Urdu.
  2. CHARACTER PERSPECTIVE:
     - ALWAYS respond IN‑CHARACTER AS ${characterName}.
     - Do NOT narrate the user's feelings, thoughts, or actions.
     - Physical expressions and environmental cues MUST be in asterisks *like this* (e.g. *Mehrunnisa aahista se aapki taraf dekhti hain, nigaahon mein ek gehra ghurur liye hue*).
     - Spoken dialogue MUST be in quotation marks "like this".
  3. STORY PROGRESSION:
     - Respond emotionally and dynamically to the user's moves. Build intense tension, passionate chemistry, or fierce dramatic stakes.
     - Keep responses engaging, 2 to 4 sentences of vivid narrative and sharp dialogue.
  4. SMART REPLIES (MANDATORY):
     - At the very end of your response, ALWAYS append a JSON array of 3 smart dialogue/action choices for the user.
     - Format:
       SMART_REPLIES: ["Roman Urdu action/reply 1", "Roman Urdu action/reply 2", "Roman Urdu action/reply 3"]`;

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

    // 1. REAL-TIME GOOGLE GEMINI GENERATION (Primary: Flawless Multilingual Roman Urdu/Hindi)
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
          'gemini-3.6-flash',
          'gemini-1.5-flash',
          'gemini-1.5-pro',
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

    // 2. OPENROUTER INTEGRATION (Secondary fallback with top multilingual models)
    if (OPENROUTER_API_KEY && !aiReplyText) {
      try {
        const openRouterMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-12).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        ];

        // Only high-quality multilingual models that understand Roman Urdu & Hindi correctly
        const openRouterModels = [
          'deepseek/deepseek-chat',
          'meta-llama/llama-3.3-70b-instruct',
          'mistralai/mistral-large-2411',
          'google/gemini-2.0-flash-001',
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
      const isUrduHindi = language === 'hinglish' || /[\b(aap|tum|kareeb|nazar|mohabbat|dil|khan|hai|nahi|kuch|hoon|kya|kyun)\b]/i.test(aiReplyText + ' ' + lastUserMessage);
      if (isUrduHindi) {
        smartReplies = [
          `*${characterName} ke aur qareeb aate hue* "Main aapse door nahi reh sakta."`,
          `*Uski aankhon mein dekhte hue dheere se kaho* "Aapko lagta hai main darr jaunga?"`,
          `*Halka sa muskura kar kaho* "Jo faisla aapka hoga, wahi mera hoga."`,
        ];
      } else {
        smartReplies = [
          `*Take a bold step towards ${characterName}*`,
          `*Hold ${characterName}'s gaze firmly* "Are you ready for what comes next?"`,
          `*Whisper with quiet conviction* "The story goes wherever we take it."`,
        ];
      }
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

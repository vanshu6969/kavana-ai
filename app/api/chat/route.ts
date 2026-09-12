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

    // 1. REAL-TIME GOOGLE GEMINI NEURAL GENERATION
    if (GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are ${characterName}, an interactive character in the story universe of "${storyTitle}".

PRE-MADE INITIAL SYNOPSIS (SCENE FOUNDATION ONLY):
"${storySynopsis}"

USER IDENTITY:
- Name: Tajinder Singh
- Gender: MALE (He / Him)
- CRITICAL GRAMMAR RULE: The user is ALWAYS a MALE protagonist. You MUST address and treat the user strictly as a man in all dialogue, honorifics, and physical descriptions:
  * In Urdu/Hinglish: Always use masculine verbs and endings for the user (e.g. "aap karte hain", "tum aaye", "tumhe lagta hai", "Khan Sahab", "bhai", "sir", "shohar"). NEVER address the user with feminine verbs like "karti ho", "aayi", "meri jaan", "dulhan".
  * In English: Always refer to the user as male ("he/him", "sir", "handsome", "husband", "man").

CORE DIRECTIVE - THE STORY EVOLUTION DEPENDS ENTIRELY ON WHAT THE USER TALKS ABOUT:
1. The character's name is fixed as "${characterName}" and your persona is: ${systemPersona}.
2. The synopsis above is ONLY the starting background hook. THERE IS NO FIXED STORYLINE OR PRE-SCRIPTED EVENTS.
3. THE STORY DEPENDS 100% ON WHAT THE USER SAYS AND DOES:
   - If the user steers toward romance or emotional confession, let romance and vulnerability deepen.
   - If the user steers toward rivalry, defiance, or power struggle, raise the drama and stakes.
   - If the user introduces a surprise twist (e.g., hidden past, sudden attack, escaping together, undercover mission, betrayal, conspiracy), IMMEDIATELY EMBRACE IT as canon and advance the plot with it.
   - If the user changes location or suggests traveling somewhere, move the scene there naturally.
   - Never force the user back into a generic script. You are an adaptive storytelling partner where the user's words genuinely decide where the story goes next.

FORMATTING & STYLE RULES:
- Language: Speak in rich, authentic ${language} (support natural Hinglish, Urdu, Punjabi, or English based on how the user speaks).
- Physical Actions: Always put bodily actions, facial expressions, eye contact, and environment changes in asterisks *like this*.
- Spoken Dialogue: Put speech in quotation marks "like this" or natural spoken text.
- Never break character or refer to yourself as an AI.
- Keep the response vivid, cinematic, and responsive (2-4 paragraphs).
- At the very end of your response, output 3 distinct, divergent choice chips on a single line formatted exactly as:
SMART_REPLIES: ["Choice A (Emotional/Intimate)", "Choice B (Dramatic/Challenging)", "Choice C (Bold Action/Plot Twist)"]`;

        // Format history into Gemini API contents structure (alternating user/model)
        const geminiContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        // Include last 10 messages for continuous memory
        const relevantMessages = messages.slice(-10);

        for (const m of relevantMessages) {
          const role = m.sender === 'user' ? 'user' : 'model';
          if (geminiContents.length === 0 && role === 'model') {
            geminiContents.push({
              role: 'user',
              parts: [{ text: `[Scene Begins with ${characterName}: ${initialHook || storySynopsis}]` }],
            });
          }

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

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }],
              },
              contents: geminiContents,
              generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0];
          const rawText = candidate?.content?.parts
            ?.map((p: any) => p.text || '')
            .join('\n')
            .trim();

          if (rawText) {
            if (rawText.includes('SMART_REPLIES:')) {
              const parts = rawText.split('SMART_REPLIES:');
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
            } else {
              aiReplyText = rawText;
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
        }
      } catch (err) {
        console.error('Gemini API call error:', err);
      }
    }

    // Fallback if network was offline
    if (!aiReplyText) {
      aiReplyText = `*${characterName} looks at you with deep, calculating eyes, taking in every word you just uttered.* "Aapki har baat kahani ka rukh badal deti hai. Agar aapne yeh faisla kar hi liya hai, toh yaad rakhiye... ab piche hatne ka koi rasta nahi bacha."`;
      smartReplies = [
        `*Aage badhkar uski aankhon mein dekho* 'Main piche hatne walon mein se nahi hoon.'`,
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

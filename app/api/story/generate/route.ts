import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
  '';

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  '';

// Curated aesthetic backdrop covers for generated stories
const BACKDROP_COVERS = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80',
];

const AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
];

export async function POST(req: NextRequest) {
  try {
    const { title, prompt = '', genre = 'Drama' } = await req.json();

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Story title is required' },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();

    const systemPrompt = `You are a master dramatic storyteller and interactive novel architect for AuraFlex AI.
The user wants to create a new interactive story titled: "${cleanTitle}".
Additional user note or idea: "${prompt}".
Genre preference: "${genre}".

CRITICAL DESIGN RULES:
1. The protagonist (User) is ALWAYS a MALE character. He is sharp, handsome, respected, and central to the plot.
2. The companion is a compelling, high-tension character (e.g. passionate rival, estranged lover, fierce partner, underworld associate, or mysterious heiress).
3. The opening hook must be thrilling, cinematic, and written in rich Roman Urdu / Hinglish with physical actions in asterisks *like this* and spoken dialogue in quotes "like this".
4. Provide exactly 3 distinct, high-stakes dialogue or action choices for the user's first response.
5. Provide a deep persona profile and scene setup.

Return ONLY a valid JSON object with this exact structure and NO markdown around it:
{
  "title": "${cleanTitle}",
  "characterName": "<Name of character, e.g. Anjali, Zoya, Mehwish, Maya>",
  "userRole": "<Protagonist male role, e.g. Feudal Heir, Estranged Billionaire, Syndicate Boss, Undercover Agent>",
  "userGoal": "<Primary stakes or objective>",
  "category": "<Romance | Drama | Crime | Mystery | Anime | Fantasy>",
  "tags": ["<tag1>", "<tag2>", "<tag3>", "Male POV", "18+ Uncensored"],
  "summary": "<2-3 sentence engaging synopsis setting up the conflict>",
  "openingHook": "*<Dramatic physical action describing the character entering the scene>* \\"<First spoken dialogue addressing the user with intense emotional or dramatic tension>\\"",
  "smartReplies": [
    "*<Action 1>* \\"<Spoken choice 1>\\"",
    "*<Action 2>* \\"<Spoken choice 2>\\"",
    "*<Action 3>* \\"<Spoken choice 3>\\""
  ],
  "initialMood": "<Intense | Passionate | Guarded | Defiant>",
  "systemPersona": "<Deep personality, secrets, and speech style of the character>",
  "location": "<Starting atmospheric location, e.g. Sindh Haveli, Private Penthouse, Midnight Docks, Royal Courtyard>"
}`;

    let generatedData: any = null;

    // 1. Try OpenRouter First
    if (OPENROUTER_API_KEY) {
      try {
        const orModels = [
          'meta-llama/llama-3.3-70b-instruct',
          'gryphe/mythomax-l2-13b',
          'deepseek/deepseek-chat',
        ];

        for (const model of orModels) {
          try {
            const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENROUTER_API_KEY.trim()}`,
                'HTTP-Referer': 'https://nocturne-ai-beta.vercel.app',
                'X-Title': 'AuraFlex AI - Story Generator',
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: 'system', content: 'You are an API that generates valid JSON stories.' },
                  { role: 'user', content: systemPrompt },
                ],
                temperature: 0.85,
                response_format: { type: 'json_object' },
              }),
            });

            if (orRes.ok) {
              const resData = await orRes.json();
              const content = resData.choices?.[0]?.message?.content?.trim();
              if (content) {
                try {
                  generatedData = JSON.parse(content);
                  break;
                } catch {
                  const match = content.match(/\{[\s\S]*\}/);
                  if (match) {
                    generatedData = JSON.parse(match[0]);
                    break;
                  }
                }
              }
            }
          } catch (mErr) {
            console.warn('OpenRouter generation error for model', model, mErr);
          }
        }
      } catch (err) {
        console.error('OpenRouter top level story generation error:', err);
      }
    }

    // 2. Fallback to Gemini
    if (!generatedData && GEMINI_API_KEY) {
      try {
        const geminiModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
        for (const model of geminiModels) {
          try {
            const gRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
                  generationConfig: {
                    temperature: 0.85,
                    maxOutputTokens: 2048,
                    responseMimeType: 'application/json',
                  },
                  safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                  ],
                }),
              }
            );

            if (gRes.ok) {
              const data = await gRes.json();
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
              if (text) {
                try {
                  generatedData = JSON.parse(text);
                  break;
                } catch {
                  const match = text.match(/\{[\s\S]*\}/);
                  if (match) {
                    generatedData = JSON.parse(match[0]);
                    break;
                  }
                }
              }
            }
          } catch (gErr) {
            console.warn('Gemini generation error for model', model, gErr);
          }
        }
      } catch (err) {
        console.error('Gemini top level story generation error:', err);
      }
    }

    // 3. Fallback procedural generator if offline
    if (!generatedData) {
      const charName = 'Zoya';
      generatedData = {
        title: cleanTitle,
        characterName: charName,
        userRole: 'The Respected Heir',
        userGoal: 'Reclaim power and decide the destiny of the dynasty',
        category: genre || 'Drama',
        tags: ['🔥 Custom Story', 'Male POV', '18+ Uncensored', 'High Stakes'],
        summary: `The sudden dawn of "${cleanTitle}" plunges you into a dangerous crossroads of legacy and passion alongside ${charName}.`,
        openingHook: `*${charName} enters the shadowed chamber, her eyes fixed onto you with a mixture of raw desire and calculation.* "Aap aa gaye... Mujhe laga tha shayad aap yeh faisla karne se pehle darenge. Par ab piche hatne ka koi rasta nahi bacha."`,
        smartReplies: [
          `*Aage badhkar ${charName} ki aankhon mein dekho* 'Main kisi se nahi darta, Zoya.'`,
          `*Dheemi aawaz mein muskurao* 'Is kahani ka asli faisla ab shuru hoga.'`,
          `*Uska haath thaam kar kaho* 'Batao, tum kis taraf khadi ho?'`,
        ],
        initialMood: 'Intense & Unpredictable',
        systemPersona: `You are ${charName}, an enigmatic and seductive confidante in "${cleanTitle}". You speak fluent, authentic Roman Urdu / Hinglish with high tension.`,
        location: 'Private Quarters',
      };
    }

    // Create unique ID
    const storyId = 'custom-' + cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    
    // Pick visual assets
    const randomCover = BACKDROP_COVERS[Math.floor(Math.random() * BACKDROP_COVERS.length)];
    const randomAvatar = AVATAR_IMAGES[Math.floor(Math.random() * AVATAR_IMAGES.length)];

    const finalStory = {
      id: storyId,
      title: generatedData.title || cleanTitle,
      characterName: generatedData.characterName || 'Companion',
      userRole: generatedData.userRole || 'The Protagonist',
      userGoal: generatedData.userGoal || 'Master the narrative outcome',
      category: generatedData.category || genre || 'Drama',
      tags: Array.isArray(generatedData.tags) ? generatedData.tags : ['🔥 Custom Novel', 'Male POV'],
      summary: generatedData.summary || `An immersive custom storyline built around ${cleanTitle}.`,
      openingHook: generatedData.openingHook || `*[Steps closer]* "The story begins with you."`,
      smartReplies: Array.isArray(generatedData.smartReplies) && generatedData.smartReplies.length > 0
        ? generatedData.smartReplies
            .filter((r: any) => typeof r === 'string' && r.trim().length > 4 && !r.includes('initialMood') && !r.includes('systemPersona'))
            .slice(0, 3)
        : [
            "*Step forward boldly*",
            "*Challenge the character calmly*",
            "*Whisper with conviction*",
          ],
      initialMood: generatedData.initialMood || 'Intense',
      systemPersona: generatedData.systemPersona || 'You are an engaging roleplay companion.',
      avatar: randomAvatar,
      cover: randomCover,
      viewsCount: '1.2K',
      rating: 5.0,
      quality: '4K UHD',
      isFeatured: false,
      sceneContext: {
        location: generatedData.location || 'Private Suite',
        empireControl: '90%',
        activeNpc: generatedData.characterName || 'Companion',
        mood: generatedData.initialMood || 'Intense',
      },
    };

    return NextResponse.json({
      success: true,
      story: finalStory,
    });
  } catch (error: any) {
    console.error('Create Story API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

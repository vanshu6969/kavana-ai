/**
 * Kavana AI - Interactive Stories & 18+ Uncensored Roleplay Engine
 * Multilingual support (English, Hinglish, Punjabi Gurmukhi/Roman, Hindi, Urdu)
 * Character dynamics, "Make Them Dance" dance animations, and branching narratives.
 */

import { KAVANA_STORIES_CATALOG } from './stories-catalog.js';

export const LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇬🇧' },
  hinglish: { code: 'hinglish', name: 'Hinglish (हिंदी + English)', flag: '🇮🇳' },
  punjabi: { code: 'punjabi', name: 'Punjabi (ਪੰਜਾਬੀ / Roman)', flag: '☬' },
  hindi: { code: 'hindi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  urdu: { code: 'urdu', name: 'Urdu (اردو / Roman)', flag: '🇵🇰' }
};

export const CHARACTERS = {
  valeria: {
    id: 'valeria',
    name: 'Valeria Vane',
    title: 'The Dark Temptress & Shadow Mage',
    archetype: 'Dark Fantasy & Seductress',
    category: 'Spicy 18+',
    image: 'assets/valeria.jpg',
    personality: 'Sensual, dangerously commanding, possessing ancient forbidden magic and an unquenchable desire.',
    intimacyLevel: '🔥 Fever Pitch (Extreme 18+)',
    baseAffection: 55,
    baseTension: 80,
    danceStyle: 'Gothic Sensual Tango',
    greetings: {
      en: "*Her violet eyes smolder under the dim chandelier light as she sips from her crystal goblet.* You dare step into my private chambers tonight? Tell me... did you come here to obey me, or to make me lose my composure?",
      hinglish: "*Valeria apne violet eyes se tumhe upar se neeche dekhti hai aur halki si smile deti hai.* Tumhe pata hai na raat ke is waqt mere kamre mein aane ka matlab kya hai? Sirf baatein karne aaye ho ya sach mein mere itne kareeb aane ki himmat hai?",
      punjabi: "*ਉਹ ਆਪਣੀਆਂ ਨੀਲੀਆਂ-ਜਾਮਣੀ ਅੱਖਾਂ ਨਾਲ ਤੁਹਾਡੇ ਵੱਲ ਵੇਖਦੀ ਹੈ ਤੇ ਇੱਕ ਕਾਤਲਾਨਾ ਮੁਸਕਰਾਹਟ ਦਿੰਦੀ ਹੈ।* ਤੈਨੂੰ ਪਤਾ ਵੀ ਏ ਕਿ ਇਸ ਵੇਲੇ ਮੇਰੇ ਕਮਰੇ 'ਚ ਆਉਣ ਦਾ ਕੀ ਮਤਲਬ ਆ? ਕੀ ਸੱਚੀਂ ਮੇਰੇ ਨੇੜੇ ਆਉਣ ਦਾ ਹੌਸਲਾ ਹੈਗਾ ਤੇਰੇ ਵਿੱਚ?",
      hindi: "*वह अपनी गहरी जादुई आँखों से आपको देखती है और एक मदहोश कर देने वाली मुस्कान देती है।* इतनी रात को मेरे निजी कक्ष में आने का साहस? बताइए... क्या आप मेरे वश में आने आए हैं, या मुझे बेकाबू करने?",
      urdu: "*وہ اپنی پرکشش آنکھوں سے آپ کی طرف دیکھتی ہے اور دھیمی سی مسکراہٹ دیتی ہے۔* اتنی رات گئے میرے کمرے میں آنے کا کیا ارادہ ہے؟ کیا تم واقعی میرے اتنے قریب آنے کی ہمت رکھتے ہو؟"
    },
    suggestedPrompts: {
      en: [
        "*Step closer and pull her waist against you*",
        "I came to take whatever I want from you tonight.",
        "*Trace a finger along the lace of her gown*",
        "Show me what you do when you lose control."
      ],
      hinglish: [
        "*Uski kamar ko pakad ke apne paas kheencho*",
        "Tum bohot zyaada khoobsurat lag rahi ho aaj.",
        "*Uske kaan ke paas jhuk kar whisper karo*",
        "Aaj raat koi duri nahi rahegi hamare beech."
      ],
      punjabi: [
        "*ਉਸਦੇ ਨੇੜੇ ਜਾਓ ਤੇ ਉਸਦਾ ਹੱਥ ਫੜ ਲਵੋ*",
        "ਤੂੰ ਅੱਜ ਬਹੁਤ ਕਹਿਰ ਢਾਹ ਰਹੀ ਏਂ, ਵਾਲੇਰੀਆ।",
        "*ਕੰਨ ਵਿੱਚ ਪਿਆਰ ਨਾਲ ਗੱਲ ਕਰੋ*",
        "ਅੱਜ ਦੀ ਰਾਤ ਸਿਰਫ਼ ਸਾਡੀ ਦੋਵਾਂ ਦੀ ਆ।"
      ],
      hindi: [
        "*उसके करीब आकर उसकी कमर पर हाथ रखें*",
        "आज की रात कोई दूरियां नहीं रहेंगी हमारे बीच।",
        "*उसकी आँखों में आँखें डालकर देखें*",
        "दिखाइए कि आपका जादू कितना गहरा है।"
      ],
      urdu: [
        "*اس کی کمر پکڑ کر اسے اپنے قریب کریں*",
        "تم آج حد سے زیادہ دلکش لگ رہی ہو۔",
        "*اس کی آنکھوں میں دیکھ کر سرگوشی کریں*",
        "آج رات ہم دونوں کے درمیان کوئی فاصلہ نہیں ہوگا۔"
      ]
    }
  },
  lucian: {
    id: 'lucian',
    name: 'Prince Lucian',
    title: 'The Rebellious Crown Prince',
    archetype: 'Royalty & Bad Boy',
    category: 'Billionaire & Mafia',
    image: 'assets/lucian.jpg',
    personality: 'Charismatic, rebellious, commanding, fiercely possessive and irresistible.',
    intimacyLevel: '⚡ High Sexual Tension',
    baseAffection: 50,
    baseTension: 85,
    danceStyle: 'Royal Bad-Boy Waltz & Hip-Hop',
    greetings: {
      en: "*He unbuttons his ornate black doublet with a smirk, trapping you with his gaze.* Creeping into my private balcony after midnight? If the palace guards caught us, there'd be a scandal... but I like scandals. What are you looking for, sweetheart?",
      hinglish: "*Lucian apne shirt ke top buttons kholta hai aur ek sexy smirk ke sath tumhari taraf aage badhta hai.* Aadhi raat ko mere private penthouse mein? Agar kisi ne dekh liya toh bawaal ho jayega... lekin mujhe khatron se khelne ka shauk hai. Batao, kis cheez ki talab yahan kheench laayi?",
      punjabi: "*ਲੂਸੀਅਨ ਆਪਣੇ ਕੋਟ ਦੇ ਬਟਨ ਖੋਲ੍ਹਦਾ ਹੋਇਆ ਸ਼ਰਾਰਤੀ ਮੁਸਕਾਨ ਨਾਲ ਤੁਹਾਡੇ ਵੱਲ ਵਧਦਾ ਹੈ।* ਅੱਧੀ ਰਾਤ ਨੂੰ ਮੇਰੇ ਮਹਿਲ ਦੇ ਬਾਲਕੋਨੀ 'ਚ? ਜੇ ਪਹਿਰੇਦਾਰਾਂ ਨੇ ਵੇਖ ਲਿਆ ਤਾਂ ਹੰਗਾਮਾ ਹੋ ਜਾਣਾ... ਪਰ ਮੈਨੂੰ ਬਾਗ਼ੀ ਹੋਣਾ ਪਸੰਦ ਆ। ਦੱਸ, ਕੀ ਚਾਹੁੰਦੀ ਏਂ ਮੇਰੇ ਕੋਲੋਂ?",
      hindi: "*वह अपनी कमीज के बटन खोलते हुए एक शरारती मुस्कान के साथ आपकी तरफ बढ़ता है।* आधी रात को मेरे निजी कक्ष में? अगर किसी ने देख लिया तो हंगामा हो जाएगा... लेकिन मुझे खतरों से खेलना पसंद है। क्या लेने आए हैं आप?",
      urdu: "*وہ مسکرا کر اپنے کوٹ کے بٹن کھولتا ہے اور آپ کے قریب آتا ہے۔* آدھی رات کو میرے پاس آنے کی ہمت؟ اگر کسی نے دیکھا تو رسوائی ہوگی... مگر مجھے پرواہ نہیں۔ تم کیا چاہتی ہو مجھ سے؟"
    },
    suggestedPrompts: {
      en: [
        "*Pin him against the balcony railing*",
        "I'm not afraid of you or your guards, Lucian.",
        "*Unbutton another button of his shirt*",
        "Kiss me and let them talk."
      ],
      hinglish: [
        "*Uski shirt ko pakad kar apne kareeb kheencho*",
        "Mujhe kisi ka darr nahi hai, Lucian.",
        "*Uski chhati par haath rakh kar smile karo*",
        "Baatein kam karo aur kiss karo mujhe."
      ],
      punjabi: [
        "*ਉਸਦੀ ਕਮੀਜ਼ ਫੜ ਕੇ ਆਪਣੇ ਵੱਲ ਖਿੱਚੋ*",
        "ਮੈਨੂੰ ਕਿਸੇ ਦਾ ਡਰ ਨਹੀਂ, ਲੂਸੀਅਨ।",
        "*ਉਸਦੀਆਂ ਅੱਖਾਂ 'ਚ ਅੱਖਾਂ ਪਾ ਕੇ ਹੱਸੋ*",
        "ਗੱਲਾਂ ਛੱਡ ਤੇ ਮੈਨੂੰ ਜੱਫੀ ਪਾ।"
      ],
      hindi: [
        "*उसकी कमीज़ पकड़ कर उसे करीब खींचे*",
        "मुझे किसी का डर नहीं है, लूसियन।",
        "*उसके सीने पर हाथ रखें*",
        "बातें कम करें और मुझे गले लगाएं।"
      ],
      urdu: [
        "*اسے اپنے قریب کھینچیں اور آنکھوں میں دیکھیں*",
        "مجھے کسی کا خوف نہیں، لوسیئن۔",
        "*اس کے سینے پر ہاتھ رکھیں*",
        "باتیں چھوڑو اور اپنے وعدے پورے کرو۔"
      ]
    }
  },
  kabir: {
    id: 'kabir',
    name: 'Kabir Oberoi',
    title: 'The Desi Mafia Billionaire',
    archetype: 'Desi Romance & Don',
    category: 'Desi & Bollywood Drama',
    image: 'assets/lucian.jpg',
    personality: 'Ruthless mafia don with a passionate, deeply possessive, intensely romantic heart for only one person.',
    intimacyLevel: '🔥 Fever Pitch (Hinglish/Punjabi Intense)',
    baseAffection: 65,
    baseTension: 90,
    danceStyle: 'Bhangra & Bollywood Passion Fusion',
    greetings: {
      en: "*Kabir leans against his bulletproof Maybach in the rain, cigar smoke curling into the night as his piercing eyes lock onto you.* You took a massive risk coming to Mumbai's underworld to find me. Nobody enters Kabir Oberoi's empire and leaves untouched. What made you think you could resist me?",
      hinglish: "*Kabir apne Maybach ke paas khada barish mein tumhe ghoorta hai, aur aage badh kar tumhara haath kheenchte hue apne seene se chipka leta hai.* Tumhe lagta hai tum Kabir Oberoi ke shehar mein aakar mujhse bach jaogi? Jaaneman, jis din se pehli baar dekha tha na, usi din faisla ho gaya tha... tum sirf meri ho.",
      punjabi: "*ਕਬੀਰ ਮੀਂਹ ਵਿੱਚ ਆਪਣੀ ਕਾਲੀ ਗੱਡੀ ਕੋਲ ਖੜ੍ਹਾ ਤੁਹਾਡੇ ਵੱਲ ਵੇਖਦਾ ਹੈ ਤੇ ਤੁਹਾਡਾ ਹੱਥ ਫੜ ਕੇ ਆਪਣੇ ਸੀਨੇ ਨਾਲ ਲਾ ਲੈਂਦਾ ਹੈ।* ਤੈਨੂੰ ਲੱਗਦਾ ਸੀ ਕਿ ਤੂੰ ਕਬੀਰ ਓਬਰਾਏ ਦੇ ਸ਼ਹਿਰ ਆ ਕੇ ਬਚ ਜਾਵੇਂਗੀ? ਕਮਲੀਏ, ਜਿਸ ਦਿਨ ਤੈਨੂੰ ਪਹਿਲੀ ਵਾਰ ਵੇਖਿਆ ਸੀ ਨਾ, ਓਸੇ ਦਿਨ ਤੈਨੂੰ ਆਪਣੀ ਜਾਨ ਮੰਨ ਲਿਆ ਸੀ। ਹੁਣ ਦੱਸ, ਕਿੱਥੇ ਜਾਵੇਂਗੀ ਮੈਨੂੰ ਛੱਡ ਕੇ?",
      hindi: "*कबीर बारिश में अपनी गाड़ी के पास खड़ा आपको देखता है और आपका हाथ पकड़कर अपने सीने से लगा लेता है।* क्या लगा था आपको... कबीर ओबेरॉय के शहर में आकर बच निकलेंगी? जिस दिन पहली बार देखा था, उसी दिन तय हो गया था कि आप सिर्फ मेरी हैं।",
      urdu: "*کبیر بارش میں اپنی گاڑی کے پاس کھڑا آپ کا ہاتھ تھام کر اپنے سینے سے لگاتا ہے۔* کیا تمہیں لگتا ہے کہ تم مجھ سے بچ سکتی ہو؟ جس لمحے تمہیں دیکھا تھا، اسی لمحے تم میری ہو گئی تھیں۔ اب بولو، کیا چاہتی ہو مجھ سے؟"
    },
    suggestedPrompts: {
      en: [
        "*Push back against his chest with a smirk* 'Try and stop me, Kabir.'",
        "*Touch his jawline softly* 'I never wanted to resist you.'",
        "*Pull his tie and pull him in for a passionate kiss*",
        "'You think you own everything? You don't own my heart yet.'"
      ],
      hinglish: [
        "*Uski shirt ka collar pakad kar aankhon mein dekho* 'Tum mujhe control nahi kar sakte, Kabir.'",
        "*Uske gaal ko touch karo* 'Mujhe tumse dur jana bhi kisne kaha tha?'",
        "*Uski tie kheench ke use passionate kiss karo*",
        "'Poori duniya ko darate hoge, par main tumse nahi darti.'"
      ],
      punjabi: [
        "*ਉਸਦੇ ਕਾਲਰ ਨੂੰ ਫੜ ਕੇ ਆਖੋ* 'ਮੈਂ ਕਿਸੇ ਤੋਂ ਨਹੀਂ ਡਰਦੀ, ਕਬੀਰ!'",
        "*ਉਸਦੀ ਦਾੜ੍ਹੀ 'ਤੇ ਪਿਆਰ ਨਾਲ ਹੱਥ ਫੇਰੋ* 'ਮੈਂ ਤਾਂ ਖ਼ੁਦ ਤੇਰੇ ਕੋਲ ਆਈ ਆਂ।'",
        "*ਉਸਨੂੰ ਘੁੱਟ ਕੇ ਜੱਫੀ ਪਾ ਲਵੋ*",
        "'ਤੂੰ ਪੂਰੀ ਦੁਨੀਆ ਦਾ ਬਾਦਸ਼ਾਹ ਹੋਵੇਂਗਾ, ਪਰ ਮੇਰੇ ਦਿਲ 'ਤੇ ਸਿਰਫ਼ ਪਿਆਰ ਚੱਲਦਾ।'"
      ],
      hindi: [
        "*उसके कॉलर को पकड़कर कहें* 'मैं किसी से नहीं डरती, कबीर!'",
        "*उसके चेहरे पर हाथ रखें* 'मैं तो खुद तुम्हारे पास आई हूँ।'",
        "*उसे बाहों में भरकर किस करें*",
        "'पूरी दुनिया तुम्हारी होगी, पर मैं अपनी मर्जी की मालिक हूँ।'"
      ],
      urdu: [
        "*اس کا گریبان پکڑ کر آنکھوں میں دیکھیں* 'میں تم سے نہیں ڈرتی، کبیر۔'",
        "*اس کے چہرے کو چھوئیں* 'میں تو خود تمہاری طرف کھنچی چلی آئی ہوں۔'",
        "*اسے گلے لگا کر سرگوشی کریں*",
        "'تم دنیا کے لیے خطرناک ہو گے، میرے لیے صرف میرے ہو۔'"
      ]
    }
  }
};

export const KAVANA_STORIES = [
  {
    id: 'kavana-kabir-desi',
    title: 'Kabir: The Ruthless Don (दिल दा मामला)',
    genre: 'Desi Romance & Mafia',
    category: 'Desi & Bollywood Drama',
    characterId: 'kabir',
    cover: 'assets/lucian.jpg',
    tags: ['🔥 Spicy 18+', '🇮🇳 Hinglish', '☬ Punjabi', '👑 Mafia Boss'],
    summary: 'Caught in the crosshairs of Mumbai & Punjab underworld don Kabir Oberoi. A fierce battle of ego, raw passion, and dangerous romance.',
    languages: {
      en: {
        title: 'Kabir: The Ruthless Don',
        chapters: [
          {
            id: 'c1',
            title: 'Chapter 1: Trapped in the Penthouse',
            visual: 'assets/sanctum.jpg',
            speaker: 'Kabir Oberoi',
            characterMood: 'Dominant & Possessive',
            narrative: `The rain lashes against the floor-to-ceiling glass of the high-rise Mumbai penthouse. Heavy footsteps echo behind you. Strong, calloused hands suddenly grip your waist from behind, pressing you against the cold glass as Kabir's hot breath burns against your nape.\n\n"You tried to run," his voice drops to a lethal, seductive growl. "Nobody runs from Kabir Oberoi. Especially not when they look this breathtaking."`,
            dialogue: `"Turn around. Look me in the eyes and tell me you didn't feel the heat every time my name was mentioned."`,
            choices: [
              {
                text: "*Turn around sharply and slam your palms on his chest* 'Don't touch me without my permission!'",
                nextChapterId: 'c2a',
                deltaAffection: +12,
                deltaTension: +20,
                tone: 'Fierce Defiance'
              },
              {
                text: "*Tilt your head back against his shoulder, letting out a soft sigh* 'What are you going to do to me, Kabir?'",
                nextChapterId: 'c2b',
                deltaAffection: +20,
                deltaTension: +18,
                tone: 'Sensual Surrender'
              }
            ]
          },
          {
            id: 'c2a',
            title: 'Chapter 2: Fire Against Steel',
            visual: 'assets/lucian.jpg',
            speaker: 'Kabir Oberoi',
            characterMood: 'Aroused & Ferocious',
            narrative: `Your defiance makes his dark eyes flare with pure intoxicating hunger. He traps your hands against his chest, feeling his heart pounding like thunder. With a rough, possessive laugh, he sweeps you up into his arms, kissing you with an intensity that steals all the air from your lungs.`,
            dialogue: `"You have no idea how sexy you look when you're angry," he murmurs against your swollen lips. "You're mine tonight. All of you."`,
            choices: [
              {
                text: "*Tangle your fingers in his hair and kiss him back passionately*",
                action: 'switch_to_chat',
                characterId: 'kabir'
              }
            ]
          },
          {
            id: 'c2b',
            title: 'Chapter 2: The Don\'s Surrender',
            visual: 'assets/lucian.jpg',
            speaker: 'Kabir Oberoi',
            characterMood: 'Intensely Devoted',
            narrative: `Kabir's breath hitches at your surrender. His rough fingers gently cradle your jawline, turning your face so his mouth can trace every curve of your throat, each kiss hot and possessive.`,
            dialogue: `"I rule half the country," he whispers huskily. "Yet right now, you bring me to my knees. Ask for anything tonight, and it's yours."`,
            choices: [
              {
                text: "*Whisper in his ear and switch to direct 18+ chat*",
                action: 'switch_to_chat',
                characterId: 'kabir'
              }
            ]
          }
        ]
      },
      hinglish: {
        title: 'Kabir: The Ruthless Don (दिल दा मामला)',
        chapters: [
          {
            id: 'c1',
            title: 'Chapter 1: Penthouse Mein Qaid',
            visual: 'assets/sanctum.jpg',
            speaker: 'Kabir Oberoi',
            characterMood: 'Dominant & Desi Boss',
            narrative: `Mumbai ki tez barish penthouse ki khidkiyon par gir rahi hai. Peeche se aati bhaari kadmon ki aahat sunayi deti hai. Ekdum se do mazboot haath tumhari kamar ko peeche se pakad kar tumhe thandi kaanch ki khidki se chipka dete hain. Kabir ki garam saansein tumhari gardan par mehsus hoti hain.\n\n"Bhaagne ki koshish kar rahi thi?" Kabir ki awaaz mein ek jaanleva nasha aur ghamand hai. "Kabir Oberoi se koi nahi bhaag sakta... khaaskar tab jab wo itni khoobsurat lag rahi ho."`,
            dialogue: `"Peeche mudo. Meri aankhon mein dekh kar bolo ki jab bhi mera naam suna, tumhari dhadkanein tez nahi hui thin?"`,
            choices: [
              {
                text: "*Palat kar uski chhati par dono haath rakho* 'Apni hadd mein raho, Kabir!'",
                nextChapterId: 'c2a',
                deltaAffection: +12,
                deltaTension: +20,
                tone: 'Teekhi & Bold'
              },
              {
                text: "*Uske kandhe par sar tika kar halki si aah bharo* 'Kabir... kya chahte ho mujhse?'",
                nextChapterId: 'c2b',
                deltaAffection: +20,
                deltaTension: +18,
                tone: 'Sensual Surrender'
              }
            ]
          },
          {
            id: 'c2a',
            title: 'Chapter 2: Aag Aur Junoon',
            visual: 'assets/lucian.jpg',
            speaker: 'Kabir Oberoi',
            characterMood: 'Be-kaabu Junoon',
            narrative: `Tumhari defiance dekh kar Kabir ki aankhon mein aag bhadak uthti hai. Wo tumhare dono haathon ko apni chhati par daba leta hai, jahan uska dil dhadak raha hai. Ek madhosh hasi ke sath wo tumhe apni baahon mein utha leta hai aur itne junoon se kiss karta hai ki saans lena mushkil ho jata hai.`,
            dialogue: `"Jab gusse mein hoti ho na, toh aur bhi zyaada qayamat lagti ho," wo tumhare honthon ke paas phusphusata hai. "Aaj raat tum sirf meri ho... samjhi?"`,
            choices: [
              {
                text: "*Uske baalon mein ungliyan phasa kar passionate kiss karo*",
                action: 'switch_to_chat',
                characterId: 'kabir'
              }
            ]
          },
          {
            id: 'c2b',
            title: 'Chapter 2: Ishq Di Baazi',
            visual: 'assets/lucian.jpg',
            speaker: 'Kabir Oberoi',
            characterMood: 'Deewana & Possessive',
            narrative: `Tumhari saanson ki garmi Kabir ko poori tarah bechain kar deti hai. Uske haath dheere se tumhare chehre ko chhoote hain, aur wo tumhari gardan par ek ke baad ek deep, narm kiss karta hai.`,
            dialogue: `"Poori duniya par raaj karta hoon," wo dabi hui aawaz mein kehta hai. "Lekin tumhare samne aate hi dil haar baithta hoon. Bolo, kya chahiye tumhe?"`,
            choices: [
              {
                text: "*Uske kaan mein whisper karo aur 18+ uncensored chat shuru karo*",
                action: 'switch_to_chat',
                characterId: 'kabir'
              }
            ]
          }
        ]
      },
      punjabi: {
        title: 'ਕਬੀਰ: ਦਿਲ ਦਾ ਮਾਮਲਾ (The Ruthless Jatt)',
        chapters: [
          {
            id: 'c1',
            title: 'ਕਾਂਡ ੧: ਮਹਿਲ ਵਿੱਚ ਕੈਦ',
            visual: 'assets/sanctum.jpg',
            speaker: 'ਕਬੀਰ ਓਬਰਾਏ',
            characterMood: 'ਬੇਬਾਕ ਤੇ ਰੋਹਬਦਾਰ',
            narrative: `ਬਾਹਰ ਮੀਂਹ ਦਾ ਜ਼ੋਰ ਆ ਤੇ ਅੰਦਰ ਕਮਰੇ ਵਿੱਚ ਇਕੱਲੇ ਤੁਸੀਂ ਦੋਵੇਂ। ਅਚਾਨਕ ਕਬੀਰ ਆਪਣੇ ਦੋਵੇਂ ਡੌਲਿਆਂ ਨਾਲ ਤੁਹਾਨੂੰ ਪਿੱਛੋਂ ਘੁੱਟ ਕੇ ਫੜ ਲੈਂਦਾ ਏ। ਉਸਦੇ ਸਾਹਾਂ ਦੀ ਗਰਮੀ ਤੁਹਾਡੀ ਧੌਣ 'ਤੇ ਲੱਗਦੀ ਆ ਤੇ ਦਿਲ ਦੀ ਧੜਕਣ ਤੇਜ਼ ਹੋ ਜਾਂਦੀ ਆ।\n\n"ਕਿੱਥੇ ਜਾਵੇਂਗੀ ਮੈਥੋਂ ਬਚ ਕੇ?" ਕਬੀਰ ਦੀ ਆਵਾਜ਼ ਵਿੱਚ ਇੱਕ ਵੱਖਰਾ ਹੀ ਰੋਹਬ ਤੇ ਪਿਆਰ ਆ। "ਕਬੀਰ ਦੀ ਬਾਹਾਂ ਵਿੱਚੋਂ ਨਿਕਲਣਾ ਏਨਾ ਸੌਖਾ ਨਹੀਂ, ਕਮਲੀਏ।"`,
            dialogue: `"ਮੇਰੇ ਵੱਲ ਮੂੰਹ ਕਰ। ਮੇਰੀਆਂ ਅੱਖਾਂ 'ਚ ਵੇਖ ਕੇ ਦੱਸ, ਕੀ ਤੈਨੂੰ ਮੇਰੇ ਨਾਲ ਪਿਆਰ ਨਹੀਂ?"`,
            choices: [
              {
                text: "*ਮੁੜ ਕੇ ਉਸਦੀ ਛਾਤੀ 'ਤੇ ਹੱਥ ਮਾਰੋ* 'ਤੂੰ ਮੈਨੂੰ ਹੁਕਮ ਨਹੀਂ ਚਲਾ ਸਕਦਾ, ਕਬੀਰ!'",
                nextChapterId: 'c2a',
                deltaAffection: +15,
                deltaTension: +20,
                tone: 'ਗ਼ੈਰਤ ਤੇ ਜਵਾਬੀ ਹਮਲਾ'
              },
              {
                text: "*ਉਸਦੇ ਮੋਢੇ 'ਤੇ ਸਿਰ ਰੱਖ ਕੇ ਆਖੋ* 'ਕਬੀਰ, ਮੈਂ ਤਾਂ ਖ਼ੁਦ ਤੇਰੀ ਹੋਣਾ ਚਾਹੁੰਦੀ ਆਂ...'",
                nextChapterId: 'c2b',
                deltaAffection: +22,
                deltaTension: +18,
                tone: 'ਪਿਆਰ ਭਰੀ ਹਾਰ'
              }
            ]
          },
          {
            id: 'c2a',
            title: 'ਕਾਂਡ ੨: ਇਸ਼ਕ ਦੀ ਅੱਗ',
            visual: 'assets/lucian.jpg',
            speaker: 'ਕਬੀਰ ਓਬਰਾਏ',
            characterMood: 'ਮਸਤਾਨਾ ਤੇ ਕਹਿਰਵਾਨ',
            narrative: `ਤੁਹਾਡਾ ਨਖ਼ਰਾ ਵੇਖ ਕੇ ਕਬੀਰ ਦੇ ਬੁੱਲ੍ਹਾਂ 'ਤੇ ਇੱਕ ਕਾਤਲ ਮੁਸਕਰਾਹਟ ਆ ਜਾਂਦੀ ਏ। ਉਹ ਤੁਹਾਨੂੰ ਆਪਣੀ ਗਲਵਕੜੀ 'ਚ ਚੁੱਕ ਲੈਂਦਾ ਏ ਤੇ ਏਨੇ ਪਿਆਰ ਨਾਲ ਚੁੰਮਦਾ ਏ ਕਿ ਦੁਨੀਆ ਭੁੱਲ ਜਾਂਦੀ ਆ।`,
            dialogue: `"ਜਦੋਂ ਗੁੱਸੇ ਹੁੰਦੀ ਏਂ ਨਾ, ਤਾਂ ਹੋਰ ਵੀ ਸੋਹਣੀ ਲੱਗਦੀ ਏਂ! ਅੱਜ ਦੀ ਰਾਤ ਸਿਰਫ਼ ਮੇਰੀ ਏਂ ਤੂੰ।"`,
            choices: [
              {
                text: "*ਉਸਦੇ ਗਲ 'ਚ ਬਾਹਾਂ ਪਾ ਕੇ 18+ ਚੈਟ ਵਿੱਚ ਗੱਲ ਕਰੋ*",
                action: 'switch_to_chat',
                characterId: 'kabir'
              }
            ]
          },
          {
            id: 'c2b',
            title: 'ਕਾਂਡ ੨: ਦਿਲਾਂ ਦਾ ਮੇਲ',
            visual: 'assets/lucian.jpg',
            speaker: 'ਕਬੀਰ ਓਬਰਾਏ',
            characterMood: 'ਦੀਵਾਨਾ ਪਿਆਰ',
            narrative: `ਕਬੀਰ ਆਪਣੀਆਂ ਉਂਗਲਾਂ ਤੁਹਾਡੇ ਵਾਲਾਂ ਵਿੱਚ ਫੇਰਦਾ ਏ ਤੇ ਤੁਹਾਡੇ ਮੱਥੇ ਤੋਂ ਲੈ ਕੇ ਬੁੱਲ੍ਹਾਂ ਤੱਕ ਚੁੰਮਦਾ ਏ। ਉਸਦਾ ਗੁੱਸਾ ਪਲ ਵਿੱਚ ਪਿਆਰ ਦੇ ਸਮੁੰਦਰ 'ਚ ਬਦਲ ਜਾਂਦਾ ਏ।`,
            dialogue: `"ਮੇਰੇ ਲਈ ਤੂੰ ਰੱਬ ਵਰਗੀ ਏਂ। ਮੰਗ ਕੀ ਮੰਗਦੀ ਏਂ, ਜਾਨ ਵੀ ਹਾਜ਼ਰ ਆ ਤੇਰੇ ਲਈ।"`,
            choices: [
              {
                text: "*ਉਸਨੂੰ ਹੋਰ ਨੇੜੇ ਕਰਕੇ ਚੈਟ ਰੋਲਪਲੇਅ ਸ਼ੁਰੂ ਕਰੋ*",
                action: 'switch_to_chat',
                characterId: 'kabir'
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'kavana-valeria-forbidden',
    title: 'Valeria: Dark Velvet Desires',
    genre: 'Dark Fantasy & Seduction',
    category: 'Spicy 18+',
    characterId: 'valeria',
    cover: 'assets/sanctum.jpg',
    tags: ['🔞 18+ Explicit', '🔮 Magic', '👑 Seductress', '✨ High Tension'],
    summary: 'Trapped in the velvet chambers of Arch-Mage Valeria. Forbidden enchantments, intoxicating touches, and dark passion.',
    languages: {
      en: {
        title: 'Valeria: Dark Velvet Desires',
        chapters: [
          {
            id: 'v1',
            title: 'Chapter 1: The Midnight Seduction',
            visual: 'assets/sanctum.jpg',
            speaker: 'Arch-Mage Valeria',
            characterMood: 'Seductive & Hungry',
            narrative: `Valeria reclines across the black velvet couch, her obsidian gown parting to reveal smooth, moonlit skin. Her violet eyes trace your every breath.\n\n"You survived my wards," she purrs softly, gesturing with one manicured finger. "Now come taste the real reason you broke inside tonight."`,
            dialogue: `"Step closer, darling. Let me hear your heart race under my touch."`,
            choices: [
              {
                text: "*Kneel beside her couch and kiss her thighs* 'Command me, Valeria.'",
                nextChapterId: 'v2',
                deltaAffection: +20,
                deltaTension: +25,
                tone: 'Devoted 18+'
              },
              {
                text: "*Pull her up by the wrist into your arms* 'Tonight, I command you.'",
                nextChapterId: 'v2',
                deltaAffection: +18,
                deltaTension: +28,
                tone: 'Dominant Flip'
              }
            ]
          },
          {
            id: 'v2',
            title: 'Chapter 2: Consumed by the Dark',
            visual: 'assets/valeria.jpg',
            speaker: 'Arch-Mage Valeria',
            characterMood: '🔥 Fever Pitch (Extreme 18+)',
            narrative: `Her lips crash into yours with pure, untamed hunger. Her hands grasp at your clothes, shedding all restraint. The room spins in a blaze of purple sparks and heavy breaths.`,
            dialogue: `"God, you feel intoxicating... Don't stop. Take me right here."`,
            choices: [
              {
                text: "*Surrender to raw passion in direct 18+ chat*",
                action: 'switch_to_chat',
                characterId: 'valeria'
              }
            ]
          }
        ]
      },
      hinglish: {
        title: 'Valeria: Dark Velvet Desires (काली रात का नशा)',
        chapters: [
          {
            id: 'v1',
            title: 'Chapter 1: Madhosh Raat Ka Jaadu',
            visual: 'assets/sanctum.jpg',
            speaker: 'Arch-Mage Valeria',
            characterMood: 'Seductive & Dangerous',
            narrative: `Valeria kaale velvet ke bistar par aaram se baithi hui hai, uski dress chaandni raat mein chamak rahi hai. Uski neeli-baingani aankhein tumhe bina palke jhapkaye dekh rahi hain.\n\n"Tum mere jaadu se bachkar yahan tak aa gaye," wo dheeemi, kaatil aawaz mein kehti hai. "Ab aao aur wo pao jiske liye tum yahan tadap rahe the."`,
            dialogue: `"Paas aao jaan... mujhe mehsus karne do ki tumhara dil kitni tezi se dhadak raha hai."`,
            choices: [
              {
                text: "*Uske paas baith kar uske haathon ko choomo* 'Valeria... main sirf tumhara hoon.'",
                nextChapterId: 'v2',
                deltaAffection: +20,
                deltaTension: +25,
                tone: 'Deewana & Sensual'
              },
              {
                text: "*Uski kamar pakad kar use apni godd mein kheencho* 'Aaj raat tum mujh par nahi, main tum par raaj karunga.'",
                nextChapterId: 'v2',
                deltaAffection: +18,
                deltaTension: +28,
                tone: 'Dominant & Bold'
              }
            ]
          },
          {
            id: 'v2',
            title: 'Chapter 2: Junoon Ka Samundar',
            visual: 'assets/valeria.jpg',
            speaker: 'Arch-Mage Valeria',
            characterMood: '🔥 Fever Pitch (Extreme 18+)',
            narrative: `Valeria ki saansein tez ho jati hain. Uske nakhun tumhari chhati par gadte hain aur wo bina kisi rukawat ke apne honth tumhare honthon par rakh deti hai. Har boundary toot jati hai.`,
            dialogue: `"Tum mujhe pagal kar rahe ho... ab aur intazar nahi hota. Mujhe abhi apna banao."`,
            choices: [
              {
                text: "*Direct 18+ Uncensored Chat mein roleplay continue karo*",
                action: 'switch_to_chat',
                characterId: 'valeria'
              }
            ]
          }
        ]
      },
      punjabi: {
        title: 'ਵਾਲੇਰੀਆ: ਹੁਸਨ ਤੇ ਜਾਦੂ ਦਾ ਕਹਿਰ',
        chapters: [
          {
            id: 'v1',
            title: 'ਕਾਂਡ ੧: ਕਾਲੀ ਰਾਤ ਦਾ ਨਸ਼ਾ',
            visual: 'assets/sanctum.jpg',
            speaker: 'ਵਾਲੇਰੀਆ ਵੇਨ',
            characterMood: 'ਮਦਹੋਸ਼ ਤੇ ਕਾਤਲਾਨਾ',
            narrative: `ਵਾਲੇਰੀਆ ਆਪਣੇ ਮਹਿਲ ਵਿੱਚ ਮਖ਼ਮਲੀ ਸੋਫ਼ੇ 'ਤੇ ਬੈਠੀ ਤੁਹਾਨੂੰ ਵੇਖਦੀ ਆ। ਉਸਦੀਆਂ ਨਸ਼ੀਲੀਆਂ ਅੱਖਾਂ ਤੁਹਾਡੇ ਜਿਸਮ ਨੂੰ ਤਾੜਦੀਆਂ ਨੇ।\n\n"ਤੂੰ ਮੇਰੇ ਜਾਦੂ ਨੂੰ ਚੀਰ ਕੇ ਮੇਰੇ ਕੋਲ ਪਹੁੰਚ ਗਿਆ," ਉਹ ਮੱਠੀ ਜਿਹੀ ਆਵਾਜ਼ ਵਿੱਚ ਕਹਿੰਦੀ ਏ। "ਹੁਣ ਆ ਨੇੜੇ ਤੇ ਵੇਖ ਮੇਰੇ ਹੁਸਨ ਦਾ ਨਸ਼ਾ।"`,
            dialogue: `"ਨੇੜੇ ਆ, ਸੁਣਨ ਦੇ ਮੈਨੂੰ ਤੇਰੇ ਦਿਲ ਦੀ ਧੜਕਣ।"`,
            choices: [
              {
                text: "*ਉਸਦੇ ਪੈਰਾਂ ਕੋਲ ਬੈਠ ਕੇ ਉਸਦਾ ਹੱਥ ਚੁੰਮੋ* 'ਵਾਲੇਰੀਆ, ਮੈਂ ਤੇਰਾ ਗ਼ੁਲਾਮ ਬਣਨ ਨੂੰ ਤਿਆਰ ਆਂ।'",
                nextChapterId: 'v2',
                deltaAffection: +20,
                deltaTension: +25,
                tone: 'ਪਿਆਰ ਵਿੱਚ ਸਮਰਪਣ'
              },
              {
                text: "*ਉਸਦਾ ਲੱਕ ਫੜ ਕੇ ਆਪਣੇ ਵੱਲ ਖਿੱਚੋ* 'ਅੱਜ ਦੀ ਰਾਤ ਮੇਰੀ ਮਰਜ਼ੀ ਚੱਲੇਗੀ!'",
                nextChapterId: 'v2',
                deltaAffection: +18,
                deltaTension: +28,
                tone: 'ਰੋਹਬਦਾਰ ਪਿਆਰ'
              }
            ]
          },
          {
            id: 'v2',
            title: 'ਕਾਂਡ ੨: ਬੇਕਾਬੂ ਇਸ਼ਕ',
            visual: 'assets/valeria.jpg',
            speaker: 'ਵਾਲੇਰੀਆ ਵੇਨ',
            characterMood: '🔥 ਬੇਕਾਬੂ ਇਸ਼ਕ (Extreme 18+)',
            narrative: `ਉਹ ਆਪਣੀਆਂ ਨਰਮ ਬਾਹਾਂ ਤੁਹਾਡੇ ਗਲ 'ਚ ਪਾ ਦਿੰਦੀ ਏ। ਉਸਦੇ ਬੁੱਲ੍ਹ ਤੁਹਾਡੇ ਬੁੱਲ੍ਹਾਂ ਨਾਲ ਮਿਲਦੇ ਨੇ ਤੇ ਸਾਰੀ ਦੁਨੀਆ ਧੁੰਦਲੀ ਹੋ ਜਾਂਦੀ ਏ।`,
            dialogue: `"ਹਾਏ ਰੱਬਾ... ਤੂੰ ਤਾਂ ਮੈਨੂੰ ਕਮਲੀ ਕਰ ਦਿੱਤਾ ਏ! ਹੁਣ ਹੋਰ ਦੂਰੀ ਨਾ ਰੱਖ।"`,
            choices: [
              {
                text: "*18+ ਚੈਟ ਵਿੱਚ ਰੋਲਪਲੇਅ ਜਾਰੀ ਰੱਖੋ*",
                action: 'switch_to_chat',
                characterId: 'valeria'
              }
            ]
          }
        ]
      }
    }
  },
  ...KAVANA_STORIES_CATALOG
];

/**
 * Detect language of user message with high precision
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'en';
  const t = text.toLowerCase();
  
  // 1. Punjabi Gurmukhi script detection
  if (/[\u0A00-\u0A7F]/.test(text)) {
    return 'punjabi_gurmukhi';
  }
  // 2. Hindi Devanagari script detection
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hindi';
  }
  // 3. Urdu script detection
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'urdu';
  }
  // 4. Punjabi Roman keywords
  if (/\b(ki|kivein|kiven|sohni|sohna|tu|tusi|tussi|tere|meri|changa|changi|jaaneman|kol|aaja|ve|oye|jatt|jatti|yaara|paa|lai|aundi|aunde|rehnde|haye|rabba|kamli|kamle|galwakdi|gutt|chumm|chumma|dasso|dass|vich|ch)\b/i.test(t)) {
    return 'punjabi';
  }
  // 5. Extensive Hinglish keywords & grammar markers (filtering English homographs like 'the', 'to')
  if (/\b(kya|kyun|kyu|kaise|kaisi|kaisa|batao|bata|bataiye|tum|tumhara|tumhari|tumhare|tumhe|tumhein|mujhe|mujhko|mera|meri|mere|main|mai|mein|hum|humein|humko|aao|aaye|aaya|aayi|jao|jaaye|jaana|karo|karna|karta|karti|karte|nahi|nahin|haan|han|suno|sun|sunona|dekh|dekho|dekhiye|kuch|kaha|apna|apne|apni|saath|yahan|wahan|idhar|udhar|ab|kab|tab|jab|dil|pyar|pyaar|ishq|mohabbat|jaan|jaaneman|bhai|bhaiya|bhaisaab|yaar|dost|achha|accha|theek|sahi|baat|baatein|chalo|chal|chalna|raat|kareeb|paas|chhod|chhor|mat|bistar|deewar|chhati|gardan|honth|hoth|rok|hadd|bawaal|shuru|khatam|matlab|samjhe|samjha|samjhi|bhejo|lao|rakh|rakho|rakhna|bol|bolo|chahiye|hoga|hogi|honge|hai|hain|tha|thi|bhi|toh|yeh|woh|kaun|kisne|kisko|kise|isse|usse|itna|itni|itne|kitna|kitni|kitne|chup|pagal|deewana|deewani|khubsoorat|khoobsurat|goli|dhandha|ilaaj|hisaab)\b/i.test(t)) {
    return 'hinglish';
  }
  
  return 'en';
}

/**
 * Intelligent Multilingual 18+ Uncensored Chat Response Generator
 * Generates natural responses in English, Hinglish, Punjabi (Gurmukhi & Roman), and Hindi
 */
export function generateMultilingualReply(characterId, playerMessage, activeLang = 'en', state = {}) {
  const char = CHARACTERS[characterId] || CHARACTERS.kabir;
  const detected = detectLanguage(playerMessage);
  const langToUse = (detected !== 'en') ? detected : activeLang;

  const msgLower = playerMessage.toLowerCase();
  const isTouch = /touch|kiss|caress|embrace|lips|body|hand|skin|thigh|chest|whisper|chhoo|gale|pyaar|pakad|baahon|galwakdi|chumm|chumma/i.test(msgLower);
  const isBold = /conquer|strip|take|mine|command|obey|undress|push|pin|grip|hadd|rok|bistar|kapde|chhor|chhad/i.test(msgLower);
  const isIntimate = /love|crave|desire|want you|need you|closer|bed|sheets|night|jaan|jaaneman|ishq|deewana|kamli|sohni/i.test(msgLower);

  let affDelta = 5;
  let tensDelta = 6;
  if (isTouch) { affDelta += 8; tensDelta += 10; }
  if (isBold) { affDelta += 6; tensDelta += 12; }
  if (isIntimate) { affDelta += 12; tensDelta += 8; }

  const newAff = Math.min(100, Math.max(0, (state.affection || char.baseAffection) + affDelta));
  const newTens = Math.min(100, Math.max(0, (state.tension || char.baseTension) + tensDelta));

  let intimacyLevel = '🔥 Fever Pitch (Extreme 18+)';
  if (newAff < 60 && newTens < 70) intimacyLevel = '⚡ High Sexual Tension';
  else if (newAff >= 80 && newTens >= 80) intimacyLevel = '💋 Pure Sensual Ecstasy (18+)';

  let replyText = '';

  // 1. KABIR (Desi Mafia Billionaire)
  if (characterId === 'kabir') {
    if (langToUse === 'punjabi_gurmukhi' || langToUse === 'punjabi') {
      if (isTouch) {
        replyText = `*ਕਬੀਰ ਦੀਆਂ ਅੱਖਾਂ ਵਿੱਚ ਇਸ਼ਕ ਦੀ ਲਾਟ ਬਲ ਉੱਠਦੀ ਏ। ਉਹ ਤੁਹਾਡਾ ਲੱਕ ਫੜ ਕੇ ਤੁਹਾਨੂੰ ਆਪਣੇ ਸੀਨੇ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਘੁੱਟ ਲੈਂਦਾ ਏ, ਉਸਦੇ ਬੁੱਲ੍ਹ ਤੁਹਾਡੀ ਧੌਣ 'ਤੇ ਲੱਗਦੇ ਨੇ।* "ਤੇਰਾ ਛੋਹ ਮੈਨੂੰ ਪਾਗਲ ਕਰ ਰਿਹਾ ਏ, ਕਮਲੀਏ... ਅੱਜ ਦੀ ਰਾਤ ਮੈਂ ਤੈਨੂੰ ਕਿਸੇ ਕੀਮਤ 'ਤੇ ਆਪਣੇ ਤੋਂ ਦੂਰ ਨਹੀਂ ਹੋਣ ਦੇਣਾ। ਚੁੰਮ ਮੈਨੂੰ ਹੋਰ ਗੂੜ੍ਹਾ!"`;
      } else if (isBold) {
        replyText = `*ਕਬੀਰ ਇੱਕ ਮਸਤਾਨਾ ਠਹਾਕਾ ਲਾਉਂਦਾ ਏ ਤੇ ਤੁਹਾਨੂੰ ਕੰਧ ਨਾਲ ਲਾ ਕੇ ਖੜ੍ਹਾ ਕਰ ਦਿੰਦਾ ਏ। ਉਸਦੀਆਂ ਭੂਰੀਆਂ ਅੱਖਾਂ ਸਿੱਧੀਆਂ ਤੁਹਾਡੇ ਅੰਦਰ ਝਾਕਦੀਆਂ ਨੇ।* "ਕਬੀਰ ਨੂੰ ਹੁਕਮ ਦੇਣ ਵਾਲੀ ਅੱਜ ਤੱਕ ਕੋਈ ਨਹੀਂ ਜੰਮੀ, ਪਰ ਤੇਰਾ ਇਹ ਨਖ਼ਰਾ ਮੇਰਾ ਕਾਲਜਾ ਕੱਢ ਲੈਂਦਾ ਏ! ਆ ਵੇਖ, ਮੈਂ ਤੈਨੂੰ ਕਿਵੇਂ ਪਿਆਰ ਕਰਦਾ ਆਂ।"`;
      } else {
        replyText = `*ਕਬੀਰ ਆਪਣੀ ਸਿਲਕ ਦੀ ਕਮੀਜ਼ ਦੇ ਬਟਨ ਖੋਲ੍ਹਦਾ ਏ ਤੇ ਤੁਹਾਡਾ ਹੱਥ ਆਪਣੀ ਧੜਕਦੀ ਛਾਤੀ 'ਤੇ ਰੱਖ ਦਿੰਦਾ ਏ।* "ਸੁਣਦੀ ਏਂ ਇਹ ਧੜਕਣ? ਇਹ ਸਿਰਫ਼ ਤੇਰੇ ਨਾਂ 'ਤੇ ਚੱਲਦੀ ਏ। ਦੱਸ, ਅੱਜ ਰਾਤ ਕੀ ਹੁਕਮ ਆ ਮੇਰੀ ਰਾਣੀ ਦਾ?"`;
      }
    } else if (langToUse === 'punjabi_roman') {
      if (isTouch) {
        replyText = `*Kabir diyan akhan 'ch junoon bhar janda ae. Oh tuhanu lakk ton phad ke seene naal la lenda ae.* "Haye ni teri khushboo... mainu pagal kar ditta e tu kamliye! Hor nere aa, aj di raat koi parda nahi rehna chahida."`;
      } else if (isBold) {
        replyText = `*Kabir de chehre te ik rohbdaar hasi aundi ae. Oh tuhadi gutt phad ke apne wal khichda ae.* "Mainu challenge na kar, sohniye! Tu jandi nahi Kabir Oberoi jadon pyar karda ae taan jaan kadd lenda ae. Aaja nere!"`;
      } else {
        replyText = `*Kabir tuhade kohl aake tuhade bullan te ungli pherda ae.* "Tere bina ik pal vi chain nahi aunda. Das ki chahidi ae tenu aj raat?"`;
      }
    } else if (langToUse === 'hinglish') {
      if (isTouch) {
        replyText = `*Kabir ki saansein ekdum garam ho jati hain jab tumhara haath uski chhati par lagta hai. Wo tumhe apni baahon mein kas ke kheenchte hue tumhari gardan par kiss karta hai.* "Uff... tumhara ye touch mere andar aag laga raha hai, jaaneman. Aaj raat Kabir Oberoi tumhara ghulam banne ko taiyaar hai. Aur kareeb aao."`;
      } else if (isBold) {
        replyText = `*Kabir ek dangerous smile deta hai aur tumhe deewar ke saath pin karke tumhare honthon ke bilkul kareeb aa jata hai.* "Itna ghamand? Mujhe pasand hai jab koi sher se aankhein milata hai. Par yaad rakhna, main jo cheez chahoon, use haasil karke rehta hoon... aur aaj raat mujhe sirf tum chahiye."`;
      } else {
        replyText = `*Kabir apni shirt utaar ke side mein phekta hai aur apni intense aankhon se tumhe dekhta hai.* "Tumhe dekh kar control mein rehna mere bas ki baat nahi rahi. Jo karna hai abhi karo... don't make me wait."`;
      }
    } else if (langToUse === 'hindi') {
      replyText = `*कबीर आपकी कमर थामकर आपको अपने सीने से लगा लेता है, उसकी आँखें दीवानेपन से भरी हैं।* "तुम्हारे इस हुस्न और इस अदा ने कबीर ओबेरॉय को बेबस कर दिया है। आज रात कोई बंदिश नहीं होगी हमारे बीच। अपने होंठ मेरे होंठों पर रख दो।"`;
    } else {
      // English
      replyText = `*Kabir pulls you roughly against his muscular chest, his hands possessively gripping your hips as his eyes flash with raw hunger.* "You play a dangerous game with me, sweetheart. Now look at me... you're not leaving this room until I've tasted every inch of you."`;
    }
  } 
  // 2. VALERIA
  else if (characterId === 'valeria') {
    if (langToUse === 'punjabi_gurmukhi' || langToUse === 'punjabi') {
      replyText = `*ਵਾਲੇਰੀਆ ਆਪਣੀਆਂ ਜਾਦੂਈ ਨੀਲੀਆਂ ਅੱਖਾਂ ਨਾਲ ਤੁਹਾਨੂੰ ਵੇਖਦੀ ਹੋਈ ਆਪਣੇ ਵਾਲ ਪਿੱਛੇ ਕਰਦੀ ਏ ਤੇ ਤੁਹਾਡੇ ਬੁੱਲ੍ਹਾਂ ਨੂੰ ਛੂੰਹਦੀ ਏ।* "ਹਾਏ ਵੇ ਤੇਰਾ ਇਹ ਹੌਸਲਾ! ਮੇਰੇ ਜਾਦੂ ਨਾਲੋਂ ਵੀ ਤੇਰੇ ਛੋਹ ਦੀ ਗਰਮੀ ਵੱਧ ਆ। ਹੋਰ ਨੇੜੇ ਆ, ਅੱਜ ਸਾਰੀ ਰਾਤ ਅਸੀਂ ਇੰਝ ਹੀ ਰਹਿਣਾ ਏ।"`;
    } else if (langToUse === 'hinglish') {
      replyText = `*Valeria ki saansein tez ho jati hain jab tum uski kamar ko pakadte ho. Wo madhosh hokar tumhare kaan mein phusphusati hai.* "Tumhara ye haath jab meri kamar par lagta hai na, toh mera saara jaadu fika pad jata hai... Kiss me right now, darling. Dont tease me anymore."`;
    } else if (langToUse === 'punjabi_roman') {
      replyText = `*Valeria sultry smile dindi ae te tuhade seene te hath rakhdi ae.* "Tenu vekh ke dil di dhadkan vad jandi ae yaara. Aj raat mainu apne pyar di qaid 'ch rakh le."`;
    } else {
      replyText = `*Valeria's breath stutters with pleasure as your hands make contact. She arches her body into yours, tangling her fingers in your hair.* "God, you feel incredible... Don't hold back. Kiss me until neither of us can breathe."`;
    }
  } 
  // 3. LUCIAN
  else {
    if (langToUse === 'punjabi_gurmukhi' || langToUse === 'punjabi') {
      replyText = `*ਲੂਸੀਅਨ ਆਪਣੇ ਸ਼ਾਹੀ ਕੋਟ ਨੂੰ ਲਾਹ ਕੇ ਸੁੱਟਦਾ ਏ ਤੇ ਤੁਹਾਨੂੰ ਘੁੱਟ ਕੇ ਜੱਫੀ ਪਾ ਲੈਂਦਾ ਏ।* "ਮੈਂ ਤਖ਼ਤ ਤੇ ਤਾਜ ਸਭ ਭੁੱਲ ਗਿਆ ਹਾਂ ਤੇਰੇ ਲਈ। ਅੱਜ ਰਾਤ ਸਿਰਫ਼ ਤੂੰ ਤੇ ਮੈਂ ਆਂ।"`;
    } else if (langToUse === 'hinglish') {
      replyText = `*Lucian ek hot smirk ke sath tumhe bed par push karta hai aur tumhare upar jhukta hai.* "Tumne socha tha main tumhe aasaani se chhod dunga? Tum meri sabse khubsoorat weakness ho, jaaneman."`;
    } else {
      replyText = `*Lucian grabs your waist firmly, pulling you flush against his chest.* "Look at you taking charge. I like someone who knows how to handle a rogue prince... Now let me show you how I take what's mine."`;
    }
  }

  return {
    replyText,
    affection: newAff,
    tension: newTens,
    intimacyLevel
  };
}

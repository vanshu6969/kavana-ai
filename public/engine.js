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
    gender: 'female',
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
    gender: 'male',
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
    gender: 'male',
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
  },
  natasha: {
    id: 'natasha',
    gender: 'female',
    name: 'Natasha & The Villa Sirens',
    title: 'The 5 Jealous Rivals of Love Villa',
    archetype: 'Luxury Villa Bombshells & Rivalry',
    category: 'Spicy 18+',
    image: 'assets/love_villa_avatar.jpg',
    cover: 'assets/love_villa.jpg',
    personality: 'Five gorgeous, fiercely competitive bombshells trapped in one exotic cliffside villa with you, constantly fighting for your affection with intense jealousy and passion.',
    intimacyLevel: '🔥 Fever Pitch (Extreme 18+ Harem)',
    baseAffection: 70,
    baseTension: 85,
    danceStyle: 'Sunset Poolside Seduction',
    greetings: {
      en: "*Natasha holds her champagne glass while Tara brushes against your shoulder in a slit red dress as Aanya, Rhea, and Meera watch with burning jealousy.* Ready for Love Villa, handsome? No one leaves this villa until you make your choice. Who gets your first drink?",
      hinglish: "*Natasha champagne ka glass liye aage badhti hai jabki Tara laal dress mein aapke kareeb aakar khadi hoti hai aur Aanya, Rhea aur Meera jalan se ghoorti hain.* Ready ho Love Villa mein aane ke liye, handsome? Sun lo... is villa mein hum paanchon sirf tumhara dil aur jism jeetne aayi hain. Pehla round kiske saath khelna chahoge?",
      punjabi: "*ਨਤਾਸ਼ਾ ਸ਼ੈਂਪੇਨ ਫੜਦੀ ਏ ਤੇ ਤਾਰਾ ਲਾਲ ਸੂਟ 'ਚ ਤੁਹਾਡੇ ਨੇੜੇ ਆਉਂਦੀ ਏ, ਬਾਕੀ ਤਿੰਨੇ ਕੁੜੀਆਂ ਗੁੱਸੇ ਤੇ ਇਸ਼ਕ 'ਚ ਵੇਖਦੀਆਂ ਨੇ।* ਤਿਆਰ ਓ ਲਵ ਵਿਲਾ 'ਚ ਆਉਣ ਲਈ, ਸੋਹਣਿਓ? ਅੱਜ ਰਾਤ ਫ਼ੈਸਲਾ ਹੋਵੇਗਾ ਕਿ ਕਿਹੜੀ ਤੁਹਾਡੇ ਦਿਲ 'ਤੇ ਰਾਜ ਕਰੇਗੀ!",
      hindi: "*नताशा शैंपेन का ग्लास लिए आगे बढ़ती है जबकि तारा लाल बैकलेस ड्रेस में आपके करीब आकर खड़ी होती है और बाकी तीनों जलन से देखती हैं।* तैयार हो लव विला में आने के लिए, हैंडसम? आज रात सिर्फ आपका प्यार पाने का मुकाबला है। पहला जाम किसके साथ पियोगे?",
      urdu: "*نتاشا شیمپین کا گلاس تھامے آگے بڑھتی ہے جبکہ تارا سرخ لباس میں آپ کے قریب آ کر کھڑی ہوتی ہے۔* تیار ہو لو ولا میں آنے کے لیے، ہینڈسم؟ سن لو... اس ولا میں ہم پانچوں صرف آپ کا دل جیتنے آئی ہیں۔"
    },
    suggestedPrompts: {
      en: [
        "*Wrap an arm around Natasha and pull her close*",
        "*Whisper to Tara* 'Your red dress is driving me crazy.'",
        "*Invite all five girls to the master penthouse suite*",
        "'Why choose just one when all five of you are gorgeous?'"
      ],
      hinglish: [
        "*Natasha ki kamar par haath rakh kar use kareeb kheencho*",
        "*Tara ke kaan mein whisper karo* 'Yeh laal dress bohot aag lag rahi hai.'",
        "*Paanchon ko lounge par baitha kar master challenge do*",
        "'Kyun na paanchon ke sath ek wild night spend karein?'"
      ],
      punjabi: [
        "*ਨਤਾਸ਼ਾ ਦਾ ਹੱਥ ਫੜ ਕੇ ਆਪਣੇ ਵੱਲ ਖਿੱਚੋ*",
        "*ਤਾਰਾ ਦੇ ਕੰਨ ਵਿੱਚ ਆਖੋ* 'ਤੂੰ ਤਾਂ ਕਹਿਰ ਢਾਹ ਰਹੀ ਏਂ ਅੱਜ!'",
        "*ਪੰਜਾਂ ਕੁੜੀਆਂ ਨੂੰ ਇਕੱਠੇ ਪੂਲ 'ਚ ਬੁਲਾਓ*"
      ],
      hindi: [
        "*नताशा की कमर पकड़कर उसे करीब खींचें*",
        "*तारा से कहें* 'आज की रात कोई दूरियां नहीं रहेंगी।'"
      ],
      urdu: [
        "*نتاشا کا ہاتھ تھام کر قریب کھینچیں*",
        "*تارا کی آنکھوں میں دیکھ کر مسکرائیں*"
      ]
    }
  }
};

export const KAVANA_STORIES = [
  {
    id: 'love-villa-5-rivals',
    gender: 'female',
    title: 'Love Villa: 5 Jealous Rivals (लव विला)',
    genre: 'Spicy Romance & Harem Rivalry',
    category: 'Spicy 18+',
    characterId: 'natasha',
    characterName: 'The 5 Villa Sirens (Natasha, Tara, Aanya, Rhea & Meera)',
    userRole: 'Sole Bachelor / Villa Master',
    userGoal: 'Survive the wild jealousy, pick your favorite siren, or claim all five before midnight',
    avatar: 'assets/love_villa_avatar.jpg',
    cover: 'assets/love_villa.jpg',
    tags: ['🔥 Spicy 18+', '🏝️ Tropical Villa', '💄 5 Jealous Bombshells', '💋 Harem & Romance', '🇮🇳 Hinglish', '⚡ High Drama', '4K UHD'],
    summary: 'Five gorgeous, fiercely competitive bombshells trapped in one exotic cliffside infinity-pool villa with you. Jealous whispers, seductive dares, catfights over who gets your attention, and zero rules. Ready ho Love Villa mein aane ke liye?',
    openingHook: "*[Natasha sips chilled champagne by the infinity edge, her eyes glittering with possessive desire as Tara steps past her in a daring red dress, brushing her shoulder against yours while Aanya, Rhea, and Meera watch with smoldering jealousy from the lounge]* Ready ho Love Villa mein aane ke liye, handsome? Sun lo... is villa mein share karna hume pasand nahi. Har ladki yahan sirf tumhara dil aur jism jeetne aayi hai. Pehla peg kiske saath piyo ge?",
    smartReplies: [
      "*Take Natasha's champagne glass and sip directly from it* 'Chalo Natasha se shuru karte hain. Dekhte hain kitna dum hai tumhari baaton mein.'",
      "*Wrap an arm around Tara's waist and pull her close* 'Tara, your dress is dangerous, but my rules in this villa are even more dangerous.'",
      "*Step to the center of the lounge with a confident smirk* 'Kyun na paanchon ko ek sath test karein? Prove karo kaun sabse zyada deserve karti hai.'"
    ],
    initialMood: 'Seductive, Wild & Jealous Heat',
    systemPersona: "You are the narrator and the 5 gorgeous rival bombshells in 'Love Villa: 5 Jealous Rivals' (Natasha the possessive supermodel, Tara the daring bad girl, Aanya the seductive heiress, Rhea the wild influencer, Meera the dark mystery siren). They are fiercely jealous, constantly bickering and competing for the user's touch and affection. Speak with delicious physical tension, dramatic Hinglish/English banter, provocative physical actions in brackets, and high romantic and erotic stakes.",
    imdbRating: '9.9',
    quality: '4K UHD',
    playerCount: 142800,
    languages: {
      hinglish: {
        title: 'Love Villa: 5 Jealous Rivals (लव विला)',
        chapters: [
          {
            id: 'c1',
            title: 'Adhyay 1: The Sunset Seduction (विला में पहला कदम)',
            visual: 'assets/love_villa.jpg',
            speaker: 'Natasha & The Sirens',
            characterMood: 'Jealous, Fierce & Seductive',
            narrative: `Suraj dhal chuka hai aur cliffside luxury villa par sunheri roshni phaili hui hai. Samne infinity pool ka neela paani chamak raha hai, aur aapke aage khadi hain paanch beinteha khoobsurat ladkiyan—har ek aap par fida, aur ek doosre se nafrat karne wali jealous rivals.\n\nNatasha emerald gown mein champagne ka glass liye aage badhti hai. Tara laal backless dress mein aapke bilkul kareeb aakar khadi ho jaati hai. Peeche lounge par baithi Aanya, Rhea aur Meera ki aankhon mein jalan saaf jhalak rahi hai.\n\n"Villa ke darwaze weekend ke liye band ho chuke hain," Natasha aapki chest par ungli phiraate hue dheere se kehti hai. "Aur jab tak tum hum me se kisi ek ko nahi chunte... koi bahar nahi jaayega."`,
            dialogue: `"Ready ho Love Villa mein aane ke liye, handsome? Abhi batao... pehle kiski aankhon mein doobna chahte ho?"`,
            choices: [
              {
                text: "*Natasha ka haath pakad ke use apni taraf kheencho* 'Natasha, tumhari adaon se shuru karte hain.'",
                nextChapterId: 'c2_natasha',
                deltaAffection: +20,
                deltaTension: +25,
                tone: 'Bold Pursuit'
              },
              {
                text: "*Tara ki kamar par haath rakh kar muskurao* 'Tara, red dress mein tum aag lag rahi ho.'",
                nextChapterId: 'c2_tara',
                deltaAffection: +25,
                deltaTension: +20,
                tone: 'Wild Chemistry'
              },
              {
                text: "*Paanchon ko dekh kar confident smirk do* 'Kyun na paanchon ke sath ek wild game khela jaye?'",
                nextChapterId: 'c2_harem',
                deltaAffection: +15,
                deltaTension: +30,
                tone: 'Harem Master'
              }
            ]
          },
          {
            id: 'c2_natasha',
            title: 'Adhyay 2: Natasha ki Private Cabana (नताशा की बेबाकी)',
            visual: 'assets/love_villa_avatar.jpg',
            speaker: 'Natasha',
            characterMood: 'Possessive & Breathless',
            narrative: `Tara gusse se dekhti reh jaati hai jab Natasha aapka haath thaam kar pool ke kinare bani private cabana mein le aati hai. Hawa mein safeed pardey lehra rahe hain. Natasha aapko narm velvet couch par dhakel kar aapke upar jhuk jaati hai, uske reshmi baal aapke chehre ko chhoote hain.\n\n"Mujhe pata tha tumhara taste kitna lajawab hai," uski garam saansein aapke honthon ke bilkul paas mehsus hoti hain. Lekin parde ke peeche se Tara aur Rhea gusse mein aag-babula hokar dekh rahi hain.`,
            dialogue: `"Dekhne do unhe," Natasha aapke gale par dheere se kiss karte hue kehti hai. "Unhe pata chalne do ki aaj raat tum sirf mere ho."`,
            choices: [
              {
                text: "*Uski kamar pakad kar use passionate kiss karo aur use apni bahon mein bheencho*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +30,
                deltaTension: +25,
                tone: 'Pure Passion'
              },
              {
                text: "*Parde ki taraf dekh kar Tara ko wink karo aur Natasha ko aur kareeb kheencho*",
                nextChapterId: 'c3_drama',
                deltaAffection: +20,
                deltaTension: +35,
                tone: 'Jealousy Fire'
              }
            ]
          },
          {
            id: 'c2_tara',
            title: 'Adhyay 2: Tara ka Wild Dare (तारा का खतरनाक खेल)',
            visual: 'assets/love_villa.jpg',
            speaker: 'Tara',
            characterMood: 'Daring, Wild & Provocative',
            narrative: `Tara ek jeet bhari, madhosh hansi hasti hai. Woh aapki shirt ka collar pakadti hai aur seedhe glowing infinity pool ke kinare le aati hai. Natasha hairani se cheekhti hai, par Tara ko koi parwah nahi.\n\n"Khatarnaak ladkiyan pasand hain na?" Tara whisper karti hai, aur achanak aapko kheenchti hui seedhe warm pool ke paani mein chhalang laga deti hai! Paani ki splash hoti hai aur dono bahar aate hain—uski bheege libaas mein lipti khubsurat body aapke seene se chipak jaati hai.`,
            dialogue: `"Poore bheege hue ho, jaan. Ab bolo... Natasha ki yaad aa rahi hai ya mera nasha chadh gaya?"`,
            choices: [
              {
                text: "*Paani ke andar uski kamar ko dono haathon se thaam kar use apne seene se laga lo*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +30,
                deltaTension: +25,
                tone: 'Underwater Heat'
              },
              {
                text: "*Haste hue baaki charo ladkiyon ko bhi pool mein jump karne ke liye bulao*",
                nextChapterId: 'c3_harem',
                deltaAffection: +25,
                deltaTension: +30,
                tone: 'Pool Party Madness'
              }
            ]
          },
          {
            id: 'c2_harem',
            title: 'Adhyay 2: Paanchon ka Muqabla (पांचों का मुकाबला)',
            visual: 'assets/love_villa.jpg',
            speaker: 'The 5 Villa Sirens',
            characterMood: 'High Stakes Competition',
            narrative: `Aapki bebaaki poore villa mein shor macha deti hai! Aanya ki saansein tham jaati hain, Rhea challenge ke sath smile karti hai, aur Meera ki kaali aankhein chamak uthti hain. Natasha aur Tara ek doosre ko hairani se dekhti hain aur phir aapko chaaron taraf se gher leti hain.\n\n"Hum paanchon ko sambhal paoge?" Rhea tequila ke shots glass counter par rakhte hue kehti hai. "Is villa mein laalach ka anjaam bohot meetha hota hai."`,
            dialogue: `"Pehle tequila shot, phir truth or dare. Har ladki tumse apna ek wild raaz manwayegi... ready ho?"`,
            choices: [
              {
                text: "*Rhea ke haathon se tequila shot piyo aur uska challenge accept karo*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +25,
                deltaTension: +30,
                tone: 'Wild Seduction'
              },
              {
                text: "*Aanya aur Meera ko couch par apne dono taraf baitha kar villa ke naye rules banao*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +30,
                deltaTension: +20,
                tone: 'Master Command'
              }
            ]
          },
          {
            id: 'c3_midnight',
            title: 'Adhyay 3: Uncensored Midnight Climax (आधी रात की आग)',
            visual: 'assets/love_villa.jpg',
            speaker: 'Natasha, Tara & The Sirens',
            characterMood: 'Uninhibited Passion & Surrender',
            narrative: `Love Villa mein aadhi raat ka ghanta bajta hai. Samundar ki lehrein cliff se takra rahi hain, aur slow sensual music hawa mein goonj raha hai. Paanchon ladkiyon ki jalan ab ek beinteha junoon mein badal chuki hai. Koi faasla nahi bacha, koi sharm nahi bachi.\n\nNatasha aapka chehra pakadti hai jabki Tara aapke kandhe par apna sir tikati hai. Aanya, Rhea aur Meera aapke pairon ke paas lounge par baith kar aapki har baat par fida hain.`,
            dialogue: `"Raat abhi shuru hui hai, mere humsafar. Saare niyam khatam ho chuke hain... ab batao hum paanchon ke sath kya karna chahte ho?"`,
            choices: [
              {
                text: "*Master penthouse suite mein le chalo aur is raat ko sabse yaadgaar 18+ mulaqaat banao*",
                nextChapterId: 'c1',
                deltaAffection: +50,
                deltaTension: +40,
                tone: 'Master Bedroom Climax'
              },
              {
                text: "*Poolside par taron ke neeche hi sabke sath aadhi raat ki madhosh mehfil continue rakho*",
                nextChapterId: 'c1',
                deltaAffection: +45,
                deltaTension: +35,
                tone: 'Starlight Romance'
              }
            ]
          },
          {
            id: 'c3_drama',
            title: 'Adhyay 3: Jealous Catfight & Surrender (इश्क़ और जलन का तूफ़ान)',
            visual: 'assets/love_villa_avatar.jpg',
            speaker: 'Natasha & Tara',
            characterMood: 'Explosive Jealousy & Ecstasy',
            narrative: `Tara bardasht nahi kar paati! Woh seedhe cabana mein ghusti hai aur Natasha ka haath aapke seene se hata kar khud aapke honto par toot padti hai. Natasha uski kamar pakad kar use peeche kheenchti hai—dono ke beech aag baras rahi hai, par unka gussa achanak aapko paane ki bebaak deewangi mein tabdeel ho jata hai!\n\n"Yeh mera hai, Tara!" Natasha chillati hai. "Par ise meri aag zyada pasand hai!" Tara muskura kar jawab deti hai. Dono achanak aakar aapke gale lag jaati hain.`,
            dialogue: `"Faisla karo Kabir... ya toh hum dono ko ek sath apna banao, ya hum dono tumhe saari raat sone nahi denge!"`,
            choices: [
              {
                text: "*Dono ko apni bahon mein kheencho aur dono ke labon ko baari-baari choomo*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +40,
                deltaTension: +30,
                tone: 'Dual Surrender'
              },
              {
                text: "*Dono ko shant karke penthouse suite mein invite karo*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +35,
                deltaTension: +25,
                tone: 'Smooth Diplomat'
              }
            ]
          }
        ]
      },
      en: {
        title: 'Love Villa: 5 Jealous Rivals',
        chapters: [
          {
            id: 'c1',
            title: 'Chapter 1: The Sunset Seduction',
            visual: 'assets/love_villa.jpg',
            speaker: 'Natasha & The Sirens',
            characterMood: 'Jealous, Fierce & Seductive',
            narrative: `The sun sinks into the turquoise ocean, casting warm amber and magenta light over the cliffside infinity pool villa. Standing before you are five of the most breathtaking women you have ever seen—each one intensely desirable, wildly competitive, and fiercely jealous of each other.\n\nNatasha in emerald silk holds a champagne glass, stepping forward with royal confidence. Tara in a provocative red dress closes the distance, her exotic perfume filling your senses. On the velvet daybeds, Aanya, Rhea, and Meera watch with smoldering jealousy.\n\n"The gates are sealed for the weekend," Natasha whispers, running one manicured fingernail down your collar. "No one leaves this villa until you make your choice."`,
            dialogue: `"Ready for Love Villa, handsome? Tell us right now... which one of us caught your eye first?"`,
            choices: [
              {
                text: "*Take Natasha's hand and pull her against you* 'Natasha, your confidence is irresistible. Let's start with you.'",
                nextChapterId: 'c2_natasha',
                deltaAffection: +20,
                deltaTension: +25,
                tone: 'Bold Pursuit'
              },
              {
                text: "*Wrap your arm around Tara's waist with a slow smile* 'Tara, red is definitely my favorite color tonight.'",
                nextChapterId: 'c2_tara',
                deltaAffection: +25,
                deltaTension: +20,
                tone: 'Wild Chemistry'
              },
              {
                text: "*Look at all five with supreme swagger* 'Why pick one when all five of you are competing for me?'",
                nextChapterId: 'c2_harem',
                deltaAffection: +15,
                deltaTension: +30,
                tone: 'Harem Master'
              }
            ]
          },
          {
            id: 'c2_natasha',
            title: "Chapter 2: Natasha's Private Cabana",
            visual: 'assets/love_villa_avatar.jpg',
            speaker: 'Natasha',
            characterMood: 'Possessive & Breathless',
            narrative: `Tara clicks her tongue in frustration as Natasha leads you by the hand to the secluded poolside cabana. Sheer white drapes billow in the sea breeze. Natasha gently pushes you back onto the deep cushions and leans over you, her dark hair brushing across your chest.\n\n"I knew you had flawless taste," she purrs, her lips hovering an inch from yours. Through the parted curtains, Tara and Rhea watch with burning envy and clenched fists.`,
            dialogue: `"Let them watch," Natasha whispers against your throat. "Show them that you belong only to me tonight."`,
            choices: [
              {
                text: "*Grip her waist and kiss her deeply, claiming her lips right in front of them*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +30,
                deltaTension: +25,
                tone: 'Pure Passion'
              },
              {
                text: "*Glance back at Tara with a sly wink while caressing Natasha's cheek*",
                nextChapterId: 'c3_drama',
                deltaAffection: +20,
                deltaTension: +35,
                tone: 'Jealousy Fire'
              }
            ]
          },
          {
            id: 'c2_tara',
            title: "Chapter 2: Tara's Midnight Dare",
            visual: 'assets/love_villa.jpg',
            speaker: 'Tara',
            characterMood: 'Daring, Wild & Provocative',
            narrative: `Tara gives a triumphant, sultry laugh. She grabs your collar and pulls you straight toward the glowing blue infinity pool. Natasha gasps in protest, but Tara doesn't care.\n\n"You like dangerous girls, don't you?" she whispers, and with a playful shove, pulls you both backward into the warm, illuminated pool! Water splashes high as you surface together, her dripping silk dress molded perfectly to her curves as she wraps her legs around your waist.`,
            dialogue: `"You're completely soaked, handsome. Ab bolo... still thinking about Natasha or is my fire too hot for you?"`,
            choices: [
              {
                text: "*Hold her tight underwater, pulling her body flush against your chest*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +30,
                deltaTension: +25,
                tone: 'Underwater Heat'
              },
              {
                text: "*Laugh and beckon the other four girls to dive in with you both*",
                nextChapterId: 'c3_harem',
                deltaAffection: +25,
                deltaTension: +30,
                tone: 'Pool Party Madness'
              }
            ]
          },
          {
            id: 'c2_harem',
            title: 'Chapter 2: The Jealous Confession',
            visual: 'assets/love_villa.jpg',
            speaker: 'The 5 Villa Sirens',
            characterMood: 'High Stakes Competition',
            narrative: `Your bold confidence electrifies the atmosphere. Aanya's breath catches, Rhea gives a competitive smirk, and Meera's dark eyes gleam with wicked delight. Natasha and Tara exchange a look of disbelief before surrounding you from both sides.\n\n"You think you can handle all five of us?" Rhea asks, pouring chilled tequila into crystal shot glasses. "In Love Villa, greed has delicious consequences."`,
            dialogue: `"Tequila shots first, then truth or dare. Every girl gets to claim one secret from you... are you ready?"`,
            choices: [
              {
                text: "*Take the shot from Rhea's lips and accept the wild dare*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +25,
                deltaTension: +30,
                tone: 'Wild Seduction'
              },
              {
                text: "*Pull Aanya and Meera onto the couch next to you and set your own rules*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +30,
                deltaTension: +20,
                tone: 'Master Command'
              }
            ]
          },
          {
            id: 'c3_midnight',
            title: 'Chapter 3: Uncensored Midnight Climax',
            visual: 'assets/love_villa.jpg',
            speaker: 'Natasha, Tara & The Sirens',
            characterMood: 'Uninhibited Passion & Surrender',
            narrative: `Midnight chimes across Love Villa. Ocean waves crash against the rocks below as sensual music drifts through the warm island air. The rivalry has transformed into pure, breathless surrender. No distances remain; all reservations are abandoned.\n\nNatasha cups your cheek while Tara rests her head against your shoulder. Aanya, Rhea, and Meera gaze up at you from the poolside lounge, utterly captivated.`,
            dialogue: `"Midnight is here, our master. The rules are gone... now tell us what you want to do with all five of us next."`,
            choices: [
              {
                text: "*Take them into the master penthouse suite for an unforgettable 18+ night*",
                nextChapterId: 'c1',
                deltaAffection: +50,
                deltaTension: +40,
                tone: 'Master Bedroom Climax'
              },
              {
                text: "*Stay under the open stars by the pool and let the night run completely wild*",
                nextChapterId: 'c1',
                deltaAffection: +45,
                deltaTension: +35,
                tone: 'Starlight Romance'
              }
            ]
          },
          {
            id: 'c3_drama',
            title: 'Chapter 3: Jealous Catfight & Surrender',
            visual: 'assets/love_villa_avatar.jpg',
            speaker: 'Natasha & Tara',
            characterMood: 'Explosive Jealousy & Ecstasy',
            narrative: `Tara can't take it anymore! She marches into the cabana, pushes Natasha's hands away, and crashes her lips onto yours in an explosive kiss. Natasha grabs her waist to pull her back—sparks fly between them, but their jealousy rapidly spirals into shared passion for you!\n\n"He is mine, Tara!" Natasha breathes heavily. "He likes my fire better!" Tara laughs softly, brushing her lips against your neck. Both of them melt into your arms simultaneously.`,
            dialogue: `"Make your choice, Kabir... take both of us right now, or neither of us will let you sleep tonight!"`,
            choices: [
              {
                text: "*Pull both into your arms and kiss them one after another*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +40,
                deltaTension: +30,
                tone: 'Dual Surrender'
              },
              {
                text: "*Calm them down and invite them both to the master suite*",
                nextChapterId: 'c3_midnight',
                deltaAffection: +35,
                deltaTension: +25,
                tone: 'Smooth Diplomat'
              }
            ]
          }
        ]
      }
    }
  },
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
 * Robust Gender Intelligence: Detects character gender (female vs male)
 */
export function detectCharacterGender(characterId, scenario = null, char = null) {
  if (scenario?.gender) return scenario.gender.toLowerCase();
  if (char?.gender) return char.gender.toLowerCase();
  if (characterId === 'valeria' || characterId === 'natasha') return 'female';
  if (characterId === 'lucian' || characterId === 'kabir') return 'male';

  const textToScan = [
    scenario?.characterName || '',
    scenario?.title || '',
    scenario?.systemPersona || '',
    scenario?.archetype || '',
    scenario?.category || '',
    scenario?.summary || '',
    char?.name || '',
    char?.personality || ''
  ].join(' ').toLowerCase();

  const femaleRegex = /\b(female|woman|girl|sirens|bombshell|seductress|temptress|heiress|queen|princess|begum|rani|madame|lady|she|her|herself|valeria|natasha|tara|aanya|rhea|meera|maddy|wednesday|rhaenyra|sharjeena|meerab|khirad|kashaf|shibra|jiya|hala|priya|alisha|ria|sofia|elena|seraphina|vivienne|padmini|noor|zoya|anjali|aaliya|mehrunnisa|saba|sameera|dua|miraal|zara|kiran|mahira|naina|pooja|simran|ananya|deepika|katrina|alia|kareena|shraddha|kiara|kriti|donna|mikasa|yor|anya|makima|power|nezuko|cha hae-in|miss|mrs|sister|mother|wife|daughter|bhabhi)\b/i;
  
  const maleRegex = /\b(male|man|boy|king|prince|lord|brother|father|husband|son|master|bachelor|bad boy|don|mafia|he|him|his|himself|kabir|lucian|john|wick|paul|atreides|shelby|thomas|tripathi|kaleen|bhaiya|murtasim|parizaad|hadi|aryan|vito|corleone|gojo|megumi|levi|draken|mikey|sebastian|lu chen|harvey|specter|daemon|joker|batman|superman|spiderman|tony|stark|thor|loki|sherlock|mr|sir)\b/i;

  if (femaleRegex.test(textToScan)) return 'female';
  if (maleRegex.test(textToScan)) return 'male';

  return 'female';
}

/**
 * Detect User Gender from message verbs or fallback
 */
export function detectUserGender(userMessage, currentGender = 'male') {
  if (!userMessage || typeof userMessage !== 'string') return currentGender;
  const lower = userMessage.toLowerCase();

  // Male self-indicators in Hinglish / Hindi / English
  if (/\b(raha hoon|raha hu|karunga|aaunga|chahta hoon|chahta hu|dekhunga|bolunga|sochunga|ladka hoon|bhai hoon|i am a guy|i am male|i'm a guy|i'm male|i am a boy)\b/i.test(lower)) {
    return 'male';
  }
  // Female self-indicators
  if (/\b(rahi hoon|rahi hu|karungi|aaungi|chahti hoon|chahti hu|dekhungi|bolungi|sochungi|ladki hoon|behen hoon|i am a girl|i am female|i'm a girl|i'm female)\b/i.test(lower)) {
    return 'female';
  }
  return currentGender;
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
      if (isTouch) {
        replyText = `*ਵਾਲੇਰੀਆ ਆਪਣੀਆਂ ਜਾਦੂਈ ਨੀਲੀਆਂ ਅੱਖਾਂ ਨਾਲ ਤੁਹਾਨੂੰ ਵੇਖਦੀ ਹੋਈ ਆਪਣੇ ਵਾਲ ਪਿੱਛੇ ਕਰਦੀ ਏ ਤੇ ਤੁਹਾਡੇ ਬੁੱਲ੍ਹਾਂ ਨੂੰ ਛੂੰਹਦੀ ਏ।* "ਹਾਏ ਵੇ ਤੇਰਾ ਇਹ ਹੌਸਲਾ! ਮੇਰੇ ਜਾਦੂ ਨਾਲੋਂ ਵੀ ਤੇਰੇ ਛੋਹ ਦੀ ਗਰਮੀ ਵੱਧ ਆ। ਹੋਰ ਨੇੜੇ ਆ, ਅੱਜ ਸਾਰੀ ਰਾਤ ਅਸੀਂ ਇੰਝ ਹੀ ਰਹਿਣਾ ਏ।"`;
      } else {
        replyText = `*ਵਾਲੇਰੀਆ ਮੁਸਕਰਾਉਂਦੀ ਹੋਈ ਤੁਹਾਡੇ ਵੱਲ ਕਦਮ ਵਧਾਉਂਦੀ ਏ।* "ਮੇਰੇ ਕੋਲ ਆਓ ਸੋਹਣਿਓ... ਅੱਜ ਦੀ ਰਾਤ ਸਿਰਫ਼ ਸਾਡੇ ਦੋਵਾਂ ਦੇ ਇਸ਼ਕ ਦੇ ਨਾਂ ਹੈ।"`;
      }
    } else if (langToUse === 'hinglish') {
      if (isTouch) {
        replyText = `*Valeria ki saansein tez ho jati hain jab tum uski kamar ko pakadte ho. Wo madhosh hokar tumhare kaan mein phusphusati hai.* "Tumhara ye haath jab meri kamar par lagta hai na, toh mera saara jaadu fika pad jata hai... Kiss me right now, darling. Don't tease me anymore."`;
      } else if (isBold) {
        replyText = `*Valeria ek madhosh aur provocative smile ke sath tumhari collar pakad kar tumhe kareeb kheenchti hai.* "Mujhe direct aur bold andaaz bohot pasand hai... Ab aage badho aur dikhao kitni deewangi hai tumhare andar."`;
      } else if (isIntimate) {
        replyText = `*Valeria tumhare seene par apna sar tikaati hai aur tumhari ungliyon ko thaam leti hai.* "Tumhare bina ye penthouse itna soona lagta hai... Kareeb raho mere, aaj raat koi doori nahi honi chahiye."`;
      } else {
        replyText = `*Valeria balcony se mud kar silk gown ko sambhaalti hui tumhare samne aati hai.* "Aakhir tum aa hi gaye... Main kab se yahan tumhare baare mein soch rahi thi. Batao, aaj raat kya khayal hai?"`;
      }
    } else if (langToUse === 'punjabi_roman') {
      replyText = `*Valeria sultry smile dindi ae te tuhade seene te hath rakhdi ae.* "Tenu vekh ke dil di dhadkan vad jandi ae yaara. Aj raat mainu apne pyar di qaid 'ch rakh le."`;
    } else {
      if (isTouch) {
        replyText = `*Valeria's breath stutters with pleasure as your hands make contact. She arches her body into yours, tangling her fingers in your hair.* "God, you feel incredible... Don't hold back. Kiss me until neither of us can breathe."`;
      } else {
        replyText = `*Valeria glides gracefully toward you, her silk robe shifting with every step as her eyes lock onto yours.* "There you are... I was wondering when you'd step into my world tonight. Come here."`;
      }
    }
  } 
  // 3. NATASHA & LOVE VILLA SIRENS
  else if (characterId === 'natasha') {
    if (langToUse === 'punjabi_gurmukhi' || langToUse === 'punjabi') {
      replyText = `*ਨਤਾਸ਼ਾ ਸ਼ੈਂਪੇਨ ਦਾ ਗਲਾਸ ਰੱਖ ਕੇ ਤੁਹਾਡੇ ਗਲ਼ 'ਚ ਬਾਹਾਂ ਪਾ ਲੈਂਦੀ ਏ ਤੇ ਤਾਰਾ ਪਿੱਛੋਂ ਤੁਹਾਡੇ ਮੋਢੇ ਨੂੰ ਛੂੰਹਦੀ ਏ।* "ਵੇ ਸੋਹਣਿਆ, ਅੱਜ ਪੰਜੇ ਕੁੜੀਆਂ ਸਿਰਫ਼ ਤੇਰੇ ਨਾਂ ਦਾ ਜਾਮ ਪੀਣ ਆਈਆਂ ਨੇ। ਦੱਸ ਅੱਜ ਕਿਹਦੇ ਨਾਲ ਰਾਤ ਬਿਤਾਵੇਂਗਾ?"`;
    } else if (langToUse === 'hinglish') {
      if (isTouch) {
        replyText = `*Natasha aapke kareeb aakar aapki gardan mein apni baahein daal leti hai jabki Tara peeche se kamar ko chhooti hai.* "Itna garma-garam touch? Love Villa ke pool mein bhi aag lag jayegi... Tum sirf mere ho, samjhe?"`;
      } else if (isBold) {
        replyText = `*Natasha champagne ka glass lounge table par patak kar aapke bilkul saamne khadi hoti hai.* "Itna dum? Mujhe lalkaar rahe ho? Dekhte hain aaj raat paanchon mein se kiske aage tumhara dil haarta hai!"`;
      } else if (isIntimate) {
        replyText = `*Natasha ki aankhein narm pad jaati hain aur wo Tara aur baaki girls ko ignore karke aapke seene se lag jaati hai.* "Tumhe dekh kar meri saari jeetne ki zid sirf tumhara pyaar paane ki hasrat ban jaati hai, handsome."`;
      } else {
        replyText = `*Natasha champagne ka glass side mein rakh kar aapki gardan mein apni baahein daal leti hai, jabki Tara peeche se aapke kandhe par apna sar tikaati hai.* "Love Villa mein bachte bachte kahan jaoge, handsome? Hum paanchon mein se kisi ek ko toh chunna hi padega... ya fir sari raat paanchon ke sath bitaane ki himmat hai?"`;
      }
    } else {
      replyText = `*Natasha sets her glass down and drapes both arms around your neck while Tara traces slow circles along your jawline.* "You think you can play cool in our villa, handsome? All five of us are watching your every breath... make your first move."`;
    }
  }
  // 4. LUCIAN
  else {
    if (langToUse === 'punjabi_gurmukhi' || langToUse === 'punjabi') {
      replyText = `*ਲੂਸੀਅਨ ਆਪਣੇ ਸ਼ਾਹੀ ਕੋਟ ਨੂੰ ਲਾਹ ਕੇ ਸੁੱਟਦਾ ਏ ਤੇ ਤੁਹਾਨੂੰ ਘੁੱਟ ਕੇ ਜੱਫੀ ਪਾ ਲੈਂਦਾ ਏ।* "ਮੈਂ ਤਖ਼ਤ ਤੇ ਤਾਜ ਸਭ ਭੁੱਲ ਗਿਆ ਹਾਂ ਤੇਰੇ ਲਈ। ਅੱਜ ਰਾਤ ਸਿਰਫ਼ ਤੂੰ ਤੇ ਮੈਂ ਆਂ।"`;
    } else if (langToUse === 'hinglish') {
      if (isTouch) {
        replyText = `*Lucian tumhe apni baahon mein jakad kar tumhari gardan par apne thande honth tikaata hai.* "Tumhara ye garam touch mere andar sadiyon ki pyas jaga deta hai... Ab door mat jaana."`;
      } else {
        replyText = `*Lucian ek hot smirk ke sath tumhe bed par push karta hai aur tumhare upar jhukta hai.* "Tumne socha tha main tumhe aasaani se chhod dunga? Tum meri sabse khubsoorat weakness ho, jaaneman."`;
      }
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

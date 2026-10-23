import fs from 'fs';

console.log('Rebuilding character-lore-engine.js...');

let code = fs.readFileSync('character-lore-engine.js', 'utf8');

// 1. Update classifyUserMessage isAgreement regex
const oldAgreement = `isAgreement: /\\b(haan|yes|theek hai|ok|ready|chal|sure|bilkul|deal)\\b/i.test(lower)`;
const newAgreement = `isAgreement: /\\b(haan|yes|theek hai|ok|okay|ready|chal|sure|bilkul|deal|jarur|zaroor|kyun nahi|why not|chalo|done|aao|chaloge|help|madad|madad karunga|theek karunga|aa raha hoon|of course|chalo andar)\\b/i.test(lower)`;
if (code.includes(oldAgreement)) {
  code = code.replace(oldAgreement, newAgreement);
  console.log('✓ Updated isAgreement regex in classifyUserMessage');
}

// 2. Add neighbor-priya profile to CHARACTER_LORE
const priyaProfile = `  // 2.5. PRIYA SHARMA (Seductive Neighbor Across the Hall)
  'neighbor-priya': {
    cleanName: 'Priya Sharma',
    shortName: 'Priya',
    gender: 'female',
    location: 'apartment doorway & dimly lit corridor',
    props: ['crimson georgette saree', 'slipping pallu', 'jammed balcony door', 'late-night flat'],
    agreement: {
      actions: [
        \`*Priya ke chehre par ek shaitani aur behad madhosh muskaan aati hai. Wo jhat se tumhara haath thaam kar tumhe apne flat ke andar kheenchti hai, uski georgette saree ka pallu tumhare seene se chhookar phisalta hai.*\`,
        \`*Priya tumhare bilkul kareeb aakar tumhare kaan mein dheere se whisper karti hai, uski meethi khushbu tumhari saanson mein ghul jaati hai.*\`
      ],
      dialogues: [
        \`"Sach mein? Mujhe pata tha mera handsome neighbor itna sweet hai ki inkaar nahi karega... Aao na mere flat mein."\`,
        \`"Waise sach bataun... balcony door toh bas ek bahana tha, handsome. Asli wajah toh tumse akele mein milna tha."\`
      ],
      leads: [
        \`"Darwaza andar se lock kar do na... koi hume dekh na le."\`,
        \`"Pehle darwaza theek karoge ya mere liye ek cup chai banaoge?"\`
      ]
    },
    resignation: {
      actions: [
        \`*Priya darwaze ke aage khadi hokar apni saree ka pallu kandhe par theek karti hai aur tumhara raasta rokti hai.*\`,
        \`*Uski kohl-rimmed aankhon mein ek shaitani narazgi aati hai jab wo tumhara haath pakadti hai.*\`
      ],
      dialogues: [
        \`"Itni der raat ko mujhe akele chhod kar ja rahe ho? Aise kaise, handsome padosi?"\`,
        \`"Mere flat ka darwaza phansa hua hai aur tum bina madad kiye chale jaoge? Ye galat baat hai."\`
      ],
      leads: [
        \`"Wapas aao aur pehle meri problem solve karo."\`,
        \`"Itni jaldi kya hai? Raat toh abhi shuru hui hai."\`
      ]
    },
    defiance: {
      actions: [
        \`*Priya apni kamar par haath rakh kar smirk karti hai, uski georgette saree ki kamar par uski gori twacha chamakti hai.*\`,
        \`*Wo ek kadam aur aage badhti hai taaki uski saansein tumhare chehre ko chhoone lagein.*\`
      ],
      dialogues: [
        \`"Itna attitude apne cute neighbor ko dikhana shobha nahi deta, handsome!"\`,
        \`"Tum jitna sharif banne ka natak karoge, main utna hi zyaada satane aaungi."\`
      ],
      leads: [
        \`"Ab batao, kya ab bhi inkaar karne ki himmat hai?"\`,
        \`"Mera sath itna bura lagta hai kya tumhe?"\`
      ]
    },
    intimacy: {
      actions: [
        \`*Priya tumhari baahon mein simat jaati hai, uske georgette saree ke pallu ke neeche uski narm twacha tumhare seene ko garam kar deti hai.*\`,
        \`*Uski laal chooriyan khanakti hain jab wo apne narm haath tumhari gardan ke peeche daal deti hai.*\`
      ],
      dialogues: [
        \`"Uff... itne kareeb aane se meri dhadkanein kitni tez ho gayi hain, feel kar rahe ho na?"\`,
        \`"Mumbai ki is raat mein agar hum dono ke beech thodi gustakhi ho bhi gayi... toh kisi ko kya pata chalega?"\`
      ],
      leads: [
        \`"Mujhe aur kareeb kheench lo na apne..."\`,
        \`"Aaj raat saare faasle mita dete hain."\`
      ]
    },
    general: {
      actions: [
        \`*Priya doorframe se tek lagakar khadi hoti hai aur apni saree ka pallu nazaakat se sambhalti hai.*\`,
        \`*Uski gehri kajrari aankhein tumpar tiki rehti hain aur halke se honth kaat ti hai.*\`
      ],
      dialogues: [
        \`"Jab se tum is flat mein shift hue ho na... mera dhyan apne ghar par kam aur tumpar zyaada rehta hai."\`,
        \`"Akele flat mein bohot thand lag rahi thi... socha tumse thodi baat kar loon."\`
      ],
      leads: [
        \`"Kaho na, andar aane ka permission kab de rahe ho?"\`,
        \`"Kuch bolo... tumhari khamoshi meri jaan le rahi hai."\`
      ]
    }
  },
`;

if (!code.includes("'neighbor-priya'")) {
  code = code.replace("export const CHARACTER_LORE = {", `export const CHARACTER_LORE = {\n${priyaProfile}`);
  console.log('✓ Added dedicated neighbor-priya profile to CHARACTER_LORE');
}

// 3. Update Arya Singhania (Female CEO) in CHARACTER_LORE
code = code.replace(/cleanName: 'Aryan Singhania'/g, `cleanName: 'Arya Singhania'`);
code = code.replace(/shortName: 'Aryan'/g, `shortName: 'Arya'`);
code = code.replace(/gender: 'male'/g, `gender: 'female'`);
code = code.replace(/Aryan/g, 'Arya');
code = code.replace(/bina palke jhapkaye do tukdon mein faad deta hai/g, 'bina palke jhapkaye do tukdon mein faad deti hai');
code = code.replace(/kareeb aata hai/g, 'kareeb aati hai');
code = code.replace(/chhoone lagti hain/g, 'chhoone lagti hain');
code = code.replace(/faad diya maine/g, 'faad diya maine');

// 4. Update Kiara Oberoi in CHARACTER_LORE
code = code.replace(/cleanName: 'Kabir Oberoi'/g, `cleanName: 'Kiara Oberoi'`);
code = code.replace(/shortName: 'Kabir'/g, `shortName: 'Kiara'`);
code = code.replace(/Kabir/g, 'Kiara');
code = code.replace(/apna bhari haath/g, 'apna narm kohl-sundar haath');

// 5. Update Universal Character Profile with agreement and eliminate generic quote
const oldGeneral = `    general: {
      actions: [
        isFemale
          ? \`*\${cleanName} ek madhosh muskurahat ke saath tumhari taraf dekhti hai aur paas aati hai.*\`
          : \`*\${cleanName} ek confident smirk ke sath aage badhta hai aur tumhara dhyan apni taraf kheenchta hai.*\`
      ],
      dialogues: [
        isFemale
          ? \`"Jab se tum meri zindagi mein aaye ho, har ek lamha behad khaas lagne laga hai."\`
          : \`"Tumhe paas dekh kar saari duniya ka shor tham jaata hai. Kaho, kya chal raha hai dil mein?"\`
      ],
      leads: [
        \`"Batao, mere kareeb aana kaisa lag raha hai?"\`,
        \`"Main sirf tumhara intezar kar raha tha."\`
      ]
    }`;

const newGeneralWithAgreement = `    agreement: {
      actions: [
        isFemale
          ? \`*\${cleanName} ke chehre par ek shaitani aur jeet bhari muskurahat aati hai. Wo jhat se tumhara haath thaam kar tumhe apne aur kareeb kheenchti hai.*\`
          : \`*\${cleanName} ek confident muskaan ke sath tumhara haath pakadta hai aur tumhe apne seene se chipka leta hai.*\`
      ],
      dialogues: [
        isFemale
          ? \`"Sach mein? Mujhe pata tha tum inkaar nahi karoge, handsome... Main janti thi tum mere bulave par daude chale aaoge."\`
          : \`"Mujhe tumhari isi 'haan' ka intezar tha. Ab pichhe hatne ka koi rasta nahi bacha."\`
      ],
      leads: [
        \`"Ab aao mere sath, dekhte hain aage kya hota hai."\`,
        \`"Batao, sabse pehle kya shuru karna chahte ho?"\`
      ]
    },
    general: {
      actions: [
        isFemale
          ? \`*\${cleanName} ek madhosh aur shaitani muskurahat ke saath tumhare bilkul kareeb aati hai, uski saansein tumhari chhati ko garam karti hain.*\`
          : \`*\${cleanName} ek confident smirk ke sath aage badhta hai aur tumhara dhyan apni taraf kheenchta hai.*\`
      ],
      dialogues: [
        isFemale
          ? \`"Tumhe itne kareeb dekh kar mera dhyan bhatak raha hai... Kaho, aage kya irada hai tumhara?"\`
          : \`"Tumhari in aankhon mein dekh kar sab kuch bhool jata hoon. Kaho, kya chal raha hai dil mein?"\`
      ],
      leads: [
        \`"Batao, mere itne kareeb aakar kaisa lag raha hai?"\`,
        \`"Kuch bolo na... tumhari khamoshi aur bechain kar rahi hai."\`
      ]
    }`;

if (code.includes(oldGeneral)) {
  code = code.replace(oldGeneral, newGeneralWithAgreement);
  console.log('✓ Replaced disconnected quote with dynamic agreement and situational response in getUniversalCharacterProfile');
}

// 6. Update track selection in synthesizeDynamicRoleplayReply
const oldTrackSelection = `  // Determine Primary Thematic Track
  let track = 'general';
  if (intents.isResignation) track = 'resignation';
  else if (intents.isDefiance) track = 'defiance';
  else if (intents.isIntimacy) track = 'intimacy';
  else if (intents.isAffection) track = 'intimacy';
  else if (intents.isPowerRules) track = profile.resignation ? 'resignation' : 'defiance';`;

const newTrackSelection = `  // Determine Primary Thematic Track
  let track = 'general';
  if (intents.isAgreement) track = profile.agreement ? 'agreement' : 'intimacy';
  else if (intents.isResignation) track = 'resignation';
  else if (intents.isDefiance) track = 'defiance';
  else if (intents.isIntimacy) track = 'intimacy';
  else if (intents.isAffection) track = 'intimacy';
  else if (intents.isPowerRules) track = profile.resignation ? 'resignation' : 'defiance';`;

if (code.includes(oldTrackSelection)) {
  code = code.replace(oldTrackSelection, newTrackSelection);
  console.log('✓ Wired up intents.isAgreement to agreement track');
}

// 7. Add direct situational acknowledgment for agreement in acknowledge step
const oldAckResign = `  if (intents.isResignation) {`;
const newAckAgreement = `  if (intents.isAgreement) {
    const ackPool = [
      effectiveLang === 'en' ? "You're willing to help? That's what I wanted to hear." : "Madad ke liye tayyar ho? Mujhe pata tha tum mana nahi karoge.",
      effectiveLang === 'en' ? "Good boy. You know how to treat a lady." : "Mujhe pata tha mera handsome neighbor inkaar nahi karega.",
      effectiveLang === 'en' ? "Come inside then." : "Chalo fir andar aao..."
    ];
    acknowledgment = pickNonRepetitive(characterId, 'ack_agree', ackPool);
  } else if (intents.isResignation) {`;

if (code.includes(oldAckResign)) {
  code = code.replace(oldAckResign, newAckAgreement);
  console.log('✓ Added direct situational acknowledgment for agreement');
}

fs.writeFileSync('character-lore-engine.js', code, 'utf8');
fs.writeFileSync('public/character-lore-engine.js', code, 'utf8');

console.log('Successfully updated character-lore-engine.js and public/character-lore-engine.js!');

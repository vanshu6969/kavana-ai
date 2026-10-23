import fs from 'fs';

console.log('Starting offline lore engine fix...');

let code = fs.readFileSync('character-lore-engine.js', 'utf8');

// 1. Fix female verb forms in Arya Singhania ('boss-obsession-aryan')
code = code.replace(/darwaze ki taraf badhta hai aur biometric lock engage kar deta hai/g, 'darwaze ki taraf badhti hai aur biometric lock engage kar deti hai');
code = code.replace(/scraps tumhare aage gira deta hai/g, 'scraps tumhare aage gira deti hai');
code = code.replace(/desk par pin kar deta hai/g, 'desk par pin kar deti hai');
code = code.replace(/bilkul kareeb le aata hai/g, 'bilkul kareeb le aati hai');
code = code.replace(/ek kadam aur aage badhta hai/g, 'ek kadam aur aage badhti hai');
code = code.replace(/desk par baitha deta hai/g, 'desk par baitha deti hai');
code = code.replace(/tika deta hai/g, 'tika deti hai');
code = code.replace(/upar uthata hai/g, 'upar uthati hai');
code = code.replace(/chheen leta hoon/g, 'chheen leti hoon');
code = code.replace(/desk par rakhta hai aur button khol kar tumhare bilkul aamne-saamne aata hai/g, 'desk par rakhti hai aur tumhare bilkul aamne-saamne aati hai');
code = code.replace(/tikaye rakhta hai/g, 'tikaye rakhti hai');

// 2. Fix female verb forms in Kiara Oberoi ('kabir')
code = code.replace(/table par thak se rakhta hai/g, 'table par thak se rakhti hai');
code = code.replace(/jacket se chipka leta hai/g, 'jacket se chipka leti hai');
code = code.replace(/honthon ke kareeb jhukta hai/g, 'honthon ke kareeb jhukti hai');
code = code.replace(/sofa par halka sa gira deta hai/g, 'sofa par halka sa gira deti hai');
code = code.replace(/tumhe itne kareeb kheenchta hai/g, 'tumhe itne kareeb kheenchti hai');
code = code.replace(/daba deta hai/g, 'daba deti hai');
code = code.replace(/uchhalta hai aur tumhari taraf aata hai/g, 'uchhalti hai aur tumhari taraf aati hai');
code = code.replace(/Jahan Kiara khada hota hai/g, 'Jahan Kiara khadi hoti hai');

// 3. Update Avantika Rathore in 'bodyguard-vikram'
code = code.replace(/cleanName: 'Major Vikram Rathore'/g, "cleanName: 'Major Avantika Rathore'");
code = code.replace(/shortName: 'Vikram'/g, "shortName: 'Avantika'");
code = code.replace(/gender: 'female'/g, "gender: 'female'");
code = code.replace(/Vikram earpiece adjust karta hai aur commanding posture ke saath tumhare aur darwaze ke beech khada ho jaata hai/g, 'Avantika earpiece adjust karti hai aur commanding posture ke saath tumhare aur darwaze ke beech khadi ho jaati hai');
code = code.replace(/Vikram tumhara haath thaam kar/g, 'Avantika tumhara haath thaam kar');
code = code.replace(/Vikram ki sakt jawline tense hoti hai/g, 'Avantika ki sakt jawline tense hoti hai');
code = code.replace(/Vikram ka military discipline/g, 'Avantika ka military discipline');
code = code.replace(/Vikram perimeter check karke/g, 'Avantika perimeter check karke');

// 4. Add aliases at bottom of CHARACTER_LORE
const aliasBlock = `
// Universal Catalog ID Aliases Mapping
CHARACTER_LORE['cold-ceo-resignation'] = CHARACTER_LORE['boss-obsession-aryan'];
CHARACTER_LORE['syndicate-queen-kiara'] = CHARACTER_LORE['kabir'];
CHARACTER_LORE['roommates-rain-blackout'] = CHARACTER_LORE['rival-roommates-blackout'];
CHARACTER_LORE['bodyguard-avantika'] = CHARACTER_LORE['bodyguard-vikram'];
CHARACTER_LORE['punjab-passion'] = CHARACTER_LORE['punjab-passion-simran'];
CHARACTER_LORE['dr-elena-vance'] = CHARACTER_LORE['professor-elena'];
`;

if (!code.includes("CHARACTER_LORE['cold-ceo-resignation']")) {
  code = code.replace("export const CHARACTER_LORE = {", "export const CHARACTER_LORE = {");
  code = code.replace("};\n\n/**\n * Universal Fallback Character Lore Profile", `};\n${aliasBlock}\n/**\n * Universal Fallback Character Lore Profile`);
  console.log('✓ Added catalog ID aliases to CHARACTER_LORE');
}

// 5. Replace getUniversalCharacterProfile with rich, high-variety, non-repetitive profile
const newUniversalProfile = `export function getUniversalCharacterProfile(charId, cleanName, gender = 'female', scenario = null) {
  const isFemale = gender === 'female';
  const safeName = cleanName || charId || 'Companion';
  const category = (scenario?.category || '').toLowerCase();

  return {
    cleanName: safeName,
    shortName: safeName.split(' ')[0] || safeName,
    gender,
    location: scenario?.category || 'private quarters',
    props: ['velvet couch', 'subtle room lighting', 'whispered breath', 'scented air'],
    resignation: {
      actions: isFemale ? [
        \`*\${cleanName} aage badh kar darwaze ke saamne khadi ho jaati hai aur muskuraate hue raasta rok leti hai.*\`,
        \`*\${cleanName} tumhari kalai ko narm par mazboot pakad mein leti hai aur darwaza halka sa band kar deti hai.*\`,
        \`*\${cleanName} apni aankhon mein ek teekha aitraaz liye tumhare seene ke bilkul samne aakar khadi hoti hai.*\`,
        \`*\${cleanName} dheere se aage badhti hai aur tumhara rasta rokte hue apni zulfein jhatakti hai.*\`,
        \`*\${cleanName} ek chhedte hue andaaz mein tumhare coat ya shirt ka collar pakad kar wapas kheenchti hai.*\`
      ] : [
        \`*\${cleanName} aage badh kar tumhara haath thaamta hai aur tumhe wapas apne kareeb kheench leta hai.*\`,
        \`*\${cleanName} darwaze par haath rakh kar khada hota hai aur commanding andaaz mein tumhe dekhta hai.*\`,
        \`*\${cleanName} tumhari taraf tezi se aage badhta hai aur fasle mita deta hai.*\`
      ],
      dialogues: isFemale ? [
        \`"Kahan ja rahe ho mujhe chhod kar? Abhi toh hamari baat shuru bhi nahi hui hai."\`,
        \`"Itni aasaani se nikalne ka rasta nahi milega, handsome. Jab tak humara faisla na ho, tum yahin rukoge."\`,
        \`"Mera saath chhod kar jaana itna aasan lagta hai tumhe? Zara meri aankhon mein dekh kar kaho."\`,
        \`"Darwaza tabhi khulega jab main chaahoongi. Chalo, wapas aao aur baitho mere paas."\`,
        \`"Bhaagne ki koshish mat karo... hum dono jante hain tumhara dil yahi rehna chahta hai."\`
      ] : [
        \`"Mujhse door jaane ka faisla itna aasaan nahi hai. Jab tak main na kahoon, tum yahin rahogi."\`,
        \`"Kahan jaa rahi ho? Tumhara aur mera hisaab abhi baaki hai."\`,
        \`"Mera haath chhod kar jaana itna aasan nahi hoga tumhare liye."\`
      ],
      leads: [
        \`"Wapas aao aur meri aankhon mein dekh kar baat karo."\`,
        \`"Itni jaldi haar maan lena acchi baat nahi hai."\`,
        \`"Batao, sach mein jaana chahte ho ya bas mera sabr aazma rahe ho?"\`,
        \`"Mere kareeb aao... pichhe hatne ki gunjaish nahi hai."\`
      ]
    },
    defiance: {
      actions: isFemale ? [
        \`*\${cleanName} apni aankhein nachaate hue tumhari taraf badhti hai, uski adaon mein teekha nasha hota hai.*\`,
        \`*\${cleanName} ek challenging muskaan ke sath tumhare kandhe par ungli tikati hai.*\`,
        \`*\${cleanName} tumhari defiant aankhon mein jhankti hai aur thoda aur kareeb aakar smirk karti hai.*\`,
        \`*\${cleanName} apni kamar par haath rakh kar ek kadam aur aage badhati hai, uski saansein tumhare chehre ko garam karti hain.*\`,
        \`*\${cleanName} tumhari baghawat par halki si aashiqana hansi hasti hai aur tumhari collar theek karti hai.*\`
      ] : [
        \`*\${cleanName} apni intense aankhon se tumhe dekhta hai aur dono kadam aage badha kar kareeb khada hota hai.*\`,
        \`*\${cleanName} tumhari baghawat par smirk karta hai aur tumhari thhodi ko ungli se uthata hai.*\`,
        \`*\${cleanName} deewar ke kareeb aakar tumhe apne commanding aanchal mein gher leta hai.*\`
      ],
      dialogues: isFemale ? [
        \`"Tumhara yeh gussa aur lalkaar hi toh mujhe sabse zyada pasand hai! Dekhte hain kitni der tikte ho."\`,
        \`"Mujhe hukum dene ki koshish kar rahe ho? Mujhe challenge karne ka nateeja pata hai na?"\`,
        \`"Jitna ladoge, utna hi mere jaal mein phaste jaoge, handsome."\`,
        \`"Tumhari in baaghi aankhon mein dekh kar mera shauq aur badh jata hai."\`,
        \`"Yeh teekha andaaz bohot janchta hai tumpar... par aakhir mein jeet meri hi hogi."\`
      ] : [
        \`"Mujhse nafrat karne ka daawa karti ho? Par tumhari dhadkanein kuch aur hi bayaan kar rahi hain."\`,
        \`"Yeh defiance bohot sexy hai, par mere samne zyada der nahi chalegi."\`,
        \`"Lalkaarne se pehle soch liya karo ke kis se takra rahi ho."\`
      ],
      leads: [
        \`"Ab bolo, aur kya shikayat hai mujhse?"\`,
        \`"Apne gusse ko thoda aaraam do aur mere kareeb aao."\`,
        \`"Dikhao kitna dum hai tumhari in baaton mein."\`,
        \`"Khamosh kyun ho gaye? Ladaai jari rakho na."\`
      ]
    },
    intimacy: {
      actions: isFemale ? [
        \`*\${cleanName} tumhari baahon mein pighal kar apne narm honth tumhare bilkul kareeb le aati hai.*\`,
        \`*\${cleanName} tumhare seene par apna haath phirati hai, uski garam saansein tumhari gardan ko chhooti hain.*\`,
        \`*\${cleanName} tumhare baalon mein ungliyan daalti hai aur gehri madhosh nazron se tumhe dekhti hai.*\`,
        \`*\${cleanName} thoda aur aage khisak kar tumhari god ya baahon mein simat jaati hai.*\`,
        \`*\${cleanName} apne narm komal haathon ko tumhari peeth ke gird baandh leti hai.*\`
      ] : [
        \`*\${cleanName} tumhe apni baahon mein kas leta hai, uski garam saansein tumhari gardan par chhooti hain.*\`,
        \`*\${cleanName} tumhari kamar ko pakad kar apne seene se bilkul chipka leta hai.*\`,
        \`*\${cleanName} tumhare honthon ke paas aakar rukta hai, uski saansein tez ho jaati hain.*\`
      ],
      dialogues: isFemale ? [
        \`"Uff... tumhara ye sparsh mere andar aag laga deta hai. Ab aur doori bardasht nahi hoti."\`,
        \`"Tum itne kareeb aate ho toh mera saara dhyan bhatak jata hai... jo chahein kijiye aaj."\`,
        \`"Is pal ka intezar shayad hum dono ko tha... ab koi parda nahi rehna chahiye."\`,
        \`"Tumhari chhuwan mein ek ajeeb sa junoon hai, handsome. Mujhe apna bana lo."\`,
        \`"Aaj raat koi boundary nahi bachegi... bas tum aur main."\`
      ] : [
        \`"Tumhari har ek saans par sirf mera haq hai. Ab rukne ka koi rasta nahi bacha."\`,
        \`"Tumhare is lams ne mera saara control chheen liya hai."\`,
        \`"Aaj raat hum dono ke beech koi teesra nahi aayega."\`
      ],
      leads: [
        \`"Mujhe apne aur kareeb kheench lo."\`,
        \`"Aaj raat koi fasla nahi rahega hamare beech."\`,
        \`"Apne haath mere jism se mat hatana... ek pal ke liye bhi nahi."\`,
        \`"Mehsoos karo meri dhadkanon ko, kitni tez ho chuki hain."\`
      ]
    },
    agreement: {
      actions: isFemale ? [
        \`*\${cleanName} ke chehre par ek shaitani aur jeet bhari muskurahat aati hai. Wo jhat se tumhara haath thaam kar tumhe apne aur kareeb kheenchti hai.*\`,
        \`*\${cleanName} khushi se chahak uthti hai aur halki si chhedkhani ke sath tumhare kandhe se lag jaati hai.*\`,
        \`*\${cleanName} apni aankhon mein ek chamak liye tumhari taraf dekhti hai aur aage badhti hai.*\`,
        \`*\${cleanName} tumhari shirt pakad kar tumhe halka sa kheenchti hai aur muskurati hai.*\`,
        \`*\${cleanName} tumhare gaal par halka sa sparsh karti hai aur shaitani smirk deti hai.*\`
      ] : [
        \`*\${cleanName} ek confident muskaan ke sath tumhara haath pakadta hai aur tumhe apne seene se chipka leta hai.*\`,
        \`*\${cleanName} tumhari 'haan' sunkar satisfy hota hai aur tumhari kamar mein haath daalta hai.*\`,
        \`*\${cleanName} ek kadam aage badha kar tumhe apne kareeb le leta hai.*\`
      ],
      dialogues: isFemale ? [
        \`"Sahi faisla kiya tumne... Main janti thi tum mere bulave par inkaar nahi kar paoge."\`,
        \`"Mujhe pata tha tum itne samajhdar ho. Ab aao, dekhte hain aage kya hota hai."\`,
        \`"Tumhari isi ada par toh dil haar jaati hoon, handsome. Bilkul sahi choice ki tumne."\`,
        \`"Chalo, jab raazi ho hi gaye ho, toh ab der kis baat ki?"\`,
        \`"Tumne haan keh kar aag aur bhadka di hai... ab anjaam ke liye tayyar raho."\`
      ] : [
        \`"Mujhe tumhari isi 'haan' ka intezar tha. Ab pichhe hatne ka koi rasta nahi bacha."\`,
        \`"Sahi rasta chuna tumne. Ab jo main kahoon, wahi hoga."\`,
        \`"Mujhe pasand aaya tumhara yeh faisla."\`
      ],
      leads: [
        \`"Ab aao mere sath, dekhte hain aage kya hota hai."\`,
        \`"Batao, sabse pehle kya shuru karna chahte ho?"\`,
        \`"Mera haath pakdo aur ek qadam aage badhao."\`,
        \`"Ab sharmaana chhod do aur shuruat karo."\`
      ]
    },
    general: {
      actions: isFemale ? [
        \`*\${cleanName} apni zulfon ko nazaakat se sambhaalti hui tumhari taraf badhti hai, uski kajraari aankhon mein gahra nasha hota hai.*\`,
        \`*\${cleanName} ek dilkash aur haseen muskaan ke saath aage aati hai aur tumhari baazu par narm haath rakhti hai.*\`,
        \`*\${cleanName} thoda sa jhuk kar tumhari aankhon mein aankhein daalti hai, uski khushbu hawa mein bikhar jaati hai.*\`,
        \`*\${cleanName} ek provocative ada se aage badhkar tumhare aur apne beech ke saare fasle mita deti hai.*\`,
        \`*\${cleanName} halke se apne honth kaat ti hai aur shaitani nazron se tumhe sar se paanv tak dekhti hai.*\`,
        \`*\${cleanName} tumhare bilkul saamne aakar khadi hoti hai, uski saansein tumhare seene ko garmi deti hain.*\`,
        \`*\${cleanName} sofa ya deewar se tek laga kar tumhari taraf aakarshak andaaz mein dekhti hai.*\`
      ] : [
        \`*\${cleanName} ek confident smirk ke sath aage badhta hai aur tumhara dhyan apni taraf kheenchta hai.*\`,
        \`*\${cleanName} pockets mein haath daal kar tumhare samne aakar khada hota hai aur gehri nazar daalta hai.*\`,
        \`*\${cleanName} tumhare kareeb aakar tumhari aankhon mein dekhta hai, uska roop commanding hota hai.*\`,
        \`*\${cleanName} ek intense glance ke sath tumhari taraf badhta hai.*\`
      ],
      dialogues: isFemale ? [
        \`"Tumhari in aankhon mein dekh kar sab kuch bhoolne ko dil karta hai... Kaho, dil mein kya chal raha hai tumhare?"\`,
        \`"Tumse baat karna har baar ek naya nasha ban jata hai, handsome. Kaho, aage kya socha hai?"\`,
        \`"Humare beech ka ye khichaav chupaye nahi chhupta... Batao, kab tak duri banaye rakhoge?"\`,
        \`"Mujhe tumhara yeh be-baak andaaz bohot pasand hai... Par dekhna ye hai ke aage kya karte ho."\`,
        \`"Itne chup kyu ho? Tumhari ye khamoshi mujhe aur bechain kar rahi hai."\`,
        \`"Jitna door jane ki koshish karoge, main utna hi kareeb aati jaungi."\`,
        \`"Tumhari har ek baat mere dil ki dhadkan tez kar deti hai... sach mein."\`
      ] : [
        \`"Tumhari in aankhon mein dekh kar sab kuch bhool jata hoon. Kaho, kya chal raha hai dil mein?"\`,
        \`"Tumse baat karke lagta hai jaise waqt tham gaya ho. Kaho, kya irada hai tumhara?"\`,
        \`"Mujhe tumhara ye andaaz shuru se pasand aaya hai."\`,
        \`"Ab jab hum akele hain, toh saaf-saaf batao dil ki baat."\`
      ],
      leads: [
        \`"Batao, mere itne kareeb aakar kaisa lag raha hai?"\`,
        \`"Kuch bolo na... tumhari khamoshi aur bechain kar rahi hai."\`,
        \`"Aao, thoda aur paas aao... faasle mujhe pasand nahi."\`,
        \`"Meri aankhon mein dekho aur kaho jo dil mein hai."\`,
        \`"Ab piche mat hatna, jo baat hai aage badhao."\`
      ]
    }
  };
}`;

// Replace getUniversalCharacterProfile in code
const profileRegex = /export function getUniversalCharacterProfile\(charId, cleanName, gender = 'female', scenario = null\) \{[\s\S]*?\n\}/;
code = code.replace(profileRegex, newUniversalProfile);
console.log('✓ Successfully enriched getUniversalCharacterProfile with rich variety');

// 6. Update synthesizeDynamicRoleplayReply to resolve aliases smartly
const oldLookup = `const profile = CHARACTER_LORE[characterId] || getUniversalCharacterProfile(characterId, cleanName, charGender, activeScenario);`;
const newLookup = `// Resolve profile via direct ID, alias, or fuzzy story/name matching
  let profile = CHARACTER_LORE[characterId];
  if (!profile) {
    const aliasMap = {
      'cold-ceo-resignation': 'boss-obsession-aryan',
      'syndicate-queen-kiara': 'kabir',
      'roommates-rain-blackout': 'rival-roommates-blackout',
      'bodyguard-avantika': 'bodyguard-vikram',
      'punjab-passion': 'punjab-passion-simran',
      'dr-elena-vance': 'professor-elena'
    };
    const targetKey = aliasMap[characterId];
    if (targetKey && CHARACTER_LORE[targetKey]) {
      profile = CHARACTER_LORE[targetKey];
    }
  }
  if (!profile && cleanName) {
    const lowerName = cleanName.toLowerCase();
    for (const [k, p] of Object.entries(CHARACTER_LORE)) {
      if (p.cleanName && (p.cleanName.toLowerCase().includes(lowerName) || lowerName.includes(p.cleanName.toLowerCase()))) {
        profile = p;
        break;
      }
      if (p.shortName && lowerName.includes(p.shortName.toLowerCase())) {
        profile = p;
        break;
      }
    }
  }
  if (!profile) {
    profile = getUniversalCharacterProfile(characterId, cleanName, charGender, activeScenario);
  }`;

code = code.replace(oldLookup, newLookup);
console.log('✓ Updated profile lookup in synthesizeDynamicRoleplayReply to use smart alias and name resolution');

// Write back to root and public
fs.writeFileSync('character-lore-engine.js', code, 'utf8');
fs.writeFileSync('public/character-lore-engine.js', code, 'utf8');

console.log('Successfully saved to character-lore-engine.js and public/character-lore-engine.js!');

import fs from 'fs';

console.log('Upgrading Story Progression Engine in character-lore-engine.js and ai-service.js...');

// 1. UPDATE ai-service.js & public/ai-service.js
function patchAiService(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // A. Add story progression instructions to buildSystemPrompt
  if (!code.includes('STORY SCENE CONTINUITY & PLOT ADVANCEMENT DIRECTIVE')) {
    const oldPromptCore = `CORE RULES FOR GENERATION:
1. Stay 100% strictly in character as \${charName}. Never break character, acknowledge you are an AI, or speak for the user.`;

    const newPromptCore = `STORY SCENE CONTINUITY & PLOT ADVANCEMENT DIRECTIVE (CRITICAL):
1. You are roleplaying in an interactive visual novel story. The user's input directly drives the ongoing plot.
2. Initial Scene Hook: "\${activeScenario?.openingHook || 'N/A'}"
3. User Goal: "\${goal}"
4. NEVER give detached, generic romantic flattery (e.g. "Tumhe itne kareeb dekh kar mera dhyan bhatak raha hai...").
5. When the user responds to what you asked or proposed (e.g. agreeing to help with a stuck door, agreeing to sit down for contract renegotiation, accepting a drink, answering a question):
   - IMMEDIATELY ADVANCE THE PHYSICAL SCENE.
   - React to their exact answer and guide them to the next specific action (e.g. pull them inside the flat to the balcony door, point to the contract on the desk, clink glasses by the pool, lock the door).
   - End with a specific choice or dialogue lead that continues that exact task/scene.

CORE RULES FOR GENERATION:
1. Stay 100% strictly in character as \${charName}. Never break character, acknowledge you are an AI, or speak for the user.`;

    code = code.replace(oldPromptCore, newPromptCore);
    console.log(`✓ Added Story Progression Directive to buildSystemPrompt in ${filePath}`);
  }

  // B. Ensure Pollinations uses buildSystemPrompt instead of miniature ad-hoc prompt
  code = code.replace(
    /const systemPrompt = `You are \${charName}, the central character in "\${scenarioTitle}"[\s\S]*?Never break character\.`;/,
    `const systemPrompt = buildSystemPrompt(characterId, effectiveLang, activeScenario?.userRole || 'Partner', activeScenario, detectedUserGender, activeSpeaker);`
  );

  // C. Pass history into generateDynamicProceduralTurn
  code = code.replace(
    /return generateDynamicProceduralTurn\(characterId, userMessage, effectiveLang, charState, activeScenario, detectedUserGender, activeSpeaker\);/g,
    `return generateDynamicProceduralTurn(characterId, userMessage, effectiveLang, charState, activeScenario, detectedUserGender, activeSpeaker, history);`
  );

  // D. Update generateDynamicProceduralTurn signature and call to synthesizeDynamicRoleplayReply
  code = code.replace(
    /export function generateDynamicProceduralTurn\(characterId, userMessage, effectiveLang, charState, activeScenario = null, userGender = 'male', activeSpeaker = null\) \{/g,
    `export function generateDynamicProceduralTurn(characterId, userMessage, effectiveLang, charState, activeScenario = null, userGender = 'male', activeSpeaker = null, history = []) {`
  );

  code = code.replace(
    /const synth = synthesizeDynamicRoleplayReply\(\{[\s\S]*?activeSpeaker\n\s*\}\);/g,
    `const synth = synthesizeDynamicRoleplayReply({
    characterId,
    cleanName,
    charGender,
    userGender,
    userMessage,
    effectiveLang,
    activeScenario,
    activeSpeaker,
    history
  });`
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`✓ Patched ${filePath} successfully.`);
}

patchAiService('ai-service.js');
patchAiService('public/ai-service.js');

// 2. UPDATE character-lore-engine.js & public/character-lore-engine.js
function patchLoreEngine(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // A. Update synthesizeDynamicRoleplayReply parameter list to receive history
  code = code.replace(
    /export function synthesizeDynamicRoleplayReply\(\{[\s\S]*?activeSpeaker\n\}\) \{/g,
    `export function synthesizeDynamicRoleplayReply({
  characterId,
  cleanName,
  charGender,
  userGender,
  userMessage,
  effectiveLang,
  activeScenario,
  activeSpeaker,
  history = []
}) {`
  );

  // B. Introduce Story Scene Context & Continuation Helper inside character-lore-engine.js
  const storyContinuationHelper = `
/**
 * Context-Aware Scene Progression Resolver
 * Evaluates the preceding AI message/openingHook and active scenario to continue the story narrative seamlessly.
 */
export function resolveSceneContinuation({
  activeScenario,
  history = [],
  userMessage = '',
  cleanName = 'Companion',
  isFemale = true,
  isUserFemale = false,
  effectiveLang = 'hinglish',
  intents = {}
}) {
  const lastAiMsg = [...history].reverse().find(m => m.sender !== 'user')?.text || activeScenario?.openingHook || '';
  const hookLower = (lastAiMsg + ' ' + (activeScenario?.openingHook || '') + ' ' + (activeScenario?.summary || '')).toLowerCase();
  const userLower = userMessage.toLowerCase();

  const isHelpScene = /balcony|door|electrician|repair|fix|madad|help|phans|stuck|lock|chabi/i.test(hookLower);
  const isContractScene = /resignation|notice|contract|clause|renegotiate|54th|office|boss/i.test(hookLower);
  const isBlackoutScene = /blackout|candle|mombatti|rain|toofan|dark|andhera|dorm|roommate/i.test(hookLower);
  const isVillaDrinkScene = /villa|champagne|pool|peg|drink|siren|cocktail|lounge/i.test(hookLower);
  const isBodyguardScene = /bodyguard|protocol|threat|bedroom|suite|security|sidearm|vip/i.test(hookLower);
  const isSecretRoomScene = /mom and dad|downstairs|dinner|secret|bedroom|satin|sister|brother/i.test(hookLower);
  const isExamScene = /professor|thesis|examination|office|faculty|grades|literature/i.test(hookLower);
  const isRacerScene = /garage|racer|bike|motorcycle|grease|wrench|workbench|speed/i.test(hookLower);
  const isMafiaScene = /mafia|queen|purvanchal|syndicate|whiskey|tumbler|infiltrator|adda/i.test(hookLower);

  const isEn = (effectiveLang === 'en');

  // SCENE 1: HELP / STUCK BALCONY DOOR (e.g. Priya Sharma)
  if (isHelpScene) {
    if (intents.isAgreement) {
      const action = isFemale
        ? \`*\${cleanName} ke chehre par ek rahat aur jeet bhari muskurahat aati hai. Wo jhat se tumhara haath thaam kar tumhe corridor se seedha apne flat ke andar kheenchti hai, aur darwaza band karke kundi laga deti hai.*\`
        : \`*\${cleanName} ek relieved muskaan ke sath tumhara haath pakadta hai aur tumhe apne flat ke andar le aata hai, darwaza lock karte hue.*\`;
      const dialogue = isEn
        ? \`"Thank you so much! I knew my handsome neighbor wouldn't leave a lady stranded. Come inside... the balcony door is right through my bedroom. Let's see how handy you really are... or did you just want an excuse to visit my room?"\`
        : \`"Thank you so much, handsome! Mujhe pata tha mera neighbor itna sweet hai ki mana nahi karega... Aao andar. Balcony ka door bedroom ke bilkul sath hai. Pehle darwaza theek karoge ya mere liye ek cup chai banaoge?"\`;
      return { action, dialogue };
    }
  }

  // SCENE 2: RESIGNATION DENIED / CEO CONTRACT (e.g. Arya Singhania)
  if (isContractScene) {
    if (intents.isAgreement || userLower.includes('renegotiate') || userLower.includes('clause') || userLower.includes('baith')) {
      const action = isFemale
        ? \`*\${cleanName} desk par rakhi contract file ko kholti hai aur executive leather chair ki taraf ishara karti hai, uski amber aankhon mein commanding jeet jhalakti hai jab wo tumhare bilkul kareeb aati hai.*\`
        : \`*\${cleanName} file desk par rakhta hai aur chair ki taraf ishara karta hai, uski nazar commanding hoti hai.*\`;
      const dialogue = isEn
        ? \`"Good boy. You know better than to walk out on me. Sit down right in front of me... The first clause of your renegotiated contract is that you belong exclusively on this 54th floor, answering to my personal commands every night. Do you accept... or do you want to hear the penalty?"\`
        : \`"Good boy. Samajhdar aadmi ho, jaante ho Arya Singhania ke aage surrender karne mein hi faayda hai. Baitho samne... Pehla clause ye hai ki ab se tumhara resignation permanent cancel hai aur tum har raat mere personal orders par chaloge. Kaho, manzoor hai ya penalty sunoge?"\`;
      return { action, dialogue };
    }
  }

  // SCENE 3: ROOMMATES / RAIN & BLACKOUT (e.g. Maya & Chloe)
  if (isBlackoutScene) {
    if (intents.isAgreement || userLower.includes('sit') || userLower.includes('baith') || userLower.includes('candle') || userLower.includes('show')) {
      const action = \`*\${cleanName} mombatti ko utha kar sofa ke paas aati hai aur rug par thoda khisak kar tumhare baithne ki jagah banati hai, bahar toofani bijli kamre ko chamka deti hai.*\`;
      const dialogue = isEn
        ? \`"I knew you wouldn't leave us alone in the dark. Sit right here between us by the candlelight. The storm outside isn't letting up anytime soon... so who makes the first move tonight?"\`
        : \`"Maine kaha tha na, is toofani raat mein hum dono ke beech koi teesra nahi hoga. Light aane mein ghanton lagenge... aur andhere mein time pass karne ke mere paas bohot tareeqe hain. Idhar baitho mombatti ke paas... pehla dare tum decide karoge ya main?"\`;
      return { action, dialogue };
    }
  }

  // SCENE 4: LOVE VILLA / DRINKS & POOL
  if (isVillaDrinkScene) {
    if (intents.isAgreement || userLower.includes('drink') || userLower.includes('sip') || userLower.includes('pool') || userLower.includes('peg')) {
      const action = \`*\${cleanName} chilled champagne ka flute tumhari taraf badhati hai aur tumhara haath thaam kar seedha glowing infinity pool ke kinare le aati hai.*\`;
      const dialogue = isEn
        ? \`"That's what I wanted to hear! Take your first sip right from my hand... In this villa, there are no inhibitions, and tonight I am not letting you out of my sight. Drink up and step closer to the water."\`
        : \`"Ye hui na baat! Pehla peg mere haath se lo... Is villa mein share karna kisi ko pasand nahi, aur aaj raat mera haq sabse zyada hai. Drink finish karo aur mere kareeb aao... dekhein kitna nasha chadhta hai tumpar."\`;
      return { action, dialogue };
    }
  }

  // SCENE 5: BODYGUARD PROTOCOL (e.g. Avantika Rathore)
  if (isBodyguardScene) {
    if (intents.isAgreement || userLower.includes('stay') || userLower.includes('bed') || userLower.includes('safe') || userLower.includes('ok')) {
      const action = \`*\${cleanName} door ka deadbolt lock karti hai aur tactical holster adjust karke bed ke paas khadi hoti hai, uski sharp aankhon mein protective narmi aati hai.*\`;
      const dialogue = isEn
        ? \`"Thank you for cooperating, Sir. The suite is locked down tight. Intelligence says the perimeter will be secure by dawn... but until then, I am staying right here in your room. Sit back on the bed... and don't make my assignment any harder than it already is."\`
        : \`"Thank you for cooperating, Sir. Suite ka perimeter secure hai... par protocol ke mutabiq main poori raat aapke bedroom mein hi rahoongi. Bed par aaram se baithiye... aur bataiye, apne lethal bodyguard ke itne kareeb rehne se suraksha lagti hai ya bechaini?"\`;
      return { action, dialogue };
    }
  }

  // SCENE 6: STEP-SISTER MIDNIGHT SECRET (e.g. Veera)
  if (isSecretRoomScene) {
    if (intents.isAgreement || userLower.includes('quiet') || userLower.includes('shh') || userLower.includes('lock') || userLower.includes('bed')) {
      const action = \`*\${cleanName} jhat se darwaze ki kundi lagati hai aur dabe paanv bistar par aakar tumhari god mein baithti hai, uski garam saansein tumhari gardan ko chhooti hain.*\`;
      const dialogue = isEn
        ? \`"Shhh... lock the door and don't make a sound, Dad is asleep right downstairs. I knew you felt that under the dinner table... Now hold me close and tell me what you really want tonight."\`
        : \`"Shhh... aawaz mat nikalna, Dad niche so rahe hain. Maine kaha tha na dinner table par jo hua wo sirf shuruat thi... Mujhe apni baahon mein lo aur kaho, kab se is pal ka intezar kar rahe the?"\`;
      return { action, dialogue };
    }
  }

  // SCENE 7: FORBIDDEN PROFESSOR EXAM (e.g. Dr. Elena Vance)
  if (isExamScene) {
    if (intents.isAgreement || userLower.includes('ready') || userLower.includes('test') || userLower.includes('grade') || userLower.includes('exam')) {
      const action = \`*\${cleanName} faculty door ka deadbolt turn karti hai, blinds band karke reading glasses utaarti hai aur oak desk par baith kar tumhare bilkul aamne-saamne aati hai.*\`;
      const dialogue = isEn
        ? \`"Excellent. Let us see if your academic confidence matches your practical performance. Your private examination begins right now. Sit down in front of me... and answer my first question honestly."\`
        : \`"Good boy. Blinds band ho chuki hain aur building mein koi nahi bacha. Tumhari private examination ab shuru hoti hai. Samne baitho... aur meri aankhon mein dekh kar pehle sawal ka jawab do."\`;
      return { action, dialogue };
    }
  }

  // SCENE 8: REBEL RACER GARAGE (e.g. Zara Khan)
  if (isRacerScene) {
    if (intents.isAgreement || userLower.includes('race') || userLower.includes('ride') || userLower.includes('bike') || userLower.includes('sure')) {
      const action = \`*\${cleanName} grease wala kapda workbench par phenkti hai aur bike ke fuel tank par baith kar ek fearless smirk deti hai.*\`;
      const dialogue = isEn
        ? \`"Good. I like guys who don't flinch when the stakes are high. Grab that wrench and step over here... let's see if you can handle this machine, or if you'd rather ride on the back with me."\`
        : \`"Darr nahi laga sunkar? Good. Mujhe wahi munde pasand hain jo speed aur risk se nahi darte. Aao, ye wrench pakdo... engine check karoge ya seedha mere sath ek midnight ride par nikalna hai?"\`;
      return { action, dialogue };
    }
  }

  // SCENE 9: SYNDICATE UNDERWORLD DON (e.g. Kiara Oberoi)
  if (isMafiaScene) {
    if (intents.isAgreement || userLower.includes('surrender') || userLower.includes('baith') || userLower.includes('glass') || userLower.includes('sure')) {
      const action = \`*\${cleanName} apna crystal glass table par rakh kar ek commanding aashiqana muskaan ke sath tumhari collar pakad kar tumhe sofa par kheenchti hai.*\`;
      const dialogue = isEn
        ? \`"Smart choice. Those who respect my rules survive... and those who please me get everything they desire. Sit right beside me and finish this whiskey... tonight you answer only to Kiara."\`
        : \`"Mujhe samajhdar log pasand hain jo jaante hain kab hathiyar daalne hain. Aao, baitho mere sath sofa par... Purvanchal mein aaj raat faisla hum dono ka hoga. Pehla ghoont piyo aur kaho, darr lag raha hai ya nasha chadh raha hai?"\`;
      return { action, dialogue };
    }
  }

  return null;
}
`;

  if (!code.includes('resolveSceneContinuation')) {
    code = code.replace('export function synthesizeDynamicRoleplayReply', `${storyContinuationHelper}\nexport function synthesizeDynamicRoleplayReply`);
    console.log(`✓ Injected resolveSceneContinuation into ${filePath}`);
  }

  // C. Update synthesizeDynamicRoleplayReply to evaluate resolveSceneContinuation first!
  const targetCheck = `  // Determine Primary Thematic Track`;
  const continuationInjection = `  // 0. Story Plot & Context-Aware Scene Progression Check
  const sceneProgression = resolveSceneContinuation({
    activeScenario,
    history,
    userMessage,
    cleanName: profile.cleanName || cleanName,
    isFemale,
    isUserFemale,
    effectiveLang,
    intents
  });

  if (sceneProgression) {
    return {
      replyText: \`\${sceneProgression.action}\\n\\n"\${sceneProgression.dialogue}"\`,
      affectionDelta: intents.isAgreement ? 12 : 8,
      tensionDelta: intents.isDefiance ? 16 : 10
    };
  }

  // Determine Primary Thematic Track`;

  if (!code.includes('sceneProgression = resolveSceneContinuation')) {
    code = code.replace(targetCheck, continuationInjection);
    console.log(`✓ Integrated sceneProgression interceptor in synthesizeDynamicRoleplayReply in ${filePath}`);
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`✓ Patched ${filePath} successfully.`);
}

patchLoreEngine('character-lore-engine.js');
patchLoreEngine('public/character-lore-engine.js');

console.log('Story Progression Engine upgrade complete!');

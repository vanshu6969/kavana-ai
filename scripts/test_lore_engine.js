import { synthesizeDynamicRoleplayReply } from '../character-lore-engine.js';

async function run() {
  const reply1 = synthesizeDynamicRoleplayReply({
    characterId: 'neighbor-priya',
    cleanName: 'Priya Sharma',
    charGender: 'female',
    userGender: 'male',
    userMessage: 'Jarur',
    effectiveLang: 'hinglish'
  });
  console.log('=== TEST 1: Priya Sharma replying to "Jarur" ===');
  console.log(reply1.replyText);

  const reply2 = synthesizeDynamicRoleplayReply({
    characterId: 'neighbor-priya',
    cleanName: 'Priya Sharma',
    charGender: 'female',
    userGender: 'male',
    userMessage: 'Haan bilkul madad karunga batao kya hua',
    effectiveLang: 'hinglish'
  });
  console.log('\n=== TEST 2: Priya Sharma replying to "Haan bilkul madad karunga..." ===');
  console.log(reply2.replyText);

  const reply3 = synthesizeDynamicRoleplayReply({
    characterId: 'cold-ceo',
    cleanName: 'Arya Singhania',
    charGender: 'female',
    userGender: 'male',
    userMessage: 'Sure maam, I agree',
    effectiveLang: 'hinglish'
  });
  console.log('\n=== TEST 3: Arya Singhania (CEO) replying to "Sure maam, I agree" ===');
  console.log(reply3.replyText);
}

run();

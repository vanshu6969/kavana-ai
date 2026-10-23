import { synthesizeDynamicRoleplayReply } from '../character-lore-engine.js';

console.log('=== TEST 1: Arya Singhania (cold-ceo-resignation) ===');
const aryaReplies = [];
for (let i = 0; i < 3; i++) {
  const reply = synthesizeDynamicRoleplayReply({
    characterId: 'cold-ceo-resignation',
    cleanName: 'Arya Singhania',
    charGender: 'female',
    userGender: 'male',
    userMessage: 'Hey Arya, what are you looking at?',
    effectiveLang: 'hinglish',
    activeScenario: { id: 'cold-ceo-resignation', characterName: 'Arya Singhania' }
  });
  console.log(`Turn ${i + 1}:\n${reply.replyText}\n`);
}

console.log('=== TEST 2: Arya Singhania Resignation Intent ===');
const aryaResign = synthesizeDynamicRoleplayReply({
  characterId: 'cold-ceo-resignation',
  cleanName: 'Arya Singhania',
  charGender: 'female',
  userGender: 'male',
  userMessage: 'I am leaving and submitting my resignation.',
  effectiveLang: 'hinglish',
  activeScenario: { id: 'cold-ceo-resignation', characterName: 'Arya Singhania' }
});
console.log(`Resignation Turn:\n${aryaResign.replyText}\n`);

console.log('=== TEST 3: Catalog Character without hardcoded ID (Zara Khan) ===');
for (let i = 0; i < 3; i++) {
  const zaraReply = synthesizeDynamicRoleplayReply({
    characterId: 'badgirl-zara',
    cleanName: 'Zara Khan',
    charGender: 'female',
    userGender: 'male',
    userMessage: 'Hey Zara, nice bike you got here.',
    effectiveLang: 'hinglish',
    activeScenario: { id: 'badgirl-zara', characterName: 'Zara Khan' }
  });
  console.log(`Zara Turn ${i + 1}:\n${zaraReply.replyText}\n`);
}

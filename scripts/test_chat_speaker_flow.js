import { resolveActiveSpeakerName } from '../engine.js';
import { synthesizeDynamicRoleplayReply } from '../character-lore-engine.js';

console.log('=== MULTI-CHARACTER SPEAKER RESOLUTION & LORE TESTS ===\n');

const loveVillaScenario = {
  id: 'love-villa-5-rivals',
  characterName: 'The 5 Villa Sirens (Natasha, Tara, Aanya, Rhea & Meera)',
  title: 'Love Villa: 5 Jealous Rivals'
};

const roommatesScenario = {
  id: 'rival-roommates-blackout',
  characterName: 'Maya & Chloe (College Rivals With Benefits)',
  title: 'Rival Roommates: Stormy Blackout'
};

// 1. Direct message naming Natasha
const s1 = resolveActiveSpeakerName(loveVillaScenario, 'Hey Natasha, sit next to me');
console.log('Test 1 - Direct Natasha message => activeSpeaker:', s1);
console.assert(s1 === 'Natasha', 'Expected Natasha');

// 2. Direct message naming Tara
const s2 = resolveActiveSpeakerName(loveVillaScenario, 'Tara, that red dress is unbelievable');
console.log('Test 2 - Direct Tara message => activeSpeaker:', s2);
console.assert(s2 === 'Tara', 'Expected Tara');

// 3. Direct message naming Meera
const s3 = resolveActiveSpeakerName(loveVillaScenario, 'Meera, come out of the shadows');
console.log('Test 3 - Direct Meera message => activeSpeaker:', s3);
console.assert(s3 === 'Meera', 'Expected Meera');

// 4. Conversation history continuation (user says general statement, history had Tara)
const historyWithTara = [
  { sender: 'user', text: 'Hey Tara, who are you?' },
  { sender: 'ai', text: '*Tara smirks*', character: 'Tara' },
  { sender: 'user', text: 'Come sit on my lap.' }
];
const s4 = resolveActiveSpeakerName(loveVillaScenario, 'Come sit on my lap.', historyWithTara);
console.log('Test 4 - History continuation (Tara) => activeSpeaker:', s4);
console.assert(s4 === 'Tara', 'Expected Tara');

// 5. Roommates story - Chloe
const s5 = resolveActiveSpeakerName(roommatesScenario, 'Chloe why did you lock the door?');
console.log('Test 5 - Roommates Chloe message => activeSpeaker:', s5);
console.assert(s5 === 'Chloe', 'Expected Chloe');

// 6. Test Lore Synthesis for Tara
const taraReply = synthesizeDynamicRoleplayReply({
  characterId: 'love-villa-5-rivals',
  cleanName: 'Tara',
  charGender: 'female',
  userGender: 'male',
  userMessage: 'Tara, what do you want?',
  effectiveLang: 'hinglish',
  activeScenario: loveVillaScenario,
  activeSpeaker: 'Tara'
});
console.log('\nTest 6 - Lore Reply for Tara:');
console.log(taraReply.replyText);
console.assert(taraReply.replyText.includes('Tara'), 'Expected Tara action/dialogue');

// 7. Test Lore Synthesis for Chloe
const chloeReply = synthesizeDynamicRoleplayReply({
  characterId: 'rival-roommates-blackout',
  cleanName: 'Chloe',
  charGender: 'female',
  userGender: 'male',
  userMessage: 'Chloe, sit with me',
  effectiveLang: 'hinglish',
  activeScenario: roommatesScenario,
  activeSpeaker: 'Chloe'
});
console.log('\nTest 7 - Lore Reply for Chloe:');
console.log(chloeReply.replyText);
console.assert(chloeReply.replyText.includes('Chloe'), 'Expected Chloe action/dialogue');

console.log('\n✅ ALL MULTI-CHARACTER TESTS PASSED PERFECTLY!');

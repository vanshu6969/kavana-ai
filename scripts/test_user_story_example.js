import { synthesizeDynamicRoleplayReply } from '../character-lore-engine.js';

console.log('=== TEST 1: User Example - Priya asks for help, user says "sure" ===');
const priyaScenario = {
  id: 'neighbor-priya',
  title: 'Late Night Balcony Door: Priya Sharma',
  characterName: 'Priya Sharma (Neighbor Across the Hall)',
  openingHook: '*[Priya leans softly against your doorframe, the pallu of her crimson georgette saree slipping down her smooth shoulder]* Suno na... mere flat ka balcony door bilkul phans gaya hai. Itni der raat ko kisi electrician ko toh bula nahi sakti thi... Socha apne handsome neighbor se madad maang loon. Help karoge na meri?'
};

const priyaReply = synthesizeDynamicRoleplayReply({
  characterId: 'neighbor-priya',
  cleanName: 'Priya Sharma',
  charGender: 'female',
  userGender: 'male',
  userMessage: 'sure',
  effectiveLang: 'hinglish',
  activeScenario: priyaScenario,
  history: [{ sender: 'ai', text: priyaScenario.openingHook }]
});
console.log(priyaReply.replyText);

console.log('\n=== TEST 2: English Language - User says "Sure, I will help you" ===');
const priyaReplyEn = synthesizeDynamicRoleplayReply({
  characterId: 'neighbor-priya',
  cleanName: 'Priya Sharma',
  charGender: 'female',
  userGender: 'male',
  userMessage: 'Sure, I will help you',
  effectiveLang: 'en',
  activeScenario: priyaScenario,
  history: [{ sender: 'ai', text: priyaScenario.openingHook }]
});
console.log(priyaReplyEn.replyText);

console.log('\n=== TEST 3: Arya Singhania (CEO) - User agrees to renegotiate contract ===');
const aryaScenario = {
  id: 'cold-ceo-resignation',
  title: 'The Cold Female CEO: Resignation Denied',
  characterName: 'Arya Singhania (Billionaire Female CEO)',
  openingHook: '*[Arya tears your resignation letter in half]* Sit down. Your contract under me is for life... and tonight, we renegotiate every single clause on my terms.'
};

const aryaReply = synthesizeDynamicRoleplayReply({
  characterId: 'cold-ceo-resignation',
  cleanName: 'Arya Singhania',
  charGender: 'female',
  userGender: 'male',
  userMessage: 'sure, let us renegotiate',
  effectiveLang: 'hinglish',
  activeScenario: aryaScenario,
  history: [{ sender: 'ai', text: aryaScenario.openingHook }]
});
console.log(aryaReply.replyText);

console.log('\n=== TEST 4: Maya & Chloe (Rain & Blackout) - User says "sure, show me" ===');
const roommatesScenario = {
  id: 'roommates-rain-blackout',
  title: 'Rival Roommates: Rain & Blackout',
  characterName: 'Maya & Chloe',
  openingHook: '*[Lightning flashes... Maya strikes a match, lighting a single candle on the desk]* What do you say we find out what is really between us when the lights go out?'
};

const roommatesReply = synthesizeDynamicRoleplayReply({
  characterId: 'roommates-rain-blackout',
  cleanName: 'Maya & Chloe',
  charGender: 'female',
  userGender: 'male',
  userMessage: 'sure, show me',
  effectiveLang: 'hinglish',
  activeScenario: roommatesScenario,
  history: [{ sender: 'ai', text: roommatesScenario.openingHook }]
});
console.log(roommatesReply.replyText);

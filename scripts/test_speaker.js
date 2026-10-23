export function resolveActiveSpeakerName(scenario, userText = '', history = []) {
  if (!scenario) return 'Companion';
  const rawName = scenario.characterName || scenario.name || '';
  const charId = scenario.id || scenario.characterId || '';

  const isLoveVilla = /love-villa|sirens/i.test(charId) || /sirens|natasha.*tara/i.test(rawName);
  const isRoommates = /roommate/i.test(charId) || /maya.*chloe/i.test(rawName);
  const isMulti = isLoveVilla || isRoommates || /&|,|\band\b/i.test(rawName);

  if (!isMulti) {
    return rawName.replace(/\s*\([^)]*\)/g, '').trim() || 'Companion';
  }

  let characterList = [];
  let defaultSpeaker = 'Natasha';

  if (isLoveVilla) {
    characterList = [
      { name: 'Natasha', patterns: [/\bnatasha\b/i, /\btash\b/i, /\bsupermodel\b/i, /\bchampagne\b/i] },
      { name: 'Tara', patterns: [/\btara\b/i, /\bred dress\b/i, /\bbad girl\b/i] },
      { name: 'Aanya', patterns: [/\baanya\b/i, /\banya\b/i, /\bheiress\b/i] },
      { name: 'Rhea', patterns: [/\brhea\b/i, /\binfluencer\b/i] },
      { name: 'Meera', patterns: [/\bmeera\b/i, /\bmira\b/i, /\bdark siren\b/i] }
    ];
    defaultSpeaker = 'Natasha';
  } else if (isRoommates) {
    characterList = [
      { name: 'Maya', patterns: [/\bmaya\b/i] },
      { name: 'Chloe', patterns: [/\bchloe\b/i] }
    ];
    defaultSpeaker = 'Maya';
  }

  if (userText) {
    for (const item of characterList) {
      if (item.patterns.some(p => p.test(userText))) {
        return item.name;
      }
    }
  }

  if (Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-6).reverse();
    for (const msg of recent) {
      if (msg.character) {
        const match = characterList.find(c => c.name.toLowerCase() === msg.character.toLowerCase());
        if (match) return match.name;
      }
      const text = msg.text || '';
      for (const item of characterList) {
        if (item.patterns.some(p => p.test(text))) {
          return item.name;
        }
      }
    }
  }

  return defaultSpeaker;
}

const scenario = { id: 'love-villa-5-rivals', characterName: 'The 5 Villa Sirens (Natasha, Tara, Aanya, Rhea & Meera)' };
console.log('1. User says hello to Tara:', resolveActiveSpeakerName(scenario, 'Hello Tara, come here'));
console.log('2. User says hello to Natasha:', resolveActiveSpeakerName(scenario, 'Hey Natasha what drink is that?'));
console.log('3. User says hello to Aanya:', resolveActiveSpeakerName(scenario, 'Aanya you look gorgeous'));
console.log('4. User just says general message, history had Tara:', resolveActiveSpeakerName(scenario, 'Sit on my lap', [{sender: 'user', text: 'Hey Tara'} ]));
console.log('5. Default on empty chat:', resolveActiveSpeakerName(scenario, ''));
console.log('6. Single character scenario:', resolveActiveSpeakerName({ id: 'aryan', characterName: 'Aryan Singhania (Billionaire CEO)' }, 'Hello'));

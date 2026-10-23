import { KAVANA_STORIES_CATALOG } from '../stories-catalog.js';

const malePatterns = [/\bbad boy\b/i, /\bprince\b/i, /\blord\b/i, /\bking\b/i, /\bhusband\b/i, /\bbrother\b/i, /\bboy\b/i, /\bmr\.\b/i, /\bhe\b/i, /\bhim\b/i, /\bhis\b/i];

KAVANA_STORIES_CATALOG.forEach((s, idx) => {
  const text = `${s.title} ${s.characterName} ${s.userRole} ${s.userGoal}`;
  const matched = malePatterns.filter(p => p.test(text)).map(p => p.source);
  if (matched.length > 0) {
    console.log(`[${idx+1}] ID: ${s.id} | Title: "${s.title}" | Char: "${s.characterName}" | Matched: [${matched.join(', ')}]`);
  }
});

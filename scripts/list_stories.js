import { KAVANA_STORIES } from '../engine.js';

console.log('--- KAVANA STORIES AUDIT ---');
console.log('Total Count:', KAVANA_STORIES.length);

const movieKeywords = ['mirzapur', 'dune', 'john wick', 'peaky', 'euphoria', 'tmdb', 'queen of tears', 'godfather', 'breaking bad', 'game of thrones'];
let movieCount = 0;

KAVANA_STORIES.forEach((s, i) => {
  const isMovie = movieKeywords.some(k => 
    (s.title || '').toLowerCase().includes(k) || 
    (s.characterName || '').toLowerCase().includes(k) ||
    (s.summary || '').toLowerCase().includes(k) ||
    Boolean(s.tmdbId)
  );
  if (isMovie) {
    console.log(`⚠️ Movie story found: ${s.title}`);
    movieCount++;
  } else {
    console.log(`${i+1}. [${s.category || 'Story'}] ${s.title} — ${s.characterName}`);
  }
});

console.log(`\nResult: ${KAVANA_STORIES.length - movieCount} Original Stories | ${movieCount} Movie stories`);

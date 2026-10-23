import { KAVANA_ORIGINAL_STORIES } from './stories-catalog.js';

const posters = new Set();
const storyMap = new Map();

KAVANA_ORIGINAL_STORIES.forEach((s, idx) => {
  const p = s.avatar || s.cover;
  posters.add(p);
  if (!storyMap.has(p)) storyMap.set(p, []);
  storyMap.get(p).push({ idx: idx + 1, title: s.title, character: s.characterName, id: s.id });
});

console.log(`Total stories: ${KAVANA_ORIGINAL_STORIES.length}`);
console.log(`Unique poster paths: ${posters.size}`);
for (const [poster, list] of storyMap.entries()) {
  console.log(`${poster} (used by ${list.length} stories: ${list.map(x => '#' + x.idx + ' ' + x.character).join(', ')})`);
}

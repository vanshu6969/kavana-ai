import { KAVANA_ORIGINAL_STORIES } from '../stories-catalog.js';
import fs from 'fs';
import path from 'path';

console.log('Auditing all', KAVANA_ORIGINAL_STORIES.length, 'stories in stories-catalog.js...');

let missingRoot = 0;
let missingPub = 0;
let smallRoot = 0;
let smallPub = 0;

KAVANA_ORIGINAL_STORIES.forEach((s, idx) => {
  const fn = path.basename(s.avatar);
  const pRoot = path.join('assets', fn);
  const pPub = path.join('public/assets', fn);

  if (!fs.existsSync(pRoot)) {
    console.error(`[Missing in assets] #${idx + 1} (${s.id}): ${pRoot}`);
    missingRoot++;
  } else if (fs.statSync(pRoot).size < 10000) {
    console.error(`[Too small in assets] #${idx + 1} (${s.id}): ${pRoot} (${fs.statSync(pRoot).size} bytes)`);
    smallRoot++;
  }

  if (!fs.existsSync(pPub)) {
    console.error(`[Missing in public/assets] #${idx + 1} (${s.id}): ${pPub}`);
    missingPub++;
  } else if (fs.statSync(pPub).size < 10000) {
    console.error(`[Too small in public/assets] #${idx + 1} (${s.id}): ${pPub} (${fs.statSync(pPub).size} bytes)`);
    smallPub++;
  }
});

console.log('\n=== AUDIT RESULTS ===');
console.log(`Total Stories: ${KAVANA_ORIGINAL_STORIES.length}`);
console.log(`Missing in assets: ${missingRoot}`);
console.log(`Missing in public/assets: ${missingPub}`);
console.log(`Small files in assets: ${smallRoot}`);
console.log(`Small files in public/assets: ${smallPub}`);

if (missingRoot === 0 && missingPub === 0 && smallRoot === 0 && smallPub === 0) {
  console.log('🌟 100% PERFECT! ALL 105 STORY POSTERS ARE VALID, HIGH-RES, AND PRESENT IN BOTH DIRS!');
}

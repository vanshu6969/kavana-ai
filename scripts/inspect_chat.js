import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- VIEWS IN INDEX.HTML ---');
lines.forEach((l, idx) => {
  if (l.includes('id="view-') || l.includes("id='view-") || l.includes('class="view-section')) {
    console.log(`Line ${idx+1}: ${l.trim()}`);
  }
});

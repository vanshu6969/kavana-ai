import fs from 'fs';

const text = fs.readFileSync('C:\\Users\\prince\\.gemini\\antigravity-ide\\brain\\1806c4cd-dd86-4907-90be-3e9417e85901\\.system_generated\\logs\\transcript.jsonl', 'utf8');
const lines = text.split('\n');

lines.forEach((line) => {
  if (line.includes('GENERATE_IMAGE')) {
    try {
      const obj = JSON.parse(line);
      console.log('--- GENERATE_IMAGE OUTPUT ---');
      console.log(obj.content);
    } catch(e) {}
  }
});

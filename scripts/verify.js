const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const files = [
  'server.js',
  'engine.js',
  'ai-service.js',
  'stories-catalog.js',
  'tmdb-service.js',
  'app.js',
  'lib-stories.js'
];

let hasErrors = false;

for (const file of files) {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`MISSING: ${file}`);
    hasErrors = true;
    continue;
  }
  try {
    execSync(`"${process.execPath}" --check "${fullPath}"`);
    console.log(`✓ ${file}: Syntax valid`);
  } catch (err) {
    console.error(`✗ ${file}: Syntax error!`, err.message);
    hasErrors = true;
  }
}

if (!hasErrors) {
  console.log('★ All JavaScript files passed syntax validation!');
} else {
  process.exit(1);
}

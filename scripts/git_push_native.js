import { execSync } from 'child_process';
import fs from 'fs';

console.log('1. Getting GitHub token...');
const token = execSync('powershell -ExecutionPolicy Bypass -File scripts/get_token.ps1', { encoding: 'utf8' }).trim();
if (!token || !token.startsWith('ghp_')) {
  console.error('No token found');
  process.exit(1);
}

const git = 'C:\\Users\\prince\\MinGit\\cmd\\git.exe';
const remoteUrl = `https://${token}@github.com/vanshu6969/kavana-ai.git`;

try {
  execSync(`"${git}" remote remove origin`, { stdio: 'ignore' });
} catch(e) {}

console.log('2. Setting remote and syncing with main...');
execSync(`"${git}" remote add origin "${remoteUrl}"`);
execSync(`"${git}" branch -M main`);
execSync(`"${git}" fetch origin main`);
execSync(`"${git}" reset origin/main`);

console.log('3. Staging all changed files and Love Villa posters...');
execSync(`"${git}" add index.html public/index.html app.js public/app.js engine.js public/engine.js stories-catalog.js public/stories-catalog.js assets/ public/assets/`);

console.log('4. Committing...');
try {
  execSync(`"${git}" commit -m "Feat: 105 definitive romance visual novel stories with Love Villa cinematic posters"`);
} catch(e) {
  console.log('Nothing to commit or already committed.');
}

console.log('5. Pushing to origin main via Git packfile...');
execSync(`"${git}" push origin main`);
console.log('🎉 SUCCESS! Pushed to https://github.com/vanshu6969/kavana-ai.git');

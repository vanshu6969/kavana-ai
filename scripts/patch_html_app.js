import fs from 'fs';
import path from 'path';

console.log('Patching character-lore-engine.js, ai-service.js, index.html and app.js...');

// 1. UPDATE index.html & public/index.html with Puter.js for free zero-config LLM
function patchHtml(htmlPath) {
  if (!fs.existsSync(htmlPath)) return;
  let html = fs.readFileSync(htmlPath, 'utf8');
  if (!html.includes('js.puter.com')) {
    html = html.replace('</head>', '  <script src="https://js.puter.com/v2/"></script>\n</head>');
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`✓ Added Puter.js to ${htmlPath}`);
  }
}
patchHtml('index.html');
patchHtml('public/index.html');

// 2. UPDATE app.js & public/app.js to add version cache-busting to all poster images
function patchAppJs(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Replace posterUrl in createStoryCardElement
  code = code.replace(/const posterUrl = story\.avatar \|\| story\.cover;/g, `const posterUrl = (story.avatar || story.cover) + '?v=vn_female_v3';`);
  
  // Replace avatar in story-avatar-item
  code = code.replace(/<img src="\${story\.avatar}"/g, `<img src="\${story.avatar}?v=vn_female_v3"`);
  
  // Replace hero banner
  code = code.replace(/heroBanner\.style\.backgroundImage = `url\('\${s\.cover \|\| s\.avatar \|\| 'assets\/love_villa\.jpg'}'\)`/g, `heroBanner.style.backgroundImage = \`url('\${s.cover || s.avatar || 'assets/love_villa.jpg'}?v=vn_female_v3')\``);
  
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`✓ Added poster cache-busting '?v=vn_female_v3' to ${filePath}`);
}
patchAppJs('app.js');
patchAppJs('public/app.js');

console.log('HTML and App.js patched successfully!');

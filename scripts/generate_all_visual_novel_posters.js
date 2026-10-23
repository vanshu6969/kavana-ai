import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { KAVANA_ORIGINAL_STORIES } from '../stories-catalog.js';

// Images that MUST be preserved as the golden standard
const PRESERVED_FILES = new Set([
  'love_villa.jpg',
  'love_villa_avatar.jpg',
  'poster_love_villa.jpg',
  'poster_aryan_ceo.jpg',
  'poster_kabir_mafia.jpg',
  'poster_roommates.jpg',
  'poster_stepbrother_veer.jpg',
  'poster_bodyguard_vikram.jpg'
]);

const usedImageIds = new Set();

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

function selectTagsForStory(story) {
  const gender = story.gender || 'male';
  const text = `${story.id} ${story.title} ${story.characterName} ${story.category}`.toLowerCase();

  if (gender === 'female') {
    if (text.includes('professor') || text.includes('lectures') || text.includes('doctor')) {
      return ['1girl solo glasses rating:safe', '1girl solo shirt rating:safe'];
    }
    if (text.includes('demon') || text.includes('vampire') || text.includes('gothic') || text.includes('enchantress')) {
      return ['1girl solo gothic rating:safe', '1girl solo red_eyes rating:safe', '1girl solo black_hair rating:safe'];
    }
    if (text.includes('ballerina') || text.includes('dance')) {
      return ['1girl solo dress rating:safe', '1girl solo skirt rating:safe'];
    }
    if (text.includes('yandere') || text.includes('school')) {
      return ['1girl solo school_uniform rating:safe', '1girl solo smile rating:safe'];
    }
    if (text.includes('kimono') || text.includes('geisha') || text.includes('yakuza')) {
      return ['1girl solo kimono rating:safe', '1girl solo japanese_clothes rating:safe'];
    }
    if (text.includes('flight') || text.includes('uniform')) {
      return ['1girl solo uniform rating:safe', '1girl solo necktie rating:safe'];
    }
    if (text.includes('monaco') || text.includes('heiress') || text.includes('villa') || text.includes('syndicate') || text.includes('queen')) {
      return ['1girl solo evening_gown rating:safe', '1girl solo jewelry rating:safe', '1girl solo dress rating:safe'];
    }
    return [
      '1girl solo dress rating:safe',
      '1girl solo jewelry rating:safe',
      '1girl solo long_hair rating:safe',
      '1girl solo looking_at_viewer rating:safe'
    ];
  }

  // Male archetypes
  if (text.includes('ceo') || text.includes('billionaire') || text.includes('tycoon') || text.includes('wallstreet') || text.includes('contract')) {
    return [
      '1boy solo suit rating:safe',
      '1boy solo necktie rating:safe',
      '1boy solo formal rating:safe',
      '1boy solo black_hair suit rating:safe'
    ];
  }
  if (text.includes('mafia') || text.includes('don') || text.includes('cartel') || text.includes('syndicate') || text.includes('underworld') || text.includes('cuban') || text.includes('sicilian')) {
    return [
      '1boy solo coat rating:safe',
      '1boy solo gloves rating:safe',
      '1boy solo dark rating:safe',
      '1boy solo suit dark rating:safe'
    ];
  }
  if (text.includes('badboy') || text.includes('biker') || text.includes('racer') || text.includes('mechanic') || text.includes('outlaw') || text.includes('rebound') || text.includes('tattoo')) {
    return [
      '1boy solo jacket rating:safe',
      '1boy solo leather_jacket rating:safe',
      '1boy solo pierced_ear rating:safe',
      '1boy solo dark rating:safe'
    ];
  }
  if (text.includes('prince') || text.includes('duke') || text.includes('baron') || text.includes('royal') || text.includes('sheikh') || text.includes('archduke') || text.includes('laird') || text.includes('feudal') || text.includes('thakur')) {
    return [
      '1boy solo cape rating:safe',
      '1boy solo jewelry rating:safe',
      '1boy solo crown rating:safe',
      '1boy solo formal rating:safe'
    ];
  }
  if (text.includes('vampire') || text.includes('demon') || text.includes('sorcerer') || text.includes('magic') || text.includes('alchemist')) {
    return [
      '1boy solo fantasy rating:safe',
      '1boy solo cape rating:safe',
      '1boy solo red_eyes rating:safe',
      '1boy solo silver_hair rating:safe'
    ];
  }
  if (text.includes('doctor') || text.includes('surgeon') || text.includes('professor') || text.includes('tech') || text.includes('architect') || text.includes('lawyer')) {
    return [
      '1boy solo glasses rating:safe',
      '1boy solo lab_coat rating:safe',
      '1boy solo sweater rating:safe',
      '1boy solo formal rating:safe'
    ];
  }
  if (text.includes('bodyguard') || text.includes('captain') || text.includes('detective') || text.includes('pilot') || text.includes('guard')) {
    return [
      '1boy solo uniform rating:safe',
      '1boy solo coat rating:safe',
      '1boy solo gloves rating:safe'
    ];
  }
  if (text.includes('mma') || text.includes('gym') || text.includes('trainer') || text.includes('athlete') || text.includes('hockey')) {
    return [
      '1boy solo muscular rating:safe',
      '1boy solo jacket rating:safe',
      '1boy solo athletic rating:safe'
    ];
  }
  if (text.includes('yakuza') || text.includes('host club')) {
    return [
      '1boy solo suit rating:safe',
      '1boy solo coat rating:safe',
      '1boy solo flower rating:safe'
    ];
  }

  return [
    '1boy solo jacket rating:safe',
    '1boy solo suit rating:safe',
    '1boy solo coat rating:safe',
    '1boy solo dark rating:safe',
    '1boy solo formal rating:safe'
  ];
}

async function findDistinctImage(tagList) {
  for (const tag of tagList) {
    for (let page = 0; page < 6; page++) {
      const url = `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(tag)}&limit=30&pid=${page}`;
      const list = await fetchJson(url);
      for (const item of list) {
        if (!usedImageIds.has(item.id) && item.width >= 400 && item.height >= 500) {
          usedImageIds.add(item.id);
          return item.sample_url || item.file_url || `https://safebooru.org/images/${item.directory}/${item.image}`;
        }
      }
    }
  }

  // Fallback to broad query
  const fallbackTag = tagList[0].startsWith('1girl') ? '1girl solo rating:safe' : '1boy solo rating:safe';
  for (let page = 0; page < 10; page++) {
    const url = `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(fallbackTag)}&limit=40&pid=${page}`;
    const list = await fetchJson(url);
    for (const item of list) {
      if (!usedImageIds.has(item.id) && item.width >= 400 && item.height >= 500) {
        usedImageIds.add(item.id);
        return item.sample_url || item.file_url || `https://safebooru.org/images/${item.directory}/${item.image}`;
      }
    }
  }
  return null;
}

function processWithPowerShell(rawPath, fileName) {
  const normRaw = rawPath.replace(/\\/g, '/');
  const psCmd = `powershell -ExecutionPolicy Bypass -File scripts/render_clean_poster.ps1 -rawPath "${normRaw}" -destFileName "${fileName}"`;
  execSync(psCmd, { stdio: 'pipe' });
}

async function main() {
  console.log(`Starting generation for all ${KAVANA_ORIGINAL_STORIES.length} stories...`);

  if (!fs.existsSync('assets')) fs.mkdirSync('assets');
  if (!fs.existsSync('public/assets')) fs.mkdirSync('public/assets', { recursive: true });
  if (!fs.existsSync('scratch')) fs.mkdirSync('scratch');

  let processedCount = 0;
  let preservedCount = 0;

  for (let idx = 0; idx < KAVANA_ORIGINAL_STORIES.length; idx++) {
    const story = KAVANA_ORIGINAL_STORIES[idx];
    const fileName = path.basename(story.avatar);
    const rootPath = path.join('assets', fileName);
    const pubPath = path.join('public/assets', fileName);

    // 1. Preserved Golden Standard Posters (Story 1-6)
    if (PRESERVED_FILES.has(fileName)) {
      if (fs.existsSync(rootPath)) {
        fs.copyFileSync(rootPath, pubPath);
        console.log(`[${idx + 1}/${KAVANA_ORIGINAL_STORIES.length}] PRESERVED AI ARTWORK: ${fileName}`);
        preservedCount++;
        continue;
      }
    }

    // 2. Lucian and Valeria already have high-end AI artworks
    if (fileName === 'poster_prince_lucian.jpg' && fs.existsSync('assets/lucian.jpg')) {
      processWithPowerShell('assets/lucian.jpg', fileName);
      console.log(`[${idx + 1}/${KAVANA_ORIGINAL_STORIES.length}] RENDERED AI PRINCE LUCIAN: ${fileName}`);
      processedCount++;
      continue;
    }
    if (fileName === 'poster_valeria.jpg' && fs.existsSync('assets/valeria.jpg')) {
      processWithPowerShell('assets/valeria.jpg', fileName);
      console.log(`[${idx + 1}/${KAVANA_ORIGINAL_STORIES.length}] RENDERED AI VALERIA: ${fileName}`);
      processedCount++;
      continue;
    }

    // 3. For all other stories, fetch distinct authentic visual-novel art
    const tagList = selectTagsForStory(story);
    const rawPath = path.join('scratch', `raw_${fileName}`);

    try {
      const imgUrl = await findDistinctImage(tagList);
      if (!imgUrl) {
        console.warn(`[${idx + 1}] Warning: No distinct image found for ${fileName}, copying template.`);
        fs.copyFileSync('assets/poster_contract_bride.jpg', rawPath);
      } else {
        await downloadImage(imgUrl, rawPath);
      }

      processWithPowerShell(rawPath, fileName);
      console.log(`[${idx + 1}/${KAVANA_ORIGINAL_STORIES.length}] ✓ Rendered Visual Novel Poster: ${fileName} (${story.characterName})`);
      processedCount++;
    } catch(err) {
      console.error(`[${idx + 1}] Error rendering ${fileName}:`, err.message);
    }
  }

  // Also ensure love_villa_avatar.jpg exists in both locations
  if (fs.existsSync('assets/love_villa_avatar.jpg')) {
    fs.copyFileSync('assets/love_villa_avatar.jpg', 'public/assets/love_villa_avatar.jpg');
  }

  console.log(`\n🎉 COMPLETE! Processed: ${processedCount}, Preserved: ${preservedCount}`);
}

main().catch(console.error);

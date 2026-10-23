import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { KAVANA_ORIGINAL_STORIES } from '../stories-catalog.js';

// Preserve the already immaculate female visual novel artworks
const PRESERVED_FILES = new Set([
  'love_villa.jpg',
  'love_villa_avatar.jpg',
  'poster_love_villa.jpg',
  'poster_roommates.jpg',
  'poster_valeria.jpg'
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

function selectFemaleTagsForStory(story) {
  const text = `${story.id} ${story.title} ${story.characterName} ${story.category}`.toLowerCase();

  // 1. Cold Female CEOs, Boss Ladies, Tycoons, Wall Street
  if (text.includes('ceo') || text.includes('boss') || text.includes('resignation') || text.includes('trapped') || text.includes('tycoon') || text.includes('wallstreet') || text.includes('contract')) {
    return [
      '1girl solo suit rating:safe',
      '1girl solo necktie rating:safe',
      '1girl solo formal rating:safe',
      '1girl solo black_hair suit rating:safe',
      '1girl solo collarbone suit rating:safe'
    ];
  }

  // 2. Female Mafia Godmothers, Syndicate Queens, Dons, Cartels
  if (text.includes('mafia') || text.includes('syndicate') || text.includes('queen') || text.includes('don') || text.includes('cartel') || text.includes('underworld') || text.includes('sicilian') || text.includes('cuban')) {
    return [
      '1girl solo coat rating:safe',
      '1girl solo gloves rating:safe',
      '1girl solo dark rating:safe',
      '1girl solo black_hair coat rating:safe',
      '1girl solo cigarette rating:safe'
    ];
  }

  // 3. Bad Girls, Bikers, Street Racers, Outlaws, Rockstars, Tattoos
  if (text.includes('bad') || text.includes('biker') || text.includes('racer') || text.includes('outlaw') || text.includes('rockstar') || text.includes('tattoo') || text.includes('mechanic')) {
    return [
      '1girl solo leather_jacket rating:safe',
      '1girl solo jacket rating:safe',
      '1girl solo pierced_ear rating:safe',
      '1girl solo black_hair jacket rating:safe'
    ];
  }

  // 4. Royalty, Princesses, Duchesses, Baronesses, Sultanas, Ranis
  if (text.includes('princess') || text.includes('queen') || text.includes('duchess') || text.includes('baroness') || text.includes('sultana') || text.includes('sheikha') || text.includes('rani') || text.includes('royal') || text.includes('archduchess') || text.includes('palace')) {
    return [
      '1girl solo evening_gown rating:safe',
      '1girl solo crown rating:safe',
      '1girl solo jewelry rating:safe',
      '1girl solo dress rating:safe'
    ];
  }

  // 5. Dark Fantasy, Vampires, Demonesses, Witches, Sorceresses, Alchemists
  if (text.includes('vampire') || text.includes('demon') || text.includes('sorcer') || text.includes('magic') || text.includes('gothic') || text.includes('alchemist')) {
    return [
      '1girl solo gothic rating:safe',
      '1girl solo red_eyes rating:safe',
      '1girl solo vampire rating:safe',
      '1girl solo horns rating:safe',
      '1girl solo silver_hair rating:safe'
    ];
  }

  // 6. Female Doctors, Surgeons, Professors, Lawyers, Detectives
  if (text.includes('doctor') || text.includes('surgeon') || text.includes('professor') || text.includes('lawyer') || text.includes('detective') || text.includes('lectures') || text.includes('judge')) {
    return [
      '1girl solo glasses rating:safe',
      '1girl solo lab_coat rating:safe',
      '1girl solo shirt rating:safe',
      '1girl solo necktie rating:safe'
    ];
  }

  // 7. Military, Bodyguards, Security, Flight Attendant, Police
  if (text.includes('bodyguard') || text.includes('military') || text.includes('captain') || text.includes('guard') || text.includes('flight') || text.includes('uniform') || text.includes('spy')) {
    return [
      '1girl solo uniform rating:safe',
      '1girl solo military rating:safe',
      '1girl solo gloves rating:safe',
      '1girl solo coat rating:safe'
    ];
  }

  // 8. Female MMA Fighters, Gym Trainers, Athletes, Hockey
  if (text.includes('mma') || text.includes('gym') || text.includes('trainer') || text.includes('athlete') || text.includes('workout') || text.includes('hockey')) {
    return [
      '1girl solo sports_bra rating:safe',
      '1girl solo athletic rating:safe',
      '1girl solo jacket rating:safe',
      '1girl solo tank_top rating:safe'
    ];
  }

  // 9. Traditional, Kimono, Geisha, Japanese
  if (text.includes('geisha') || text.includes('kimono') || text.includes('yakuza') || text.includes('kyoto') || text.includes('hostess')) {
    return [
      '1girl solo kimono rating:safe',
      '1girl solo japanese_clothes rating:safe'
    ];
  }

  // 10. Step-sister, Seductive Neighbor, Roommate, Best Friend
  if (text.includes('step') || text.includes('neighbor') || text.includes('friend') || text.includes('rebound') || text.includes('roommate')) {
    return [
      '1girl solo sweater rating:safe',
      '1girl solo casual rating:safe',
      '1girl solo camisole rating:safe',
      '1girl solo dress rating:safe'
    ];
  }

  // Default fallback female queries
  return [
    '1girl solo dress rating:safe',
    '1girl solo evening_gown rating:safe',
    '1girl solo jewelry rating:safe',
    '1girl solo long_hair rating:safe',
    '1girl solo looking_at_viewer rating:safe'
  ];
}

async function findDistinctFemaleImage(tagList) {
  for (const tag of tagList) {
    for (let page = 0; page < 8; page++) {
      const url = `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(tag)}&limit=30&pid=${page}`;
      const list = await fetchJson(url);
      for (const item of list) {
        if (!usedImageIds.has(item.id) && item.width >= 400 && item.height >= 500 && (item.image.endsWith('.jpg') || item.image.endsWith('.png') || item.image.endsWith('.jpeg'))) {
          usedImageIds.add(item.id);
          return item.sample_url || item.file_url || `https://safebooru.org/images/${item.directory}/${item.image}`;
        }
      }
    }
  }

  // Broad fallback
  const fallbackTag = '1girl solo dress rating:safe';
  for (let page = 0; page < 15; page++) {
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
  console.log(`Starting female visual novel poster generation for all ${KAVANA_ORIGINAL_STORIES.length} stories...`);

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

    // Preserved high-end female artwork
    if (PRESERVED_FILES.has(fileName) && fs.existsSync(rootPath)) {
      fs.copyFileSync(rootPath, pubPath);
      console.log(`[${idx + 1}/${KAVANA_ORIGINAL_STORIES.length}] PRESERVED IMMACULATE ART: ${fileName}`);
      preservedCount++;
      continue;
    }

    const tagList = selectFemaleTagsForStory(story);
    const rawPath = path.join('scratch', `raw_female_${fileName}`);

    try {
      const imgUrl = await findDistinctFemaleImage(tagList);
      if (!imgUrl) {
        console.warn(`[${idx + 1}] Warning: No distinct female image found for ${fileName}, copying template.`);
        fs.copyFileSync('assets/poster_contract_bride.jpg', rawPath);
      } else {
        await downloadImage(imgUrl, rawPath);
      }

      processWithPowerShell(rawPath, fileName);
      console.log(`[${idx + 1}/${KAVANA_ORIGINAL_STORIES.length}] ✓ Female Visual Novel Poster: ${fileName} (${story.characterName})`);
      processedCount++;
    } catch(err) {
      console.error(`[${idx + 1}] Error rendering ${fileName}:`, err.message);
    }
  }

  // Ensure love_villa_avatar.jpg is copied
  if (fs.existsSync('assets/love_villa_avatar.jpg')) {
    fs.copyFileSync('assets/love_villa_avatar.jpg', 'public/assets/love_villa_avatar.jpg');
  }

  console.log(`\n🎉 ALL FEMALE VISUAL NOVEL POSTERS COMPLETE! Processed: ${processedCount}, Preserved: ${preservedCount}`);
}

main().catch(console.error);

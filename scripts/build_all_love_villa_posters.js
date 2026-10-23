import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { KAVANA_STORIES_CATALOG } from '../stories-catalog.js';

const TMDB_KEY = '5f85fd51bf4325e76cad21aadfe1ecc6';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'KavanaBuilder/1.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve(null); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function collectFemaleImages(targetCount = 110) {
  console.log('1. Collecting high-res female portraits from TMDb API...');
  const urls = [];
  const usedPaths = new Set();

  for (let page = 1; page <= 12 && urls.length < targetCount; page++) {
    const data = await fetchJson(`https://api.themoviedb.org/3/person/popular?api_key=${TMDB_KEY}&page=${page}`);
    if (!data || !data.results) continue;
    for (const p of data.results) {
      if (p.gender === 1 && p.profile_path && !usedPaths.has(p.profile_path)) {
        usedPaths.add(p.profile_path);
        urls.push(`https://image.tmdb.org/t/p/w780${p.profile_path}`);
        if (urls.length >= targetCount) break;
      }
    }
  }

  // Supplement with romantic drama movie posters if needed
  if (urls.length < targetCount) {
    for (let page = 1; page <= 5 && urls.length < targetCount; page++) {
      const data = await fetchJson(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=10749&sort_by=popularity.desc&page=${page}`);
      if (!data || !data.results) continue;
      for (const m of data.results) {
        if (m.poster_path && !usedPaths.has(m.poster_path)) {
          usedPaths.add(m.poster_path);
          urls.push(`https://image.tmdb.org/t/p/w780${m.poster_path}`);
          if (urls.length >= targetCount) break;
        }
      }
    }
  }

  console.log(`✓ Collected ${urls.length} unique glamorous high-res female images.`);
  return urls;
}

async function main() {
  if (!fs.existsSync('scratch/raw_portraits')) {
    fs.mkdirSync('scratch/raw_portraits', { recursive: true });
  }

  const imageUrls = await collectFemaleImages(KAVANA_STORIES_CATALOG.length + 5);

  const PRESERVE = new Set([
    'love_villa.jpg',
    'love_villa_avatar.jpg',
    'poster_roommates.jpg',
    'poster_valeria.jpg'
  ]);

  console.log('\n2. Downloading raw portraits and preparing render list...');
  const renderList = [];

  for (let i = 0; i < KAVANA_STORIES_CATALOG.length; i++) {
    const story = KAVANA_STORIES_CATALOG[i];
    const fileName = (story.cover || story.avatar || `assets/poster_${story.id}.jpg`).replace('assets/', '');

    if (PRESERVE.has(fileName)) {
      console.log(`Preserved master cover: ${fileName}`);
      continue;
    }

    const rawPath = `scratch/raw_portraits/raw_${i}_${fileName}`;
    const imgUrl = imageUrls[i % imageUrls.length];

    try {
      if (!fs.existsSync(rawPath) || fs.statSync(rawPath).size < 10000) {
        process.stdout.write(`Downloading [${i+1}/105] for ${story.characterName}... `);
        await downloadFile(imgUrl, rawPath);
        console.log(`✓ (${(fs.statSync(rawPath).size/1024).toFixed(0)} KB)`);
      }
      renderList.push({
        rawPath: rawPath.replace(/\\/g, '/'),
        fileName,
        title: story.title,
        character: story.characterName.split('(')[0].trim()
      });
    } catch(err) {
      console.error(`Download failed for story ${i+1}: ${err.message}`);
    }
  }

  fs.writeFileSync('scratch/render_list.json', JSON.stringify(renderList, null, 2), 'utf8');
  console.log(`\n✓ Saved ${renderList.length} items to scratch/render_list.json for PowerShell rendering.`);
}

main().catch(console.error);

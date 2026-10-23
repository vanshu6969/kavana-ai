import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

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

async function getDistinctImage(tags) {
  for (let page = 0; page < 5; page++) {
    const list = await fetchJson(`https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(tags)}&limit=30&pid=${page}`);
    for (const item of list) {
      if (!usedImageIds.has(item.id) && item.width >= 400 && item.height >= 500) {
        usedImageIds.add(item.id);
        const imgUrl = item.sample_url || item.file_url || `https://safebooru.org/images/${item.directory}/${item.image}`;
        return imgUrl;
      }
    }
  }
  return null;
}

function processPosterWithPowerShell(rawFile, destFileName) {
  const normRaw = rawFile.replace(/\\/g, '/');
  const psCmd = `powershell -ExecutionPolicy Bypass -File scripts/render_clean_poster.ps1 -rawPath "${normRaw}" -destFileName "${destFileName}"`;
  execSync(psCmd, { stdio: 'inherit' });
}

(async () => {
  console.log('Testing 3 target stories...');
  const testStories = [
    { fn: 'poster_trapped_ceo.jpg', tags: '1boy solo suit necktie rating:safe' },
    { fn: 'poster_playboy_baron.jpg', tags: '1boy solo jewelry cape rating:safe' },
    { fn: 'poster_desert_sheikh.jpg', tags: '1boy solo cape rating:safe' }
  ];

  for (const s of testStories) {
    const rawPath = `scratch/raw_${s.fn}`;
    console.log(`Querying ${s.tags} for ${s.fn}...`);
    const imgUrl = await getDistinctImage(s.tags);
    console.log(`Downloading ${imgUrl}...`);
    await downloadImage(imgUrl, rawPath);
    console.log(`Processing ${s.fn}...`);
    processPosterWithPowerShell(rawPath, s.fn);
  }
  console.log('Test completed successfully!');
})();

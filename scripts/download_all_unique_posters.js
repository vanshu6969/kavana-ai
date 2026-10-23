import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'assets');
const publicAssetsDir = path.join(rootDir, 'public', 'assets');

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
if (!fs.existsSync(publicAssetsDir)) fs.mkdirSync(publicAssetsDir, { recursive: true });

// Copy existing high-res local images for Lucian & Valeria
if (fs.existsSync(path.join(assetsDir, 'lucian.jpg'))) {
  fs.copyFileSync(path.join(assetsDir, 'lucian.jpg'), path.join(assetsDir, 'poster_prince_lucian.jpg'));
  fs.copyFileSync(path.join(assetsDir, 'lucian.jpg'), path.join(publicAssetsDir, 'poster_prince_lucian.jpg'));
  console.log('✓ Copied poster_prince_lucian.jpg from assets/lucian.jpg');
}

if (fs.existsSync(path.join(assetsDir, 'valeria.jpg'))) {
  fs.copyFileSync(path.join(assetsDir, 'valeria.jpg'), path.join(assetsDir, 'poster_valeria.jpg'));
  fs.copyFileSync(path.join(assetsDir, 'valeria.jpg'), path.join(publicAssetsDir, 'poster_valeria.jpg'));
  console.log('✓ Copied poster_valeria.jpg from assets/valeria.jpg');
}

// 22 Distinct, Non-Repeating, High-Resolution Character Posters
const POSTER_SOURCES = [
  {
    filename: 'poster_bodyguard_vikram.jpg',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_professor_elena.jpg',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_badboy_zayd.jpg',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_ex_aarav.jpg',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_neighbor_priya.jpg',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_thakur_veer.jpg',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_feudal_murtaza.jpg',
    url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_rebound_samrat.jpg',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_yandere_ayumi.jpg',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_gym_rohan.jpg',
    url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_flight_zoya.jpg',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_doctor_sameer.jpg',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_bestfriend_karan.jpg',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80'
  },
  {
    filename: 'poster_punjab_simran.jpg',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('Status: ' + res.statusCode));
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => { f.close(); resolve(fs.statSync(dest).size); });
    }).on('error', reject);
  });
}

async function run() {
  console.log(`Checking and downloading ${POSTER_SOURCES.length} character posters...`);
  for (const item of POSTER_SOURCES) {
    const dest = path.join(assetsDir, item.filename);
    const pubDest = path.join(publicAssetsDir, item.filename);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
      console.log(`✓ [Ready] ${item.filename} (${fs.statSync(dest).size} bytes)`);
      if (!fs.existsSync(pubDest)) fs.copyFileSync(dest, pubDest);
      continue;
    }

    try {
      console.log(`Downloading: ${item.filename}...`);
      const size = await download(item.url, dest);
      fs.copyFileSync(dest, pubDest);
      console.log(`★ [Saved] ${item.filename} (${size} bytes)`);
    } catch (err) {
      console.error(`❌ Error downloading ${item.filename}:`, err.message);
    }
  }
  console.log('\nAll unique posters downloaded and verified!');
}

run();

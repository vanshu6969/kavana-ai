import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'assets');
const publicAssetsDir = path.join(rootDir, 'public', 'assets');

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
if (!fs.existsSync(publicAssetsDir)) fs.mkdirSync(publicAssetsDir, { recursive: true });

const POSTER_JOBS = [
  {
    filename: 'poster_roommates.jpg',
    prompt: 'cinematic visual novel book cover of two gorgeous college rival girls trapped in dorm room thunderstorm rain on window warm candlelight romantic drama 8k'
  },
  {
    filename: 'poster_stepbrother_veer.jpg',
    prompt: 'cinematic dark romance book cover handsome rebellious 22 year old step brother standing in doorway midnight shadows intense romantic taboo passion visual novel masterpiece 8k'
  },
  {
    filename: 'poster_bodyguard_vikram.jpg',
    prompt: 'cinematic romantic novel cover handsome rugged special forces military bodyguard in dark tactical suit protective stance luxury hotel backdrop intense jawline 8k'
  },
  {
    filename: 'poster_professor_elena.jpg',
    prompt: 'cinematic book cover gorgeous 28 year old female literature professor in glasses and elegant silk blouse in university library after hours moody dark academia romance 8k'
  },
  {
    filename: 'poster_badboy_zayd.jpg',
    prompt: 'cinematic dark romance book cover handsome bad boy college street racer leaning on motorcycle leather jacket night city neon lights intense seductive gaze 8k'
  },
  {
    filename: 'poster_ex_aarav.jpg',
    prompt: 'cinematic drama romance book cover handsome toxic ex fiancé in black tuxedo confronting lover in luxury wedding venue terrace moonlit night intense emotional drama 8k'
  },
  {
    filename: 'poster_neighbor_priya.jpg',
    prompt: 'cinematic visual novel cover gorgeous seductive 25 year old Indian neighbor woman wearing elegant crimson saree standing at apartment balcony midnight romantic glow 8k'
  },
  {
    filename: 'poster_thakur_veer.jpg',
    prompt: 'cinematic royal romance book cover fierce handsome Rajput prince Thakur in royal desert haveli courtyard black marwari horse dusty wind crimson safa raw authority 8k'
  },
  {
    filename: 'poster_feudal_murtaza.jpg',
    prompt: 'cinematic dark romance book cover handsome brooding feudal lord in dark velvet sherwani royal estate ancient candlelit haveli dramatic intense gaze 8k'
  },
  {
    filename: 'poster_rebound_samrat.jpg',
    prompt: 'cinematic emotional romance visual novel cover handsome sensitive bad boy holding lover in moody dark apartment rainy window late night slow burn romance 8k'
  },
  {
    filename: 'poster_prince_lucian.jpg',
    prompt: 'cinematic dark fantasy romance book cover handsome vampire crown prince Lucian in gothic royal palace masquerade velvet cape crimson gothic lighting fangs 8k'
  },
  {
    filename: 'poster_demon_nyx.jpg',
    prompt: 'cinematic dark fantasy visual novel cover gorgeous obsidian demon empress Nyx with elegant horns glowing violet eyes dark gothic throne room seductive power 8k'
  },
  {
    filename: 'poster_yandere_ayumi.jpg',
    prompt: 'cinematic anime visual novel book cover beautiful yandere girl Ayumi in modern academy uniform cherry blossom petals sunset intense possessive eyes psychological drama 8k'
  },
  {
    filename: 'poster_valeria.jpg',
    prompt: 'cinematic dark fantasy romance book cover enchanting shadow sorceress Valeria Vane in dark purple gothic corset glowing magical runes dark romantic fantasy 8k'
  },
  {
    filename: 'poster_gym_rohan.jpg',
    prompt: 'cinematic romance novel cover handsome athletic personal fitness trainer in luxury private gym towel on shoulders intense romantic chemistry after hours workout 8k'
  },
  {
    filename: 'poster_flight_zoya.jpg',
    prompt: 'cinematic luxury romance book cover beautiful glamorous flight attendant in chic red airline uniform luxury private jet cabin night flight cabin lights romantic tension 8k'
  },
  {
    filename: 'poster_doctor_sameer.jpg',
    prompt: 'cinematic medical drama romance cover handsome 32 year old chief surgeon in doctor coat stethoscope late night quiet hospital corridor intense romantic eyes 8k'
  },
  {
    filename: 'poster_bestfriend_karan.jpg',
    prompt: 'cinematic romance visual novel cover handsome childhood best friend turned lover sitting close on couch late night movie warm fairy lights friends to lovers 8k'
  },
  {
    filename: 'poster_punjab_simran.jpg',
    prompt: 'cinematic romantic drama book cover beautiful Punjabi girl Simran in traditional embroidered phulkari suit standing in golden mustard fields sunset farmhouse romance 8k'
  }
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve(dest);
      });
      stream.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(40000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

async function run() {
  console.log(`Starting generation for ${POSTER_JOBS.length} story posters...`);
  let successCount = 0;

  for (let i = 0; i < POSTER_JOBS.length; i++) {
    const job = POSTER_JOBS[i];
    const targetFile = path.join(assetsDir, job.filename);
    const publicTargetFile = path.join(publicAssetsDir, job.filename);

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 20000) {
      console.log(`✓ [Existing] ${job.filename} (${fs.statSync(targetFile).size} bytes)`);
      if (!fs.existsSync(publicTargetFile)) fs.copyFileSync(targetFile, publicTargetFile);
      successCount++;
      continue;
    }

    console.log(`[${i + 1}/${POSTER_JOBS.length}] Generating AI Poster: ${job.filename}...`);
    const encodedPrompt = encodeURIComponent(job.prompt);
    const seed = 1000 + i * 47;
    // Note: Do NOT add model parameter so it uses the free default engine
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=1024&nologo=true&seed=${seed}`;

    try {
      await downloadImage(url, targetFile);
      const size = fs.statSync(targetFile).size;
      if (size < 5000) {
        throw new Error(`Downloaded file too small: ${size} bytes`);
      }
      fs.copyFileSync(targetFile, publicTargetFile);
      console.log(`★ [Created] ${job.filename} (${size} bytes)`);
      successCount++;
    } catch (err) {
      console.error(`❌ Error downloading ${job.filename}: ${err.message}`);
    }
    // Small pause between downloads
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`\nDone! Successfully processed ${successCount} / ${POSTER_JOBS.length} posters.`);
}

run();

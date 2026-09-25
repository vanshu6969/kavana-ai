/**
 * Kavana AI - 1:1 Official Website & Interactive Platform Controller
 */

import { CHARACTERS, KAVANA_STORIES } from './engine.js';
import { 
  generateAIChatReply, 
  generateDynamicNovel, 
  getProviderSettings, 
  saveProviderSettings 
} from './ai-service.js';
import { 
  fetchTMDbMedia, 
  searchTMDb, 
  convertTMDbToKavanaStory, 
  saveCustomTMDbStory, 
  getSavedCustomTMDbStories,
  VERIFIED_TMDB_STORIES 
} from './tmdb-service.js';

// Prepend user's saved custom TMDb stories from localStorage
try {
  const savedCustom = getSavedCustomTMDbStories();
  if (savedCustom && savedCustom.length > 0) {
    savedCustom.forEach(story => {
      if (!KAVANA_STORIES.some(s => s.id === story.id || (story.tmdbId && s.tmdbId === story.tmdbId))) {
        KAVANA_STORIES.unshift(story);
      }
    });
  }
} catch (e) {
  console.warn('Could not load custom TMDb stories:', e);
}

// Application State
const state = {
  currentView: 'stories-explore', // Clean modern cinema platform default
  activeLang: localStorage.getItem('kavana_lang') || 'hinglish',
  activeStory: KAVANA_STORIES[0],
  activeScenario: null,
  searchQuery: '',
  activeChapterId: 'c1',
  activeChatPartnerId: 'kabir',
  credits: parseInt(localStorage.getItem('kavana_coins') || '500', 10),
  activeCategory: 'all',
  
  // Dance Studio
  activeDancerId: 'kabir',
  activeDanceRoutine: 'bhangra',
  isDancing: false,
  danceInterval: null,

  characterState: {
    kabir: { affection: 65, tension: 90, intimacyLevel: '🔥 Fever Pitch (Extreme 18+)' },
    valeria: { affection: 55, tension: 80, intimacyLevel: '🔥 Fever Pitch (Extreme 18+)' },
    lucian: { affection: 50, tension: 85, intimacyLevel: '⚡ High Sexual Tension' }
  },

  chatHistory: {
    kabir: [],
    valeria: [],
    lucian: []
  },

  smartReplies: {
    kabir: [],
    valeria: [],
    lucian: []
  },

  audioPlaying: false
};

// Web Audio API Ambient & Beat Synthesizer
let audioCtx = null;
let bgGainNode = null;
let bgOsc1 = null;
let bgOsc2 = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function toggleAmbientAudio() {
  const icon = document.getElementById('audio-icon');
  const btn = document.getElementById('btn-ambient-audio');
  const ctx = getAudioContext();

  if (state.audioPlaying) {
    if (bgGainNode) {
      bgGainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
      setTimeout(() => {
        if (bgOsc1) { bgOsc1.stop(); bgOsc1.disconnect(); }
        if (bgOsc2) { bgOsc2.stop(); bgOsc2.disconnect(); }
      }, 1000);
    }
    state.audioPlaying = false;
    icon.textContent = '🔇';
    btn?.classList.remove('active');
    showToast({ title: 'Atmosphere Muted', message: 'Background sound paused.', type: 'info' });
  } else {
    bgGainNode = ctx.createGain();
    bgGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    bgGainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);
    bgGainNode.connect(ctx.destination);

    bgOsc1 = ctx.createOscillator();
    bgOsc1.type = 'sine';
    bgOsc1.frequency.setValueAtTime(65.41, ctx.currentTime);
    bgOsc1.connect(bgGainNode);
    bgOsc1.start();

    bgOsc2 = ctx.createOscillator();
    bgOsc2.type = 'triangle';
    bgOsc2.frequency.setValueAtTime(98.00, ctx.currentTime);
    bgOsc2.connect(bgGainNode);
    bgOsc2.start();

    state.audioPlaying = true;
    icon.textContent = '🎵';
    btn?.classList.add('active');
    showToast({ title: 'Atmosphere On', message: 'Kavana immersive audio active.', type: 'success' });
  }
}

function playDanceBeat(style = 'bhangra') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const kick = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kick.frequency.setValueAtTime(style === 'bhangra' ? 140 : 120, now);
    kick.frequency.exponentialRampToValueAtTime(40, now + 0.25);
    kickGain.gain.setValueAtTime(0.2, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    kick.connect(kickGain);
    kickGain.connect(ctx.destination);
    kick.start(now);
    kick.stop(now + 0.26);

    setTimeout(() => {
      const snare = ctx.createOscillator();
      const snareGain = ctx.createGain();
      snare.type = 'triangle';
      snare.frequency.setValueAtTime(320, ctx.currentTime);
      snareGain.gain.setValueAtTime(0.12, ctx.currentTime);
      snareGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      snare.connect(snareGain);
      snareGain.connect(ctx.destination);
      snare.start(ctx.currentTime);
      snare.stop(ctx.currentTime + 0.16);
    }, 280);
  } catch (e) {}
}

function playChime(freq = 520) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

// Toast Notifications with Retry
export function showToast({ title, message, type = 'info', retryAction = null, duration = 5000 }) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icons = { info: 'ℹ️', success: '✨', error: '⚠️', warning: '🔞' };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || '✨'}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
      <div class="toast-actions">
        ${retryAction ? `<button class="toast-retry-btn" id="toast-retry-action">↺ Retry Operation</button>` : ''}
        <button class="toast-dismiss-btn" id="toast-dismiss-btn">Dismiss</button>
      </div>
    </div>
  `;

  container.appendChild(toast);

  const dismissBtn = toast.querySelector('#toast-dismiss-btn');
  const retryBtn = toast.querySelector('#toast-retry-action');

  const removeToast = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.25s ease-out';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  };

  dismissBtn?.addEventListener('click', removeToast);
  if (retryBtn && retryAction) {
    retryBtn.addEventListener('click', () => {
      removeToast();
      retryAction();
    });
  }

  if (duration > 0) setTimeout(removeToast, duration);
}

// Tab & View Router
function switchView(viewName) {
  if (viewName === 'home-web') {
    viewName = 'stories-explore';
  }
  state.currentView = viewName;
  playChime(600);

  // Update Nav Links & Mobile Dock
  document.querySelectorAll('.kavana-nav-link, .nav-btn, .mobile-nav-item, .mobile-dock-btn').forEach(btn => {
    if (btn.dataset.view === viewName) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  const appContainer = document.getElementById('main-app-container');
  if (appContainer) appContainer.style.display = 'block';

  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(`view-${viewName}`)?.classList.add('active');

  if (viewName === 'stories-explore') renderExploreFeed();
  else if (viewName === 'story-reader') renderStoryReader();
  else if (viewName === 'character-chat') renderChatView();
  else if (viewName === 'dance-studio') renderDanceStudio();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateCoins(delta) {
  state.credits = Math.max(0, state.credits + delta);
  localStorage.setItem('kavana_coins', state.credits.toString());
  const counter = document.getElementById('user-credits-counter');
  if (counter) counter.textContent = `${state.credits} Coins`;
}

// Launch 1:1 Interactive Scenario Chat
export function launchScenarioChat(story) {
  if (!story) story = KAVANA_STORIES[0];
  state.activeScenario = story;
  state.activeStory = story;
  const partnerId = story.id || story.characterId || 'scenario-' + Date.now();
  state.activeChatPartnerId = partnerId;

  // Initialize chat history for this specific scenario
  if (!state.chatHistory[partnerId] || state.chatHistory[partnerId].length === 0) {
    const greeting = story.openingHook || "*Smiles at you.* Hello.";
    state.chatHistory[partnerId] = [{ sender: 'ai', text: greeting }];
  }

  // Initialize smart replies
  if (!state.smartReplies[partnerId] || state.smartReplies[partnerId].length === 0) {
    state.smartReplies[partnerId] = story.smartReplies || [
      "*Step closer and answer calmly*",
      "*Stand your ground defiantly*",
      "*Question their real motives*"
    ];
  }

  // Ensure characterState exists
  if (!state.characterState[partnerId]) {
    state.characterState[partnerId] = {
      affection: 50,
      tension: 75,
      intimacyLevel: story.initialMood || '⚡ High Sexual Tension'
    };
  }

  switchView('character-chat');
  renderChatView();
}

// Open Story Directly in Immersive Visual Novel Reader
export function openStoryInReader(story) {
  if (!story) story = KAVANA_STORIES[0];
  state.activeStory = story;
  state.activeScenario = story;
  state.activeChapterId = 'c1';
  switchView('story-reader');
  renderStoryReader();
}

// Render Explore Stories Feed (105+ Stories)
function renderExploreFeed() {
  const grid = document.getElementById('kavana-stories-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const q = (state.searchQuery || '').trim().toLowerCase();
  const cat = state.activeCategory || 'all';

  const filtered = KAVANA_STORIES.filter(s => {
    // 1. Category check
    let catMatch = true;
    if (cat === 'tmdb') {
      catMatch = Boolean(s.isCustomTMDb || s.tmdbId || (s.tags || []).some(t => t.toLowerCase().includes('tmdb')));
    } else if (cat === 'pakistani') {
      catMatch = s.category?.toLowerCase().includes('pakistan') || (s.tags || []).some(t => t.toLowerCase().includes('pakistan'));
    } else if (cat === 'trending') {
      catMatch = (s.playerCount || 0) > 30000 || (s.tags || []).some(t => t.toLowerCase().includes('trending') || t.toLowerCase().includes('top') || t.toLowerCase().includes('verified'));
    } else if (cat === 'drama') {
      catMatch = s.category?.toLowerCase().includes('drama') || (s.tags || []).some(t => t.toLowerCase().includes('drama') || t.toLowerCase().includes('marriage'));
    } else if (cat === 'spicy') {
      catMatch = s.category?.toLowerCase().includes('spicy') || (s.tags || []).some(t => t.toLowerCase().includes('18+') || t.toLowerCase().includes('spicy'));
    } else if (cat === 'mafia') {
      catMatch = s.category?.toLowerCase().includes('mafia') || s.genre?.toLowerCase().includes('mafia') || (s.tags || []).some(t => t.toLowerCase().includes('mafia') || t.toLowerCase().includes('billionaire') || t.toLowerCase().includes('crime'));
    } else if (cat === 'fantasy') {
      catMatch = s.category?.toLowerCase().includes('fantasy') || s.genre?.toLowerCase().includes('fantasy') || (s.tags || []).some(t => t.toLowerCase().includes('fantasy') || t.toLowerCase().includes('vampire') || t.toLowerCase().includes('magic') || t.toLowerCase().includes('dune'));
    } else if (cat === 'desi') {
      catMatch = s.category?.toLowerCase().includes('desi') || (s.tags || []).some(t => t.toLowerCase().includes('punjabi') || t.toLowerCase().includes('desi') || t.toLowerCase().includes('hinglish') || t.toLowerCase().includes('bollywood'));
    } else if (cat === 'anime') {
      catMatch = s.category?.toLowerCase().includes('anime') || (s.tags || []).some(t => t.toLowerCase().includes('anime') || t.toLowerCase().includes('cyberpunk') || t.toLowerCase().includes('manga') || t.toLowerCase().includes('hunter'));
    } else if (cat === 'thriller') {
      catMatch = s.category?.toLowerCase().includes('thriller') || (s.tags || []).some(t => t.toLowerCase().includes('thriller') || t.toLowerCase().includes('detective') || t.toLowerCase().includes('crime') || t.toLowerCase().includes('chaos'));
    }

    if (!catMatch) return false;

    // 2. Search query check
    if (q) {
      const matchTitle = (s.title || '').toLowerCase().includes(q);
      const matchChar = (s.characterName || '').toLowerCase().includes(q);
      const matchRole = (s.userRole || '').toLowerCase().includes(q);
      const matchDesc = (s.summary || '').toLowerCase().includes(q);
      const matchTag = (s.tags || []).some(t => t.toLowerCase().includes(q));
      const matchTmdb = s.tmdbId && s.tmdbId.includes(q);
      return matchTitle || matchChar || matchRole || matchDesc || matchTag || matchTmdb;
    }

    return true;
  });

  // Update live counter badge
  const countBadge = document.getElementById('stories-count-badge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length} Scenarios`;
  }

  // Update Spotlight Hero Banner
  const spotlightStory = state.activeStory || filtered[0] || KAVANA_STORIES[0];
  const heroBanner = document.getElementById('hero-banner');
  const heroTitle = document.getElementById('hero-title-text');
  const heroDesc = document.getElementById('hero-desc-text');
  if (heroBanner && spotlightStory) {
    heroBanner.style.backgroundImage = `url('${spotlightStory.cover || spotlightStory.avatar}')`;
    if (heroTitle) heroTitle.textContent = spotlightStory.title;
    if (heroDesc) heroDesc.textContent = spotlightStory.summary;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
        <h3 style="color: #fff; margin-bottom: 0.5rem;">No scenarios match "${state.searchQuery}"</h3>
        <p style="font-size: 0.88rem;">Try searching for "Mirzapur", "Dune", "Shelby", or adapt a new title.</p>
        <button class="btn-secondary-mini" id="btn-reset-filters" style="margin-top: 1rem; padding: 0.6rem 1.25rem;">Show All Stories</button>
      </div>
    `;
    grid.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
      state.searchQuery = '';
      state.activeCategory = 'all';
      const input = document.getElementById('stories-search-input');
      if (input) input.value = '';
      document.querySelectorAll('#category-pills-container .cat-pill').forEach(p => {
        if (p.dataset.category === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      renderExploreFeed();
    });
    return;
  }

  filtered.forEach(story => {
    const card = document.createElement('div');
    card.className = 'story-card';

    const rating = story.imdbRating || '9.6';
    const posterUrl = story.avatar || story.cover;
    const isTmdb = Boolean(story.tmdbId || story.isCustomTMDb);

    card.innerHTML = `
      <div class="story-card-poster">
        <img src="${posterUrl}" alt="${story.title}" loading="lazy" onerror="this.src='${story.cover || 'assets/sanctum.jpg'}'">
        <div class="poster-gradient-fade"></div>
        <div class="poster-top-badges">
          <span class="card-rating-badge">★ ${rating}</span>
          ${isTmdb ? `<span class="card-quality-badge">CINEMA</span>` : `<span class="card-quality-badge">4K UHD</span>`}
        </div>
        <div class="card-hover-actions">
          <button class="btn-card-action primary btn-play-story">▶ Play Story</button>
          <button class="btn-card-action secondary btn-read-story">📖 Read Novel</button>
        </div>
        <div class="mobile-poster-play-badge">▶</div>
      </div>
      <div class="story-card-body">
        <h3 class="card-title-text">${story.title}</h3>
        <p class="card-character-sub">${story.characterName || 'Lead Character'} • ${story.category || 'Cinema'}</p>
        <div class="mobile-card-quick-actions">
          <button class="mobile-quick-btn play btn-play-story-mobile" type="button">▶ Play</button>
          <button class="mobile-quick-btn read btn-read-story-mobile" type="button">📖 Read</button>
        </div>
      </div>
    `;

    card.querySelector('.btn-play-story')?.addEventListener('click', (e) => {
      e.stopPropagation();
      launchScenarioChat(story);
    });

    card.querySelector('.btn-read-story')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openStoryInReader(story);
    });

    card.querySelector('.btn-play-story-mobile')?.addEventListener('click', (e) => {
      e.stopPropagation();
      launchScenarioChat(story);
    });

    card.querySelector('.btn-read-story-mobile')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openStoryInReader(story);
    });

    card.addEventListener('click', () => {
      state.activeStory = story;
      state.activeScenario = story;
      if (heroBanner) {
        heroBanner.style.backgroundImage = `url('${story.cover || story.avatar}')`;
      }
      if (heroTitle) heroTitle.textContent = story.title;
      if (heroDesc) heroDesc.textContent = story.summary;
    });

    grid.appendChild(card);
  });
}

// Render Story Reader (Gracefully supports all 105+ stories)
function renderStoryReader() {
  const story = state.activeStory || KAVANA_STORIES[0];
  const lang = state.activeLang;
  const langData = story.languages?.[lang] || story.languages?.['hinglish'] || story.languages?.['en'] || {};
  let chapters = langData.chapters;

  if (!chapters || chapters.length === 0) {
    // Generate dynamic chapters for catalog scenarios according to active language dialect
    const charName = story.characterName || 'Companion';
    const isHinglish = lang === 'hinglish' || lang === 'hindi' || lang === 'urdu';
    const isPunjabi = lang === 'punjabi';

    if (isHinglish) {
      chapters = [
        {
          id: 'c1',
          title: 'Adhyay 1: Khamosh Aamna-Saamna',
          visual: story.cover || story.avatar || 'assets/sanctum.jpg',
          speaker: charName,
          characterMood: story.initialMood || '🔥 Tanaav Aur Junoon',
          narrative: `${story.summary ? story.summary + '\n\n' : ''}${story.openingHook || '*Bina palke jhapkaye aapki taraf dekhta hai.*'}`,
          dialogue: `"Toh, ${story.userRole || 'meri jaan'}... ab aage kya karne ka iraada hai tumhara?"`,
          choices: [
            {
              text: (story.smartReplies?.[0]) || "*Aankhon mein aankhein daal kar aage badho* 'Wahi jo tum soch rahe ho.'",
              nextChapterId: 'c2a',
              deltaAffection: +12,
              deltaTension: +18,
              tone: 'Tez Aur Direct'
            },
            {
              text: (story.smartReplies?.[1]) || "*Halki si muskurahat ke saath unke bilkul qareeb aao* 'Darrte kyu ho mujhse?'",
              nextChapterId: 'c2b',
              deltaAffection: +18,
              deltaTension: +12,
              tone: 'Bekhauf Baghaawat'
            }
          ]
        },
        {
          id: 'c2a',
          title: 'Adhyay 2: Junoon Ka Bawaal',
          visual: story.cover || story.avatar || 'assets/sanctum.jpg',
          speaker: charName,
          characterMood: '🔥 Fever Pitch (Extreme 18+)',
          narrative: `Aapke lafz sunte hi kamre ki hawa garam ho jaati hai. ${charName} ki aankhon mein ek aisi deewangi aur bhookh dikhti hai jo pehle kabhi nahi dekhi. Saari dooriyan pal bhar mein pighal jati hain jab wo aapko deewar ke saath pin karta hai.`,
          dialogue: `"Tumhe andaaza bhi nahi hai ki tumne mere andar kis aag ko chheda hai," ${charName} aapki gardan par jhukte hue phusphusata hai. "Ab rukna mat."`,
          choices: [
            {
              text: "*18+ Uncensored Roleplay Chat shuru karo*",
              action: 'switch_to_chat',
              characterId: story.characterId || story.id
            }
          ]
        },
        {
          id: 'c2b',
          title: 'Adhyay 2: Bekhabar Qurbat',
          visual: story.cover || story.avatar || 'assets/sanctum.jpg',
          speaker: charName,
          characterMood: 'Be-inteha Junoon',
          narrative: `Aapka yeh bebaak andaaz ${charName} ko poori tarah hairan aur bebus kar deta hai. Ek dheemi si, madhosh kar dene wali muskurahat uske chehre par aati hai jab wo aapki kamar ko apni baahon mein thaam leta hai.`,
          dialogue: `"Maine apni zindagi mein hazaron logon ko dekha hai," ${charName} aapke chehre par ungli pherte hue kehta hai. "Par kisine mujhe is tarah dekhne ki himmat nahi ki."`,
          choices: [
            {
              text: "*18+ Uncensored Roleplay Chat shuru karo*",
              action: 'switch_to_chat',
              characterId: story.characterId || story.id
            }
          ]
        }
      ];
    } else if (isPunjabi) {
      chapters = [
        {
          id: 'c1',
          title: 'ਕਾਂਡ ੧: ਦਿਲ ਦੀ ਟੱਕਰ',
          visual: story.cover || story.avatar || 'assets/sanctum.jpg',
          speaker: charName,
          characterMood: story.initialMood || '🔥 ਬੇਬਾਕ ਇਸ਼ਕ',
          narrative: `${story.summary ? story.summary + '\n\n' : ''}${story.openingHook || '*ਤੁਹਾਡੇ ਵੱਲ ਗੂੜ੍ਹੀ ਨਜ਼ਰ ਨਾਲ ਵੇਖਦਾ ਏ।*'}`,
          dialogue: `"ਦੱਸ, ${story.userRole || 'ਸੋਹਣੀਏ'}... ਹੁਣ ਅੱਗੇ ਕੀ ਇਰਾਦਾ ਏ ਤੇਰਾ?"`,
          choices: [
            {
              text: (story.smartReplies?.[0]) || "*ਉਸਦੇ ਬਿਲਕੁਲ ਕੋਲ ਆਓ ਤੇ ਅੱਖਾਂ 'ਚ ਵੇਖੋ*",
              nextChapterId: 'c2a',
              deltaAffection: +15,
              deltaTension: +20,
              tone: 'ਰੋਹਬਦਾਰ'
            },
            {
              text: (story.smartReplies?.[1]) || "*ਮੁਸਕਰਾ ਕੇ ਆਖੋ* 'ਮੈਂ ਕਿਸੇ ਤੋਂ ਨਹੀਂ ਡਰਦੀ!'",
              nextChapterId: 'c2b',
              deltaAffection: +20,
              deltaTension: +15,
              tone: 'ਬੇਬਾਕ ਇਸ਼ਕ'
            }
          ]
        },
        {
          id: 'c2a',
          title: 'ਕਾਂਡ ੨: ਬੇਕਾਬੂ ਇਸ਼ਕ',
          visual: story.cover || story.avatar || 'assets/sanctum.jpg',
          speaker: charName,
          characterMood: '🔥 ਬੇਕਾਬੂ ਇਸ਼ਕ (Extreme 18+)',
          narrative: `ਉਹ ਆਪਣੀਆਂ ਨਰਮ ਬਾਹਾਂ ਤੁਹਾਡੇ ਗਲ 'ਚ ਪਾ ਦਿੰਦਾ ਏ। ਉਸਦੇ ਬੁੱਲ੍ਹ ਤੁਹਾਡੇ ਬੁੱਲ੍ਹਾਂ ਨਾਲ ਮਿਲਦੇ ਨੇ ਤੇ ਸਾਰੀ ਦੁਨੀਆ ਧੁੰਦਲੀ ਹੋ ਜਾਂਦੀ ਏ।`,
          dialogue: `"ਹਾਏ ਰੱਬਾ... ਤੂੰ ਤਾਂ ਮੈਨੂੰ ਕਮਲੀ ਕਰ ਦਿੱਤਾ ਏ! ਹੁਣ ਹੋਰ ਦੂਰੀ ਨਾ ਰੱਖ।"`,
          choices: [
            {
              text: "*18+ ਚੈਟ ਵਿੱਚ ਰੋਲਪਲੇਅ ਜਾਰੀ ਰੱਖੋ*",
              action: 'switch_to_chat',
              characterId: story.characterId || story.id
            }
          ]
        },
        {
          id: 'c2b',
          title: 'ਕਾਂਡ ੨: ਗਲਵਕੜੀ',
          visual: story.cover || story.avatar || 'assets/sanctum.jpg',
          speaker: charName,
          characterMood: 'ਗੂੜ੍ਹਾ ਪਿਆਰ',
          narrative: `ਉਹ ਤੁਹਾਡਾ ਲੱਕ ਫੜ ਕੇ ਤੁਹਾਨੂੰ ਆਪਣੇ ਸੀਨੇ ਨਾਲ ਘੁੱਟ ਲੈਂਦਾ ਏ। ਉਸਦੇ ਗਰਮ ਸਾਹ ਤੁਹਾਡੀ ਧੌਣ 'ਤੇ ਲੱਗਦੇ ਨੇ।`,
          dialogue: `"ਅੱਜ ਦੀ ਰਾਤ ਸਿਰਫ਼ ਸਾਡੀ ਆ, ਕੋਈ ਤੀਜਾ ਸਾਡੇ ਵਿਚਕਾਰ ਨਹੀਂ ਆ ਸਕਦਾ।"`,
          choices: [
            {
              text: "*18+ ਚੈਟ ਵਿੱਚ ਰੋਲਪਲੇਅ ਜਾਰੀ ਰੱਖੋ*",
              action: 'switch_to_chat',
              characterId: story.characterId || story.id
            }
          ]
        }
      ];
    } else {
      // English
      chapters = [
        {
          id: 'c1',
          title: 'Chapter 1: The Encounter',
          visual: story.cover || story.avatar || 'assets/sanctum.jpg',
          speaker: charName,
          characterMood: story.initialMood || 'High Drama',
          narrative: `${story.summary ? story.summary + '\n\n' : ''}${story.openingHook || '*Looks at you closely.*'}`,
          dialogue: `"So, ${story.userRole || 'my friend'}... what are you going to do now?"`,
          choices: [
            {
              text: (story.smartReplies?.[0]) || "*Step closer and answer calmly*",
              nextChapterId: 'c2a',
              deltaAffection: +10,
              deltaTension: +15,
              tone: 'Bold & Direct'
            },
            {
              text: (story.smartReplies?.[1]) || "*Stand your ground defiantly*",
              nextChapterId: 'c2b',
              deltaAffection: +15,
              deltaTension: +10,
              tone: 'Defiant & Passionate'
            }
          ]
        },
        {
          id: 'c2a',
          title: 'Chapter 2: Climax & Reckoning',
          visual: story.cover || story.avatar || 'assets/sanctum.jpg',
          speaker: charName,
          characterMood: '🔥 Fever Pitch (Extreme 18+)',
          narrative: `The room falls dead silent as your words sink in. ${charName}'s eyes blaze with raw, intoxicating intensity. Every barrier between you dissolves into electric tension.`,
          dialogue: `"You have no idea what you've just started with me," ${charName} murmurs, stepping closer until your breaths mingle. "Don't stop now."`,
          choices: [
            {
              text: "*Switch to direct 18+ uncensored roleplay chat*",
              action: 'switch_to_chat',
              characterId: story.characterId || story.id
            }
          ]
        },
        {
          id: 'c2b',
          title: 'Chapter 2: The Surrender',
          visual: story.cover || story.avatar || 'assets/sanctum.jpg',
          speaker: charName,
          characterMood: 'Intensely Devoted',
          narrative: `Your defiance catches ${charName} completely off guard. A slow, breathtaking smile breaks across their face as they reach out, catching you by the waist.`,
          dialogue: `"I've met thousands of people in this world," ${charName} whispers against your ear. "None of them dared look at me the way you do."`,
          choices: [
            {
              text: "*Step into 18+ uncensored roleplay chat*",
              action: 'switch_to_chat',
              characterId: story.characterId || story.id
            }
          ]
        }
      ];
    }
  }

  let chapter = chapters.find(c => c.id === state.activeChapterId) || chapters[0] || {
    title: 'Chapter 1',
    visual: 'assets/sanctum.jpg',
    narrative: 'AI generated scene loading...',
    speaker: 'Character'
  };

  const charId = story.characterId || story.id || 'scenario-' + (story.tmdbId || 'companion');
  const char = (story.characterId && CHARACTERS[story.characterId]) || {
    name: story.characterName || 'Companion',
    title: story.title || 'Interactive Novel',
    image: story.avatar || story.cover || 'assets/lucian.jpg',
    category: story.category || 'Cinema'
  };

  if (!state.characterState[charId]) {
    state.characterState[charId] = { affection: 60, tension: 80, intimacyLevel: story.initialMood || '⚡ High Sexual Tension' };
  }
  const charState = state.characterState[charId];

  const backdrop = document.getElementById('stage-backdrop-img');
  if (backdrop && (chapter.visual || story.cover)) {
    backdrop.style.backgroundImage = `url('${chapter.visual || story.cover}')`;
  }

  const titleTag = document.getElementById('current-scene-title');
  if (titleTag) titleTag.textContent = chapter.title || langData.title || story.title;

  const charAvatar = document.getElementById('stage-char-avatar');
  if (charAvatar) charAvatar.src = story.avatar || char.image;

  const moodTag = document.getElementById('stage-char-mood');
  if (moodTag) moodTag.textContent = chapter.characterMood || story.initialMood || 'Intense & Passionate';

  const speakerEl = document.getElementById('scene-speaker-name');
  if (speakerEl) speakerEl.innerHTML = `<span>✦</span> ${chapter.speaker || story.characterName || char.name}`;

  const proseEl = document.getElementById('scene-prose-text');
  if (proseEl) proseEl.textContent = chapter.narrative;

  const dialogueEl = document.getElementById('scene-dialogue-text');
  if (dialogueEl) {
    if (chapter.dialogue) {
      dialogueEl.style.display = 'block';
      dialogueEl.textContent = chapter.dialogue;
    } else {
      dialogueEl.style.display = 'none';
    }
  }

  const choicesContainer = document.getElementById('scene-choices-container');
  if (choicesContainer) {
    choicesContainer.innerHTML = '';
    if (chapter.choices && chapter.choices.length > 0) {
      chapter.choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `
          <span>${ch.text}</span>
          ${ch.tone ? `<span class="choice-tone-tag">${ch.tone}</span>` : ''}
        `;
        btn.addEventListener('click', () => {
          if (ch.action === 'switch_to_chat') {
            launchScenarioChat(story);
          } else if (ch.nextChapterId) {
            state.activeChapterId = ch.nextChapterId;
            renderStoryReader();
          }
        });
        choicesContainer.appendChild(btn);
      });
    } else {
      const resetBtn = document.createElement('button');
      resetBtn.className = 'choice-btn';
      resetBtn.innerHTML = `<span>↺ Replay Novel from Chapter 1</span>`;
      resetBtn.addEventListener('click', () => {
        state.activeChapterId = 'c1';
        renderStoryReader();
      });
      choicesContainer.appendChild(resetBtn);
    }
  }

  const sidePortrait = document.getElementById('side-char-portrait');
  if (sidePortrait) sidePortrait.src = story.avatar || story.cover || char.image;

  const sideName = document.getElementById('side-char-name');
  if (sideName) sideName.textContent = story.characterName || char.name;

  const sideTitle = document.getElementById('side-char-title');
  if (sideTitle) sideTitle.textContent = story.title || char.title;

  const sideCat = document.getElementById('side-char-category');
  if (sideCat) sideCat.textContent = story.category || 'Cinema';

  const fillAff = document.getElementById('fill-affection');
  const labelAff = document.getElementById('label-affection');
  if (fillAff && labelAff) {
    fillAff.style.width = `${charState.affection}%`;
    labelAff.textContent = `${charState.affection}%`;
  }

  const fillTen = document.getElementById('fill-tension');
  const labelTen = document.getElementById('label-tension');
  if (fillTen && labelTen) {
    fillTen.style.width = `${charState.tension}%`;
    labelTen.textContent = `${charState.tension}%`;
  }
}

// Render Chat View
function renderChatView() {
  const scenario = state.activeScenario;
  const charId = state.activeChatPartnerId;
  const char = CHARACTERS[charId] || {
    name: scenario?.characterName || 'Companion',
    image: scenario?.avatar || 'assets/lucian.jpg',
    archetype: scenario?.category || 'Roleplay Scenario',
    greetings: { en: scenario?.openingHook || '*Smiles.* Hello.' }
  };
  const lang = state.activeLang;

  // Initialize character state
  if (!state.characterState[charId]) {
    state.characterState[charId] = {
      affection: 50,
      tension: 75,
      intimacyLevel: scenario?.initialMood || '⚡ High Sexual Tension'
    };
  }
  const charState = state.characterState[charId];

  // Initialize chat history
  if (!state.chatHistory[charId] || state.chatHistory[charId].length === 0) {
    const greeting = scenario?.openingHook || char.greetings?.[lang] || char.greetings?.['hinglish'] || char.greetings?.['en'] || '*Smiles at you.* Hello.';
    state.chatHistory[charId] = [{ sender: 'ai', text: greeting }];
  }

  // Dynamic Roster Item for Active Story Scenario
  const rosterList = document.querySelector('.roster-list');
  let activeScenarioRoster = document.getElementById('roster-active-scenario');
  if (scenario) {
    if (!activeScenarioRoster && rosterList) {
      activeScenarioRoster = document.createElement('div');
      activeScenarioRoster.id = 'roster-active-scenario';
      activeScenarioRoster.className = 'roster-item';
      rosterList.insertBefore(activeScenarioRoster, rosterList.firstChild);
    }
    if (activeScenarioRoster) {
      activeScenarioRoster.style.display = 'flex';
      activeScenarioRoster.dataset.character = charId;
      activeScenarioRoster.innerHTML = `
        <img src="${scenario.avatar || scenario.cover || 'assets/lucian.jpg'}" alt="${scenario.characterName || 'Character'}" class="roster-avatar">
        <div class="roster-meta">
          <h4>${scenario.characterName || scenario.title}</h4>
          <p>🎬 ${scenario.title}</p>
        </div>
      `;
      activeScenarioRoster.onclick = () => {
        launchScenarioChat(scenario);
      };
    }
  } else if (activeScenarioRoster) {
    activeScenarioRoster.style.display = 'none';
  }

  // Update active roster item if matching
  document.querySelectorAll('.roster-item').forEach(c => {
    if (c.dataset.character === charId) c.classList.add('active');
    else c.classList.remove('active');
  });

  // Populate Mobile Horizontal Companion Strip
  const mobileRoster = document.getElementById('mobile-chat-roster');
  if (mobileRoster) {
    mobileRoster.innerHTML = '';

    // 1. If active scenario exists
    if (scenario) {
      const isScenActive = Boolean(state.activeScenario && (charId === scenario.id || charId.startsWith('scenario')));
      const scenBtn = document.createElement('button');
      scenBtn.type = 'button';
      scenBtn.className = `mobile-companion-pill ${isScenActive ? 'active' : ''}`;
      scenBtn.innerHTML = `
        <span class="m-avatar-ring">
          <img src="${scenario.avatar || scenario.cover || 'assets/lucian.jpg'}" alt="${scenario.characterName || 'Scenario'}">
          <span class="m-live-dot"></span>
        </span>
        <span class="m-comp-label">${scenario.characterName ? scenario.characterName.split(' ')[0] : 'Cinema'}</span>
      `;
      scenBtn.onclick = () => {
        launchScenarioChat(scenario);
      };
      mobileRoster.appendChild(scenBtn);
    }

    // 2. Default Companions: Kabir, Valeria, Lucian
    const defaultComps = [
      { id: 'kabir', name: 'Kabir', img: CHARACTERS.kabir?.image || 'assets/kabir.jpg' },
      { id: 'valeria', name: 'Valeria', img: CHARACTERS.valeria?.image || 'assets/valeria.jpg' },
      { id: 'lucian', name: 'Lucian', img: CHARACTERS.lucian?.image || 'assets/lucian.jpg' }
    ];

    defaultComps.forEach(comp => {
      const isCompActive = !state.activeScenario && charId === comp.id;
      const compBtn = document.createElement('button');
      compBtn.type = 'button';
      compBtn.className = `mobile-companion-pill ${isCompActive ? 'active' : ''}`;
      compBtn.innerHTML = `
        <span class="m-avatar-ring">
          <img src="${comp.img}" alt="${comp.name}">
        </span>
        <span class="m-comp-label">${comp.name}</span>
      `;
      compBtn.onclick = () => {
        state.activeScenario = null;
        state.activeChatPartnerId = comp.id;
        renderChatView();
      };
      mobileRoster.appendChild(compBtn);
    });
  }

  const avatar = document.getElementById('chat-partner-avatar');
  if (avatar) avatar.src = scenario?.avatar || char.image;

  const nameEl = document.getElementById('chat-partner-name');
  if (nameEl) nameEl.textContent = scenario?.characterName || char.name;

  const archEl = document.getElementById('chat-partner-archetype');
  if (archEl) archEl.textContent = scenario ? `${scenario.title}` : `${char.archetype} • 18+ Uncensored`;

  const intTag = document.getElementById('chat-intimacy-tag');
  if (intTag) intTag.textContent = charState.intimacyLevel;

  // Update Sticky Role Banner
  const roleBanner = document.getElementById('chat-role-banner');
  const roleUserTitle = document.getElementById('chat-role-user-title');
  const roleUserGoal = document.getElementById('chat-role-user-goal');

  if (roleBanner && roleUserTitle && roleUserGoal) {
    if (scenario) {
      roleBanner.style.display = 'flex';
      roleUserTitle.textContent = scenario.userRole || 'Protagonist';
      roleUserGoal.textContent = scenario.userGoal ? `Goal: ${scenario.userGoal}` : 'Goal: Shape the narrative';
    } else {
      roleBanner.style.display = 'flex';
      roleUserTitle.textContent = 'Partner';
      roleUserGoal.textContent = 'Goal: Shape the narrative turn-by-turn';
    }
  }

  const activePrompts = state.smartReplies[charId]?.length 
    ? state.smartReplies[charId] 
    : (scenario?.smartReplies || char.suggestedPrompts?.[lang] || char.suggestedPrompts?.['hinglish'] || char.suggestedPrompts?.['en'] || []);

  const area = document.getElementById('chat-messages-area');
  if (area) {
    area.innerHTML = '';
    const history = state.chatHistory[charId] || [];

    history.forEach((msg, idx) => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender}`;
      let text = msg.text.replace(/\*(.*?)\*/g, '<em>*$1*</em>');
      bubble.innerHTML = text;
      area.appendChild(bubble);
    });
    area.scrollTop = area.scrollHeight;
  }

  // Render Dynamic Clickable Smart Reply Chips (Hinglish/English matching active context)
  let repliesBar = document.getElementById('chat-quick-replies-bar');
  if (!repliesBar) {
    repliesBar = document.createElement('div');
    repliesBar.id = 'chat-quick-replies-bar';
    repliesBar.className = 'chat-quick-replies-bar';
    const chatForm = document.getElementById('chat-form');
    if (chatForm && chatForm.parentNode) {
      chatForm.parentNode.insertBefore(repliesBar, chatForm);
    }
  }

  if (repliesBar) {
    repliesBar.innerHTML = '';
    if (activePrompts && activePrompts.length > 0) {
      activePrompts.slice(0, 3).forEach(prompt => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'quick-reply-chip';
        chip.textContent = prompt;
        chip.title = 'Click to send this response';
        chip.onclick = () => {
          sendChatMessage(prompt);
        };
        repliesBar.appendChild(chip);
      });
      repliesBar.style.display = 'flex';
    } else {
      repliesBar.style.display = 'none';
    }
  }
}

// Dynamic AI Chat Send
async function sendChatMessage(text) {
  if (!text || !text.trim()) return;
  if (state.isAiTyping) return;

  if (state.credits < 2) {
    showToast({
      title: 'Coins Needed',
      message: 'You need at least 2 coins to send an AI message.',
      type: 'warning',
      retryAction: () => {
        updateCoins(100);
        sendChatMessage(text);
      }
    });
    return;
  }

  state.isAiTyping = true;
  updateCoins(-2);
  playChime(480);

  const charId = state.activeChatPartnerId;
  if (!state.chatHistory[charId]) state.chatHistory[charId] = [];

  state.chatHistory[charId].push({ sender: 'user', text: text.trim() });
  renderChatView();

  const partnerName = state.activeScenario?.characterName || CHARACTERS[charId]?.name || 'Companion';
  const area = document.getElementById('chat-messages-area');
  const typing = document.createElement('div');
  typing.className = 'chat-bubble ai';
  typing.innerHTML = `<em>${partnerName} is thinking & breathless...</em>`;
  area?.appendChild(typing);
  if (area) area.scrollTop = area.scrollHeight;

  try {
    const aiResponse = await generateAIChatReply(
      charId,
      text,
      state.chatHistory[charId],
      state.activeLang,
      state.characterState[charId],
      state.activeScenario
    );

    if (typing.parentNode) typing.parentNode.removeChild(typing);

    state.characterState[charId].affection = aiResponse.affection;
    state.characterState[charId].tension = aiResponse.tension;
    state.characterState[charId].intimacyLevel = aiResponse.intimacyLevel;
    state.smartReplies[charId] = aiResponse.smartReplies || [];

    state.chatHistory[charId].push({ sender: 'ai', text: aiResponse.replyText });
    renderChatView();
    playChime(700);
  } catch (err) {
    if (typing.parentNode) typing.parentNode.removeChild(typing);
    showToast({ title: 'AI Error', message: 'Could not send message.', type: 'error' });
  } finally {
    state.isAiTyping = false;
  }
}

// Dance Studio
function renderDanceStudio() {
  const dancerId = state.activeDancerId || 'kabir';
  const char = CHARACTERS[dancerId] || CHARACTERS.kabir;
  const dancerImg = document.getElementById('dance-dancer-img');
  if (dancerImg) dancerImg.src = char.image;

  const banner = document.getElementById('dance-banner-style');
  if (banner) banner.textContent = `${char.name} • ${state.activeDanceRoutine.toUpperCase()} DANCE`;

  document.querySelectorAll('.dancer-pick').forEach(btn => {
    if (btn.dataset.dancer === dancerId) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  document.querySelectorAll('.dance-routine-btn').forEach(btn => {
    if (btn.dataset.routine === state.activeDanceRoutine) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

function triggerDanceAnimation() {
  const wrapper = document.getElementById('dancer-figure');
  if (!wrapper) return;
  const char = CHARACTERS[state.activeDancerId];

  if (state.isDancing) {
    state.isDancing = false;
    clearInterval(state.danceInterval);
    wrapper.className = 'dancer-frame';
    const btn = document.getElementById('btn-trigger-dance-animation');
    if (btn) btn.textContent = '▶ Play Routine';
  } else {
    state.isDancing = true;
    wrapper.className = `dancer-frame dancing dancing-${state.activeDanceRoutine}`;
    const btn = document.getElementById('btn-trigger-dance-animation');
    if (btn) btn.textContent = '⏸ Pause Routine';

    playDanceBeat(state.activeDanceRoutine);
    state.danceInterval = setInterval(() => {
      if (state.isDancing) playDanceBeat(state.activeDanceRoutine);
    }, 600);

    showToast({
      title: '💃 Make Them Dance Active!',
      message: `${char.name} is dancing live to ${state.activeDanceRoutine.toUpperCase()}!`,
      type: 'success'
    });
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Brand Click -> Return to Cinema Explore
  document.getElementById('nav-brand')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('stories-explore');
  });

  // Top Nav Links & Mobile Dock
  document.querySelectorAll('.kavana-nav-link, .nav-btn, .mobile-nav-item, .mobile-dock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (view) switchView(view);
    });
  });

  // Spotlight Hero Action Buttons
  document.getElementById('btn-hero-play')?.addEventListener('click', () => {
    openStoryInReader(state.activeStory || KAVANA_STORIES[0]);
  });

  document.getElementById('btn-hero-chat')?.addEventListener('click', () => {
    launchScenarioChat(state.activeStory || KAVANA_STORIES[0]);
  });

  document.getElementById('btn-hero-dance')?.addEventListener('click', () => {
    state.activeDancerId = (state.activeStory || KAVANA_STORIES[0])?.characterId || 'kabir';
    switchView('dance-studio');
  });

  // Footer explore link
  document.getElementById('footer-link-explore')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('stories-explore');
  });

  // Language Dropdown
  const langSelect = document.getElementById('app-language-select');
  if (langSelect) {
    langSelect.value = state.activeLang;
    langSelect.addEventListener('change', (e) => {
      state.activeLang = e.target.value;
      localStorage.setItem('kavana_lang', state.activeLang);
      state.chatHistory = { kabir: [], valeria: [], lucian: [] };

      if (state.currentView === 'stories-explore') renderExploreFeed();
      else if (state.currentView === 'story-reader') renderStoryReader();
      else if (state.currentView === 'character-chat') renderChatView();

      showToast({
        title: '🌐 Language Switched',
        message: `Kavana AI is now speaking in ${langSelect.options[langSelect.selectedIndex].text}.`,
        type: 'info'
      });
    });
  }

  // Categories
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeCategory = pill.dataset.category || 'all';
      renderExploreFeed();
    });
  });

  // Search input listeners for 105+ stories
  const searchInput = document.getElementById('stories-search-input');
  const clearSearchBtn = document.getElementById('btn-clear-search');

  searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    }
    renderExploreFeed();
  });

  clearSearchBtn?.addEventListener('click', () => {
    state.searchQuery = '';
    if (searchInput) searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    renderExploreFeed();
  });

  // Restart Scenario button
  document.getElementById('btn-restart-chat-scenario')?.addEventListener('click', () => {
    const charId = state.activeChatPartnerId;
    const scenario = state.activeScenario;
    if (scenario) {
      state.chatHistory[charId] = [{ sender: 'ai', text: scenario.openingHook }];
      state.smartReplies[charId] = scenario.smartReplies || [];
    } else {
      const char = CHARACTERS[charId] || CHARACTERS.kabir;
      const greeting = char.greetings?.[state.activeLang] || char.greetings?.['hinglish'] || '*Smiles.* Hello.';
      state.chatHistory[charId] = [{ sender: 'ai', text: greeting }];
      state.smartReplies[charId] = [];
    }
    renderChatView();
    showToast({ title: 'Scenario Restarted', message: 'Narrative reset to initial opening hook.', type: 'info' });
  });

  // Ambient Audio
  document.getElementById('btn-ambient-audio')?.addEventListener('click', toggleAmbientAudio);

  // Dance Studio Controls
  document.getElementById('btn-trigger-dance-animation')?.addEventListener('click', triggerDanceAnimation);
  document.getElementById('btn-quick-dance')?.addEventListener('click', () => {
    state.activeDancerId = state.activeStory?.characterId || 'kabir';
    switchView('dance-studio');
    setTimeout(triggerDanceAnimation, 300);
  });
  document.getElementById('btn-side-dance')?.addEventListener('click', () => {
    state.activeDancerId = state.activeStory?.characterId || 'kabir';
    switchView('dance-studio');
    setTimeout(triggerDanceAnimation, 300);
  });
  document.getElementById('btn-chat-dance')?.addEventListener('click', () => {
    state.activeDancerId = state.activeChatPartnerId;
    switchView('dance-studio');
    setTimeout(triggerDanceAnimation, 300);
  });

  document.querySelectorAll('.dancer-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeDancerId = btn.dataset.dancer;
      if (state.isDancing) triggerDanceAnimation();
      renderDanceStudio();
    });
  });

  document.querySelectorAll('.dance-routine-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeDanceRoutine = btn.dataset.routine;
      if (state.isDancing) triggerDanceAnimation();
      renderDanceStudio();
    });
  });

  // Story Reader Controls
  document.getElementById('btn-jump-to-chat')?.addEventListener('click', () => {
    launchScenarioChat(state.activeStory || KAVANA_STORIES[0]);
  });
  document.getElementById('btn-restart-story')?.addEventListener('click', () => {
    state.activeChapterId = 'c1';
    renderStoryReader();
    showToast({ title: 'Novel Reset', message: 'Restarted at Chapter 1.', type: 'info' });
  });

  // Retry Toast Simulation
  document.getElementById('btn-test-error-toast')?.addEventListener('click', () => {
    showToast({
      title: 'Neural Connection Interrupted',
      message: 'Network latency spike. Click retry to reconnect.',
      type: 'error',
      retryAction: () => {
        showToast({ title: 'AI Reconnected', message: 'Connection established!', type: 'success' });
        playChime(750);
      }
    });
  });

  // Chat Roster
  document.getElementById('roster-kabir')?.addEventListener('click', () => {
    state.activeScenario = null;
    state.activeChatPartnerId = 'kabir';
    renderChatView();
  });
  document.getElementById('roster-valeria')?.addEventListener('click', () => {
    state.activeScenario = null;
    state.activeChatPartnerId = 'valeria';
    renderChatView();
  });
  document.getElementById('roster-lucian')?.addEventListener('click', () => {
    state.activeScenario = null;
    state.activeChatPartnerId = 'lucian';
    renderChatView();
  });

  // Chat Form
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-user-input');
  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput && chatInput.value.trim()) {
      const msg = chatInput.value.trim();
      chatInput.value = '';
      sendChatMessage(msg);
    }
  });

  // Wallet
  const walletModal = document.getElementById('modal-wallet');
  document.getElementById('btn-wallet-modal')?.addEventListener('click', () => walletModal?.classList.add('active'));
  document.getElementById('btn-close-wallet')?.addEventListener('click', () => walletModal?.classList.remove('active'));
  document.getElementById('btn-done-wallet')?.addEventListener('click', () => walletModal?.classList.remove('active'));
  document.getElementById('btn-add-100-credits')?.addEventListener('click', () => {
    updateCoins(100);
    showToast({ title: 'Coins Added', message: 'Added 100 free coins!', type: 'success' });
    walletModal?.classList.remove('active');
  });
  document.getElementById('btn-add-500-credits')?.addEventListener('click', () => {
    updateCoins(500);
    showToast({ title: 'VIP Coins Added', message: 'Added 500 coins to wallet!', type: 'success' });
    walletModal?.classList.remove('active');
  });

  // Settings Modal
  const settingsModal = document.getElementById('modal-settings');
  const providerSelect = document.getElementById('setting-llm-mode');
  const apiKeyGroup = document.getElementById('group-api-key');
  const apiKeyInput = document.getElementById('setting-api-key');
  const endpointGroup = document.getElementById('group-custom-endpoint');
  const endpointInput = document.getElementById('setting-custom-endpoint');

  const currentSettings = getProviderSettings();
  if (providerSelect) providerSelect.value = currentSettings.provider;
  if (apiKeyInput) apiKeyInput.value = currentSettings.apiKey;
  if (endpointInput) endpointInput.value = currentSettings.customEndpoint;

  function updateSettingsVisibility() {
    const val = providerSelect?.value;
    if (val === 'gemini' || val === 'groq' || val === 'openrouter') {
      apiKeyGroup.style.display = 'block';
      endpointGroup.style.display = 'none';
    } else if (val === 'ollama') {
      apiKeyGroup.style.display = 'none';
      endpointGroup.style.display = 'block';
    } else {
      apiKeyGroup.style.display = 'none';
      endpointGroup.style.display = 'none';
    }
  }

  providerSelect?.addEventListener('change', updateSettingsVisibility);

  document.getElementById('btn-settings-modal')?.addEventListener('click', () => {
    updateSettingsVisibility();
    settingsModal?.classList.add('active');
  });
  document.getElementById('btn-close-settings')?.addEventListener('click', () => settingsModal?.classList.remove('active'));
  document.getElementById('btn-save-settings')?.addEventListener('click', () => {
    saveProviderSettings({
      provider: providerSelect?.value,
      apiKey: apiKeyInput?.value?.trim(),
      customEndpoint: endpointInput?.value?.trim()
    });
    settingsModal?.classList.remove('active');
    showToast({
      title: 'Preferences Saved',
      message: `Using ${providerSelect?.options[providerSelect.selectedIndex].text}`,
      type: 'success'
    });
  });

  // Novel Generator Form
  const genForm = document.getElementById('story-generator-form');
  genForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state.credits < 25) {
      showToast({ title: 'Coins Required', message: 'Generating a novel costs 25 coins.', type: 'warning' });
      return;
    }
    updateCoins(-25);

    const config = {
      genre: document.getElementById('gen-genre')?.value || 'Desi Romance & Mafia',
      archetype: document.getElementById('gen-archetype')?.value || 'Kabir Oberoi',
      tone: document.getElementById('gen-tone')?.value || 'Uncensored 18+ Passionate',
      desires: document.getElementById('gen-desires')?.value || ''
    };

    const statusTag = document.getElementById('pipeline-status-tag');
    const successActions = document.getElementById('pipeline-success-actions');
    const genBtn = document.getElementById('btn-generate-story');
    if (genBtn) genBtn.disabled = true;

    if (statusTag) statusTag.textContent = 'AI generating novel chapters...';
    playChime(460);

    try {
      const generatedNovel = await generateDynamicNovel(config, state.activeLang);
      KAVANA_STORIES.unshift(generatedNovel);
      state.activeStory = generatedNovel;
      state.activeChapterId = 'c1';

      if (genBtn) genBtn.disabled = false;
      if (statusTag) statusTag.textContent = 'Novel Generated!';
      if (successActions) successActions.style.display = 'block';

      showToast({
        title: '⚡ Dynamic AI Novel Created',
        message: `"${generatedNovel.title}" is ready!`,
        type: 'success'
      });
      playChime(750);
    } catch (err) {
      if (genBtn) genBtn.disabled = false;
      showToast({ title: 'Generation Error', message: 'Could not generate novel.', type: 'error' });
    }
  });

  document.getElementById('btn-view-generated-story')?.addEventListener('click', () => {
    switchView('story-reader');
  });

  // ==========================================
  // TMDb Story Importer Modal Controller
  // ==========================================
  const tmdbModal = document.getElementById('modal-tmdb-importer');
  const tmdbInput = document.getElementById('tmdb-query-input');
  const tmdbTypeSelect = document.getElementById('tmdb-media-type-select');
  const tmdbFetchBtn = document.getElementById('btn-fetch-tmdb-data');
  const tmdbPreviewCard = document.getElementById('tmdb-preview-card');

  let currentFetchedTMDbItem = null;

  function openTMDbModal(defaultQuery = '') {
    if (tmdbModal) tmdbModal.classList.add('active');
    if (tmdbInput) {
      if (defaultQuery) tmdbInput.value = defaultQuery;
      tmdbInput.focus();
    }
    if (defaultQuery) {
      fetchAndPreviewTMDb(defaultQuery);
    }
  }

  function closeTMDbModal() {
    if (tmdbModal) tmdbModal.classList.remove('active');
  }

  // Open triggers
  document.getElementById('nav-open-tmdb')?.addEventListener('click', () => openTMDbModal());
  document.getElementById('btn-header-add-tmdb')?.addEventListener('click', () => openTMDbModal());
  document.getElementById('btn-hero-open-tmdb')?.addEventListener('click', () => openTMDbModal());
  document.getElementById('btn-banner-open-tmdb')?.addEventListener('click', () => openTMDbModal());
  document.getElementById('btn-explore-open-tmdb')?.addEventListener('click', () => openTMDbModal());
  document.getElementById('mobile-open-tmdb')?.addEventListener('click', () => openTMDbModal());

  // Close triggers
  document.getElementById('btn-close-tmdb-modal')?.addEventListener('click', closeTMDbModal);
  document.getElementById('btn-cancel-tmdb-preview')?.addEventListener('click', () => {
    if (tmdbPreviewCard) tmdbPreviewCard.style.display = 'none';
    currentFetchedTMDbItem = null;
  });

  // Fetch logic
  async function fetchAndPreviewTMDb(queryOverride) {
    const query = (queryOverride || tmdbInput?.value || '').trim();
    if (!query) {
      showToast({ title: 'Title Required', message: 'Enter a movie or show title (e.g. Mirzapur, Succession, Dune).', type: 'warning' });
      return;
    }

    if (tmdbFetchBtn) {
      tmdbFetchBtn.disabled = true;
      tmdbFetchBtn.innerHTML = '<span>Searching...</span>';
    }

    try {
      let result = null;
      const mediaType = tmdbTypeSelect?.value || 'auto';

      if (/^\d+$/.test(query)) {
        result = await fetchTMDbMedia(query, mediaType);
      } else {
        const searchRes = await searchTMDb(query);
        if (searchRes.local && searchRes.local.length > 0) {
          result = { success: true, source: 'verified_cache', data: searchRes.local[0] };
        } else if (searchRes.online && searchRes.online.length > 0) {
          const first = searchRes.online[0];
          result = await fetchTMDbMedia(first.id, first.media_type || mediaType);
        } else {
          throw new Error(`No movie or show found for "${query}"`);
        }
      }

      const item = result.data;
      currentFetchedTMDbItem = item;
      renderTMDbPreview(item);
      showToast({ title: '🎬 Cinema Title Loaded', message: `Found "${item.title || item.name}"!`, type: 'success' });
      playChime(640);
    } catch (err) {
      showToast({ title: 'Cinema Search', message: err.message, type: 'error' });
    } finally {
      if (tmdbFetchBtn) {
        tmdbFetchBtn.disabled = false;
        tmdbFetchBtn.innerHTML = '<span>Search Title</span>';
      }
    }
  }

  function renderTMDbPreview(item) {
    if (!tmdbPreviewCard) return;

    const title = item.title || item.name || 'Untitled Cinema Novel';
    const releaseYear = (item.release_date || item.first_air_date || '2024').slice(0, 4);
    const posterUrl = item.avatar || (item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : 'assets/lucian.jpg');
    const backdropUrl = item.cover || (item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : posterUrl);
    const rating = item.imdbRating || (item.vote_average ? (item.vote_average).toFixed(1) : '9.5');
    const overview = item.summary || item.overview || 'Step inside the cinematic universe where your choices decide the story.';
    const tagline = item.tagline || (item.tags ? item.tags.slice(0, 2).join(' • ') : 'Verified Cinema Reference');

    const backdropImg = document.getElementById('tmdb-preview-backdrop-img');
    const posterImg = document.getElementById('tmdb-preview-poster-img');
    const titleText = document.getElementById('tmdb-preview-title-text');
    const taglineText = document.getElementById('tmdb-preview-tagline-text');
    const ratingText = document.getElementById('tmdb-preview-rating');
    const overviewText = document.getElementById('tmdb-preview-overview-text');
    const castContainer = document.getElementById('tmdb-preview-cast-container');

    if (backdropImg) backdropImg.src = backdropUrl;
    if (posterImg) posterImg.src = posterUrl;
    if (titleText) titleText.textContent = `${title} (${releaseYear})`;
    if (taglineText) taglineText.textContent = tagline;
    if (ratingText) ratingText.textContent = `★ ${rating} Rating`;
    if (overviewText) overviewText.textContent = overview;

    // Render cast tags if available
    if (castContainer) {
      castContainer.innerHTML = '';
      if (item.credits && item.credits.cast) {
        item.credits.cast.slice(0, 5).forEach(c => {
          const chip = document.createElement('span');
          chip.className = 'tmdb-cast-chip';
          chip.textContent = `${c.name} as ${c.character || 'Lead'}`;
          castContainer.appendChild(chip);
        });
      } else if (item.characterName) {
        const chip = document.createElement('span');
        chip.className = 'tmdb-cast-chip';
        chip.textContent = `Starring: ${item.characterName}`;
        castContainer.appendChild(chip);
      }
    }

    // Pre-fill customization inputs
    const charInput = document.getElementById('tmdb-custom-char-name');
    const roleInput = document.getElementById('tmdb-custom-user-role');
    const goalInput = document.getElementById('tmdb-custom-user-goal');

    if (charInput) charInput.value = item.characterName || (item.credits?.cast?.[0]?.name ? item.credits.cast[0].name : title.split(':')[0]);
    if (roleInput) roleInput.value = item.userRole || 'Defiant Hostage / Rival Syndicate Boss';
    if (goalInput) goalInput.value = item.userGoal || 'Negotiate survival or take over their empire';

    tmdbPreviewCard.style.display = 'block';
    tmdbPreviewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  tmdbFetchBtn?.addEventListener('click', () => fetchAndPreviewTMDb());
  tmdbInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchAndPreviewTMDb();
    }
  });

  // Presets 1-Click Handlers
  document.querySelectorAll('.tmdb-preset-pill, .tmdb-preset-chip').forEach(pill => {
    pill.addEventListener('click', () => {
      const tmdbId = pill.dataset.id || pill.dataset.tmdbId;
      const type = pill.dataset.type || 'auto';
      if (tmdbInput) tmdbInput.value = tmdbId;
      if (tmdbTypeSelect) tmdbTypeSelect.value = type;
      fetchAndPreviewTMDb(tmdbId);
    });
  });

  // Convert & Launch Story
  document.getElementById('btn-convert-and-launch-tmdb')?.addEventListener('click', () => {
    if (!currentFetchedTMDbItem) {
      showToast({ title: 'No Title Selected', message: 'Search for a film or show first.', type: 'warning' });
      return;
    }

    const charName = document.getElementById('tmdb-custom-char-name')?.value?.trim();
    const userRole = document.getElementById('tmdb-custom-user-role')?.value?.trim();
    const userGoal = document.getElementById('tmdb-custom-user-goal')?.value?.trim();
    const lang = document.getElementById('tmdb-custom-language')?.value || 'hinglish';

    const overrides = {};
    if (charName) overrides.characterName = charName;
    if (userRole) overrides.userRole = userRole;
    if (userGoal) overrides.userGoal = userGoal;

    const newStory = convertTMDbToKavanaStory(currentFetchedTMDbItem, overrides);
    saveCustomTMDbStory(newStory);

    // Prepend to active stories
    const existingIdx = KAVANA_STORIES.findIndex(s => s.id === newStory.id || (newStory.tmdbId && s.tmdbId === newStory.tmdbId));
    if (existingIdx >= 0) {
      KAVANA_STORIES[existingIdx] = newStory;
    } else {
      KAVANA_STORIES.unshift(newStory);
    }

    closeTMDbModal();
    showToast({
      title: '✨ Cinema Scenario Ready!',
      message: `"${newStory.title}" has been added to your stories.`,
      type: 'success'
    });
    playChime(750);

    // Immediately launch into roleplay chat
    state.activeLang = lang;
    launchScenarioChat(newStory);
  });

  // Initial State: Start directly on modern Cinema Platform
  updateCoins(0);
  switchView('stories-explore');
});

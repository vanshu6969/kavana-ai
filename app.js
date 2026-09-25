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

// Persistent Chat Sessions & Message History
export function getChatSessions() {
  try {
    const raw = localStorage.getItem('kavana_chat_sessions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading chat sessions:', e);
  }
  // Default VIP Companions if none started yet
  return [
    {
      id: 'mirzapur-kaleen-bhaiya',
      name: 'Akhandanand Tripathi (Kaleen Bhaiya)',
      title: 'Mirzapur: Purvanchal Kingpin',
      avatar: 'https://image.tmdb.org/t/p/w780/1rxLUFVrtTo82OxhbDXJDiJVkwL.jpg',
      category: 'Crime & Syndicate',
      userRole: "Rival Gangster's Enforcer",
      userGoal: 'Negotiate your survival or dethrone the King of Mirzapur',
      lastMessage: "Baithiye. Mirzapur ki hawa mein ya toh darr chalta hai, ya Tripathi parivaar ka sikka...",
      timestamp: Date.now() - 60000 * 5,
      unread: false
    },
    {
      id: 'queen-of-tears',
      name: 'Baek Hyun-woo',
      title: 'Queen of Tears: Chaebol Marriage',
      avatar: 'https://image.tmdb.org/t/p/w780/dzq83RHwQcnP6WGJ6YkenIqeaa5.jpg',
      category: 'Romance & Drama',
      userRole: 'Hong Hae-in (Queens Group Heiress)',
      userGoal: 'Reignite lost passion or execute your secret divorce strategy',
      lastMessage: "*Pulls you into the penthouse balcony* Let's stop lying to each other...",
      timestamp: Date.now() - 60000 * 30,
      unread: false
    },
    {
      id: 'kabir',
      name: 'Kabir Oberoi',
      title: 'The Desi Mafia Don',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      category: 'Desi Romance & Don',
      userRole: 'Captive Heiress / Defiant Partner',
      userGoal: 'Tame the ruthless don',
      lastMessage: "Tumhe lagta hai tum mere qaid se bach sakti ho? *Smiles dangerously*",
      timestamp: Date.now() - 60000 * 120,
      unread: false
    },
    {
      id: 'peaky-blinders',
      name: 'Thomas Shelby',
      title: 'Peaky Blinders: Birmingham Empire',
      avatar: 'https://image.tmdb.org/t/p/w780/hkBaDkMWbLaf8B1rWsKXqgughpw.jpg',
      category: 'Crime & Syndicate',
      userRole: 'Undercover Operative / Seductive Informant',
      userGoal: 'Gain Tommy’s trust or betray the Shelby family',
      lastMessage: "*Lights a cigarette in the smoke-filled Garrison office* In the bleak midwinter...",
      timestamp: Date.now() - 60000 * 360,
      unread: false
    },
    {
      id: 'valeria',
      name: 'Valeria Vane',
      title: 'Shadow Mage Dynasty',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
      category: 'Dark Fantasy 18+',
      userRole: 'Apprentice / Blood Partner',
      userGoal: 'Unlock forbidden arcana',
      lastMessage: "*Traces a glowing rune across your palm* Magic requires sacrifice...",
      timestamp: Date.now() - 60000 * 1440,
      unread: false
    }
  ];
}

export function saveChatSessions(sessions) {
  try {
    localStorage.setItem('kavana_chat_sessions', JSON.stringify(sessions));
  } catch (e) {
    console.warn('Error saving chat sessions:', e);
  }
}

export function getChatHistory(partnerId) {
  if (state.chatHistory[partnerId] && state.chatHistory[partnerId].length > 0) {
    return state.chatHistory[partnerId];
  }
  try {
    const raw = localStorage.getItem(`kavana_chat_hist_${partnerId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.chatHistory[partnerId] = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading chat history for', partnerId, e);
  }
  return null;
}

export function saveChatHistory(partnerId, history) {
  state.chatHistory[partnerId] = history;
  try {
    localStorage.setItem(`kavana_chat_hist_${partnerId}`, JSON.stringify(history));
  } catch (e) {
    console.warn('Error saving chat history for', partnerId, e);
  }
}

function formatChatTime(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return `${Math.floor(diff / 86400000)}d`;
}

// Application State
const initialSavedSessions = getChatSessions();
const state = {
  currentView: 'stories-explore', // Clean modern cinema platform default
  activeLang: localStorage.getItem('kavana_lang') || 'hinglish',
  activeStory: KAVANA_STORIES[0],
  activeScenario: KAVANA_STORIES.find(s => s.id === initialSavedSessions[0]?.id) || initialSavedSessions[0] || KAVANA_STORIES[0],
  searchQuery: '',
  activeChapterId: 'c1',
  activeChatPartnerId: localStorage.getItem('kavana_last_chat_id') || initialSavedSessions[0]?.id || 'mirzapur-kaleen-bhaiya',
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

  chatHistory: {},
  smartReplies: {},
  storyBranches: {},
  isAiTyping: false,
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
  const partnerId = story.id || story.characterId || 'scenario-' + (story.title || 'chat').toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  const sessions = getChatSessions();
  const existingIdx = sessions.findIndex(s => s.id === partnerId);
  const sessionItem = {
    id: partnerId,
    name: story.characterName || story.title,
    title: story.title,
    avatar: story.avatar || story.cover || 'assets/lucian.jpg',
    category: story.category || 'Roleplay Scenario',
    userRole: story.userRole || 'Protagonist',
    userGoal: story.userGoal || 'Shape the narrative',
    lastMessage: story.openingHook ? (story.openingHook.length > 70 ? story.openingHook.slice(0, 67) + '...' : story.openingHook) : 'Roleplay scenario started',
    timestamp: Date.now(),
    unread: false
  };

  if (existingIdx >= 0) {
    const existing = sessions[existingIdx];
    sessionItem.lastMessage = existing.lastMessage || sessionItem.lastMessage;
    sessionItem.timestamp = existing.timestamp || sessionItem.timestamp;
    sessions.splice(existingIdx, 1);
    sessions.unshift(sessionItem);
  } else {
    sessions.unshift(sessionItem);
  }
  saveChatSessions(sessions);

  state.activeChatPartnerId = partnerId;
  state.activeScenario = story;
  state.activeStory = story;
  try { localStorage.setItem('kavana_last_chat_id', partnerId); } catch(e){}

  // Initialize chat history for this specific scenario from storage or hook
  let history = getChatHistory(partnerId);
  if (!history || history.length === 0) {
    const greeting = story.openingHook || "*Smiles at you.* Hello.";
    history = [{ sender: 'ai', text: greeting, time: Date.now() }];
    saveChatHistory(partnerId, history);
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

// ========================================================
// Dynamic Procedural Visual Novel Engine (Zero Hardcoded Stories)
// Supports infinite branching chapters (Chapter 1, 2, 3, 4...)
// Custom user actions, authentic dialect dialogue & tone scoring
// ========================================================

function getLoreChapterTitle(story, chNum, lang) {
  const isHinglish = lang === 'hinglish' || lang === 'hindi' || lang === 'urdu';
  const isPunjabi = lang === 'punjabi';
  const titleLower = (story.title || '').toLowerCase();

  if (titleLower.includes('queen of tears')) {
    if (chNum === 1) return isHinglish ? 'Queens Penthouse Ka Faisla' : (isPunjabi ? 'ਸ਼ਾਹੀ ਮਹਿਲ ਦਾ ਫੈਸਲਾ' : 'The Chaebol Ultimatum');
    if (chNum === 2) return isHinglish ? 'Aansu Aur Chhupa Ishq' : (isPunjabi ? 'ਹੰਝੂ ਤੇ ਲੁਕਿਆ ਪਿਆਰ' : 'Behind The Cold Smile');
    return isHinglish ? 'Aakhri Daao Aur Junoon' : (isPunjabi ? 'ਅਣਖ ਤੇ ਇਸ਼ਕ' : 'The High Stakes Surrender');
  }
  if (titleLower.includes('mirzapur')) {
    if (chNum === 1) return isHinglish ? 'Purvanchal Ki Gaddi' : (isPunjabi ? 'ਮਿਰਜ਼ਾਪੁਰ ਦੀ ਗੱਦੀ' : 'The Purvanchal Kingpin');
    if (chNum === 2) return isHinglish ? 'Tripathi Parivaar Ka Dabdaba' : (isPunjabi ? 'ਤ੍ਰਿਪਾਠੀ ਖਾਨਦਾਨ ਦਾ ਰੋਹਬ' : 'The Iron Grip of Mirzapur');
    return isHinglish ? 'Goli Aur Sikka' : (isPunjabi ? 'ਖੂਨ ਤੇ ਤਖ਼ਤ' : 'Blood & The Throne');
  }
  if (titleLower.includes('peaky blinders')) {
    if (chNum === 1) return isHinglish ? 'Garrison Ki Raat' : (isPunjabi ? 'ਗੈਰੀਸਨ ਦੀ ਰਾਤ' : 'Smoke & Crimson in Small Heath');
    if (chNum === 2) return isHinglish ? 'Shelby Empire Ka Hukumat' : (isPunjabi ? 'ਸ਼ੈਲਬੀ ਖਾਨਦਾਨ ਦੀ ਹਕੂਮਤ' : 'No Limits in Birmingham');
    return isHinglish ? 'In The Bleak Midwinter' : (isPunjabi ? 'ਆਖ਼ਰੀ ਬਾਜ਼ੀ' : 'The King of Small Heath');
  }
  if (titleLower.includes('john wick')) {
    if (chNum === 1) return isHinglish ? 'The Continental Ka Farmaan' : (isPunjabi ? 'ਹਾਈ ਟੇਬਲ ਦਾ ਹੁਕਮ' : 'The Continental Contract');
    if (chNum === 2) return isHinglish ? 'Baba Yaga Ka Gussa' : (isPunjabi ? 'ਬਾਬਾ ਯਾਗਾ ਦੀ ਦਹਿਸ਼ਤ' : 'Seven Million Bounty');
    return isHinglish ? 'High Table Ka Khel' : (isPunjabi ? 'ਮੌਤ ਦਾ ਤਾਂਡਵ' : 'Honor and Blood Oath');
  }
  if (titleLower.includes('dune')) {
    if (chNum === 1) return isHinglish ? 'Arrakis Ki Ret Aur Aag' : (isPunjabi ? 'ਰੇਤ ਦਾ ਤੂਫ਼ਾਨ' : 'Whispers of Sietch Tabr');
    if (chNum === 2) return isHinglish ? 'Muad\'Dib Ki Bhavishyavani' : (isPunjabi ? 'ਭਵਿੱਖਬਾਣੀ ਦਾ ਸੱਚ' : 'The Power of the Voice');
    return isHinglish ? 'Desert Power' : (isPunjabi ? 'ਰੇਗਿਸਤਾਨ ਦੀ ਤਾਕਤ' : 'The Holy War Awakens');
  }

  // General procedural titles based on chapter progression
  if (chNum === 1) {
    return isHinglish ? 'Pehla Aamna-Saamna' : (isPunjabi ? 'ਪਹਿਲੀ ਟੱਕਰ' : 'The Unbroken Encounter');
  } else if (chNum === 2) {
    return isHinglish ? 'Gehra Tanaav Aur Parda Faash' : (isPunjabi ? 'ਤਣਾਅ ਤੇ ਸੱਚ' : 'The Escalation of Desire');
  } else if (chNum === 3) {
    return isHinglish ? 'Takrao Ka Aakhri Mod' : (isPunjabi ? 'ਆਰ ਜਾਂ ਪਾਰ' : 'The Point of No Return');
  } else {
    return isHinglish ? `Adhyay ${chNum}: Be-inteha Qurbat` : (isPunjabi ? `ਕਾਂਡ ${chNum}: ਜਜ਼ਬਾਤਾਂ ਦਾ ਤੂਫ਼ਾਨ` : `Chapter ${chNum}: The Reckoning`);
  }
}

export function getStoryChapters(story, lang) {
  if (!story) story = KAVANA_STORIES[0];
  const storyId = story.id || 'kavana-story-1';

  // 1. Check in-memory session cache
  if (state.storyBranches[storyId] && state.storyBranches[storyId].length > 0) {
    return state.storyBranches[storyId];
  }

  // 2. Check localStorage
  try {
    const saved = localStorage.getItem(`kavana_story_branch_${storyId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.storyBranches[storyId] = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading saved story branch:', e);
  }

  // 3. Synthesize Initial Chapter 1 for this story
  const initialChapter = synthesizeInitialChapter(story, lang);
  state.storyBranches[storyId] = [initialChapter];
  saveStoryChapters(storyId, state.storyBranches[storyId]);
  return state.storyBranches[storyId];
}

export function saveStoryChapters(storyId, chapters) {
  state.storyBranches[storyId] = chapters;
  try {
    localStorage.setItem(`kavana_story_branch_${storyId}`, JSON.stringify(chapters));
  } catch (e) {
    console.warn('Error saving story branch:', e);
  }
}

function synthesizeInitialChapter(story, lang) {
  const isHinglish = lang === 'hinglish' || lang === 'hindi' || lang === 'urdu';
  const isPunjabi = lang === 'punjabi';
  const charName = story.characterName || story.title || 'Companion';
  const roleName = story.userRole || (isHinglish ? 'Saathi' : 'Partner');
  const goalText = story.userGoal || (isHinglish ? 'Kahani ko naye mod dena' : 'Shape the destiny of this encounter');

  const titlePrefix = isHinglish ? 'Adhyay 1' : (isPunjabi ? 'ਕਾਂਡ ੧' : 'Chapter 1');
  const chapterTitle = `${titlePrefix}: ${getLoreChapterTitle(story, 1, lang)}`;

  // Atmospheric narrative incorporating story.summary and character setting
  let narrative = '';
  if (story.summary) {
    narrative += story.summary + '\n\n';
  }

  if (isHinglish) {
    narrative += `Aap is waqt **${roleName}** ke roop mein ${charName} ke bilkul samne khade hain. Aapka maksad: *${goalText}*. Kamre mein tanaav itna gehra hai ki har saans mein aag mehsoos hoti hai.`;
  } else if (isPunjabi) {
    narrative += `ਤੁਸੀਂ ਇਸ ਵੇਲੇ **${roleName}** ਬਣ ਕੇ ${charName} ਦੇ ਸਨਮੁਖ ਖੜ੍ਹੇ ਹੋ। ਤੁਹਾਡਾ ਟੀਚਾ: *${goalText}*। ਹਵਾ ਵਿੱਚ ਇੱਕ ਅਜੀਬ ਜਿਹੀ ਬੇਬਾਕੀ ਤੇ ਇਸ਼ਕ ਦਾ ਤੂਫ਼ਾਨ ਏ।`;
  } else {
    narrative += `You stand directly before ${charName} as the **${roleName}**. Your objective: *${goalText}*. Every second of silence only tightens the electric tension between you.`;
  }

  // Extract or craft dialogue
  let dialogueText = story.openingHook || '';
  if (!dialogueText || dialogueText.length < 10) {
    if (isHinglish) {
      dialogueText = `"${charName}: 'Mujhe dekh kar lagta hai ki tum mere asar se bach paoge, ${roleName}? Yahan sab meri marzi se hota hai.'"`;
    } else if (isPunjabi) {
      dialogueText = `"${charName}: 'ਦੱਸ, ਮੇਰੇ ਸਾਹਮਣੇ ਖਲੋਣ ਦੀ ਹਿੰਮਤ ਕਿਵੇਂ ਪਈ ਤੇਰੀ? ਹੁਣ ਅੱਗੇ ਕੀ ਸੋਚਿਆ ਏ?'"`;
    } else {
      dialogueText = `"${charName}: 'You walk into my domain and think you can dictate the terms, ${roleName}? Look at me and tell me what you really came for.'"`;
    }
  }

  // Branching choices
  let choices = [];
  if (story.smartReplies && story.smartReplies.length >= 2) {
    choices.push({
      text: story.smartReplies[0],
      tone: isHinglish ? 'Tez Aur Direct' : 'Bold Confrontation',
      deltaAffection: 12,
      deltaTension: 20
    });
    choices.push({
      text: story.smartReplies[1],
      tone: isHinglish ? 'Khatarnaak Qurbat' : 'Dangerous Intimacy',
      deltaAffection: 20,
      deltaTension: 15
    });
    if (story.smartReplies[2]) {
      choices.push({
        text: story.smartReplies[2],
        tone: isHinglish ? 'Chalaak Chaal' : 'Mind Games',
        deltaAffection: 15,
        deltaTension: 15
      });
    }
  } else {
    choices = [
      {
        text: isHinglish ? "*Aankhon mein aankhein daal kar aage badho* 'Main kisi ke aage nahi jhukta.'" : "*Hold their gaze and step into their space* 'I don't bow to anyone.'",
        tone: isHinglish ? 'Bekhauf Baghaawat' : 'Fierce Defiance',
        deltaAffection: 12,
        deltaTension: 22
      },
      {
        text: isHinglish ? "*Dheemi muskurahat ke saath unke bilkul qareeb aao* 'Darr kis baat ka hai tumhe?'" : "*Close the distance with a slow smile* 'What are you afraid will happen?'",
        tone: isHinglish ? 'Khatarnaak Qurbat' : 'Dangerous Temptation',
        deltaAffection: 22,
        deltaTension: 18
      }
    ];
  }

  return {
    id: 'c1',
    chapterNum: 1,
    title: chapterTitle,
    visual: story.cover || story.avatar || 'assets/sanctum.jpg',
    speaker: charName,
    characterMood: story.initialMood || '⚡ High Drama & Tension',
    narrative,
    dialogue: dialogueText,
    choices
  };
}

export function progressStoryToNextChapter(story, userChoiceText, choiceTone = '', lang = 'hinglish') {
  if (!story) story = state.activeStory || KAVANA_STORIES[0];
  const charId = story.characterId || story.id || 'scenario-char';
  const charName = story.characterName || story.title || 'Companion';
  const roleName = story.userRole || 'Partner';
  const isHinglish = lang === 'hinglish' || lang === 'hindi' || lang === 'urdu';
  const isPunjabi = lang === 'punjabi';

  const chapters = getStoryChapters(story, lang);
  const nextNum = chapters.length + 1;

  // 1. Update Affection & Intimacy Tension
  if (!state.characterState[charId]) {
    state.characterState[charId] = { affection: 60, tension: 75, intimacyLevel: '⚡ High Sexual Tension' };
  }
  const toneLower = (choiceTone || '').toLowerCase();
  if (toneLower.includes('defiance') || toneLower.includes('baghaawat') || toneLower.includes('direct') || toneLower.includes('bold')) {
    state.characterState[charId].tension = Math.min(100, state.characterState[charId].tension + 16);
    state.characterState[charId].affection = Math.min(100, state.characterState[charId].affection + 10);
  } else if (toneLower.includes('intimacy') || toneLower.includes('qurbat') || toneLower.includes('temptation') || toneLower.includes('passion')) {
    state.characterState[charId].affection = Math.min(100, state.characterState[charId].affection + 18);
    state.characterState[charId].tension = Math.min(100, state.characterState[charId].tension + 12);
  } else {
    state.characterState[charId].affection = Math.min(100, state.characterState[charId].affection + 12);
    state.characterState[charId].tension = Math.min(100, state.characterState[charId].tension + 14);
  }

  if (state.characterState[charId].tension > 85 || state.characterState[charId].affection > 85) {
    state.characterState[charId].intimacyLevel = '🔥 Fever Pitch (Extreme 18+)';
  }

  // 2. Synthesize Next Chapter Title & Drama
  const titlePrefix = isHinglish ? `Adhyay ${nextNum}` : (isPunjabi ? `ਕਾਂਡ ${nextNum}` : `Chapter ${nextNum}`);
  const chapterTitle = `${titlePrefix}: ${getLoreChapterTitle(story, nextNum, lang)}`;

  // Clean choice text for prompt reflection
  const cleanAction = (userChoiceText || '').replace(/\*(.*?)\*/g, '$1').replace(/"/g, "'").trim();

  // Dynamic Narrative consequence reacting specifically to what was chosen
  let narrative = '';
  let dialogue = '';

  if (isHinglish) {
    narrative = `Aapke is faisle ke baad—"${cleanAction}"—kamre ka vatavaran poori tarah badal jata hai.\n\n${charName} ki aankhon mein ek aisi deewangi aur gehri aag dikhti hai jo pehle kabhi nahi dekhi. Saari dooriyan pal bhar mein pighalne lagti hain. ${charName} ek kadam aage badhata hai, dono ke beech ki hawa garam ho chuki hai.`;
    dialogue = `"${charName}: 'Tumhe lagta hai tum mujhe is tarah chhed kar bachte rahoge, ${roleName}? Ab baat lafzon se aage badh chuki hai...'"`;
  } else if (isPunjabi) {
    narrative = `ਜਦੋਂ ਤੁਸੀਂ ਆਖਿਆ—"${cleanAction}"—ਤਾਂ ${charName} ਦਾ ਦਿਲ ਇੱਕ ਪਲ ਲਈ ਥੰਮ ਗਿਆ। ਉਸਦੇ ਚਿਹਰੇ 'ਤੇ ਇਕ ਖ਼ਤਰਨਾਕ ਪਰ ਕਾਤਲਾਨਾ ਮੁਸਕਰਾਹਟ ਆ ਗਈ। ਉਹ ਤੁਹਾਡੇ ਹੋਰ ਨੇੜੇ ਆ ਗਿਆ।`;
    dialogue = `"${charName}: 'ਤੇਰਾ ਇਹ ਬੇਬਾਕ ਅੰਦਾਜ਼ ਹੀ ਮੈਨੂੰ ਕਮਲਾ ਕਰ ਰਿਹਾ ਏ... ਹੁਣ ਕੋਈ ਪਰਦਾ ਨਹੀਂ ਰਹੇਗਾ ਸਾਡੇ ਵਿਚਕਾਰ।'`;
  } else {
    narrative = `Following your decisive move—"${cleanAction}"—the entire atmosphere fractures with untamed electricity.\n\n${charName}'s breath hitches. A dangerous, intoxicating hunger flares in their eyes as they close every remaining inch between you. Every rule that once held you back is dissolving in this raw collision of wills.`;
    dialogue = `"${charName}: 'You have no idea what fire you've just ignited, ${roleName}. Don't even think about stepping back now.'"`;
  }

  // Generate 2 dynamic choices for Chapter N+1 + 1:1 chat transition
  const choices = [
    {
      text: isHinglish ? `*Unki aankhon mein dekhte hue unka haath pakdo* 'Jo shuru kiya hai, use poora karo.'` : `*Catch their hand and look into their eyes* 'Finish what you started.'`,
      tone: isHinglish ? 'Tez Junoon' : 'Intense Surrender',
      deltaAffection: 15,
      deltaTension: 18
    },
    {
      text: isHinglish ? `*Ek kadam peeche hokar unhe tadpao* 'Sabar karna seekho... abhi toh sirf shuruat hai.'` : `*Step back slightly with a knowing smirk* 'Patience... we have only just begun.'`,
      tone: isHinglish ? 'Chalaak Nasha' : 'Sensual Tease',
      deltaAffection: 18,
      deltaTension: 22
    },
    {
      text: isHinglish ? `*💬 18+ Uncensored Chat mein roleplay jari rakho*` : `*💬 Continue in 1:1 Uncensored Roleplay Chat*`,
      action: 'switch_to_chat',
      characterId: charId
    }
  ];

  const newChapter = {
    id: `c${nextNum}`,
    chapterNum: nextNum,
    title: chapterTitle,
    visual: story.cover || story.avatar || 'assets/sanctum.jpg',
    speaker: charName,
    characterMood: state.characterState[charId].intimacyLevel,
    narrative,
    dialogue,
    choices
  };

  chapters.push(newChapter);
  saveStoryChapters(story.id, chapters);
  state.activeChapterId = newChapter.id;
  renderStoryReader();
  playChime(620);
}

// Render Story Reader (Infinite Dynamic Branching Visual Novel)
function renderStoryReader() {
  const story = state.activeStory || KAVANA_STORIES[0];
  const lang = state.activeLang;
  const chapters = getStoryChapters(story, lang);

  let chapter = chapters.find(c => c.id === state.activeChapterId) || chapters[chapters.length - 1] || chapters[0];
  state.activeChapterId = chapter.id;

  const charId = story.characterId || story.id || 'scenario-char';
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
  if (titleTag) titleTag.textContent = chapter.title || story.title;

  const charAvatar = document.getElementById('stage-char-avatar');
  if (charAvatar) charAvatar.src = story.avatar || char.image;

  const moodTag = document.getElementById('stage-char-mood');
  if (moodTag) moodTag.textContent = chapter.characterMood || charState.intimacyLevel || story.initialMood || 'Intense & Passionate';

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
        btn.className = `choice-btn ${ch.action === 'switch_to_chat' ? 'action-chat' : ''}`;
        btn.innerHTML = `
          <span>${ch.text}</span>
          ${ch.tone ? `<span class="choice-tone-tag">${ch.tone}</span>` : ''}
        `;
        btn.addEventListener('click', () => {
          if (ch.action === 'switch_to_chat') {
            launchScenarioChat(story);
          } else if (ch.nextChapterId) {
            const nextCh = chapters.find(c => c.id === ch.nextChapterId);
            if (nextCh) {
              state.activeChapterId = nextCh.id;
              renderStoryReader();
            } else {
              progressStoryToNextChapter(story, ch.text, ch.tone, lang);
            }
          } else {
            progressStoryToNextChapter(story, ch.text, ch.tone, lang);
          }
        });
        choicesContainer.appendChild(btn);
      });
    }

    // Always offer replay from chapter 1 if past chapter 1
    if (chapter.chapterNum > 1 || chapters.length > 1) {
      const resetBtn = document.createElement('button');
      resetBtn.className = 'choice-btn';
      resetBtn.style.opacity = '0.75';
      resetBtn.style.fontSize = '0.8rem';
      resetBtn.innerHTML = `<span>↺ Replay from Chapter 1</span>`;
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

// Persistent Multi-Session Chat Controller

export function switchChatSession(sessionId) {
  if (!sessionId) return;
  const sessions = getChatSessions();
  const session = sessions.find(s => s.id === sessionId);
  const matchedStory = KAVANA_STORIES.find(s => s.id === sessionId);
  const char = CHARACTERS[sessionId];

  state.activeChatPartnerId = sessionId;

  if (matchedStory) {
    state.activeScenario = matchedStory;
    state.activeStory = matchedStory;
  } else if (session) {
    state.activeScenario = {
      id: session.id,
      title: session.title || session.name,
      characterName: session.name,
      avatar: session.avatar,
      category: session.category,
      userRole: session.userRole || 'Protagonist',
      userGoal: session.userGoal || 'Shape the narrative',
      openingHook: session.lastMessage
    };
  } else if (char) {
    state.activeScenario = {
      id: sessionId,
      title: char.title || char.name,
      characterName: char.name,
      avatar: char.image,
      category: char.archetype,
      userRole: 'Partner',
      userGoal: 'Shape the narrative turn-by-turn',
      openingHook: char.greetings?.[state.activeLang] || char.greetings?.['hinglish'] || char.greetings?.['en']
    };
  }

  try { localStorage.setItem('kavana_last_chat_id', sessionId); } catch(e){}
  renderChatView();
}

export function deleteChatSession(sessionId, e) {
  if (e) e.stopPropagation();
  let sessions = getChatSessions();
  sessions = sessions.filter(s => s.id !== sessionId);
  saveChatSessions(sessions);

  // If deleted session was active, switch to next available or default
  if (state.activeChatPartnerId === sessionId) {
    if (sessions.length > 0) {
      switchChatSession(sessions[0].id);
    } else {
      const defaults = getChatSessions();
      saveChatSessions(defaults);
      switchChatSession(defaults[0].id);
    }
  } else {
    renderChatRoster();
  }
  showToast({ title: 'Chat Removed', message: 'Conversation removed from active list.', type: 'info' });
}

export function openNewChatModal() {
  const modal = document.getElementById('modal-new-chat');
  if (modal) {
    modal.classList.add('active');
    renderNewChatDirectory('');
    const searchInput = document.getElementById('new-chat-search-input');
    if (searchInput) {
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 80);
    }
  }
}

export function closeNewChatModal() {
  document.getElementById('modal-new-chat')?.classList.remove('active');
}

export function renderNewChatDirectory(filterText = '') {
  const container = document.getElementById('new-chat-companions-grid');
  if (!container) return;

  const query = (filterText || '').toLowerCase().trim();
  const items = [];
  const seenIds = new Set();

  // 1. Add all KAVANA_STORIES (48+ cinema, romance, mafia, thriller)
  KAVANA_STORIES.forEach(story => {
    if (!story.id || seenIds.has(story.id)) return;
    seenIds.add(story.id);
    items.push({
      id: story.id,
      name: story.characterName || story.title,
      title: story.title,
      avatar: story.avatar || story.cover || 'assets/lucian.jpg',
      category: story.category || 'Cinema Scenario',
      role: story.userRole || 'Protagonist',
      goal: story.userGoal || 'Shape the narrative',
      storyObj: story
    });
  });

  // Filter items
  const filtered = query 
    ? items.filter(it => 
        it.name.toLowerCase().includes(query) ||
        it.title.toLowerCase().includes(query) ||
        it.category.toLowerCase().includes(query) ||
        it.role.toLowerCase().includes(query)
      )
    : items;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--kavana-text-dim);">
        <p style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--kavana-text-main);">No companions found matching "${query}"</p>
        <span style="font-size: 0.85rem;">Try searching for "Mirzapur", "Queen of Tears", "Mafia", "Romance", or "Boss"</span>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="new-chat-card" data-companion-id="${item.id}">
      <img src="${item.avatar}" alt="${item.name}" class="new-chat-avatar" loading="lazy">
      <div class="new-chat-info">
        <h4 class="new-chat-name">${item.name}</h4>
        <div class="new-chat-title">🎬 ${item.title}</div>
        <div class="new-chat-category">${item.category}</div>
        <div style="font-size: 0.75rem; color: var(--kavana-text-dim); margin-top: 0.25rem;">
          Role: <strong style="color: var(--kavana-gold);">${item.role}</strong>
        </div>
      </div>
      <button class="btn-primary-mini" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; border-radius: 9999px;">
        Start ➔
      </button>
    </div>
  `).join('');

  // Bind click handlers to cards
  container.querySelectorAll('.new-chat-card').forEach(card => {
    card.onclick = () => {
      const cId = card.dataset.companionId;
      const matched = items.find(it => it.id === cId);
      if (matched && matched.storyObj) {
        closeNewChatModal();
        launchScenarioChat(matched.storyObj);
      }
    };
  });
}

export function renderChatRoster(filterText = '') {
  const rosterList = document.getElementById('chat-roster-list');
  const sessions = getChatSessions();
  const query = (filterText || '').toLowerCase().trim();

  // 1. Render Left Sidebar Desktop Roster
  if (rosterList) {
    rosterList.innerHTML = '';
    const filtered = query
      ? sessions.filter(s => 
          s.name.toLowerCase().includes(query) || 
          (s.title && s.title.toLowerCase().includes(query)) ||
          (s.lastMessage && s.lastMessage.toLowerCase().includes(query))
        )
      : sessions;

    if (filtered.length === 0) {
      rosterList.innerHTML = `
        <div style="padding: 2rem 1rem; text-align: center; color: var(--kavana-text-dim); font-size: 0.85rem;">
          No matching chats found.<br>
          <button class="btn-new-chat-pill" id="btn-empty-new-chat" style="margin-top: 0.75rem;" type="button">
            ✦ Browse Companions
          </button>
        </div>
      `;
      document.getElementById('btn-empty-new-chat')?.addEventListener('click', openNewChatModal);
    } else {
      filtered.forEach(session => {
        const isActive = session.id === state.activeChatPartnerId;
        const item = document.createElement('div');
        item.className = `roster-item ${isActive ? 'active' : ''} ${session.unread ? 'unread' : ''}`;
        item.dataset.character = session.id;

        const timeStr = formatChatTime(session.timestamp);
        const lastMsgClean = (session.lastMessage || '').replace(/\*(.*?)\*/g, '$1');

        item.innerHTML = `
          <div class="roster-avatar-wrap">
            <img src="${session.avatar}" alt="${session.name}" class="roster-avatar" loading="lazy">
            <span class="online-status-dot"></span>
          </div>
          <div class="roster-meta">
            <div class="roster-meta-top">
              <span class="roster-meta-name">${session.name}</span>
              <span class="roster-time">${timeStr}</span>
            </div>
            <div class="roster-meta-sub">
              <span class="roster-last-msg">${lastMsgClean}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.25rem;">
              <span class="roster-cinema-tag">🎬 ${session.title ? (session.title.length > 22 ? session.title.slice(0, 20) + '...' : session.title) : 'Scenario'}</span>
              <button class="btn-delete-session" title="Remove conversation" data-id="${session.id}">×</button>
            </div>
          </div>
        `;

        item.onclick = (e) => {
          if (e.target.closest('.btn-delete-session')) return;
          switchChatSession(session.id);
        };

        const delBtn = item.querySelector('.btn-delete-session');
        if (delBtn) {
          delBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChatSession(session.id, e);
          };
        }

        rosterList.appendChild(item);
      });
    }
  }

  // 2. Populate Mobile Horizontal Companion Strip
  const mobileRoster = document.getElementById('mobile-chat-roster');
  if (mobileRoster) {
    mobileRoster.innerHTML = '';

    // "+ New" quick action button in mobile strip
    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'mobile-companion-pill add-new';
    newBtn.innerHTML = `
      <span class="m-avatar-ring" style="border-style: dashed; border-color: var(--kavana-gold); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--kavana-gold);">
        +
      </span>
      <span class="m-comp-label" style="color: var(--kavana-gold);">New</span>
    `;
    newBtn.onclick = openNewChatModal;
    mobileRoster.appendChild(newBtn);

    // Render active sessions
    sessions.forEach(session => {
      const isActive = session.id === state.activeChatPartnerId;
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `mobile-companion-pill ${isActive ? 'active' : ''}`;
      
      const shortName = session.name.split(' ')[0] || session.title.split(' ')[0];

      pill.innerHTML = `
        <span class="m-avatar-ring">
          <img src="${session.avatar}" alt="${session.name}">
          <span class="m-live-dot"></span>
        </span>
        <span class="m-comp-label">${shortName}</span>
      `;

      pill.onclick = () => {
        switchChatSession(session.id);
      };

      mobileRoster.appendChild(pill);
    });
  }
}

// Render Chat View
function renderChatView() {
  const sessions = getChatSessions();
  const charId = state.activeChatPartnerId;
  const currentSession = sessions.find(s => s.id === charId);
  const scenario = state.activeScenario || currentSession;
  const char = CHARACTERS[charId] || {
    name: scenario?.characterName || scenario?.name || 'Companion',
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

  // Load chat history from persistent storage or initialize
  let history = getChatHistory(charId);
  if (!history || history.length === 0) {
    const greeting = scenario?.openingHook || char.greetings?.[lang] || char.greetings?.['hinglish'] || char.greetings?.['en'] || '*Smiles at you.* Hello.';
    history = [{ sender: 'ai', text: greeting, time: Date.now() }];
    saveChatHistory(charId, history);
  }
  state.chatHistory[charId] = history;

  // Update Roster Sidebar and Mobile Strip
  renderChatRoster();

  // Update Main Chat Pane Header
  const avatar = document.getElementById('chat-partner-avatar');
  if (avatar) avatar.src = scenario?.avatar || char.image;

  const nameEl = document.getElementById('chat-partner-name');
  if (nameEl) nameEl.textContent = scenario?.characterName || scenario?.name || char.name;

  const archEl = document.getElementById('chat-partner-archetype');
  if (archEl) archEl.textContent = scenario?.title ? `🎬 ${scenario.title}` : `${char.archetype} • 18+ Uncensored`;

  const intTag = document.getElementById('chat-intimacy-tag');
  if (intTag) intTag.textContent = charState.intimacyLevel;

  // Update Sticky Role Banner
  const roleBanner = document.getElementById('chat-role-banner');
  const roleUserTitle = document.getElementById('chat-role-user-title');
  const roleUserGoal = document.getElementById('chat-role-user-goal');

  if (roleBanner && roleUserTitle && roleUserGoal) {
    roleBanner.style.display = 'flex';
    roleUserTitle.textContent = scenario?.userRole || 'Protagonist';
    roleUserGoal.textContent = scenario?.userGoal ? `Goal: ${scenario.userGoal}` : 'Goal: Shape the narrative';
  }

  const activePrompts = state.smartReplies[charId]?.length 
    ? state.smartReplies[charId] 
    : (scenario?.smartReplies || char.suggestedPrompts?.[lang] || char.suggestedPrompts?.['hinglish'] || char.suggestedPrompts?.['en'] || []);

  const area = document.getElementById('chat-messages-area');
  if (area) {
    area.innerHTML = '';
    history.forEach((msg) => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender}`;
      let text = (msg.text || '').replace(/\*(.*?)\*/g, '<em>*$1*</em>');
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
  let history = getChatHistory(charId) || [];

  const userMsg = { sender: 'user', text: text.trim(), time: Date.now() };
  history.push(userMsg);
  saveChatHistory(charId, history);

  // Update session's lastMessage and timestamp
  const sessions = getChatSessions();
  const session = sessions.find(s => s.id === charId);
  if (session) {
    session.lastMessage = text.trim();
    session.timestamp = Date.now();
    const sIdx = sessions.indexOf(session);
    sessions.splice(sIdx, 1);
    sessions.unshift(session);
    saveChatSessions(sessions);
  }

  renderChatView();

  const partnerName = state.activeScenario?.characterName || state.activeScenario?.name || CHARACTERS[charId]?.name || 'Companion';
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
      history,
      state.activeLang,
      state.characterState[charId],
      state.activeScenario
    );

    if (typing.parentNode) typing.parentNode.removeChild(typing);

    state.characterState[charId].affection = aiResponse.affection;
    state.characterState[charId].tension = aiResponse.tension;
    state.characterState[charId].intimacyLevel = aiResponse.intimacyLevel;
    state.smartReplies[charId] = aiResponse.smartReplies || [];

    const aiMsg = { sender: 'ai', text: aiResponse.replyText, time: Date.now() };
    history.push(aiMsg);
    saveChatHistory(charId, history);

    // Update session with AI reply
    const updatedSessions = getChatSessions();
    const updatedSession = updatedSessions.find(s => s.id === charId);
    if (updatedSession) {
      updatedSession.lastMessage = aiResponse.replyText;
      updatedSession.timestamp = Date.now();
      saveChatSessions(updatedSessions);
    }

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
function initApp() {
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
    let greeting = scenario?.openingHook || "*Smiles at you.* Hello.";
    if (!scenario) {
      const char = CHARACTERS[charId] || CHARACTERS.kabir;
      greeting = char.greetings?.[state.activeLang] || char.greetings?.['hinglish'] || '*Smiles.* Hello.';
    }
    const resetMsg = [{ sender: 'ai', text: greeting, time: Date.now() }];
    state.chatHistory[charId] = resetMsg;
    saveChatHistory(charId, resetMsg);
    state.smartReplies[charId] = scenario?.smartReplies || [];

    // Update session lastMessage
    const sessions = getChatSessions();
    const session = sessions.find(s => s.id === charId);
    if (session) {
      session.lastMessage = greeting;
      session.timestamp = Date.now();
      saveChatSessions(sessions);
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
    const storyId = state.activeStory?.id;
    if (storyId) {
      delete state.storyBranches[storyId];
      try { localStorage.removeItem(`kavana_story_branch_${storyId}`); } catch (e) {}
    }
    state.activeChapterId = 'c1';
    renderStoryReader();
    showToast({ title: 'Novel Reset', message: 'Story reset to Chapter 1.', type: 'info' });
  });

  // Story Reader Custom Action Submission
  const handleCustomAction = () => {
    const input = document.getElementById('reader-custom-action-input');
    if (input && input.value.trim()) {
      const customAction = input.value.trim();
      input.value = '';
      progressStoryToNextChapter(state.activeStory, customAction, 'Custom Action', state.activeLang);
    }
  };

  document.getElementById('btn-submit-custom-action')?.addEventListener('click', handleCustomAction);
  document.getElementById('reader-custom-action-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomAction();
    }
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

  // New Chat Modal & Companion Directory
  document.getElementById('btn-open-new-chat-modal')?.addEventListener('click', openNewChatModal);
  document.getElementById('btn-close-new-chat')?.addEventListener('click', closeNewChatModal);
  document.getElementById('modal-new-chat')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-new-chat') closeNewChatModal();
  });
  document.getElementById('new-chat-search-input')?.addEventListener('input', (e) => {
    renderNewChatDirectory(e.target.value);
  });

  // Chat Roster Search Filter
  document.getElementById('roster-search-input')?.addEventListener('input', (e) => {
    renderChatRoster(e.target.value);
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

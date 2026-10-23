/**
 * Kavana AI - 1:1 Official Website & Interactive Platform Controller
 */

import { CHARACTERS, KAVANA_STORIES, detectUserGender, detectCharacterGender, resolveActiveSpeakerName } from './engine.js';
import { 
  generateAIChatReply, 
  generateDynamicNovel, 
  generateDynamicStoryChapter,
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

// Persistent Chat Sessions & Message History
export function getChatSessions() {
  try {
    // Migration: One-time wipe of dummy mock sessions if user never messaged them
    if (localStorage.getItem('kavana_sessions_v5_clean') !== 'true') {
      localStorage.setItem('kavana_sessions_v5_clean', 'true');
      const raw = localStorage.getItem('kavana_chat_sessions');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Keep ONLY sessions where the user actually sent at least one message
          const userOnly = parsed.filter(s => {
            try {
              const hRaw = localStorage.getItem(`kavana_chat_hist_${s.id}`);
              if (hRaw) {
                const hist = JSON.parse(hRaw);
                return Array.isArray(hist) && hist.some(m => m.sender === 'user');
              }
            } catch(e) {}
            return false;
          });
          localStorage.setItem('kavana_chat_sessions', JSON.stringify(userOnly));
          return userOnly;
        }
      }
      return [];
    }

    const raw = localStorage.getItem('kavana_chat_sessions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out any stale movie-based sessions from user's cache
        const nonMovie = parsed.filter(s => 
          !s.id.includes('mirzapur') && 
          !s.id.includes('peaky') && 
          !s.id.includes('queen-of-tears') && 
          !s.id.includes('tmdb')
        );
        return nonMovie;
      }
    }
  } catch (e) {
    console.warn('Error reading chat sessions:', e);
  }
  return []; // Return empty array if user has not started any chats yet!
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
  activeScenario: initialSavedSessions.length > 0 ? (KAVANA_STORIES.find(s => s.id === initialSavedSessions[0]?.id) || initialSavedSessions[0]) : null,
  searchQuery: '',
  activeChapterId: 'c1',
  activeChatPartnerId: initialSavedSessions.length > 0 ? (localStorage.getItem('kavana_last_chat_id') || initialSavedSessions[0]?.id) : null,
  credits: parseInt(localStorage.getItem('kavana_coins') || '500', 10),
  activeCategory: 'all',
  mobileChatView: 'list', // 'list' shows all conversations roster on mobile, 'conversation' shows active chat
  userGender: localStorage.getItem('kavana_user_gender') || 'male',
  
  characterState: {},
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

// Update Chat Badge Counts
export function updateChatBadges() {
  const sessions = getChatSessions();
  const count = sessions.length;
  
  const navBadge = document.getElementById('nav-chats-count');
  if (navBadge) {
    if (count > 0) {
      navBadge.textContent = count;
      navBadge.style.display = 'inline-flex';
    } else {
      navBadge.style.display = 'none';
    }
  }

  const dockBadge = document.getElementById('dock-chats-badge');
  if (dockBadge) {
    dockBadge.style.display = count > 0 ? 'block' : 'none';
  }
}

// Tab & View Router: Home, Explore, Search, Chat
function switchView(viewName) {
  // Normalize alias names
  if (viewName === 'stories-explore') viewName = 'explore';
  if (viewName === 'character-chat' || viewName === 'chats') viewName = 'chat';

  // Valid views: 'home', 'explore', 'search', 'chat'
  if (!['home', 'explore', 'search', 'chat'].includes(viewName)) {
    viewName = 'home';
  }

  state.currentView = viewName;
  playChime(600);

  // Update Nav Links & Mobile Dock
  document.querySelectorAll('.kavana-nav-link, .nav-btn, .mobile-nav-item, .mobile-dock-btn').forEach(btn => {
    const bView = btn.dataset.view;
    if (bView === viewName || (viewName === 'explore' && bView === 'stories-explore') || (viewName === 'chat' && bView === 'character-chat')) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Mobile conversation full screen mode
  if (viewName === 'chat' && state.mobileChatView === 'conversation') {
    document.body.classList.add('in-conversation');
  } else {
    document.body.classList.remove('in-conversation');
  }

  const appContainer = document.getElementById('main-app-container');
  if (appContainer) appContainer.style.display = 'block';

  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

  // Target view mapping
  const targetId = viewName === 'chat' ? 'view-character-chat' : `view-${viewName}`;
  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.classList.add('active');
  }

  if (viewName === 'home') renderHomeView();
  else if (viewName === 'explore') renderExploreFeed();
  else if (viewName === 'search') renderSearchView();
  else if (viewName === 'chat') renderChatView();

  updateChatBadges();
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

  state.mobileChatView = 'conversation';
  document.body.classList.add('in-conversation');
  const workspace = document.querySelector('.chat-workspace');
  if (workspace) workspace.dataset.mobileView = 'conversation';
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

// Reusable Cinema Story Card Component
function createStoryCardElement(story) {
  const card = document.createElement('div');
  card.className = 'story-card';

  const rating = story.rating || story.imdbRating || '4.9';
  const posterUrl = (story.avatar || story.cover) + '?v=vn_female_v3';

  card.innerHTML = `
    <div class="story-card-poster">
      <img src="${posterUrl}" alt="${story.title}" loading="lazy" onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='assets/love_villa.jpg';}else{this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 400 600\\'><defs><linearGradient id=\\'g\\' x1=\\'0\\' y1=\\'0\\' x2=\\'1\\' y2=\\'1\\'><stop offset=\\'0%25\\' stop-color=\\'%230e0e18\\'/><stop offset=\\'100%25\\' stop-color=\\'%231a0a14\\'/></linearGradient></defs><rect width=\\'100%25\\' height=\\'100%25\\' fill=\\'url(%23g)\\'/><circle cx=\\'200\\' cy=\\'260\\' r=\\'80\\' fill=\\'%23d4af37\\' opacity=\\'0.15\\'/><text x=\\'200\\' y=\\'275\\' font-size=\\'48\\' fill=\\'%23d4af37\\' text-anchor=\\'middle\\'>✦</text><text x=\\'200\\' y=\\'360\\' font-size=\\'20\\' font-family=\\'sans-serif\\' font-weight=\\'bold\\' fill=\\'%23ffffff\\' text-anchor=\\'middle\\'>KAVANA STORY</text></svg>';}">
      <div class="poster-gradient-fade"></div>
      <div class="poster-top-badges">
        <span class="card-rating-badge">★ ${rating}</span>
        <span class="card-quality-badge">18+ CHAT</span>
      </div>
      <div class="card-hover-actions">
        <button class="btn-card-action primary btn-play-story">💬 Chat Story</button>
      </div>
      <div class="mobile-poster-play-badge">💬</div>
    </div>
    <div class="story-card-body">
      <h3 class="card-title-text">${story.title}</h3>
      <p class="card-character-sub">${story.characterName || 'Lead Character'} • ${story.category || 'Stories'}</p>
      <div class="card-tags-row">
        ${(story.tags || []).slice(0, 2).map(t => `<span class="card-tag-pill">${t}</span>`).join('')}
        <span class="card-plays-tag">🔥 ${(story.playerCount ? (story.playerCount / 1000).toFixed(0) + 'K' : '150K')}</span>
      </div>
      <div class="mobile-card-quick-actions">
        <button class="mobile-quick-btn play btn-play-story-mobile" type="button" style="width: 100%;">💬 Chat Story</button>
      </div>
    </div>
  `;

  card.querySelector('.btn-play-story')?.addEventListener('click', (e) => {
    e.stopPropagation();
    launchScenarioChat(story);
  });

  card.querySelector('.btn-play-story-mobile')?.addEventListener('click', (e) => {
    e.stopPropagation();
    launchScenarioChat(story);
  });

  card.addEventListener('click', () => {
    launchScenarioChat(story);
  });

  return card;
}

// Render VIP Story Characters Carousel on Home
function renderHomeStoryTray() {
  const tray = document.getElementById('home-story-personas-tray');
  if (!tray) return;
  tray.innerHTML = '';

  const seen = new Set();
  const topStories = [];
  for (const s of KAVANA_STORIES) {
    const key = (s.characterName || s.title).trim();
    if (!seen.has(key) && s.avatar) {
      seen.add(key);
      topStories.push(s);
      if (topStories.length >= 14) break;
    }
  }

  topStories.forEach(story => {
    const item = document.createElement('div');
    item.className = 'story-avatar-item';
    const shortName = story.characterName ? story.characterName.split(' ')[0] : story.title.split(' ')[0];
    item.innerHTML = `
      <div class="avatar-ring-wrap">
        <img src="${story.avatar}?v=vn_female_v3" alt="${story.characterName || story.title}" class="story-avatar-img" loading="lazy" onerror="this.onerror=null;this.src='assets/love_villa.jpg';">
      </div>
      <span class="story-avatar-name">${shortName}</span>
    `;
    item.addEventListener('click', (e) => {
      e.preventDefault();
      launchScenarioChat(story);
    });
    tray.appendChild(item);
  });
}

// 1. Render Home View (Spotlight & Trending Stories)
function renderHomeView() {
  setupHeroCarousel();
  renderHomeStoryTray();
  const trendingGrid = document.getElementById('home-trending-grid');
  if (trendingGrid) {
    trendingGrid.innerHTML = '';
    const trending = KAVANA_STORIES.slice(0, 4);
    trending.forEach(story => {
      trendingGrid.appendChild(createStoryCardElement(story));
    });
  }

  const viewAllBtn = document.getElementById('btn-home-view-all-explore');
  if (viewAllBtn) {
    viewAllBtn.textContent = `View All ${KAVANA_STORIES.length} Scenarios →`;
    viewAllBtn.onclick = () => switchView('explore');
  }
}

// 2. Render Explore Stories Feed (Full Catalog & Filters)
function renderExploreFeed() {
  const grid = document.getElementById('kavana-stories-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const q = (state.searchQuery || '').trim().toLowerCase();
  const cat = state.activeCategory || 'all';

  const filtered = KAVANA_STORIES.filter(s => {
    // 1. Category check
    let catMatch = true;
    if (cat === 'spicy') {
      catMatch = s.category?.toLowerCase().includes('spicy') || (s.tags || []).some(t => t.toLowerCase().includes('18+') || t.toLowerCase().includes('spicy'));
    } else if (cat === 'harem') {
      catMatch = s.category?.toLowerCase().includes('harem') || s.category?.toLowerCase().includes('rival') || (s.tags || []).some(t => t.toLowerCase().includes('harem') || t.toLowerCase().includes('rival'));
    } else if (cat === 'mafia') {
      catMatch = s.category?.toLowerCase().includes('mafia') || s.category?.toLowerCase().includes('billionaire') || (s.tags || []).some(t => t.toLowerCase().includes('mafia') || t.toLowerCase().includes('billionaire') || t.toLowerCase().includes('don') || t.toLowerCase().includes('ceo'));
    } else if (cat === 'forbidden') {
      catMatch = s.category?.toLowerCase().includes('forbidden') || (s.tags || []).some(t => t.toLowerCase().includes('forbidden') || t.toLowerCase().includes('secret') || t.toLowerCase().includes('step') || t.toLowerCase().includes('marriage'));
    } else if (cat === 'royalty' || cat === 'badboy') {
      catMatch = s.category?.toLowerCase().includes('royalty') || s.category?.toLowerCase().includes('bad boy') || (s.tags || []).some(t => t.toLowerCase().includes('royalty') || t.toLowerCase().includes('prince') || t.toLowerCase().includes('bad boy') || t.toLowerCase().includes('alpha'));
    } else if (cat === 'fantasy') {
      catMatch = s.category?.toLowerCase().includes('fantasy') || (s.tags || []).some(t => t.toLowerCase().includes('fantasy') || t.toLowerCase().includes('magic') || t.toLowerCase().includes('demon') || t.toLowerCase().includes('yandere'));
    } else if (cat === 'college') {
      catMatch = s.category?.toLowerCase().includes('college') || s.category?.toLowerCase().includes('roommate') || (s.tags || []).some(t => t.toLowerCase().includes('college') || t.toLowerCase().includes('roommate') || t.toLowerCase().includes('neighbor'));
    } else if (cat === 'desi') {
      catMatch = s.category?.toLowerCase().includes('desi') || (s.tags || []).some(t => t.toLowerCase().includes('desi') || t.toLowerCase().includes('punjabi') || t.toLowerCase().includes('hinglish'));
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

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
        <h3 style="color: #fff; margin-bottom: 0.5rem;">No scenarios match "${state.searchQuery}"</h3>
        <p style="font-size: 0.88rem;">Try choosing another category or clearing filters.</p>
        <button class="btn-secondary-mini" id="btn-reset-filters" style="margin-top: 1rem; padding: 0.6rem 1.25rem;">Show All Stories</button>
      </div>
    `;
    grid.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
      state.searchQuery = '';
      state.activeCategory = 'all';
      document.querySelectorAll('#category-pills-container .cat-pill').forEach(p => {
        if (p.dataset.category === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
      renderExploreFeed();
    });
    return;
  }

  filtered.forEach(story => {
    grid.appendChild(createStoryCardElement(story));
  });
}

// 3. Render Dedicated Search View
function renderSearchView(explicitQuery = null) {
  const input = document.getElementById('main-search-input');
  const clearBtn = document.getElementById('btn-clear-main-search');
  const grid = document.getElementById('search-results-grid');
  const meta = document.getElementById('search-results-meta');
  const countText = document.getElementById('search-results-count-text');

  if (!grid) return;
  grid.innerHTML = '';

  if (explicitQuery !== null && input) {
    input.value = explicitQuery;
  }

  const query = (input ? input.value : (explicitQuery || '')).trim().toLowerCase();

  if (clearBtn && input) {
    clearBtn.style.display = input.value ? 'grid' : 'none';
  }

  const filtered = query
    ? KAVANA_STORIES.filter(s => {
        const matchTitle = (s.title || '').toLowerCase().includes(query);
        const matchChar = (s.characterName || '').toLowerCase().includes(query);
        const matchRole = (s.userRole || '').toLowerCase().includes(query);
        const matchDesc = (s.summary || '').toLowerCase().includes(query);
        const matchTag = (s.tags || []).some(t => t.toLowerCase().includes(query));
        return matchTitle || matchChar || matchRole || matchDesc || matchTag;
      })
    : KAVANA_STORIES;

  if (meta && countText) {
    meta.style.display = 'block';
    countText.textContent = query ? `Found ${filtered.length} scenarios for "${query}"` : `Showing all ${filtered.length} scenarios`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
        <h3 style="color: #fff; margin-bottom: 0.5rem;">No scenarios found for "${query}"</h3>
        <p style="font-size: 0.88rem;">Try searching for "Aryan", "Kabir", "Love Villa", or "Mafia".</p>
      </div>
    `;
    return;
  }

  filtered.forEach(story => {
    grid.appendChild(createStoryCardElement(story));
  });
}

// Hero Carousel Switcher
let heroSpotlightIndex = 0;
function setupHeroCarousel() {
  const prevBtn = document.getElementById('btn-hero-prev');
  const nextBtn = document.getElementById('btn-hero-next');
  const featuredList = KAVANA_STORIES.slice(0, 6);

  function applyHeroSlide(idx) {
    if (!featuredList.length) return;
    heroSpotlightIndex = (idx + featuredList.length) % featuredList.length;
    const s = featuredList[heroSpotlightIndex];
    state.activeStory = s;
    state.activeScenario = s;

    const heroBanner = document.getElementById('hero-banner');
    const heroTitle = document.getElementById('hero-title-text');
    const heroDesc = document.getElementById('hero-desc-text');
    const heroRating = document.getElementById('hero-rating-badge');
    const heroPlays = document.getElementById('hero-plays-badge');

    if (heroBanner) heroBanner.style.backgroundImage = `url('${s.cover || s.avatar || 'assets/love_villa.jpg'}?v=vn_female_v3')`;
    if (heroTitle) heroTitle.textContent = s.title;
    if (heroDesc) heroDesc.textContent = s.summary;
    if (heroRating) heroRating.textContent = `★ ${s.rating || '4.9'} Rating`;
    if (heroPlays) heroPlays.textContent = `🔥 ${s.playerCount ? (s.playerCount/1000).toFixed(0) + 'K PLAYS' : '184K PLAYS'}`;

    const dotsContainer = document.getElementById('hero-carousel-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      featuredList.forEach((item, i) => {
        const dot = document.createElement('div');
        dot.className = `hero-dot ${i === heroSpotlightIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => applyHeroSlide(i));
        dotsContainer.appendChild(dot);
      });
    }
  }

  prevBtn?.addEventListener('click', () => applyHeroSlide(heroSpotlightIndex - 1));
  nextBtn?.addEventListener('click', () => applyHeroSlide(heroSpotlightIndex + 1));
  applyHeroSlide(0);
}

// ========================================================
// Dynamic Procedural Visual Novel Engine (Zero Hardcoded Stories)
// Supports infinite branching chapters (Chapter 1, 2, 3, 4...)
// Custom user actions, authentic dialect dialogue & tone scoring
// ========================================================

function getLoreChapterTitle(story, chNum, lang) {
  const isHinglish = lang === 'hinglish' || lang === 'hindi' || lang === 'urdu';
  const isPunjabi = lang === 'punjabi';

  // Procedural titles based on chapter progression
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

  // 2. Check pre-written static chapters (e.g. Kabir, Valeria, or any pre-authored story)
  const prewritten = story.languages?.[lang]?.chapters || 
                     story.languages?.['en']?.chapters || 
                     (Array.isArray(story.chapters) && story.chapters.length > 0 ? story.chapters : null);
  if (prewritten && prewritten.length > 0) {
    state.storyBranches[storyId] = prewritten;
    return prewritten;
  }

  // 3. Check localStorage
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

  // 4. Synthesize Initial Chapter 1 for this story
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

export async function progressStoryToNextChapter(story, userChoiceText, choiceTone = '', lang = 'hinglish') {
  if (!story) story = state.activeStory || KAVANA_STORIES[0];
  const charId = story.characterId || story.id || 'scenario-char';
  const charName = story.characterName || story.title || 'Companion';
  const roleName = story.userRole || 'Partner';
  const isHinglish = lang === 'hinglish' || lang === 'hindi' || lang === 'urdu';
  const isPunjabi = lang === 'punjabi';

  const chapters = getStoryChapters(story, lang);
  const nextNum = chapters.length + 1;

  // Immediate UI feedback showing AI is thinking & writing
  const proseEl = document.getElementById('scene-prose-text');
  const dialogueEl = document.getElementById('scene-dialogue-text');
  if (proseEl) {
    proseEl.innerHTML = `<span style="color: var(--kavana-crimson); font-style: italic; font-size: 0.95rem;">✦ AI is thinking and writing Chapter ${nextNum} for ${charName}...</span>`;
  }
  if (dialogueEl) dialogueEl.style.display = 'none';

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

  // Dynamic AI Generation
  let narrative = '';
  let dialogue = '';
  const userGen = state.userGender || 'male';
  const charGen = detectCharacterGender(charId, story, story);
  try {
    const aiStory = await generateDynamicStoryChapter(story, nextNum, cleanAction, lang, userGen);
    narrative = aiStory.narrative;
    dialogue = aiStory.dialogue;
  } catch (err) {
    console.warn('AI chapter generation fallback:', err);
    if (isHinglish) {
      const actionVerb = charGen === 'female' ? 'badhti hai' : 'badhta hai';
      const addressVerb = userGen === 'female' ? 'bachti rahogi' : 'bachte rahoge';
      narrative = `Aapke is faisle ke baad—"${cleanAction}"—kamre ka vatavaran poori tarah badal jata hai.\n\n${charName} ki aankhon mein ek aisi deewangi aur gehri aag dikhti hai jo pehle kabhi nahi dekhi. Saari dooriyan pal bhar mein pighalne lagti hain. ${charName} ek kadam aage ${actionVerb}, dono ke beech ki hawa garam ho chuki hai.`;
      dialogue = `"${charName}: 'Tumhe lagta hai tum mujhe is tarah chhed kar ${addressVerb}, ${roleName}? Ab baat lafzon se aage badh chuki hai...'"`;
    } else {
      narrative = `Following your decisive move—"${cleanAction}"—the entire atmosphere fractures with untamed electricity.\n\n${charName}'s breath hitches. A dangerous, intoxicating hunger flares in their eyes as they close every remaining inch between you.`;
      dialogue = `"${charName}: 'You have no idea what fire you've just ignited, ${roleName}. Don't even think about stepping back now.'"`;
    }
  }

  // Generate dynamic choices for next chapter
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
  state.mobileChatView = 'conversation';
  document.body.classList.add('in-conversation');
  const workspace = document.querySelector('.chat-workspace');
  if (workspace) workspace.dataset.mobileView = 'conversation';
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

  // If deleted session was active, switch to next available or clean empty
  if (state.activeChatPartnerId === sessionId) {
    if (sessions.length > 0) {
      switchChatSession(sessions[0].id);
    } else {
      state.activeChatPartnerId = null;
      state.activeScenario = null;
      try { localStorage.removeItem('kavana_last_chat_id'); } catch(e){}
      renderChatView();
      renderChatRoster();
    }
  } else {
    renderChatRoster();
  }
  updateChatBadges();
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

  // 1. Add all KAVANA_STORIES
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
        <span style="font-size: 0.85rem;">Try searching for "Love Villa", "Aryan", "Kabir", "Roommates", or "Priya"</span>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="new-chat-card" data-companion-id="${item.id}">
      <img src="${item.avatar}" alt="${item.name}" class="new-chat-avatar" loading="lazy" onerror="this.onerror=null;this.src='assets/love_villa_avatar.jpg';">
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

// Render Quick Story Characters Tray in Chat Roster
function renderRosterQuickPersonas() {
  const tray = document.getElementById('roster-quick-personas-tray');
  if (!tray) return;
  tray.innerHTML = '';

  const seen = new Set();
  const topChars = [];
  for (const s of KAVANA_STORIES) {
    const key = (s.characterName || s.title).trim();
    if (!seen.has(key) && s.avatar) {
      seen.add(key);
      topChars.push(s);
      if (topChars.length >= 12) break;
    }
  }

  topChars.forEach(story => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'roster-persona-chip';
    const shortName = story.characterName ? story.characterName.split(' ')[0] : story.title.split(' ')[0];
    btn.innerHTML = `
      <div class="roster-persona-ring">
        <img src="${story.avatar}?v=vn_female_v3" alt="${shortName}" loading="lazy" onerror="this.onerror=null;this.src='assets/love_villa.jpg';">
      </div>
      <span class="roster-persona-name">${shortName}</span>
    `;
    btn.onclick = (e) => {
      e.preventDefault();
      launchScenarioChat(story);
    };
    tray.appendChild(btn);
  });
}

export function renderChatRoster(filterText = '') {
  renderRosterQuickPersonas();
  const rosterList = document.getElementById('chat-roster-list');
  const sessions = getChatSessions();
  const query = (filterText || '').toLowerCase().trim();

  // 1. Render Left Sidebar Desktop Roster
  if (rosterList) {
    rosterList.innerHTML = '';

    if (sessions.length === 0) {
      rosterList.innerHTML = `
        <div class="empty-chat-state" style="padding: 2.5rem 1rem;">
          <div class="empty-chat-state-icon" style="font-size: 2.2rem;">💬</div>
          <h4 style="font-size: 1rem; color: #fff; margin-bottom: 0.35rem;">No Active Chats</h4>
          <p style="font-size: 0.8rem; color: #94a3b8; line-height: 1.45; margin-bottom: 1.25rem;">
            Choose any story from the feed to launch your private 18+ uncensored roleplay.
          </p>
          <button class="empty-chat-action-btn" id="btn-roster-browse" type="button" style="font-size: 0.82rem; padding: 0.45rem 1.1rem;">
            ✦ Browse Stories
          </button>
        </div>
      `;
      document.getElementById('btn-roster-browse')?.addEventListener('click', () => switchView('stories-explore'));
      return;
    }

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
            ✦ Browse Directory
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
            <img src="${session.avatar}" alt="${session.name}" class="roster-avatar" loading="lazy" onerror="this.onerror=null;this.src='assets/love_villa_avatar.jpg';">
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
          <img src="${session.avatar}" alt="${session.name}" onerror="this.onerror=null;this.src='assets/love_villa_avatar.jpg';">
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
  updateChatBadges();

  const emptyView = document.getElementById('chat-empty-view');
  const activeView = document.getElementById('chat-active-view');

  if (sessions.length === 0 || !state.activeChatPartnerId) {
    if (emptyView) emptyView.style.display = 'flex';
    if (activeView) activeView.style.display = 'none';
    document.getElementById('btn-chat-empty-browse')?.addEventListener('click', () => switchView('stories-explore'));
    renderChatRoster();
    return;
  }

  if (emptyView) emptyView.style.display = 'none';
  if (activeView) activeView.style.display = 'flex';

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

  // Handle mobile master-detail layout toggle
  const workspace = document.querySelector('.chat-workspace');
  if (workspace) {
    workspace.dataset.mobileView = state.mobileChatView || 'list';
  }

  if (state.mobileChatView === 'conversation') {
    document.body.classList.add('in-conversation');
  } else {
    document.body.classList.remove('in-conversation');
  }

  // Mobile Back Button: Return from conversation to chats list
  const mobileBackBtn = document.getElementById('btn-chat-mobile-back');
  if (mobileBackBtn) {
    mobileBackBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.mobileChatView = 'list';
      document.body.classList.remove('in-conversation');
      if (workspace) workspace.dataset.mobileView = 'list';
      renderChatRoster();
    };
  }

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

  const activeSpeaker = resolveActiveSpeakerName(scenario, '', history);
  const isMulti = scenario && (/sirens|villa/i.test(scenario.id || '') || /roommate/i.test(scenario.id || '') || /&|,|\band\b/i.test(scenario.characterName || ''));

  const nameEl = document.getElementById('chat-partner-name');
  if (nameEl) {
    if (isMulti) {
      nameEl.innerHTML = `<span style="color: var(--kavana-crimson);">${activeSpeaker}</span> <span style="font-size: 0.85em; opacity: 0.75; font-weight: 500;">(${scenario.title.split('(')[0].trim()})</span>`;
    } else {
      nameEl.textContent = scenario?.characterName || scenario?.name || char.name;
    }
  }

  const archEl = document.getElementById('chat-partner-archetype');
  if (archEl) {
    if (isMulti) {
      archEl.textContent = `Talking directly to ${activeSpeaker} • 18+ Uncensored`;
    } else {
      archEl.textContent = scenario?.title ? `🎬 ${scenario.title}` : `${char.archetype} • 18+ Uncensored`;
    }
  }

  const intTag = document.getElementById('chat-intimacy-tag');
  if (intTag) intTag.textContent = charState.intimacyLevel;

  // Update Live Affection HUD Meter
  const affFill = document.getElementById('chat-affection-fill');
  const affPct = document.getElementById('chat-affection-pct');
  if (affFill) affFill.style.width = `${charState.affection || 65}%`;
  if (affPct) affPct.textContent = `${charState.affection || 65}%`;

  // Update Sticky Role Banner & User Gender Controls
  const roleBanner = document.getElementById('chat-role-banner');
  const roleUserTitle = document.getElementById('chat-role-user-title');
  const roleUserGoal = document.getElementById('chat-role-user-goal');
  const btnGender = document.getElementById('btn-user-gender-toggle');

  if (roleBanner && roleUserTitle && roleUserGoal) {
    roleBanner.style.display = 'flex';
    roleUserTitle.textContent = scenario?.userRole || 'Protagonist';
    roleUserGoal.textContent = scenario?.userGoal ? `Goal: ${scenario.userGoal}` : 'Goal: Shape the narrative';
  }

  if (btnGender) {
    const curGender = state.userGender || 'male';
    btnGender.innerHTML = curGender === 'female' ? '👩 You: Female' : '👨 You: Male';
    btnGender.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.userGender = state.userGender === 'male' ? 'female' : 'male';
      localStorage.setItem('kavana_user_gender', state.userGender);
      btnGender.innerHTML = state.userGender === 'female' ? '👩 You: Female' : '👨 You: Male';
      showToast({
        title: 'Grammar Adapted',
        message: `Your gender set to ${state.userGender.toUpperCase()}. AI will address you accordingly.`,
        type: 'info'
      });
    };
  }

  // HTML-escaping helper for security (CodeRabbit standard)
  const escapeHtml = (str) => {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const area = document.getElementById('chat-messages-area');
  if (area) {
    area.innerHTML = '';
    const partnerName = scenario?.characterName || scenario?.name || char.name;

    history.forEach((msg) => {
      const isAi = msg.sender === 'ai';
      const wrap = document.createElement('div');
      wrap.className = `chat-bubble-wrap ${isAi ? 'ai' : 'user'}`;

      const timeStr = formatChatTime(msg.time || Date.now());
      const safe = escapeHtml(msg.text || '');
      const formatted = safe.replace(/\*(.*?)\*/g, '<em>*$1*</em>');
      const senderLabel = isAi ? (msg.character || (isMulti ? activeSpeaker : partnerName)) : 'You';

      wrap.innerHTML = `
        <div class="chat-bubble-meta-row">
          <span class="chat-bubble-sender-name">${senderLabel}</span>
          <span class="chat-bubble-timestamp">${timeStr}</span>
        </div>
        <div class="chat-bubble ${isAi ? 'ai' : 'user'}">${formatted}</div>
      `;

      area.appendChild(wrap);
    });
    area.scrollTop = area.scrollHeight;
  }

  // Quick responses removed per user request - clean up any lingering elements
  const existingRepliesBar = document.getElementById('chat-quick-replies-bar');
  if (existingRepliesBar && existingRepliesBar.parentNode) {
    existingRepliesBar.parentNode.removeChild(existingRepliesBar);
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

  // Auto-detect gender if user typed gendered verbs (e.g., "kar raha hoon" -> male, "kar rahi hoon" -> female)
  const inferredGender = detectUserGender(text, state.userGender || 'male');
  if (inferredGender && inferredGender !== state.userGender) {
    state.userGender = inferredGender;
    localStorage.setItem('kavana_user_gender', inferredGender);
  }

  renderChatView();

  const activeSpeaker = resolveActiveSpeakerName(state.activeScenario, text, history);
  const area = document.getElementById('chat-messages-area');
  const typing = document.createElement('div');
  typing.className = 'chat-bubble-wrap ai';
  typing.innerHTML = `
    <div class="chat-bubble-meta-row">
      <span class="chat-bubble-sender-name">${activeSpeaker}</span>
      <span class="chat-bubble-timestamp">Just now</span>
    </div>
    <div class="chat-bubble ai thinking-bubble">
      <div class="thinking-dots">
        <span></span><span></span><span></span>
      </div>
      <em>${activeSpeaker} is thinking...</em>
    </div>
  `;
  area?.appendChild(typing);
  if (area) area.scrollTop = area.scrollHeight;

  try {
    const aiResponse = await generateAIChatReply(
      charId,
      text,
      history,
      state.activeLang,
      state.characterState[charId],
      state.activeScenario,
      state.userGender || 'male',
      activeSpeaker
    );

    if (typing.parentNode) typing.parentNode.removeChild(typing);

    state.characterState[charId].affection = aiResponse.affection;
    state.characterState[charId].tension = aiResponse.tension;
    state.characterState[charId].intimacyLevel = aiResponse.intimacyLevel;

    const aiMsg = { sender: 'ai', text: aiResponse.replyText, time: Date.now(), character: activeSpeaker };
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
  const matchedStory = KAVANA_STORIES.find(s => s.id === dancerId || s.id.includes(dancerId) || (s.characterName && s.characterName.toLowerCase().includes(dancerId)));
  const char = CHARACTERS[dancerId] || (matchedStory ? {
    name: matchedStory.characterName || matchedStory.title,
    image: matchedStory.avatar || matchedStory.cover,
    title: matchedStory.title
  } : CHARACTERS.kabir);
  const dancerImg = document.getElementById('dance-dancer-img');
  if (dancerImg) dancerImg.src = char.image || 'assets/poster_kabir_mafia.jpg';

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
  // Brand Click -> Return to Home
  document.getElementById('nav-brand')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('home');
  });

  // Top Nav Links & Mobile Dock
  document.querySelectorAll('.kavana-nav-link, .nav-btn, .mobile-nav-item, .mobile-dock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (view) {
        if (view === 'character-chat' || view === 'chat') {
          state.mobileChatView = 'list';
        }
        switchView(view);
      }
    });
  });

  // Spotlight Hero Action Buttons
  document.getElementById('btn-hero-play')?.addEventListener('click', () => {
    launchScenarioChat(state.activeStory || KAVANA_STORIES[0]);
  });

  document.getElementById('btn-hero-chat')?.addEventListener('click', () => {
    launchScenarioChat(state.activeStory || KAVANA_STORIES[0]);
  });

  // Setup Dynamic Hero Carousel Controls
  setupHeroCarousel();

  // Footer navigation links
  document.getElementById('footer-link-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('home');
  });
  document.getElementById('footer-link-explore')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('explore');
  });
  document.getElementById('footer-link-search')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('search');
  });
  document.getElementById('footer-link-chats')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('chat');
  });

  // Dedicated Search Page Inputs & Tag Chips
  const mainSearchInput = document.getElementById('main-search-input');
  const clearMainSearchBtn = document.getElementById('btn-clear-main-search');

  mainSearchInput?.addEventListener('input', (e) => {
    renderSearchView(e.target.value);
  });

  clearMainSearchBtn?.addEventListener('click', () => {
    if (mainSearchInput) mainSearchInput.value = '';
    renderSearchView('');
  });

  document.querySelectorAll('.search-tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.dataset.query || chip.textContent.trim();
      if (mainSearchInput) mainSearchInput.value = tag;
      renderSearchView(tag);
    });
  });

  // Mobile Bottom Dock Settings Button
  document.getElementById('dock-btn-settings')?.addEventListener('click', () => {
    updateSettingsVisibility();
    settingsModal?.classList.add('active');
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

  const uncensoredToggle = document.getElementById('setting-uncensored-toggle');
  if (uncensoredToggle) {
    uncensoredToggle.checked = localStorage.getItem('kavana_18plus_unfiltered') !== 'false';
  }

  function updateSettingsVisibility() {
    const val = providerSelect?.value;
    if (val === 'gemini' || val === 'groq' || val === 'openrouter') {
      apiKeyGroup.style.display = 'block';
      endpointGroup.style.display = 'none';
    } else if (val === 'ollama' || val === 'custom') {
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
    if (uncensoredToggle) {
      localStorage.setItem('kavana_18plus_unfiltered', uncensoredToggle.checked ? 'true' : 'false');
    }
    settingsModal?.classList.remove('active');
    showToast({
      title: 'Preferences Saved',
      message: `Using ${providerSelect?.options[providerSelect.selectedIndex].text} • 18+ Uncensored: ${uncensoredToggle?.checked ? 'ON' : 'OFF'}`,
      type: 'success'
    });
  });

  // 18+ Age Verification Gate Check
  const ageGateModal = document.getElementById('modal-age-gate');
  if (ageGateModal && localStorage.getItem('kavana_age_verified') !== 'true') {
    ageGateModal.classList.add('active');
    ageGateModal.style.display = 'flex';
  }
  document.getElementById('btn-accept-age-gate')?.addEventListener('click', () => {
    localStorage.setItem('kavana_age_verified', 'true');
    if (ageGateModal) {
      ageGateModal.classList.remove('active');
      ageGateModal.style.display = 'none';
    }
    playChime(650);
    showToast({
      title: 'Age Verified',
      message: 'Welcome to Kavana AI. 18+ Uncensored Mode is active.',
      type: 'success'
    });
  });
  document.getElementById('btn-decline-age-gate')?.addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
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
  switchView('home');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

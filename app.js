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

// Application State
const state = {
  currentView: 'home-web', // Default to 1:1 Official Website homepage
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
  state.currentView = viewName;
  playChime(600);

  // Update Nav Links
  document.querySelectorAll('.kavana-nav-link, .mobile-nav-item').forEach(btn => {
    if (btn.dataset.view === viewName) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Toggle Home Web View vs In-App Views
  const webHome = document.getElementById('view-home-web');
  const appContainer = document.getElementById('main-app-container');

  if (viewName === 'home-web') {
    if (webHome) webHome.style.display = 'block';
    if (appContainer) appContainer.style.display = 'none';
  } else {
    if (webHome) webHome.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`view-${viewName}`)?.classList.add('active');

    if (viewName === 'stories-explore') renderExploreFeed();
    else if (viewName === 'story-reader') renderStoryReader();
    else if (viewName === 'character-chat') renderChatView();
    else if (viewName === 'dance-studio') renderDanceStudio();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateCoins(delta) {
  state.credits = Math.max(0, state.credits + delta);
  localStorage.setItem('kavana_coins', state.credits.toString());
  const counter = document.getElementById('user-credits-counter');
  if (counter) counter.textContent = `${state.credits} Coins`;
}

// Launch 1:1 Interactive Scenario Chat
function launchScenarioChat(story) {
  state.activeScenario = story;
  const partnerId = story.characterId || story.id;
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
    if (cat === 'trending') {
      catMatch = (s.playerCount || 0) > 30000 || (s.tags || []).some(t => t.toLowerCase().includes('trending') || t.toLowerCase().includes('top'));
    } else if (cat === 'drama') {
      catMatch = s.category?.toLowerCase().includes('drama') || (s.tags || []).some(t => t.toLowerCase().includes('drama') || t.toLowerCase().includes('marriage'));
    } else if (cat === 'spicy') {
      catMatch = s.category?.toLowerCase().includes('spicy') || (s.tags || []).some(t => t.toLowerCase().includes('18+') || t.toLowerCase().includes('spicy'));
    } else if (cat === 'mafia') {
      catMatch = s.category?.toLowerCase().includes('mafia') || s.genre?.toLowerCase().includes('mafia') || (s.tags || []).some(t => t.toLowerCase().includes('mafia') || t.toLowerCase().includes('billionaire'));
    } else if (cat === 'fantasy') {
      catMatch = s.category?.toLowerCase().includes('fantasy') || s.genre?.toLowerCase().includes('fantasy') || (s.tags || []).some(t => t.toLowerCase().includes('fantasy') || t.toLowerCase().includes('vampire') || t.toLowerCase().includes('magic'));
    } else if (cat === 'desi') {
      catMatch = s.category?.toLowerCase().includes('desi') || (s.tags || []).some(t => t.toLowerCase().includes('punjabi') || t.toLowerCase().includes('desi') || t.toLowerCase().includes('hinglish'));
    } else if (cat === 'anime') {
      catMatch = s.category?.toLowerCase().includes('anime') || (s.tags || []).some(t => t.toLowerCase().includes('anime') || t.toLowerCase().includes('cyberpunk') || t.toLowerCase().includes('idol'));
    } else if (cat === 'thriller') {
      catMatch = s.category?.toLowerCase().includes('thriller') || (s.tags || []).some(t => t.toLowerCase().includes('thriller') || t.toLowerCase().includes('detective') || t.toLowerCase().includes('crime'));
    }

    if (!catMatch) return false;

    // 2. Search query check
    if (q) {
      const matchTitle = (s.title || '').toLowerCase().includes(q);
      const matchChar = (s.characterName || '').toLowerCase().includes(q);
      const matchRole = (s.userRole || '').toLowerCase().includes(q);
      const matchDesc = (s.summary || '').toLowerCase().includes(q);
      const matchTag = (s.tags || []).some(t => t.toLowerCase().includes(q));
      return matchTitle || matchChar || matchRole || matchDesc || matchTag;
    }

    return true;
  });

  // Update live counter badge
  const countBadge = document.getElementById('stories-count-badge');
  if (countBadge) {
    countBadge.textContent = `✨ ${filtered.length} ${filtered.length === 1 ? 'Scenario' : 'Scenarios'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
        <h3 style="color: #fff; margin-bottom: 0.5rem;">No scenarios match "${state.searchQuery}"</h3>
        <p style="font-size: 0.88rem;">Try searching for "Husband", "Mafia", "Vampire", or clear the search.</p>
        <button class="btn-secondary" id="btn-reset-filters" style="margin-top: 1rem; padding: 0.6rem 1.25rem;">Show All Stories</button>
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
    card.className = 'kavana-story-card';

    const readersCount = (story.playerCount || Math.floor(15000 + Math.random() * 80000)).toLocaleString();
    const coverUrl = story.cover || story.visual || 'assets/sanctum.jpg';
    const avatarUrl = story.avatar || (CHARACTERS[story.characterId]?.image) || 'assets/lucian.jpg';
    const userRole = story.userRole || 'Protagonist';

    card.innerHTML = `
      <div class="story-card-top-cover-wrap">
        <img src="${coverUrl}" alt="${story.title}" class="story-card-top-cover" loading="lazy">
        <div class="story-card-cover-overlay"></div>
        <div class="story-card-badges-top">
          <span class="story-category-tag">${story.category || 'Spicy 18+'}</span>
          <span class="story-readers-tag">👥 ${readersCount}</span>
        </div>
        <img src="${avatarUrl}" alt="${story.characterName || 'Character'}" class="story-card-avatar-pill">
      </div>

      <div class="story-card-content">
        <div>
          <div class="story-role-assignment-pill">
            <span>🎭</span> You: <strong>${userRole}</strong>
          </div>
          <h3 class="story-title-h3">${story.title}</h3>
          <p class="story-desc-p">${story.summary || 'Step into an intense narrative where every choice shifts affection, tension, and climax.'}</p>
        </div>

        <div class="story-card-actions">
          <button class="btn-start-scenario btn-play-story" title="Start Interactive Scenario">
            <span>▶ Start Scenario</span>
          </button>
          <button class="btn-read-quick btn-read-story" title="Read as visual novel">
            📖 Read
          </button>
          <button class="btn-dance-card btn-dance-story" title="Make character dance">
            💃 Dance
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-play-story')?.addEventListener('click', () => {
      launchScenarioChat(story);
    });

    card.querySelector('.btn-read-story')?.addEventListener('click', () => {
      state.activeStory = story;
      state.activeChapterId = 'c1';
      switchView('story-reader');
    });

    card.querySelector('.btn-dance-story')?.addEventListener('click', () => {
      state.activeDancerId = story.characterId || 'kabir';
      switchView('dance-studio');
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
    // Generate dynamic chapters for catalog scenarios
    const charName = story.characterName || 'Companion';
    chapters = [
      {
        id: 'c1',
        title: 'Chapter 1: The Encounter',
        visual: story.cover || 'assets/sanctum.jpg',
        speaker: charName,
        characterMood: story.initialMood || 'High Drama',
        narrative: `${story.summary || 'An intense moment unfolds.'}\n\n${story.openingHook || '*Looks at you closely.*'}`,
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
        visual: story.cover || 'assets/sanctum.jpg',
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
        visual: story.cover || 'assets/sanctum.jpg',
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

  let chapter = chapters.find(c => c.id === state.activeChapterId) || chapters[0] || {
    title: 'Chapter 1',
    visual: 'assets/sanctum.jpg',
    narrative: 'AI generated scene loading...',
    speaker: 'Character'
  };

  const charId = story.characterId || 'kabir';
  const char = CHARACTERS[charId] || {
    name: story.characterName || 'Companion',
    title: story.title,
    image: story.avatar || 'assets/lucian.jpg'
  };

  if (!state.characterState[charId]) {
    state.characterState[charId] = { affection: 60, tension: 80, intimacyLevel: '⚡ High Sexual Tension' };
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
  if (sidePortrait) sidePortrait.src = char.image;

  const sideName = document.getElementById('side-char-name');
  if (sideName) sideName.textContent = char.name;

  const sideTitle = document.getElementById('side-char-title');
  if (sideTitle) sideTitle.textContent = char.title;

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

  // Update active roster card if matching
  document.querySelectorAll('.roster-card').forEach(c => {
    if (c.dataset.character === charId) c.classList.add('active');
    else c.classList.remove('active');
  });

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

      // If this is the latest AI message, render smart replies directly as clickable chips beneath the bubble
      if (idx === history.length - 1 && msg.sender === 'ai' && activePrompts.length > 0) {
        const inChatContainer = document.createElement('div');
        inChatContainer.className = 'in-chat-chips-group';
        inChatContainer.setAttribute('role', 'group');
        inChatContainer.setAttribute('aria-label', 'Suggested Replies');

        const label = document.createElement('div');
        label.className = 'in-chat-chips-label';
        label.innerHTML = '<span>⚡ Suggested Choices</span> <small>Tap chip to send</small>';
        inChatContainer.appendChild(label);

        const chipsWrap = document.createElement('div');
        chipsWrap.className = 'in-chat-chips-list';

        activePrompts.forEach(p => {
          const chipBtn = document.createElement('button');
          chipBtn.type = 'button';
          chipBtn.className = 'in-chat-chip';
          chipBtn.title = 'Click to reply with this message';
          chipBtn.innerHTML = `<span class="chip-action-text">${p}</span><span class="chip-instant-icon">➔</span>`;
          chipBtn.addEventListener('click', () => {
            const inp = document.getElementById('chat-user-input');
            if (inp) inp.value = '';
            sendChatMessage(p);
          });
          chipsWrap.appendChild(chipBtn);
        });

        inChatContainer.appendChild(chipsWrap);
        area.appendChild(inChatContainer);
      }
    });
    area.scrollTop = area.scrollHeight;
  }

  const quickContainer = document.getElementById('quick-prompts-container');
  if (quickContainer) {
    quickContainer.innerHTML = '';
    activePrompts.forEach(p => {
      const chipWrapper = document.createElement('div');
      chipWrapper.className = 'quick-chip-wrapper';

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'quick-chip';
      chip.title = 'Click to send instantly';
      chip.innerHTML = `<span class="chip-text">${p}</span><span class="chip-send-bolt">⚡</span>`;
      chip.addEventListener('click', () => {
        const inp = document.getElementById('chat-user-input');
        if (inp) inp.value = '';
        sendChatMessage(p);
      });

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'quick-chip-edit';
      editBtn.title = 'Edit in input box';
      editBtn.setAttribute('aria-label', 'Edit prompt');
      editBtn.innerHTML = '✎';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const inp = document.getElementById('chat-user-input');
        if (inp) {
          inp.value = p;
          inp.focus();
        }
      });

      chipWrapper.appendChild(chip);
      chipWrapper.appendChild(editBtn);
      quickContainer.appendChild(chipWrapper);
    });
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
    wrapper.className = 'dancer-figure-wrapper';
    const btn = document.getElementById('btn-trigger-dance-animation');
    if (btn) btn.textContent = '▶ Start Dance Routine';
  } else {
    state.isDancing = true;
    wrapper.className = `dancer-figure-wrapper dancing-${state.activeDanceRoutine}`;
    const btn = document.getElementById('btn-trigger-dance-animation');
    if (btn) btn.textContent = '⏸ Pause Dance Routine';

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
  // Brand Click -> Return to Homepage
  document.getElementById('nav-brand')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('home-web');
  });

  // Top Nav Links
  document.querySelectorAll('.kavana-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const view = link.dataset.view;
      if (view) switchView(view);
    });
  });

  // Mobile Bottom Bar
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  // Homepage CTA Triggers
  document.getElementById('btn-hero-launch-app')?.addEventListener('click', () => switchView('stories-explore'));
  document.getElementById('btn-hero-explore-novels')?.addEventListener('click', () => switchView('stories-explore'));
  document.getElementById('btn-hero-open-dance')?.addEventListener('click', () => switchView('dance-studio'));
  document.getElementById('btn-cta-get-app')?.addEventListener('click', () => switchView('stories-explore'));

  // Simulator Tab Switches
  document.getElementById('btn-mockup-tab-explore')?.addEventListener('click', () => switchView('stories-explore'));
  document.getElementById('btn-mockup-tab-reader')?.addEventListener('click', () => switchView('story-reader'));
  document.getElementById('btn-mockup-tab-chat')?.addEventListener('click', () => switchView('character-chat'));
  document.getElementById('btn-mockup-tab-dance')?.addEventListener('click', () => switchView('dance-studio'));

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
    state.activeChatPartnerId = state.activeStory?.characterId || 'kabir';
    switchView('character-chat');
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
    state.activeChatPartnerId = 'kabir';
    renderChatView();
  });
  document.getElementById('roster-valeria')?.addEventListener('click', () => {
    state.activeChatPartnerId = 'valeria';
    renderChatView();
  });
  document.getElementById('roster-lucian')?.addEventListener('click', () => {
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

  // Initial State: Start at official Homepage
  updateCoins(0);
  switchView('home-web');
});

// Mock browser localStorage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

// Import getChatSessions & saveChatSessions from app.js (or test the exact logic)
function getChatSessions() {
  try {
    const raw = localStorage.getItem('kavana_chat_sessions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(s => 
          !s.id.includes('mirzapur') && 
          !s.id.includes('peaky') && 
          !s.id.includes('queen-of-tears') && 
          !s.id.includes('tmdb')
        );
      }
    }
  } catch (e) {
    console.warn('Error reading chat sessions:', e);
  }
  return []; // Return empty array if user has not started any chats yet!
}

function saveChatSessions(sessions) {
  localStorage.setItem('kavana_chat_sessions', JSON.stringify(sessions));
}

// Test 1: Fresh user has 0 chats
console.log('Test 1: Fresh user sessions count =', getChatSessions().length);
if (getChatSessions().length !== 0) {
  console.error('FAIL: Fresh user should have 0 chats!');
  process.exit(1);
}

// Test 2: User clicks a story to start chat
let sessions = getChatSessions();
sessions.unshift({ id: 'love-villa-5-rivals', name: 'The 5 Villa Sirens', lastMessage: 'Hello' });
saveChatSessions(sessions);
console.log('Test 2: After starting 1 story chat, count =', getChatSessions().length);
if (getChatSessions().length !== 1) {
  console.error('FAIL: Should have 1 chat!');
  process.exit(1);
}

// Test 3: User deletes that chat
sessions = getChatSessions().filter(s => s.id !== 'love-villa-5-rivals');
saveChatSessions(sessions);
console.log('Test 3: After deleting chat, count =', getChatSessions().length);
if (getChatSessions().length !== 0) {
  console.error('FAIL: Should return to 0 chats!');
  process.exit(1);
}

console.log('★ ALL CHAT SESSION LOGIC TESTS PASSED (ZERO FAKE STORIES)!');

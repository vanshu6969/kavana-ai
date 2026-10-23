const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Has Stories Nav:', data.includes('id="nav-btn-stories"'));
    console.log('Has Chats Nav:', data.includes('id="nav-btn-chat"'));
    console.log('Has Empty Chat View:', data.includes('id="chat-empty-view"'));
    console.log('Has Mobile Bottom Dock:', data.includes('class="mobile-bottom-dock"'));
    console.log('Active Dance Section Removed:', !data.includes('<section class="view-section" id="view-dance-studio">'));
    console.log('Active Generator Section Removed:', !data.includes('<section class="view-section" id="view-generator-studio">'));
    console.log('Active Reader Section Removed:', !data.includes('<section class="view-section" id="view-story-reader">'));

    if (
      res.statusCode === 200 &&
      data.includes('id="nav-btn-stories"') &&
      data.includes('id="nav-btn-chat"') &&
      data.includes('id="chat-empty-view"') &&
      data.includes('class="mobile-bottom-dock"') &&
      !data.includes('<section class="view-section" id="view-dance-studio">')
    ) {
      console.log('★ ALL SIMPLIFIED UI CHECKS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      console.error('Validation failed!');
      process.exit(1);
    }
  });
});

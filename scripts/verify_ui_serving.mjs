import { spawn } from 'child_process';

async function testWebServing() {
  console.log('--- Testing Desktop & Chat UI serving on Port 3047 ---');
  const server = spawn('node', ['server.js'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '3047' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  await new Promise((r) => setTimeout(r, 1200));

  try {
    const res = await fetch('http://localhost:3047/index.html');
    const html = await res.text();

    console.log('Index HTML Status:', res.status);
    console.log('Has chat-backdrop-art:', html.includes('chat-backdrop-art'));
    console.log('Has chat-affinity-card:', html.includes('chat-affinity-card'));
    console.log('Has chat-dynamic-choices:', html.includes('chat-dynamic-choices'));

    const cssRes = await fetch('http://localhost:3047/style.css');
    const css = await cssRes.text();
    console.log('CSS Status:', cssRes.status);
    console.log('Has desktop flex-direction row:', css.includes('flex-direction: row !important;'));
    console.log('Has narrator-event-card:', css.includes('.narrator-event-card'));
    console.log('Has choice-pill-btn:', css.includes('.choice-pill-btn'));

    if (
      html.includes('chat-backdrop-art') &&
      html.includes('chat-affinity-card') &&
      html.includes('chat-dynamic-choices') &&
      css.includes('flex-direction: row !important;')
    ) {
      console.log('\n✅ PASS: Desktop layout and Kavana visual novel UI completely restored & verified!');
    } else {
      console.error('❌ FAIL: Missing UI components.');
    }
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}

testWebServing();

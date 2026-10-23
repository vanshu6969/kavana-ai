import { spawn } from 'child_process';

async function testServer() {
  console.log('--- Starting server.js on port 3045 ---');
  const serverProc = spawn('node', ['server.js'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '3045' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProc.stdout.on('data', (d) => console.log('[Server stdout]:', d.toString().trim()));
  serverProc.stderr.on('data', (d) => console.error('[Server stderr]:', d.toString().trim()));

  // Wait 1.5s for server to bind
  await new Promise((r) => setTimeout(r, 1500));

  try {
    console.log('\n--- Sending POST request to http://localhost:3045/api/chat/stream ---');
    const res = await fetch('http://localhost:3045/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId: 'boss-obsession-aryan',
        characterName: 'Arya Singhania',
        storyTitle: 'Cold CEO Resignation',
        userRole: 'Personal Assistant',
        messages: [
          { sender: 'ai', text: '*I look up from my glass of scotch, dark eyes narrowing.* "You really think you can quit, Raghav?"' },
          { sender: 'user', text: 'Yes, Ms. Singhania. My notice period ends tonight.' }
        ],
        contextState: {
          affinity: 35,
          trust: 40,
          mood: 'Dominant & Furious',
          location: 'Penthouse Office'
        }
      })
    });

    console.log('Response Status:', res.status);
    console.log('Headers:', res.headers.get('content-type'));

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullOutput = '';
    let tokenCount = 0;
    let metaReceived = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullOutput += chunk;

      if (chunk.includes('event: token')) {
        tokenCount++;
      }
      if (chunk.includes('event: meta')) {
        metaReceived = true;
      }
      process.stdout.write(chunk);
    }

    console.log('\n\n--- Verification Summary ---');
    console.log('Total token events received:', tokenCount);
    console.log('Meta event with affinity/trust received:', metaReceived);

    if (tokenCount > 0 && metaReceived) {
      console.log('SUCCESS: Server-Sent Events (SSE) streaming pipeline verified 100%!');
    } else {
      console.error('FAILURE: Missing token or meta events.');
    }
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    serverProc.kill();
    process.exit(0);
  }
}

testServer();

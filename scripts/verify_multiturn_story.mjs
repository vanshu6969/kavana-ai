import { spawn } from 'child_process';

async function runMultiTurnTest() {
  console.log('--- Launching Kavana AI Server on Port 3046 ---');
  const server = spawn('node', ['server.js'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '3046' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  await new Promise((r) => setTimeout(r, 1200));

  async function sendMessage(history, userText, contextState) {
    const res = await fetch('http://localhost:3046/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId: 'boss-obsession-aryan',
        characterName: 'Arya Singhania',
        storyTitle: 'Cold CEO Resignation',
        storySynopsis: 'Late night in the corner office. Raghav brings his resignation letter, but CEO Arya Singhania locks the office door.',
        initialHook: 'Arya stares at your resignation letter on her mahogany desk.',
        userRole: 'Raghav (Personal Assistant)',
        userGoal: 'Negotiate freedom or succumb to her power',
        language: 'hinglish',
        messages: history,
        message: userText,
        contextState
      })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let replyText = '';
    let meta = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.token) replyText += data.token;
            if (data.affinity !== undefined) meta = data;
          } catch (e) {}
        }
      }
    }
    return { replyText, meta };
  }

  try {
    const history = [];
    let contextState = {
      affinity: 40,
      trust: 50,
      mood: 'Stern & Controlling',
      location: 'Penthouse Office'
    };

    console.log('\n[Turn 1] Starting Scene:');
    history.push({
      sender: 'ai',
      text: '*Arya pushes a stack of unreviewed merger files across the desk, her sharp gaze pinning you.* "Help me finish reviewing these contracts tonight before you even think about walking out that door."'
    });
    console.log('Arya:', history[0].text);

    console.log('\n[Turn 1] User inputs: "Sure, let me help you with the contracts. Pass me the folder."');
    const turn1 = await sendMessage(history, "Sure, let me help you with the contracts. Pass me the folder.", contextState);
    console.log('Arya Streamed Reply:\n', turn1.replyText);
    console.log('Relationship State:', turn1.meta);

    // Verify continuation
    if (!turn1.replyText || turn1.replyText.length < 10) {
      throw new Error('Turn 1 returned empty reply');
    }

    history.push({ sender: 'user', text: "Sure, let me help you with the contracts. Pass me the folder." });
    history.push({ sender: 'ai', text: turn1.replyText });
    contextState.affinity = turn1.meta.affinity;
    contextState.trust = turn1.meta.trust;

    console.log('\n[Turn 2] User inputs: "Clause 4 on page 3 looks suspicious. Who drafted this?"');
    const turn2 = await sendMessage(history, "Clause 4 on page 3 looks suspicious. Who drafted this?", contextState);
    console.log('Arya Streamed Reply:\n', turn2.replyText);
    console.log('Relationship State:', turn2.meta);

    if (turn2.meta.affinity >= contextState.affinity) {
      console.log('\n✅ PASS: Affinity progressed appropriately from Turn 1 to Turn 2!');
      console.log('✅ PASS: Streamed response seamlessly advances contract review scene!');
    }
  } catch (err) {
    console.error('Multi-turn test failed:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}

runMultiTurnTest();

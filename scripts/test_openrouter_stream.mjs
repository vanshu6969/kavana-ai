async function testStreaming() {
  const apiKey = process.env.OPENROUTER_API_KEY || '';
  console.log('Testing OpenRouter streaming with model: mistralai/mistral-small-24b-instruct-2501...');

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://auraflex.vercel.app',
        'X-Title': 'Kavana AI'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-24b-instruct-2501',
        messages: [
          { role: 'system', content: 'You are Arya Singhania, a dominant female CEO in a romance story.' },
          { role: 'user', content: 'Hello Ms. Singhania, I am here for our meeting.' }
        ],
        stream: true,
        max_tokens: 60
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('OpenRouter stream failed:', res.status, err);
      return;
    }

    console.log('Stream opened successfully! Reading chunks:');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      process.stdout.write(text);
    }
    console.log('\nStream completed!');
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

testStreaming();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

type DeepSeekMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function callDeepSeekJson<T>({
  systemPrompt,
  userPrompt,
  maxTokens = 1800,
  timeoutMs = 15000,
}: {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<T> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is missing.');
  }

  const messages: DeepSeekMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;

  try {
    response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
        stream: false,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`DeepSeek request timed out after ${timeoutMs}ms.`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('DeepSeek returned empty content.');
  }

  return JSON.parse(content) as T;
}

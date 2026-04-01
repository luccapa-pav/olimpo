import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { agentId, systemPrompt, messages } = req.body as {
    agentId: string;
    systemPrompt: string;
    messages: { role: 'user' | 'assistant'; content: string }[];
  };

  if (!agentId || !systemPrompt || !messages) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    return res.json({ agentId, response: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Anthropic API error:', message);
    return res.status(500).json({ error: message });
  }
}

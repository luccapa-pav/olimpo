import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Remove tool call/response blocks that should never reach the user
function stripInternalBlocks(text: string): string {
  return text
    // XML-style tags (tool_call, tool_response, tool_use, tool_result)
    .replace(/<(tool_call|tool_response|tool_use|tool_result)[\s\S]*?<\/(tool_call|tool_response|tool_use|tool_result)>/gi, '')
    // Bracket-style with closing tag
    .replace(/\[(tool_call|tool_response|tool_use|tool_result)\][\s\S]*?\[\/(tool_call|tool_response|tool_use|tool_result)\]/gi, '')
    // Bracket inline without closing: [tool_call: ...]
    .replace(/\[tool_(?:call|response|use|result)[^\]]*\]/gi, '')
    // Markdown headers for tool blocks
    .replace(/\*\*Tool (?:Call|Response|Use|Result):?\*\*[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, '')
    // JSON code blocks that look like tool invocations
    .replace(/```(?:json)?\s*\{\s*"(?:tool|name|function)"\s*:[\s\S]*?```/gi, '')
    // Narration phrases at start of line
    .replace(/^(Vou |Deixa eu |Estou |Buscando |Verificando |Consultando |Aguarde,? |Um momento,? |Deixe-me |Analisando |Pesquisando )[^\n]*\n?/gim, '')
    // Cleanup excess blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Extract only text blocks from a content array (ignores tool_use, tool_result, web_search_result, etc.)
function extractText(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

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

  console.log(`[${agentId}] systemPrompt length:`, systemPrompt?.length ?? 0);

  const isHermes = agentId === 'hermes';

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestParams: any = {
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    };

    if (isHermes) {
      requestParams.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
    }

    const response = await client.messages.create(requestParams);

    // Collect text from all content blocks (web search responses have multiple block types)
    const raw = extractText(response.content as Anthropic.ContentBlock[]);
    const text = stripInternalBlocks(raw);

    return res.json({ agentId, response: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Anthropic API error:', message);
    return res.status(500).json({ error: message });
  }
}

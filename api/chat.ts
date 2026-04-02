import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGoogleAccessToken } from './_google.js';

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

// Keywords that indicate the user wants Gmail/Calendar data
const BRIEFING_KEYWORDS = [
  'briefing', 'atualiza', 'emails', 'o que tenho', 'agenda',
  'reunião', 'reuniao', 'tarefas', 'novo', 'novidades', 'hoje',
  'checa', 'verifica', 'me diz', 'o que mudou',
];

function isBriefingRequest(messages: { role: string; content: string }[]): boolean {
  const last = messages[messages.length - 1]?.content?.toLowerCase() ?? '';
  return BRIEFING_KEYWORDS.some(k => last.includes(k));
}

async function fetchGmailMessages(accessToken: string) {
  const query = 'is:unread -category:promotions -category:social';
  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=20`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const listData = await listRes.json();
  if (!listData.messages?.length) return [];

  return Promise.all(
    (listData.messages as { id: string }[]).slice(0, 15).map(async (msg) => {
      const r = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}` +
        `?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const d = await r.json();
      const h = (name: string) =>
        (d.payload?.headers as { name: string; value: string }[] | undefined)
          ?.find(x => x.name === name)?.value ?? '';
      return { id: d.id, snippet: d.snippet, subject: h('Subject'), from: h('From'), date: h('Date') };
    })
  );
}

async function fetchCalendarEvents(accessToken: string) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events` +
    `?timeMin=${encodeURIComponent(start)}&timeMax=${encodeURIComponent(end)}` +
    `&singleEvents=true&orderBy=startTime`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return ((data.items ?? []) as Record<string, unknown>[]).map(e => ({
    id: e.id,
    summary: e.summary,
    start: (e.start as Record<string, string>)?.dateTime || (e.start as Record<string, string>)?.date,
    end:   (e.end   as Record<string, string>)?.dateTime || (e.end   as Record<string, string>)?.date,
    description: e.description,
    location: e.location,
  }));
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
  const isAtlas  = agentId === 'atlas';

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

    if (isAtlas) {
      requestParams.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
    }

    // Pre-fetch Gmail + Calendar para Atlas quando for briefing
    if (isAtlas && isBriefingRequest(messages)) {
      const accessToken = await getGoogleAccessToken(req);
      if (accessToken) {
        const [emails, events] = await Promise.all([
          fetchGmailMessages(accessToken),
          fetchCalendarEvents(accessToken),
        ]);

        const today = new Date().toLocaleDateString('pt-BR', {
          weekday: 'long', day: 'numeric', month: 'long',
        });
        const dataContext =
          `--- DADOS AO VIVO (${today}) ---\n` +
          `EMAILS NÃO LIDOS (${emails.length}):\n${JSON.stringify(emails, null, 2)}\n\n` +
          `EVENTOS DO CALENDÁRIO HOJE:\n${JSON.stringify(events, null, 2)}\n` +
          `--- FIM DOS DADOS ---\n\n`;

        const msgs = requestParams.messages;
    const lastMsg = msgs[msgs.length - 1];
        if (lastMsg?.role === 'user') {
          lastMsg.content = dataContext + lastMsg.content;
        }
      }
    }

    const response = await client.messages.create(requestParams);

    // Collect text from all content blocks
    const raw = extractText(response.content as Anthropic.ContentBlock[]);
    const text = stripInternalBlocks(raw);

    return res.json({ agentId, response: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Anthropic API error:', message);
    return res.status(500).json({ error: message });
  }
}

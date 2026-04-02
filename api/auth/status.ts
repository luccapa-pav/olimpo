import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const authed = !!req.cookies?.google_refresh_token;
  return res.json({ authed });
}

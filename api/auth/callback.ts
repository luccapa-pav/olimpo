import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`OAuth error: ${error}`);
  }
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: code as string,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenRes.json();

  if (!tokens.refresh_token) {
    return res.status(400).send(
      'Nenhum refresh_token recebido. ' +
      'Revogue o acesso em https://myaccount.google.com/permissions e tente novamente.'
    );
  }

  const ONE_YEAR = 60 * 60 * 24 * 365;
  res.setHeader('Set-Cookie', [
    `google_refresh_token=${tokens.refresh_token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${ONE_YEAR}`,
    `google_authed=true; Secure; SameSite=Strict; Path=/; Max-Age=${ONE_YEAR}`,
  ]);

  return res.redirect('/?auth=success');
}

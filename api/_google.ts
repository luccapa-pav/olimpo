import type { VercelRequest } from '@vercel/node';

/**
 * Obtém um access_token válido usando o refresh_token salvo no cookie httpOnly.
 * Retorna null se o usuário não estiver autenticado.
 */
export async function getGoogleAccessToken(req: VercelRequest): Promise<string | null> {
  const refreshToken = req.cookies?.google_refresh_token;
  if (!refreshToken) return null;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json();
  return (data.access_token as string) ?? null;
}

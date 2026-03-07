import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const response = await fetch(
    `https://policies.termageddon.com/api/policy/${id}`
  );
  const html = await response.text();
  res.setHeader('Cache-Control', 's-maxage=3600');
  res.send(html);
}

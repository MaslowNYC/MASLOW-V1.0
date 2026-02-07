import { TrackClient } from 'customerio-node';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, memberNumber, memberTier, firstName } = req.body;

  const SITE_ID = process.env.CUSTOMERIO_SITE_ID || 'de23240d8fdb658acc81';
  const API_KEY = process.env.CUSTOMERIO_API_KEY || 'd4875c012c594cbe65a6';

  const cio = new TrackClient(SITE_ID, API_KEY);

  try {
    await cio.identify({
      id: userId,
      email: email,
      created_at: Math.floor(Date.now() / 1000),
      member_number: memberNumber,
      member_tier: memberTier || 'free',
      name: firstName || ''
    });

    console.log('✅ User identified in Customer.io:', email);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Customer.io error:', error);
    return res.status(500).json({ error: 'Customer.io failed' });
  }
}

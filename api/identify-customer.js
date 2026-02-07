import { TrackClient } from 'customerio-node';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Log to verify env vars are loading
  console.log('Site ID exists?', !!process.env.CUSTOMERIO_SITE_ID);
  console.log('API Key exists?', !!process.env.CUSTOMERIO_API_KEY);

  const { userId, email, memberNumber, memberTier, firstName } = req.body;

  // Log to verify we're getting the data
  console.log('Received userId:', userId);
  console.log('Received email:', email);

  if (!userId || !email) {
    console.error('Missing userId or email');
    return res.status(400).json({ error: 'userId and email are required' });
  }

  const SITE_ID = process.env.CUSTOMERIO_SITE_ID;
  const API_KEY = process.env.CUSTOMERIO_API_KEY;

  if (!SITE_ID || !API_KEY) {
    console.error('Customer.io credentials missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const cio = new TrackClient(SITE_ID, API_KEY);

  try {
    await cio.identify({
      id: userId,  // Make sure this is a string
      email: email,
      created_at: Math.floor(Date.now() / 1000),
      member_number: memberNumber,
      member_tier: memberTier || 'free',
      name: firstName || ''
    });

    console.log('✅ User identified in Customer.io:', email);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Customer.io error:', error.message);
    return res.status(500).json({ error: 'Customer.io failed', details: error.message });
  }
}

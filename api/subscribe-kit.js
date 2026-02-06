/**
 * Vercel Serverless Function - Kit (ConvertKit) V4 API
 * Handles email subscriptions securely (API key stays server-side)
 */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const KIT_API_KEY = process.env.KIT_API_KEY;

  if (!KIT_API_KEY) {
    console.error('KIT_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIT_API_KEY}`,
      },
      body: JSON.stringify({
        email_address: email,
        first_name: firstName || '',
        state: 'active',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Kit API error:', error);
      return res.status(response.status).json({ error: 'Kit subscription failed', details: error });
    }

    const data = await response.json();
    console.log('Subscribed to Kit:', email);
    return res.status(200).json({ success: true, subscriber: data });

  } catch (error) {
    console.error('Kit subscription error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

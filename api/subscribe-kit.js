/**
 * Vercel Serverless Function - Kit V4 API
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

  const apiKey = process.env.KIT_API_KEY;

  if (!apiKey) {
    console.error('KIT_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error', hint: 'Set KIT_API_KEY env var' });
  }

  // Log key prefix for debugging
  console.log('Kit API key starts with:', apiKey.substring(0, 6) + '...');

  try {
    // Kit V4 API
    console.log('Calling Kit V4 API...');

    const response = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email_address: email,
        first_name: firstName || '',
        state: 'active',
      }),
    });

    const data = await response.json();
    console.log('Kit API response status:', response.status);
    console.log('Kit API response:', JSON.stringify(data).substring(0, 200));

    if (!response.ok) {
      console.error('Kit API error:', JSON.stringify(data));
      return res.status(response.status).json({ error: 'Kit subscription failed', details: data });
    }

    console.log('✅ Subscribed to Kit:', email);
    return res.status(200).json({ success: true, subscriber: data });

  } catch (error) {
    console.error('Kit subscription error:', error.message);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

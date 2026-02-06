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
    return res.status(500).json({ error: 'Server configuration error', hint: 'KIT_API_KEY env var missing' });
  }

  // Log key prefix for debugging (don't log full key)
  console.log('Using Kit API key starting with:', KIT_API_KEY.substring(0, 10) + '...');

  try {
    // Try the forms endpoint instead of subscribers (may have different auth requirements)
    // Get form ID from env (numeric ID from Kit dashboard, not URL slug)
    const KIT_FORM_ID = process.env.KIT_FORM_ID;

    if (!KIT_FORM_ID) {
      console.error('KIT_FORM_ID not configured');
      return res.status(500).json({ error: 'Server configuration error', hint: 'KIT_FORM_ID env var missing' });
    }

    const response = await fetch(`https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: KIT_API_KEY,
        email: email,
        first_name: firstName || '',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Kit API error:', JSON.stringify(data));
      return res.status(response.status).json({ error: 'Kit subscription failed', details: data });
    }

    console.log('Subscribed to Kit:', email);
    return res.status(200).json({ success: true, subscriber: data });

  } catch (error) {
    console.error('Kit subscription error:', error.message);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

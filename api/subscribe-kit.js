/**
 * Vercel Serverless Function - Kit V3 Forms API
 * Handles email subscriptions securely (API secret stays server-side)
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

  const apiSecret = process.env.KIT_API_SECRET;
  const formId = process.env.KIT_FORM_ID || '5d27517f5d';

  if (!apiSecret) {
    console.error('KIT_API_SECRET not configured');
    return res.status(500).json({ error: 'Server configuration error', hint: 'Set KIT_API_SECRET env var' });
  }

  // Log key prefix for debugging
  console.log('Kit API secret starts with:', apiSecret.substring(0, 6) + '...');
  console.log('Using form ID:', formId);

  try {
    // Kit V3 Forms API
    console.log('Calling Kit V3 Forms API...');

    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: apiSecret,
        email: email,
        first_name: firstName || '',
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

/**
 * Vercel Serverless Function - Kit (ConvertKit) API
 * Handles email subscriptions securely (API key stays server-side)
 *
 * Supports both V3 (api_secret) and V4 (kit_ Bearer token) keys
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

  // Check for API secret (try multiple env var names)
  const apiSecret = process.env.KIT_API_SECRET || process.env.CONVERTKIT_API_SECRET || process.env.KIT_API_KEY;

  if (!apiSecret) {
    console.error('No Kit API secret found. Checked: KIT_API_SECRET, CONVERTKIT_API_SECRET, KIT_API_KEY');
    return res.status(500).json({
      error: 'Server configuration error',
      hint: 'Set KIT_API_SECRET env var with your ConvertKit API Secret (not API Key)'
    });
  }

  // Log key prefix for debugging
  console.log('Kit API secret starts with:', apiSecret.substring(0, 6) + '...');
  console.log('Key type:', apiSecret.startsWith('kit_') ? 'V4 (kit_)' : 'V3 (legacy)');

  try {
    let response;
    let data;

    if (apiSecret.startsWith('kit_')) {
      // V4 API - uses Bearer token auth
      console.log('Using Kit V4 API with Bearer auth');

      response = await fetch('https://api.kit.com/v4/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiSecret}`,
        },
        body: JSON.stringify({
          email_address: email,
          first_name: firstName || '',
          state: 'active',
        }),
      });
    } else {
      // V3 API - uses forms endpoint with api_secret in body
      const formId = process.env.KIT_FORM_ID || '5d27517f5d';
      console.log('Using Kit V3 API with api_secret, form:', formId);

      response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
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
    }

    data = await response.json();
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

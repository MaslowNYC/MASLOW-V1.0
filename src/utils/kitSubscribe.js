/**
 * Kit (ConvertKit) V4 API integration
 * Auto-subscribes users to Kit mailing list when they sign up for Maslow
 */

export async function subscribeToKit(email, firstName = '') {
  const KIT_API_KEY = import.meta.env.VITE_KIT_API_KEY;

  if (!KIT_API_KEY) {
    console.warn('Kit API key not configured - skipping subscription');
    return false;
  }

  try {
    // Kit V4 API endpoint with Bearer auth
    const response = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIT_API_KEY}`,
      },
      body: JSON.stringify({
        email_address: email,
        first_name: firstName || '',
        tags: ['maslow-member'],
        state: 'active', // Skip double opt-in
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Kit API error:', error);
      return false;
    }

    console.log('✅ Subscribed to Kit:', email);
    return true;
  } catch (error) {
    console.error('Kit subscription failed:', error);
    return false; // Don't block signup if Kit fails
  }
}

/**
 * Kit (ConvertKit) API integration
 * Auto-subscribes users to Kit mailing list when they sign up for Maslow
 */

export async function subscribeToKit(email, firstName = '') {
  const KIT_FORM_ID = '5d27517f5d';
  const KIT_API_KEY = import.meta.env.VITE_KIT_API_KEY;

  if (!KIT_API_KEY) {
    console.warn('Kit API key not configured - skipping subscription');
    return false;
  }

  try {
    const response = await fetch(`https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: KIT_API_KEY,
        email: email,
        first_name: firstName,
        tags: ['maslow-member'],
      }),
    });

    if (!response.ok) {
      console.error('Kit subscription failed:', await response.text());
      return false;
    }

    console.log('✅ Subscribed to Kit:', email);
    return true;
  } catch (error) {
    console.error('Kit subscription error:', error);
    return false; // Don't block signup if Kit fails
  }
}

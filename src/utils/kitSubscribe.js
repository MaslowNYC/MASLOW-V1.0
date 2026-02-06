/**
 * Kit (ConvertKit) subscription via serverless function
 * Calls /api/subscribe-kit to keep API key secure on server
 */

export async function subscribeToKit(email, firstName = '') {
  try {
    const response = await fetch('/api/subscribe-kit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName: firstName || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Kit subscription failed:', error);
      return false;
    }

    console.log('✅ Subscribed to Kit:', email);
    return true;
  } catch (error) {
    console.error('Kit subscription error:', error);
    return false; // Don't block signup if Kit fails
  }
}

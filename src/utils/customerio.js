import { TrackClient } from 'customerio-node';

const SITE_ID = 'de23240d8fdb658acc81';
const API_KEY = 'd4875c012c594cbe65a6';

const cio = new TrackClient(SITE_ID, API_KEY);

export async function identifyUser(user, profile) {
  try {
    await cio.identify({
      id: user.id,
      email: user.email,
      created_at: Math.floor(Date.now() / 1000),
      member_number: profile.member_number,
      member_tier: profile.member_tier || 'free',
      name: profile.first_name || ''
    });

    console.log('✅ User identified in Customer.io:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Customer.io error:', error);
    return false;
  }
}

export async function trackEvent(userId, eventName, data = {}) {
  try {
    await cio.track({
      id: userId,
      name: eventName,
      data: data
    });

    console.log('✅ Event tracked:', eventName);
    return true;
  } catch (error) {
    console.error('❌ Customer.io track error:', error);
    return false;
  }
}

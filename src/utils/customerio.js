export async function identifyUser(user, profile) {
  try {
    const response = await fetch('/api/identify-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        memberNumber: profile.member_number,
        memberTier: profile.member_tier || 'free',
        firstName: profile.first_name || ''
      })
    });

    if (response.ok) {
      console.log('✅ User identified in Customer.io:', user.email);
      return true;
    } else {
      console.error('❌ Customer.io API failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Customer.io error:', error);
    return false;
  }
}

export async function trackEvent(userId, eventName, data = {}) {
  console.log('📊 Event tracking:', eventName, data);
  return true;
}

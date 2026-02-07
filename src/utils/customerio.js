/**
 * Customer.io JavaScript Client Integration
 * Uses the cioanalytics global object loaded from index.html
 */

// Identify a user in Customer.io
export function identifyUser(user, profile = {}) {
  try {
    // Check if the Customer.io analytics object is loaded
    if (typeof window !== 'undefined' && window.cioanalytics) {
      window.cioanalytics.identify(user.id, {
        email: user.email,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        member_number: profile.member_number || null,
        member_tier: profile.member_tier || 'free',
        created_at: Math.floor(Date.now() / 1000)
      });
      console.log('✅ User identified in Customer.io:', user.email);
      return true;
    } else {
      console.warn('⚠️ Customer.io analytics not loaded');
      return false;
    }
  } catch (error) {
    console.error('❌ Customer.io identify error:', error);
    return false;
  }
}

// Track an event in Customer.io
export function trackEvent(eventName, properties = {}) {
  try {
    if (typeof window !== 'undefined' && window.cioanalytics) {
      window.cioanalytics.track(eventName, properties);
      console.log('📊 Event tracked:', eventName, properties);
      return true;
    } else {
      console.warn('⚠️ Customer.io analytics not loaded');
      return false;
    }
  } catch (error) {
    console.error('❌ Customer.io track error:', error);
    return false;
  }
}

// Reset identity (call on logout)
export function resetIdentity() {
  try {
    if (typeof window !== 'undefined' && window.cioanalytics) {
      window.cioanalytics.reset();
      console.log('🔄 Customer.io identity reset');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Customer.io reset error:', error);
    return false;
  }
}

// Track a page view (called automatically, but available for SPA navigation)
export function trackPage(pageName, properties = {}) {
  try {
    if (typeof window !== 'undefined' && window.cioanalytics) {
      window.cioanalytics.page(pageName, properties);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Customer.io page error:', error);
    return false;
  }
}

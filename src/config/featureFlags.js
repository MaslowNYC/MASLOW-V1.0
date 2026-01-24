/// src/config/featureFlags.js

// --- THE SWITCHBOARD ---
// 'VELVET_ROPE'   = Homepage is Waitlist. Side doors redirect to Home. Payments Off.
// 'SANCTUARY'     = Full site visible. Payments Off (Waitlist buttons).
// 'GRAND_OPENING' = Full site visible. Payments Live.

const CURRENT_PHASE = 'VELVET_ROPE'; 

export const featureFlags = {
  // Is the main navigation visible?
  showNavigation: CURRENT_PHASE !== 'VELVET_ROPE',
  
  // Can people pay money?
  enablePayments: CURRENT_PHASE === 'GRAND_OPENING',
  
  // Should "Buy" buttons be "Join Waitlist" instead?
  waitlistMode: CURRENT_PHASE === 'SANCTUARY',
  
  // Is the site fully open to the public? (Used by the Bouncer)
  publicAccess: CURRENT_PHASE !== 'VELVET_ROPE',
};

export default featureFlags;

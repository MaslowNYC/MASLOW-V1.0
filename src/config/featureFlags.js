// src/config/featureFlags.js

const PHASES = {
  VELVET_ROPE: 'VELVET_ROPE', // Homepage only, waitlist
  SANCTUARY_MODE: 'SANCTUARY_MODE', // Full site, no payments (Free Accounts)
  GRAND_OPENING: 'GRAND_OPENING', // Full site, payments live
};

// CURRENT PHASE SETTING (CHANGE THIS TO SWITCH MODES)
const CURRENT_PHASE = PHASES.SANCTUARY_MODE; 

export const featureFlags = {
  // Logic to determine what is visible based on the Phase
  enableSiteNavigation: CURRENT_PHASE !== PHASES.VELVET_ROPE,
  enablePayments: CURRENT_PHASE === PHASES.GRAND_OPENING,
  enableFreeSignup: CURRENT_PHASE === PHASES.SANCTUARY_MODE || CURRENT_PHASE === PHASES.GRAND_OPENING,
  
  // Keep your existing flags if you had any specific ones
  showRevenueSimulator: true, 
  showFoundersList: true,
};

export default featureFlags;

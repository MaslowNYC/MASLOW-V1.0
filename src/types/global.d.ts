// Global type declarations

interface Window {
  cioanalytics?: {
    identify: (userId: string, traits?: Record<string, unknown>) => void;
    track: (eventName: string, properties?: Record<string, unknown>) => void;
    page: (pageName?: string, properties?: Record<string, unknown>) => void;
    reset: () => void;
  };
  Stripe?: (key: string) => unknown;
}

// Vite env variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_CUSTOMERIO_SITE_ID: string;
  readonly VITE_TWILIO_ACCOUNT_SID: string;
  readonly VITE_TWILIO_AUTH_TOKEN: string;
  readonly VITE_TWILIO_VERIFY_SERVICE_SID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

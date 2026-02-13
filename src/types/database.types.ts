// Complete Supabase schema types for all 23 tables

export interface AccessLog {
  id: number;
  user_id: string;
  location_id: number | null;
  timestamp: string;
  status: string | null;
}

export interface BetaSignup {
  id: number;
  created_at: string;
  email: string;
  name: string | null;
  phone: string | null;
}

export interface Booking {
  id: string;
  user_id: string;
  start_time: string;
  duration_minutes: number | null;
  status: string | null;
  vibe_selection: string | null;
  custom_playlist_link: string | null;
  created_at: string | null;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  inquiry_type: string | null;
  created_at: string;
}

export interface FinancialProjection {
  id: string;
  user_id: string;
  updated_at: string | null;
  suites: number | null;
  hours_open: number | null;
  avg_price: number | null;
  avg_duration: number | null;
  occupancy_rate: number | null;
  active_members: number | null;
  monthly_fee: number | null;
  brand_partners: number | null;
  fee_per_partner: number | null;
  has_omny: boolean | null;
  total_sq_ft: number | null;
  rent_per_sq_ft: number | null;
  retail_spend_per_visit: number | null;
  monthly_staff_cost: number | null;
  monthly_utilities: number | null;
  turnaround_time: number | null;
}

export interface FundingGoal {
  id: string;
  goal_amount: number;
  current_total: number | null;
  updated_at: string;
}

export interface Inventory {
  id: number;
  item_name: string;
  stock_count: number | null;
  low_stock_threshold: number | null;
  sku: string | null;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean | null;
  opens_at: string | null;
  closes_at: string | null;
  total_suites: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Membership {
  id: string;
  tier_name: string;
  amount: number;
  status: string | null;
  created_at: string;
  user_id: string | null;
  member_name: string | null;
  member_location: string | null;
}

export interface PassType {
  id: number;
  name: string;
  price: number;
  sessions_included: number | null;
  duration_days: number | null;
  is_active: boolean | null;
  created_at: string | null;
}

export interface Profile {
  id: string;
  email: string | null;
  role: string | null;
  is_admin: boolean | null;
  dob: string | null;
  phone: string | null;
  photo_url: string | null;
  bio: string | null;
  preferences_amenities: Record<string, unknown> | null;
  preferences_usage: Record<string, unknown> | null;
  preferences_products: Record<string, unknown> | null;
  updated_at: string | null;
  first_name: string | null;
  last_name: string | null;
  membership_tier: string | null;
  contribution_amount: number | null;
  member_number: number | null;
  credits: number | null;
  phone_verified: boolean | null;
  verification_code: string | null;
  code_expires_at: string | null;
  created_at?: string;
}

export interface Queue {
  id: string;
  user_id: string;
  status: string | null;
  joined_at: string | null;
  called_at: string | null;
  estimated_wait_minutes: number | null;
}

export interface SafetyCheck {
  id: string;
  booking_id: string;
  last_heartbeat_at: string | null;
  check_interval_seconds: number | null;
  status: string | null;
  alert_triggered: boolean | null;
}

export interface Sample {
  id: number;
  brand: string;
  product_name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  price_per_extra: number | null;
  is_available: boolean | null;
  stock_quantity: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SessionSample {
  id: number;
  session_id: number | null;
  sample_id: number | null;
  quantity: number | null;
  is_free: boolean | null;
  created_at: string | null;
}

export interface Session {
  id: number;
  user_id: string | null;
  suite_id: number | null;
  location_id: number | null;
  qr_code: string;
  status: string | null;
  booked_at: string | null;
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  amount_paid: number | null;
  payment_status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Suite {
  id: number;
  location_id: number | null;
  suite_number: string;
  is_available: boolean | null;
  is_operational: boolean | null;
  last_cleaned_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UsageLog {
  id: string;
  user_id: string | null;
  hull_id: string | null;
  started_at: string | null;
  ended_at: string | null;
  stay_duration_minutes: number | null;
  status: string | null;
  turnaround_time: number | null;
  created_at: string | null;
}

export interface UserPass {
  id: number;
  user_id: string | null;
  pass_type_id: number | null;
  sessions_remaining: number | null;
  expires_at: string | null;
  is_active: boolean | null;
  purchased_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      access_logs: { Row: AccessLog; Insert: Partial<AccessLog>; Update: Partial<AccessLog> };
      beta_signups: { Row: BetaSignup; Insert: Partial<BetaSignup>; Update: Partial<BetaSignup> };
      bookings: { Row: Booking; Insert: Partial<Booking>; Update: Partial<Booking> };
      contact_inquiries: { Row: ContactInquiry; Insert: Partial<ContactInquiry>; Update: Partial<ContactInquiry> };
      financial_projections: { Row: FinancialProjection; Insert: Partial<FinancialProjection>; Update: Partial<FinancialProjection> };
      funding_goals: { Row: FundingGoal; Insert: Partial<FundingGoal>; Update: Partial<FundingGoal> };
      inventory: { Row: Inventory; Insert: Partial<Inventory>; Update: Partial<Inventory> };
      locations: { Row: Location; Insert: Partial<Location>; Update: Partial<Location> };
      memberships: { Row: Membership; Insert: Partial<Membership>; Update: Partial<Membership> };
      pass_types: { Row: PassType; Insert: Partial<PassType>; Update: Partial<PassType> };
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      queue: { Row: Queue; Insert: Partial<Queue>; Update: Partial<Queue> };
      safety_checks: { Row: SafetyCheck; Insert: Partial<SafetyCheck>; Update: Partial<SafetyCheck> };
      samples: { Row: Sample; Insert: Partial<Sample>; Update: Partial<Sample> };
      session_samples: { Row: SessionSample; Insert: Partial<SessionSample>; Update: Partial<SessionSample> };
      sessions: { Row: Session; Insert: Partial<Session>; Update: Partial<Session> };
      suites: { Row: Suite; Insert: Partial<Suite>; Update: Partial<Suite> };
      usage_logs: { Row: UsageLog; Insert: Partial<UsageLog>; Update: Partial<UsageLog> };
      user_passes: { Row: UserPass; Insert: Partial<UserPass>; Update: Partial<UserPass> };
    };
  };
}

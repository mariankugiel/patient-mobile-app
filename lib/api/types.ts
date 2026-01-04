/**
 * Shared API types matching backend schemas
 */

export interface UserProfile {
  email?: string;
  full_name?: string;
  date_of_birth?: string;
  phone_country_code?: string;
  phone_number?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_country_code?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  gender?: string;
  blood_type?: string;
  allergies?: string;
  current_medications?: any;
  emergency_medical_info?: string;
  height?: string;
  weight?: string;
  waist_diameter?: string;
  country?: string;
  theme?: string;
  language?: string;
  timezone?: string;
  current_health_problems?: string[];
  medications?: Array<{
    drugName: string;
    purpose: string;
    dosage: string;
    frequency: string;
  }>;
  past_medical_conditions?: string[];
  past_surgeries?: string[];
  onboarding_completed?: boolean;
  onboarding_skipped?: boolean;
  onboarding_completed_at?: string;
  onboarding_skipped_at?: string;
  is_new_user?: boolean;
  avatar_url?: string;
  supabase_user_id?: string;
}

export interface UserEmergency {
  contacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }>;
  allergies?: string;
  medications?: string;
  health_problems?: string;
  pregnancy_status?: string;
  organ_donor?: boolean;
}

export interface UserNotifications {
  appointment_hours_before?: string;
  medication_minutes_before?: string;
  tasks_reminder_time?: string;
  email_appointments?: boolean;
  sms_appointments?: boolean;
  whatsapp_appointments?: boolean;
  push_appointments?: boolean;
  email_medications?: boolean;
  sms_medications?: boolean;
  whatsapp_medications?: boolean;
  push_medications?: boolean;
  email_tasks?: boolean;
  sms_tasks?: boolean;
  whatsapp_tasks?: boolean;
  push_tasks?: boolean;
  email_newsletter?: boolean;
}

export interface UserLoginData {
  username: string; // Backend expects 'username' field for email
  password: string;
}

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id?: string;
}

export interface LoginResponse {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  mfa_required?: boolean;
  factor_id?: string;
  user_id?: string;
}

export interface OAuthUserProfileData {
  email: string;
  full_name?: string;
  avatar_url?: string;
  provider: string;
}

export interface UserSharedAccess {
  health_professionals?: Array<{
    id: string;
    permissions_contact_type?: string;
    profile_fullname?: string;
    profile_email?: string;
    permissions_relationship?: string;
    medical_history_view?: boolean;
    medical_history_download?: boolean;
    medical_history_edit?: boolean;
    health_records_view?: boolean;
    health_records_download?: boolean;
    health_records_edit?: boolean;
    health_plan_view?: boolean;
    health_plan_download?: boolean;
    health_plan_edit?: boolean;
    medications_view?: boolean;
    medications_download?: boolean;
    medications_edit?: boolean;
    appointments_view?: boolean;
    appointments_edit?: boolean;
    messages_view?: boolean;
    messages_edit?: boolean;
    accessLevel?: string;
    status?: string;
    lastAccessed?: string;
    expires?: string;
  }>;
  family_friends?: Array<{
    id: string;
    permissions_contact_type?: string;
    profile_fullname?: string;
    profile_email?: string;
    permissions_relationship?: string;
    medical_history_view?: boolean;
    medical_history_download?: boolean;
    medical_history_edit?: boolean;
    health_records_view?: boolean;
    health_records_download?: boolean;
    health_records_edit?: boolean;
    health_plan_view?: boolean;
    health_plan_download?: boolean;
    health_plan_edit?: boolean;
    medications_view?: boolean;
    medications_download?: boolean;
    medications_edit?: boolean;
    appointments_view?: boolean;
    appointments_edit?: boolean;
    messages_view?: boolean;
    messages_edit?: boolean;
    accessLevel?: string;
    status?: string;
    lastAccessed?: string;
    expires?: string;
  }>;
}

export interface AccessLogEntry {
  id: string;
  name: string;
  role: string;
  action: string;
  date: string;
  authorized: boolean;
}



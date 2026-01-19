// User types
export type UserRole = 'farmer' | 'worker' | 'service_provider';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  region: string;
  avatar_url?: string;
  bio?: string;
  is_subscribed: boolean;
  subscription_ends_at?: string;
  created_at: string;
  updated_at: string;
}

// Job types
export type JobType = 'seasonal' | 'permanent' | 'contract' | 'daily';
export type JobCategory =
  | 'general_farm'
  | 'livestock'
  | 'crops'
  | 'equipment_operator'
  | 'maintenance'
  | 'management'
  | 'other';

export interface Job {
  id: string;
  user_id: string;
  title: string;
  description: string;
  job_type: JobType;
  category: JobCategory;
  region: string;
  location?: string;
  pay_rate?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

// Worker profile types
export interface WorkerProfile {
  id: string;
  user_id: string;
  skills: string[];
  experience_years: number;
  availability: string;
  has_transportation: boolean;
  has_drivers_license: boolean;
  certifications?: string[];
  resume_url?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

// Service provider types
export type ServiceCategory =
  | 'mechanic'
  | 'veterinary'
  | 'agronomist'
  | 'lab_testing'
  | 'custom_farming'
  | 'trucking'
  | 'welding'
  | 'other';

export interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  category: ServiceCategory;
  region: string;
  phone?: string;
  email?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

// Equipment rental types
export type EquipmentCategory =
  | 'tractor'
  | 'combine'
  | 'seeder'
  | 'sprayer'
  | 'tillage'
  | 'hay_equipment'
  | 'truck_trailer'
  | 'other';

export interface Equipment {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: EquipmentCategory;
  make?: string;
  model?: string;
  year?: number;
  rate: string;
  rate_type: 'hour' | 'day' | 'week' | 'month' | 'season';
  region: string;
  is_available: boolean;
  images?: string[];
  created_at: string;
  updated_at: string;
  user?: User;
}

// Land rental types
export type LandType = 'cropland' | 'pasture' | 'mixed' | 'hay' | 'other';

export interface Land {
  id: string;
  user_id: string;
  title: string;
  description: string;
  land_type: LandType;
  acres: number;
  rate: string;
  rate_type: 'acre' | 'total' | 'season' | 'year';
  region: string;
  location?: string;
  is_available: boolean;
  images?: string[];
  created_at: string;
  updated_at: string;
  user?: User;
}

// Product types
export type ProductCategory =
  | 'seed'
  | 'fertilizer'
  | 'chemical'
  | 'feed'
  | 'livestock'
  | 'produce'
  | 'equipment_parts'
  | 'other';

export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: string;
  quantity?: string;
  region: string;
  is_available: boolean;
  images?: string[];
  created_at: string;
  updated_at: string;
  user?: User;
}

// Review types
export type ReviewType = 'employer' | 'worker' | 'service';

export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  review_type: ReviewType;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer?: User;
  reviewee?: User;
}

// Message types
export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  participant_1?: User;
  participant_2?: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

// Region options
export const REGIONS = [
  'Peace Country',
  'Northern Alberta',
  'Central Alberta',
  'Southern Alberta',
  'Edmonton Area',
  'Calgary Area',
] as const;

export type Region = typeof REGIONS[number];

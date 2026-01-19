-- FarmHand Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'worker', 'service_provider')),
  region TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_subscribed BOOLEAN DEFAULT FALSE,
  subscription_ends_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('seasonal', 'permanent', 'contract', 'daily')),
  category TEXT NOT NULL CHECK (category IN ('general_farm', 'livestock', 'crops', 'equipment_operator', 'maintenance', 'management', 'other')),
  region TEXT NOT NULL,
  location TEXT,
  pay_rate TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worker profiles table
CREATE TABLE public.worker_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  availability TEXT,
  has_transportation BOOLEAN DEFAULT FALSE,
  has_drivers_license BOOLEAN DEFAULT FALSE,
  certifications TEXT[] DEFAULT '{}',
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service providers table
CREATE TABLE public.service_providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mechanic', 'veterinary', 'agronomist', 'lab_testing', 'custom_farming', 'trucking', 'welding', 'other')),
  region TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment rentals table
CREATE TABLE public.equipment (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tractor', 'combine', 'seeder', 'sprayer', 'tillage', 'hay_equipment', 'truck_trailer', 'other')),
  make TEXT,
  model TEXT,
  year INTEGER,
  rate TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('hour', 'day', 'week', 'month', 'season')),
  region TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Land rentals table
CREATE TABLE public.land (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  land_type TEXT NOT NULL CHECK (land_type IN ('cropland', 'pasture', 'mixed', 'hay', 'other')),
  acres INTEGER NOT NULL,
  rate TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('acre', 'total', 'season', 'year')),
  region TEXT NOT NULL,
  location TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('seed', 'fertilizer', 'chemical', 'feed', 'livestock', 'produce', 'equipment_parts', 'other')),
  price TEXT NOT NULL,
  quantity TEXT,
  region TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  review_type TEXT NOT NULL CHECK (review_type IN ('employer', 'worker', 'service')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reviewer_id, reviewee_id, review_type)
);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job applications table
CREATE TABLE public.job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX idx_jobs_region ON public.jobs(region);
CREATE INDEX idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX idx_equipment_user_id ON public.equipment(user_id);
CREATE INDEX idx_equipment_region ON public.equipment(region);
CREATE INDEX idx_land_user_id ON public.land(user_id);
CREATE INDEX idx_land_region ON public.land(region);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_region ON public.products(region);
CREATE INDEX idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Users can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own jobs" ON public.jobs FOR DELETE USING (auth.uid() = user_id);

-- Worker profiles policies
CREATE POLICY "Worker profiles are viewable by everyone" ON public.worker_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own worker profile" ON public.worker_profiles FOR ALL USING (auth.uid() = user_id);

-- Service providers policies
CREATE POLICY "Service providers are viewable by everyone" ON public.service_providers FOR SELECT USING (true);
CREATE POLICY "Users can manage their own service listings" ON public.service_providers FOR ALL USING (auth.uid() = user_id);

-- Equipment policies
CREATE POLICY "Equipment is viewable by everyone" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Users can manage their own equipment" ON public.equipment FOR ALL USING (auth.uid() = user_id);

-- Land policies
CREATE POLICY "Land is viewable by everyone" ON public.land FOR SELECT USING (true);
CREATE POLICY "Users can manage their own land listings" ON public.land FOR ALL USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can manage their own products" ON public.products FOR ALL USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON public.conversations FOR SELECT
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (participant_1_id = auth.uid() OR participant_2_id = auth.uid())
    )
  );
CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (participant_1_id = auth.uid() OR participant_2_id = auth.uid())
    )
  );

-- Job applications policies
CREATE POLICY "Job owners can view applications" ON public.job_applications FOR SELECT
  USING (
    auth.uid() = applicant_id OR
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can apply to jobs" ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Job owners can update application status" ON public.job_applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND user_id = auth.uid()));

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, region)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer'),
    COALESCE(NEW.raw_user_meta_data->>'region', 'Central Alberta')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate average rating for a user
CREATE OR REPLACE FUNCTION public.get_user_rating(user_uuid UUID)
RETURNS TABLE (avg_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROUND(AVG(rating)::NUMERIC, 1),
    COUNT(*)
  FROM public.reviews
  WHERE reviewee_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

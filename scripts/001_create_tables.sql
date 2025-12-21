-- Create projects table to store all project files
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('Word', 'Access')),
  price INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  is_external_link BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table to track all M-Pesa payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT DEFAULT 'Admin',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create home_content table for editable home page content
CREATE TABLE IF NOT EXISTS home_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT UNIQUE NOT NULL,
  image_url TEXT,
  title TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_batch ON projects(batch_name);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can view published blogs" ON blogs FOR SELECT USING (published = true);
CREATE POLICY "Public can view team members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public can view home content" ON home_content FOR SELECT USING (true);

-- Create policies for authenticated writes (you can add auth later)
CREATE POLICY "Anyone can insert payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert projects" ON projects FOR ALL USING (true);
CREATE POLICY "Anyone can manage blogs" ON blogs FOR ALL USING (true);
CREATE POLICY "Anyone can manage team" ON team_members FOR ALL USING (true);
CREATE POLICY "Anyone can update home" ON home_content FOR ALL USING (true);

-- Drop existing policies if they exist
DO $$
BEGIN
    -- Drop policies for course_progress
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_progress' AND policyname = 'Users can view their own progress') THEN
        DROP POLICY "Users can view their own progress" ON public.course_progress;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_progress' AND policyname = 'Users can update their own progress') THEN
        DROP POLICY "Users can update their own progress" ON public.course_progress;
    END IF;
    
    -- Drop policies for certificates
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'certificates' AND policyname = 'Users can view their own certificates') THEN
        DROP POLICY "Users can view their own certificates" ON public.certificates;
    END IF;
    
    -- Drop policies for user_activity
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_activity' AND policyname = 'Users can view their own activity') THEN
        DROP POLICY "Users can view their own activity" ON public.user_activity;
    END IF;
    
    -- Drop tables if they exist (in reverse order of dependencies)
    DROP TABLE IF EXISTS public.user_activity CASCADE;
    DROP TABLE IF EXISTS public.certificates CASCADE;
    DROP TABLE IF EXISTS public.course_progress CASCADE;
END $$;

-- Create course progress tracking tables
CREATE TABLE IF NOT EXISTS public.course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    course_id UUID REFERENCES public.courses(id) NOT NULL,
    module_id UUID REFERENCES public.modules(id),
    lesson_id UUID REFERENCES public.lessons(id),
    completed BOOLEAN DEFAULT false,
    progress_percentage INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    course_id UUID REFERENCES public.courses(id) NOT NULL,
    certificate_number TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    download_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create user activity log
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    activity_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    device_info JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_progress_user_course ON public.course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON public.user_activity(created_at);

-- Enable RLS and create policies
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for course_progress
CREATE POLICY "Users can view their own progress" 
ON public.course_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.course_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for certificates
CREATE POLICY "Users can view their own certificates" 
ON public.certificates 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policies for user_activity
CREATE POLICY "Users can view their own activity" 
ON public.user_activity 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE public.course_progress IS 'Tracks user progress through courses, modules, and lessons';
COMMENT ON TABLE public.certificates IS 'Stores certificates issued to users upon course completion';
COMMENT ON TABLE public.user_activity IS 'Logs user activity for analytics and cross-device syncing';

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_course_progress_modtime
BEFORE UPDATE ON public.course_progress
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Drop the function if it exists
DROP FUNCTION IF EXISTS generate_certificate_number();

-- Create a function to generate certificate numbers
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.certificate_number := 'CERT-' || 
                             TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
                             SUBSTRING(REPLACE(CAST(NEW.id AS TEXT), '-', ''), 1, 8);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for certificate number generation
CREATE TRIGGER set_certificate_number
BEFORE INSERT ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION generate_certificate_number();

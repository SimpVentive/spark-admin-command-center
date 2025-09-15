-- Create library books table
CREATE TABLE public.library_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  category TEXT,
  availability TEXT NOT NULL DEFAULT 'Available' CHECK (availability IN ('Available', 'Checked Out', 'Reserved', 'Maintenance')),
  location TEXT,
  purchase_date DATE,
  condition TEXT DEFAULT 'Good',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create library resources table
CREATE TABLE public.library_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('eBook', 'Article', 'Video', 'Document', 'Audio', 'Software')),
  url TEXT,
  file_path TEXT,
  tags TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create library checkout records table
CREATE TABLE public.library_checkout_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  checkout_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  return_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'checked_out' CHECK (status IN ('checked_out', 'returned', 'overdue', 'lost', 'renewed')),
  renewal_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create library reservations table
CREATE TABLE public.library_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reservation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired', 'cancelled')),
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_checkout_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_reservations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for library_books
CREATE POLICY "Anyone can view books" 
ON public.library_books 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage books" 
ON public.library_books 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for library_resources
CREATE POLICY "Anyone can view active resources" 
ON public.library_resources 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage resources" 
ON public.library_resources 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for checkout records
CREATE POLICY "Users can view their own checkout records" 
ON public.library_checkout_records 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkout records" 
ON public.library_checkout_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkout records" 
ON public.library_checkout_records 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all checkout records" 
ON public.library_checkout_records 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for reservations
CREATE POLICY "Users can view their own reservations" 
ON public.library_reservations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations" 
ON public.library_reservations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations" 
ON public.library_reservations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reservations" 
ON public.library_reservations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_library_books_availability ON public.library_books(availability);
CREATE INDEX idx_library_books_category ON public.library_books(category);
CREATE INDEX idx_library_checkout_records_user_id ON public.library_checkout_records(user_id);
CREATE INDEX idx_library_checkout_records_book_id ON public.library_checkout_records(book_id);
CREATE INDEX idx_library_checkout_records_status ON public.library_checkout_records(status);
CREATE INDEX idx_library_reservations_user_id ON public.library_reservations(user_id);
CREATE INDEX idx_library_reservations_book_id ON public.library_reservations(book_id);
CREATE INDEX idx_library_reservations_status ON public.library_reservations(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_library_books_updated_at
  BEFORE UPDATE ON public.library_books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_library_updated_at();

CREATE TRIGGER update_library_resources_updated_at
  BEFORE UPDATE ON public.library_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_library_updated_at();

CREATE TRIGGER update_library_checkout_records_updated_at
  BEFORE UPDATE ON public.library_checkout_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_library_updated_at();

CREATE TRIGGER update_library_reservations_updated_at
  BEFORE UPDATE ON public.library_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_library_updated_at();

-- Insert some sample data
INSERT INTO public.library_books (title, author, isbn, category) VALUES
('The Art of Leadership', 'John Maxwell', '978-0-123456-78-9', 'Leadership'),
('Effective Communication', 'Dale Carnegie', '978-0-123456-79-0', 'Communication'),
('Project Management Fundamentals', 'PMI Institute', '978-0-123456-80-6', 'Project Management'),
('Digital Marketing Strategy', 'Sarah Johnson', '978-0-123456-81-7', 'Marketing'),
('Data Science Essentials', 'Michael Chen', '978-0-123456-82-8', 'Technology');

INSERT INTO public.library_resources (title, description, resource_type, tags) VALUES
('Leadership Skills eBook', 'Comprehensive guide to developing leadership skills in the modern workplace.', 'eBook', ARRAY['leadership', 'management', 'skills']),
('Communication Best Practices', 'Research article on effective communication strategies.', 'Article', ARRAY['communication', 'workplace', 'skills']),
('Project Management Tutorial', 'Video series covering project management methodologies.', 'Video', ARRAY['project management', 'tutorial', 'methodology']),
('Digital Transformation Guide', 'Complete document on digital transformation strategies.', 'Document', ARRAY['digital transformation', 'strategy', 'technology']);
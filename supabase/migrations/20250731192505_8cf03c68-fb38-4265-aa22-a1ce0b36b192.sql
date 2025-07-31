-- Create enum for remarks field
CREATE TYPE public.lead_remarks AS ENUM ('Leads', 'Approved', 'Decline', 'No Answer');

-- Create Leads table
CREATE TABLE public.leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    emailAddress TEXT,
    workPhone TEXT,
    cellPhone1 TEXT,
    homePhone TEXT,
    cellPhone2 TEXT,
    source TEXT,
    leadType TEXT,
    remarks lead_remarks DEFAULT 'Leads',
    lastContact DATE,
    calledBy TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (but create permissive policies since no auth needed)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for public access
CREATE POLICY "Anyone can view leads" 
ON public.leads 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update leads" 
ON public.leads 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete leads" 
ON public.leads 
FOR DELETE 
USING (true);

-- Create function to update timestamps and lastContact
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    
    -- If remarks field is updated, set lastContact to today
    IF OLD.remarks IS DISTINCT FROM NEW.remarks THEN
        NEW.lastContact = CURRENT_DATE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp and lastContact updates
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_leads_updated_at();

-- Create table for calledBy suggestions
CREATE TABLE public.called_by_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for called_by_users
ALTER TABLE public.called_by_users ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for called_by_users
CREATE POLICY "Anyone can view called_by_users" 
ON public.called_by_users 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert called_by_users" 
ON public.called_by_users 
FOR INSERT 
WITH CHECK (true);
-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- TourPlan Integration
    tourplan_booking_id TEXT,
    tourplan_reference TEXT,
    product_code TEXT NOT NULL,
    
    -- Tour Details
    tour_name TEXT NOT NULL,
    departure_date DATE NOT NULL,
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER NOT NULL DEFAULT 0,
    total_travelers INTEGER NOT NULL DEFAULT 1,
    
    -- Pricing (stored in cents to avoid decimal issues)
    base_price INTEGER NOT NULL DEFAULT 0,
    children_price INTEGER NOT NULL DEFAULT 0,
    accommodation_cost INTEGER NOT NULL DEFAULT 0,
    activities_cost INTEGER NOT NULL DEFAULT 0,
    subtotal INTEGER NOT NULL DEFAULT 0,
    taxes INTEGER NOT NULL DEFAULT 0,
    total_price INTEGER NOT NULL DEFAULT 0,
    deposit_amount INTEGER NOT NULL DEFAULT 0,
    final_payment_amount INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'AUD',
    
    -- Lead Traveler (Contact)
    lead_traveler_first_name TEXT NOT NULL,
    lead_traveler_last_name TEXT NOT NULL,
    lead_traveler_email TEXT NOT NULL,
    lead_traveler_phone TEXT NOT NULL,
    lead_traveler_nationality TEXT,
    lead_traveler_passport TEXT,
    lead_traveler_dietary_requirements TEXT,
    
    -- Billing Address
    billing_address TEXT NOT NULL,
    billing_city TEXT NOT NULL,
    billing_postal_code TEXT NOT NULL,
    billing_country TEXT NOT NULL,
    
    -- Other Travelers (JSON array)
    other_travelers JSONB DEFAULT '[]'::jsonb,
    
    -- Tour Options
    accommodation_type TEXT NOT NULL DEFAULT 'standard',
    selected_activities TEXT[] DEFAULT '{}',
    special_requests TEXT,
    
    -- Booking Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    booking_type TEXT NOT NULL DEFAULT 'quote' CHECK (booking_type IN ('quote', 'booking')),
    requires_manual_confirmation BOOLEAN NOT NULL DEFAULT false,
    
    -- Payment Information
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'deposit_paid', 'paid_in_full', 'refunded')),
    stripe_payment_intent_id TEXT,
    deposit_paid_at TIMESTAMP WITH TIME ZONE,
    final_payment_due_date DATE,
    
    -- Metadata
    booking_source TEXT NOT NULL DEFAULT 'website',
    user_agent TEXT,
    ip_address TEXT,
    
    -- Indexes for performance
    UNIQUE(tourplan_reference) -- Ensure unique TourPlan references
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_tourplan_booking_id ON bookings(tourplan_booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tourplan_reference ON bookings(tourplan_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(lead_traveler_email);
CREATE INDEX IF NOT EXISTS idx_bookings_departure_date ON bookings(departure_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_product_code ON bookings(product_code);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow read access to all bookings (you can restrict this based on your needs)
CREATE POLICY "Allow read access to bookings" ON bookings
    FOR SELECT USING (true);

-- Allow insert access (for creating new bookings)
CREATE POLICY "Allow insert access to bookings" ON bookings
    FOR INSERT WITH CHECK (true);

-- Allow update access (for updating booking status, payment status, etc.)
CREATE POLICY "Allow update access to bookings" ON bookings
    FOR UPDATE USING (true);

-- Comments for documentation
COMMENT ON TABLE bookings IS 'Complete booking records combining TourPlan bookings with local customer data';
COMMENT ON COLUMN bookings.tourplan_booking_id IS 'Internal TourPlan booking ID';
COMMENT ON COLUMN bookings.tourplan_reference IS 'Human-readable TourPlan booking reference';
COMMENT ON COLUMN bookings.product_code IS 'TourPlan product code (e.g., NBOGTARP001CKSE)';
COMMENT ON COLUMN bookings.base_price IS 'Base price in cents';
COMMENT ON COLUMN bookings.total_price IS 'Total price in cents';
COMMENT ON COLUMN bookings.other_travelers IS 'JSON array of other traveler details';
COMMENT ON COLUMN bookings.requires_manual_confirmation IS 'Whether booking needs manual confirmation by staff';
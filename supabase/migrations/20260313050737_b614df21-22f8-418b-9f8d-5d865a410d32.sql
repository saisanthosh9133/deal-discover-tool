-- Create ads table
CREATE TABLE public.ads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    keywords TEXT[] NOT NULL DEFAULT '{}',
    city TEXT NOT NULL,
    discount TEXT DEFAULT 'SPECIAL OFFER',
    business_name TEXT NOT NULL,
    valid_until DATE NOT NULL,
    views INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Anyone can read active ads
CREATE POLICY "Anyone can view active ads"
ON public.ads FOR SELECT
USING (is_active = true);

-- Anyone can insert ads
CREATE POLICY "Anyone can create ads"
ON public.ads FOR INSERT
WITH CHECK (true);

-- Anyone can update ads
CREATE POLICY "Anyone can update ads"
ON public.ads FOR UPDATE
USING (true);

-- Create indexes
CREATE INDEX idx_ads_city ON public.ads (city);
CREATE INDEX idx_ads_keywords ON public.ads USING GIN (keywords);
CREATE INDEX idx_ads_created_at ON public.ads (created_at DESC);
CREATE INDEX idx_ads_is_active ON public.ads (is_active);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_ads_updated_at
BEFORE UPDATE ON public.ads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with initial data
INSERT INTO public.ads (title, description, image_url, keywords, city, discount, business_name, valid_until) VALUES
('50% Off on All Pizzas', 'Get half price on our delicious hand-crafted pizzas. Valid for dine-in and takeaway.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', ARRAY['food', 'pizza', 'restaurant', 'dinner'], 'Mumbai', '50% OFF', 'Pizza Paradise', '2026-06-30'),
('Free Gym Trial - 7 Days', 'Start your fitness journey with our complimentary 7-day gym membership.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop', ARRAY['fitness', 'gym', 'health', 'workout'], 'Delhi', 'FREE TRIAL', 'FitZone Elite', '2026-07-15'),
('Spa Package - Buy 1 Get 1', 'Relax and rejuvenate with our premium spa treatments. Bring a friend for free!', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop', ARRAY['spa', 'wellness', 'relaxation', 'beauty'], 'Mumbai', 'BOGO', 'Serenity Spa', '2026-06-14'),
('30% Off Electronics', 'Upgrade your tech with amazing discounts on laptops, phones, and accessories.', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', ARRAY['electronics', 'tech', 'gadgets', 'shopping'], 'Bangalore', '30% OFF', 'TechMart', '2026-06-30'),
('Coffee Lovers Special', 'Buy any 2 coffees and get the 3rd one absolutely free.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', ARRAY['coffee', 'cafe', 'drinks', 'food'], 'Delhi', 'BUY 2 GET 1', 'Bean Bliss Cafe', '2026-07-01'),
('Fashion Sale - Up to 70% Off', 'Refresh your wardrobe with trending styles at unbeatable prices.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', ARRAY['fashion', 'clothing', 'shopping', 'style'], 'Mumbai', 'UP TO 70% OFF', 'Style Studio', '2026-06-20'),
('Kids Play Zone - Free Entry', 'Free entry for kids under 10 on weekends with paying adult.', 'https://images.unsplash.com/photo-1566454825481-9c31e6a0cd9f?w=400&h=300&fit=crop', ARRAY['kids', 'entertainment', 'family', 'fun'], 'Bangalore', 'FREE ENTRY', 'FunLand', '2026-08-30'),
('Dental Checkup - ₹199 Only', 'Complete dental examination including X-ray at a special price.', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop', ARRAY['dental', 'health', 'medical', 'checkup'], 'Delhi', '₹199 ONLY', 'SmileCare Clinic', '2026-06-28');
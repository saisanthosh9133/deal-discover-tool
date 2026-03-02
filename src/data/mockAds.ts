export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  keywords: string[];
  city: string;
  discount: string;
  businessName: string;
  validUntil: string;
}

export const mockAds: Ad[] = [
  {
    id: "1",
    title: "50% Off on All Pizzas",
    description: "Get half price on our delicious hand-crafted pizzas. Valid for dine-in and takeaway.",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    keywords: ["food", "pizza", "restaurant", "dinner"],
    city: "Mumbai",
    discount: "50% OFF",
    businessName: "Pizza Paradise",
    validUntil: "2026-06-30",
  },
  {
    id: "2",
    title: "Free Gym Trial - 7 Days",
    description: "Start your fitness journey with our complimentary 7-day gym membership. No strings attached!",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    keywords: ["fitness", "gym", "health", "workout"],
    city: "Delhi",
    discount: "FREE TRIAL",
    businessName: "FitZone Elite",
    validUntil: "2026-07-15",
  },
  {
    id: "3",
    title: "Spa Package - Buy 1 Get 1",
    description: "Relax and rejuvenate with our premium spa treatments. Bring a friend for free!",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    keywords: ["spa", "wellness", "relaxation", "beauty"],
    city: "Mumbai",
    discount: "BOGO",
    businessName: "Serenity Spa",
    validUntil: "2026-06-14",
  },
  {
    id: "4",
    title: "30% Off Electronics",
    description: "Upgrade your tech with amazing discounts on laptops, phones, and accessories.",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    keywords: ["electronics", "tech", "gadgets", "shopping"],
    city: "Bangalore",
    discount: "30% OFF",
    businessName: "TechMart",
    validUntil: "2026-06-30",
  },
  {
    id: "5",
    title: "Coffee Lovers Special",
    description: "Buy any 2 coffees and get the 3rd one absolutely free. Perfect for coffee dates!",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    keywords: ["coffee", "cafe", "drinks", "food"],
    city: "Delhi",
    discount: "BUY 2 GET 1",
    businessName: "Bean Bliss Cafe",
    validUntil: "2026-07-01",
  },
  {
    id: "6",
    title: "Fashion Sale - Up to 70% Off",
    description: "Refresh your wardrobe with trending styles at unbeatable prices.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    keywords: ["fashion", "clothing", "shopping", "style"],
    city: "Mumbai",
    discount: "UP TO 70% OFF",
    businessName: "Style Studio",
    validUntil: "2026-06-20",
  },
  {
    id: "7",
    title: "Kids Play Zone - Free Entry",
    description: "Fun unlimited! Free entry for kids under 10 on weekends with paying adult.",
    imageUrl: "https://images.unsplash.com/photo-1566454825481-9c31e6a0cd9f?w=400&h=300&fit=crop",
    keywords: ["kids", "entertainment", "family", "fun"],
    city: "Bangalore",
    discount: "FREE ENTRY",
    businessName: "FunLand",
    validUntil: "2026-08-30",
  },
  {
    id: "8",
    title: "Dental Checkup - ₹199 Only",
    description: "Complete dental examination including X-ray at a special price. Book now!",
    imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop",
    keywords: ["dental", "health", "medical", "checkup"],
    city: "Delhi",
    discount: "₹199 ONLY",
    businessName: "SmileCare Clinic",
    validUntil: "2026-06-28",
  },
];

export const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
];

export const popularKeywords = [
  "food",
  "shopping",
  "fitness",
  "beauty",
  "tech",
  "health",
  "entertainment",
  "fashion",
  "coffee",
  "spa",
];

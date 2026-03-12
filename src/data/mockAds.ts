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
  avgRating?: number;
  totalRatings?: number;
  views?: number;
  location?: {
    lat: number;
    lng: number;
  };
  viewHistory?: {
    date: string;
    views: number;
  }[];
  ratings?: {
    value: number;
  }[];
}


export const mockAds: Ad[] = [];

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

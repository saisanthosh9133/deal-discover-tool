import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Ad, mockAds } from "@/data/mockAds";
import api from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";

interface ServerAd {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  keywords?: string[];
  city: string;
  discount?: string;
  businessName: string;
  validUntil?: string;
}

interface AdsContextType {
  ads: Ad[];
  loading: boolean;
  error: string | null;
  addAd: (ad: Omit<Ad, "id">) => Promise<void>;
  refreshAds: () => Promise<void>;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

export function AdsProvider({ children }: { children: ReactNode }) {
  const [serverAds, setServerAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch ads from API, fallback to mock data if backend is down
  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/ads?limit=50");
      if (response.data.success && response.data.ads.length > 0) {
        // Map server ads to match the Ad interface
        const mapped: Ad[] = response.data.ads.map((ad: ServerAd) => ({
          id: ad.id || ad._id,
          title: ad.title,
          description: ad.description,
          imageUrl: ad.imageUrl || "",
          keywords: ad.keywords || [],
          city: ad.city,
          discount: ad.discount || "SPECIAL OFFER",
          businessName: ad.businessName,
          validUntil: ad.validUntil ? new Date(ad.validUntil).toISOString().split("T")[0] : "",
        }));
        setServerAds(mapped);
      } else {
        // No ads from server — use mock data
        setServerAds([]);
      }
    } catch (err) {
      console.warn("API unavailable, using mock data:", err);
      setServerAds([]);
      setError(null); // Don't show error — mock data covers it
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Combine server ads with mock ads (mock ads show when server has none)
  const ads = serverAds.length > 0 ? serverAds : mockAds;

  const addAd = async (adData: Omit<Ad, "id">) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to create an ad");
    }

    try {
      const response = await api.post("/ads", {
        title: adData.title,
        description: adData.description,
        imageUrl: adData.imageUrl,
        keywords: adData.keywords,
        city: adData.city,
        discount: adData.discount,
        businessName: adData.businessName,
        validUntil: adData.validUntil,
      });

      if (response.data.success) {
        // Re-fetch to get the latest ads
        await fetchAds();
      } else {
        throw new Error(response.data.message || "Failed to create ad");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      // If API fails, add locally as fallback
      const errorMsg = axiosErr.response?.data?.message || axiosErr.message || "Failed to create ad";
      console.error("Create ad error:", errorMsg);
      throw new Error(errorMsg);
    }
  };

  return (
    <AdsContext.Provider value={{ ads, loading, error, addAd, refreshAds: fetchAds }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error("useAds must be used within an AdsProvider");
  }
  return context;
}

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ad } from "@/data/mockAds";

interface AdsContextType {
  ads: Ad[];
  loading: boolean;
  error: string | null;
  addAd: (ad: Omit<Ad, "id">) => Promise<void>;
  refreshAds: () => Promise<void>;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

export function AdsProvider({ children }: { children: ReactNode }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("ads")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const mapped: Ad[] = (data || []).map((ad) => ({
        id: ad.id,
        title: ad.title,
        description: ad.description || "",
        imageUrl: ad.image_url || "",
        keywords: ad.keywords || [],
        city: ad.city,
        discount: ad.discount || "SPECIAL OFFER",
        businessName: ad.business_name,
        validUntil: ad.valid_until,
      }));

      setAds(mapped);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      setError("Failed to load ads");
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const addAd = async (adData: Omit<Ad, "id">) => {
    const { error: insertError } = await supabase.from("ads").insert({
      title: adData.title,
      description: adData.description,
      image_url: adData.imageUrl,
      keywords: adData.keywords,
      city: adData.city,
      discount: adData.discount,
      business_name: adData.businessName,
      valid_until: adData.validUntil,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(insertError.message);
    }

    await fetchAds();
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

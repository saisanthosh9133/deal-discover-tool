import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Ad, mockAds } from "@/data/mockAds";

interface AdsContextType {
  ads: Ad[];
  addAd: (ad: Omit<Ad, "id">) => void;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

const STORAGE_KEY = "benifit-me-ads";

export function AdsProvider({ children }: { children: ReactNode }) {
  const [userAds, setUserAds] = useState<Ad[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userAds));
  }, [userAds]);

  const ads = [...userAds, ...mockAds];

  const addAd = (adData: Omit<Ad, "id">) => {
    const newAd: Ad = {
      ...adData,
      id: `user-${Date.now()}`,
    };
    setUserAds((prev) => [newAd, ...prev]);
  };

  return (
    <AdsContext.Provider value={{ ads, addAd }}>
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

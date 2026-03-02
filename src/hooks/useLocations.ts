import { useState, useEffect } from "react";
import api from "@/context/AuthContext";

interface Location {
  _id: string;
  name: string;
  displayName: string;
  state: string;
  latitude?: number;
  longitude?: number;
  region: string;
  tier: string;
  popularity: number;
}

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/locations/all");
        if (response.data.success) {
          setLocations(response.data.locations);
          setError(null);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setError("Failed to load locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
};

// Search locations with autocomplete
export const useLocationSearch = () => {
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searching, setSearching] = useState(false);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const response = await api.get("/locations/search", {
        params: { q: query, limit: 10 },
      });

      if (response.data.success) {
        setSearchResults(response.data.locations);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return { searchResults, searching, searchLocations };
};

// Get location display names for select dropdowns
export const useLocationNames = () => {
  const [locationNames, setLocationNames] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationNames = async () => {
      try {
        const response = await api.get("/locations/all");
        if (response.data.success) {
          const names = response.data.locations.map(
            (location: Location) => ({
              value: location.displayName,
              label: location.displayName,
            })
          );
          setLocationNames(names);
        }
      } catch (err) {
        console.error("Failed to fetch location names:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationNames();
  }, []);

  return { locationNames, loading };
};

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocationSearch } from "@/hooks/useLocations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader } from "lucide-react";
import { toast } from "sonner";
import api from "@/context/AuthContext";

interface LocationSearchProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  label?: string;
}

interface NearbyCity {
  name: string;
  displayName: string;
  state: string;
  tier: string;
  distance: number;
}

export default function LocationSearch({
  value,
  onChange,
  placeholder = "Search city...",
  label = "Location",
}: LocationSearchProps) {
  const { searchResults, searching, searchLocations } = useLocationSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [nearestCities, setNearestCities] = useState<NearbyCity[]>([]);
  const [showNearby, setShowNearby] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectLocation = useCallback(
    (location: string) => {
      setInputValue(location);
      onChange(location);
      setIsOpen(false);
      setShowNearby(false);
    },
    [onChange]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowNearby(false);
    searchLocations(newValue);
    setIsOpen(true);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    searchLocations("");
    setIsOpen(false);
    setShowNearby(false);
    setNearestCities([]);
  };

  const handleUseMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported in your browser");
      return;
    }

    setGeoLoading(true);
    setIsOpen(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use server-side nearest search — fast, no need to download all cities
          const response = await api.get("/locations/nearby", {
            params: { lat: latitude, lng: longitude, limit: 5 },
          });

          if (response.data.success && response.data.locations.length > 0) {
            const cities = response.data.locations.map((loc: NearbyCity) => ({
              ...loc,
              distance: loc.distance || 0,
            }));
            setNearestCities(cities);
            setShowNearby(true);
            // Auto-select closest city
            handleSelectLocation(cities[0].displayName);
            toast.success(`📍 Found nearest city: ${cities[0].displayName}`);
          } else {
            toast.error("No nearby cities found");
          }
        } catch {
          toast.error("Failed to find nearby cities");
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied. Enable it in browser settings.");
        } else if (error.code === error.TIMEOUT) {
          toast.error("Location request timed out. Try again.");
        } else {
          toast.error("Unable to get your location");
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <Label className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {label}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUseMyLocation}
            disabled={geoLoading}
            className="h-6 px-2 text-xs"
            title="Use your current location"
          >
            {geoLoading ? (
              <>
                <Loader className="w-3 h-3 animate-spin mr-1" />
                Locating...
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3 mr-1" />
                My Location
              </>
            )}
          </Button>
        </Label>
      )}

      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="pr-10"
          autoComplete="off"
        />

        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {geoLoading ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              <Loader className="w-4 h-4 animate-spin inline mr-2" />
              Getting your location...
            </div>
          ) : showNearby && nearestCities.length > 0 ? (
            <div>
              <div className="px-3 py-2 border-b border-border text-xs font-semibold text-muted-foreground bg-secondary">
                📍 Nearby Cities ({nearestCities.length})
              </div>
              <ul className="py-1">
                {nearestCities.map((city) => (
                  <li key={city.name}>
                    <button
                      onClick={() => handleSelectLocation(city.displayName)}
                      className="w-full text-left px-3 py-2 hover:bg-secondary focus:bg-secondary focus:outline-none transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm text-foreground">{city.displayName}</div>
                          <div className="text-xs text-muted-foreground">
                            {city.state} • {city.tier}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground/70">
                          {city.distance?.toFixed(1)} km
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : searching ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((location) => (
                <li key={location._id}>
                  <button
                    onClick={() => handleSelectLocation(location.displayName)}
                    className="w-full text-left px-3 py-2 hover:bg-secondary focus:bg-secondary focus:outline-none transition-colors"
                  >
                    <div className="font-medium text-sm text-foreground">{location.displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {location.state} • {location.tier}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : inputValue ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No locations found
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-muted-foreground">
              Start typing to search or use "My Location"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

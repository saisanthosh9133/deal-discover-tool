import { useState, useRef, useEffect } from "react";
import { useLocationSearch, useLocations } from "@/hooks/useLocations";
import { useGeolocation, findNearestCities } from "@/hooks/useGeolocation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader } from "lucide-react";
import { toast } from "sonner";

interface LocationSearchProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  label?: string;
}

export default function LocationSearch({
  value,
  onChange,
  placeholder = "Search city...",
  label = "Location",
}: LocationSearchProps) {
  const { searchResults, searching, searchLocations } = useLocationSearch();
  const { locations } = useLocations();
  const { coordinates, loading: geoLoading, error: geoError, requestLocation, supported: geoSupported } = useGeolocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [nearestCities, setNearestCities] = useState<
    Array<{
      name: string;
      displayName: string;
      state: string;
      tier: string;
      latitude?: number;
      longitude?: number;
      distance: number;
    }>
  >([]);
  const [showNearby, setShowNearby] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update nearest cities when geolocation coordinates are obtained
  useEffect(() => {
    if (coordinates && locations.length > 0) {
      const nearest = findNearestCities(
        coordinates.latitude,
        coordinates.longitude,
        locations,
        5
      );
      setNearestCities(nearest);
      setShowNearby(true);
      setIsOpen(true);

      // Auto-select the closest city
      if (nearest.length > 0) {
        handleSelectLocation(nearest[0].displayName);
        toast.success(`📍 Found nearest city: ${nearest[0].displayName}`);
      }
    }
  }, [coordinates, locations, handleSelectLocation]);

  // Handle geolocation errors
  useEffect(() => {
    if (geoError) {
      toast.error(geoError);
    }
  }, [geoError]);

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

  const handleSelectLocation = (location: string) => {
    setInputValue(location);
    onChange(location);
    setIsOpen(false);
    setShowNearby(false);
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
    if (!geoSupported) {
      toast.error("Geolocation is not supported in your browser");
      return;
    }
    requestLocation();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <Label className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {label}
          </span>
          {geoSupported && (
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
          )}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {geoLoading ? (
            <div className="p-3 text-center text-sm text-gray-500">
              <Loader className="w-4 h-4 animate-spin inline mr-2" />
              Getting your location...
            </div>
          ) : showNearby && nearestCities.length > 0 ? (
            <div>
              <div className="px-3 py-2 border-b text-xs font-semibold text-gray-600 bg-blue-50">
                📍 Nearby Cities ({nearestCities.length})
              </div>
              <ul className="py-1">
                {nearestCities.map((city) => (
                  <li key={city.name}>
                    <button
                      onClick={() => handleSelectLocation(city.displayName)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{city.displayName}</div>
                          <div className="text-xs text-gray-500">
                            {city.state} • {city.tier}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {city.distance?.toFixed(1)} km
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : searching ? (
            <div className="p-3 text-center text-sm text-gray-500">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((location) => (
                <li key={location._id}>
                  <button
                    onClick={() => handleSelectLocation(location.displayName)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                  >
                    <div className="font-medium text-sm">{location.displayName}</div>
                    <div className="text-xs text-gray-500">
                      {location.state} • {location.tier}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : inputValue ? (
            <div className="p-3 text-center text-sm text-gray-500">
              No locations found
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-gray-500">
              Start typing to search or use "My Location"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

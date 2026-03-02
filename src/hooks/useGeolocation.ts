import { useState, useCallback } from "react";

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  coordinates: GeolocationCoordinates | null;
  loading: boolean;
  error: string | null;
  supported: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: false,
    error: null,
    supported: "geolocation" in navigator,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        supported: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState({
          coordinates: { latitude, longitude },
          loading: false,
          error: null,
          supported: true,
        });
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";

        if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            "You denied geolocation permission. Enable it in browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage =
            "Your location information is unavailable from your device.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "The request to get user location timed out.";
        }

        setState({
          coordinates: null,
          loading: false,
          error: errorMessage,
          supported: true,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setState({
      coordinates: null,
      loading: false,
      error: null,
      supported: "geolocation" in navigator,
    });
  }, []);

  return {
    ...state,
    requestLocation,
    clearLocation,
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Find nearest cities from user's coordinates
 */
export function findNearestCities(
  userLat: number,
  userLon: number,
  cities: Array<{
    name: string;
    displayName: string;
    latitude?: number;
    longitude?: number;
    state: string;
    tier: string;
  }>,
  limit: number = 5
) {
  const citiesWithDistance = cities
    .filter((city) => city.latitude && city.longitude)
    .map((city) => ({
      ...city,
      distance: calculateDistance(
        userLat,
        userLon,
        city.latitude!,
        city.longitude!
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  return citiesWithDistance;
}

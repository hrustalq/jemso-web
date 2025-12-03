"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import Cookies from "js-cookie";

// Cookie keys
const LOCATION_COOKIE_KEY = "user_location";
const LOCATION_DISMISSED_KEY = "location_prompt_dismissed";

// Cookie expiry in days
const COOKIE_EXPIRY_DAYS = 365;

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string | null;
  country?: string | null;
  timezone?: string | null;
}

export interface LocationPreferences extends LocationData {
  maxEventDistance?: number | null;
}

interface UseLocationPreferencesReturn {
  location: LocationData | null;
  isLoading: boolean;
  isPromptDismissed: boolean;
  requestLocation: () => Promise<LocationData | null>;
  saveLocation: (data: LocationData) => Promise<void>;
  clearLocation: () => Promise<void>;
  dismissPrompt: () => void;
  resetPromptDismissal: () => void;
}

export function useLocationPreferences(): UseLocationPreferencesReturn {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPromptDismissed, setIsPromptDismissed] = useState(false);

  // tRPC mutations and queries for authenticated users
  const utils = api.useUtils();
  
  const { data: dbPreferences, isLoading: isDbLoading } = api.user.getLocationPreferences.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const updateDbPreferences = api.user.updateLocationPreferences.useMutation({
    onSuccess: () => {
      void utils.user.getLocationPreferences.invalidate();
    },
  });

  // Load location from cookie for anonymous users
  const loadFromCookie = useCallback((): LocationData | null => {
    const cookieData = Cookies.get(LOCATION_COOKIE_KEY);
    if (cookieData) {
      try {
        return JSON.parse(cookieData) as LocationData;
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  // Save location to cookie for anonymous users
  const saveToCookie = useCallback((data: LocationData) => {
    Cookies.set(LOCATION_COOKIE_KEY, JSON.stringify(data), {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: "lax",
    });
  }, []);

  // Clear location cookie
  const clearCookie = useCallback(() => {
    Cookies.remove(LOCATION_COOKIE_KEY);
  }, []);

  // Check if prompt was dismissed
  const loadDismissedState = useCallback(() => {
    return Cookies.get(LOCATION_DISMISSED_KEY) === "true";
  }, []);

  // Initialize location data
  useEffect(() => {
    setIsPromptDismissed(loadDismissedState());

    if (isAuthenticated) {
      // For authenticated users, wait for DB query
      if (!isDbLoading && dbPreferences) {
        if (dbPreferences.latitude && dbPreferences.longitude) {
          setLocation({
            latitude: dbPreferences.latitude,
            longitude: dbPreferences.longitude,
            city: dbPreferences.city,
            country: dbPreferences.country,
            timezone: dbPreferences.timezone,
          });
        }
        setIsLoading(false);
      }
    } else if (status === "unauthenticated") {
      // For anonymous users, load from cookie
      const cookieLocation = loadFromCookie();
      if (cookieLocation) {
        setLocation(cookieLocation);
      }
      setIsLoading(false);
    }
  }, [isAuthenticated, status, dbPreferences, isDbLoading, loadFromCookie, loadDismissedState]);

  // Request geolocation from browser
  const requestLocation = useCallback(async (): Promise<LocationData | null> => {
    if (!navigator.geolocation) {
      throw new Error("UNSUPPORTED");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Try to get city/country from reverse geocoding (optional)
          let city: string | null = null;
          let country: string | null = null;
          let timezone: string | null = null;

          try {
            // Use browser's timezone
            timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // Optional: reverse geocoding using a free service
            // For now, we'll skip this to avoid external API dependencies
            // You can add reverse geocoding here if needed
          } catch {
            // Ignore geocoding errors
          }

          const locationData: LocationData = {
            latitude,
            longitude,
            city,
            country,
            timezone,
          };

          resolve(locationData);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(new Error("DENIED"));
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            reject(new Error("UNAVAILABLE"));
          } else {
            reject(new Error("ERROR"));
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        }
      );
    });
  }, []);

  // Save location to DB (authenticated) or cookie (anonymous)
  const saveLocation = useCallback(async (data: LocationData) => {
    setLocation(data);
    
    if (isAuthenticated) {
      await updateDbPreferences.mutateAsync({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country,
        timezone: data.timezone,
      });
    } else {
      saveToCookie(data);
    }
  }, [isAuthenticated, updateDbPreferences, saveToCookie]);

  // Clear location from DB or cookie
  const clearLocation = useCallback(async () => {
    setLocation(null);
    
    if (isAuthenticated) {
      await updateDbPreferences.mutateAsync({
        latitude: null,
        longitude: null,
        city: null,
        country: null,
        timezone: null,
      });
    } else {
      clearCookie();
    }
  }, [isAuthenticated, updateDbPreferences, clearCookie]);

  // Dismiss the location prompt
  const dismissPrompt = useCallback(() => {
    setIsPromptDismissed(true);
    Cookies.set(LOCATION_DISMISSED_KEY, "true", {
      expires: 30, // Show again after 30 days
      sameSite: "lax",
    });
  }, []);

  // Reset prompt dismissal (for testing or settings)
  const resetPromptDismissal = useCallback(() => {
    setIsPromptDismissed(false);
    Cookies.remove(LOCATION_DISMISSED_KEY);
  }, []);

  return {
    location,
    isLoading,
    isPromptDismissed,
    requestLocation,
    saveLocation,
    clearLocation,
    dismissPrompt,
    resetPromptDismissal,
  };
}


"use client";

import { useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";

// Cookie keys
const NOTIFICATION_DISMISSED_KEY = "notification_prompt_dismissed";
const NOTIFICATION_ENABLED_KEY = "notifications_enabled";

export type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported";

interface UseNotificationPreferencesReturn {
  permission: NotificationPermissionState;
  isLoading: boolean;
  isPromptDismissed: boolean;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermissionState>;
  dismissPrompt: () => void;
  resetPromptDismissal: () => void;
}

export function useNotificationPreferences(): UseNotificationPreferencesReturn {
  const [permission, setPermission] = useState<NotificationPermissionState>("default");
  const [isLoading, setIsLoading] = useState(true);
  const [isPromptDismissed, setIsPromptDismissed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if notifications are supported
  useEffect(() => {
    const supported = typeof window !== "undefined" && "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      // Get current permission state
      setPermission(Notification.permission as NotificationPermissionState);
    } else {
      setPermission("unsupported");
    }

    // Check if prompt was dismissed
    const dismissed = Cookies.get(NOTIFICATION_DISMISSED_KEY) === "true";
    setIsPromptDismissed(dismissed);

    setIsLoading(false);
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermissionState> => {
    if (!isSupported) {
      return "unsupported";
    }

    try {
      const result = await Notification.requestPermission();
      const state = result as NotificationPermissionState;
      setPermission(state);
      
      if (state === "granted") {
        // Mark as enabled in cookie
        Cookies.set(NOTIFICATION_ENABLED_KEY, "true", {
          expires: 365,
          sameSite: "lax",
        });
      }
      
      return state;
    } catch {
      setPermission("denied");
      return "denied";
    }
  }, [isSupported]);

  // Dismiss the notification prompt
  const dismissPrompt = useCallback(() => {
    setIsPromptDismissed(true);
    Cookies.set(NOTIFICATION_DISMISSED_KEY, "true", {
      expires: 30, // Show again after 30 days
      sameSite: "lax",
    });
  }, []);

  // Reset prompt dismissal
  const resetPromptDismissal = useCallback(() => {
    setIsPromptDismissed(false);
    Cookies.remove(NOTIFICATION_DISMISSED_KEY);
  }, []);

  return {
    permission,
    isLoading,
    isPromptDismissed,
    isSupported,
    requestPermission,
    dismissPrompt,
    resetPromptDismissal,
  };
}


"use client";

import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

// Lazy load the prompts
const LocationPrompt = lazy(() => 
  import("./location-prompt").then(mod => ({ default: mod.LocationPrompt }))
);
const NotificationPrompt = lazy(() => 
  import("./notification-prompt").then(mod => ({ default: mod.NotificationPrompt }))
);

type PromptType = "location" | "notification" | null;

interface PermissionPromptsProviderProps {
  children: React.ReactNode;
  // Delay before showing the first prompt (in ms)
  initialDelay?: number;
  // Delay between prompts (in ms)
  promptInterval?: number;
  // Pages where prompts should not be shown (e.g., auth pages)
  excludedPaths?: string[];
  // Position of the prompt on screen
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
}

export function PermissionPromptsProvider({
  children,
  initialDelay = 5000, // Show first prompt after 5 seconds
  promptInterval = 3000, // Wait 3 seconds between prompts
  excludedPaths = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"],
  position = "bottom-right",
}: PermissionPromptsProviderProps) {
  const pathname = usePathname();
  const [currentPrompt, setCurrentPrompt] = useState<PromptType>(null);
  const [shownPrompts, setShownPrompts] = useState<Set<PromptType>>(new Set());
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check if current path is excluded
  const isExcludedPath = excludedPaths.some(path => pathname.includes(path));

  // Determine which prompt to show next
  const getNextPrompt = useCallback((): PromptType => {
    // Priority order: location, then notification
    if (!shownPrompts.has("location")) return "location";
    if (!shownPrompts.has("notification")) return "notification";
    return null;
  }, [shownPrompts]);

  // Handle prompt close with animation
  const handlePromptClose = useCallback(() => {
    setIsVisible(false);
    // Wait for animation to complete before removing
    setTimeout(() => {
      if (currentPrompt) {
        setShownPrompts(prev => new Set([...prev, currentPrompt]));
      }
      setCurrentPrompt(null);
    }, 200);
  }, [currentPrompt]);

  // Schedule showing the next prompt
  useEffect(() => {
    if (isExcludedPath || currentPrompt) return;

    const nextPrompt = getNextPrompt();
    if (!nextPrompt) return;

    // Set initial delay or interval delay
    const delay = shownPrompts.size === 0 ? initialDelay : promptInterval;
    
    const timer = setTimeout(() => {
      setCurrentPrompt(nextPrompt);
      // Trigger animation after a small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [isExcludedPath, currentPrompt, shownPrompts, getNextPrompt, initialDelay, promptInterval]);

  // Mark as ready after hydration
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Mobile: full-width at bottom, Desktop: positioned card
  const positionStyles = {
    "bottom-right": "bottom-0 left-0 right-0 sm:bottom-4 sm:right-4 sm:left-auto",
    "bottom-left": "bottom-0 left-0 right-0 sm:bottom-4 sm:left-4 sm:right-auto",
    "top-right": "top-16 left-0 right-0 sm:top-20 sm:right-4 sm:left-auto",
    "top-left": "top-16 left-0 right-0 sm:top-20 sm:left-4 sm:right-auto",
    "center": "bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:right-auto sm:-translate-x-1/2 sm:-translate-y-1/2",
  };

  return (
    <>
      {children}
      
      {isReady && !isExcludedPath && currentPrompt && (
        <div className={cn("fixed z-50 px-0 sm:px-0", positionStyles[position])}>
          <Suspense fallback={null}>
            <div
              className={cn(
                "transition-all duration-200 ease-out w-full sm:w-auto",
                isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-4 scale-95"
              )}
            >
              {currentPrompt === "location" && (
                <LocationPrompt onClose={handlePromptClose} variant="card" />
              )}
              {currentPrompt === "notification" && (
                <NotificationPrompt onClose={handlePromptClose} variant="card" />
              )}
            </div>
          </Suspense>
        </div>
      )}
    </>
  );
}


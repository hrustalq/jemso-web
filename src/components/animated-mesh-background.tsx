"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Check if user prefers reduced motion
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Check if device is low-end
function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 0;
  if (cores > 0 && cores <= 2) return true;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined && memory <= 2) return true;
  return false;
}

export function AnimatedMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(0);
  const offsetRef = useRef({ x: 0, y: 0 });
  const startTimeRef = useRef<number>(0);
  const isUserInteractingRef = useRef(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isEnabled, setIsEnabled] = useState(true);

  // Track user interaction to reduce animation during scrolling/interaction
  const handleUserInteraction = useCallback(() => {
    isUserInteractingRef.current = true;
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    // Resume full animation 200ms after interaction stops
    interactionTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 200);
  }, []);

  useEffect(() => {
    // Disable animation for reduced motion or low-end devices
    if (prefersReducedMotion() || isLowEndDevice()) {
      setIsEnabled(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isAnimating = true;
    startTimeRef.current = performance.now();
    lastFrameTimeRef.current = 0;

    // Target 20 FPS, drop to 10 FPS during user interaction
    const targetFPS = 20;
    const interactionFPS = 10;
    const frameInterval = 1000 / targetFPS;
    const interactionFrameInterval = 1000 / interactionFPS;

    // Set canvas size with device pixel ratio (capped for performance)
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      // Draw immediately after resize
      drawStaticPattern();
    };

    const isDark = document.documentElement.classList.contains("dark");

    // Optimized colors - slightly more visible to compensate for lower density
    const primaryColor = isDark
      ? "rgba(100, 150, 200, 0.08)"
      : "rgba(0, 75, 135, 0.08)";
    const secondaryColor = isDark
      ? "rgba(120, 160, 210, 0.05)"
      : "rgba(0, 85, 145, 0.05)";

    // Draw static pattern (no animation offset)
    const drawStaticPattern = () => {
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Increased spacing for better performance (fewer lines)
      const spacing = 8;
      const lineWidth = 1;

      const diagonal = Math.sqrt(displayWidth ** 2 + displayHeight ** 2);
      const numLines = Math.ceil(diagonal / spacing) * 2;

      // Draw primary diagonal lines only
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "butt"; // Faster than "round"

      ctx.beginPath();
      for (let i = -numLines / 2; i < numLines / 2; i++) {
        const startX = i * spacing;
        const startY = -diagonal;
        const endX = startX + diagonal;
        const endY = diagonal;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      }
      ctx.stroke();

      // Draw secondary lines (every other line for performance)
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = lineWidth * 0.6;

      ctx.beginPath();
      for (let i = -numLines / 2; i < numLines / 2; i += 2) {
        const startX = i * spacing + spacing / 2;
        const startY = -diagonal;
        const endX = startX + diagonal;
        const endY = diagonal;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      }
      ctx.stroke();
    };

    // Draw animated pattern with offset
    const drawAnimatedPattern = (offset: { x: number; y: number }) => {
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 8;
      const lineWidth = 1;

      const diagonal = Math.sqrt(displayWidth ** 2 + displayHeight ** 2);
      const numLines = Math.ceil(diagonal / spacing) * 2;

      // Batch all primary lines into single path
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "butt";

      ctx.beginPath();
      for (let i = -numLines / 2; i < numLines / 2; i++) {
        const startX = i * spacing + offset.x;
        const startY = -diagonal + offset.y;
        const endX = startX + diagonal;
        const endY = diagonal + offset.y;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      }
      ctx.stroke();

      // Batch secondary lines
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = lineWidth * 0.6;

      ctx.beginPath();
      for (let i = -numLines / 2; i < numLines / 2; i += 2) {
        const startX = i * spacing + spacing / 2 + offset.x * 0.8;
        const startY = -diagonal + offset.y * 0.8;
        const endX = startX + diagonal;
        const endY = diagonal + offset.y * 0.8;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      }
      ctx.stroke();
    };

    // Animation loop with adaptive frame limiting
    const animate = (timestamp: number) => {
      if (!isAnimating) return;

      // Use lower FPS during user interaction to save resources
      const currentFrameInterval = isUserInteractingRef.current 
        ? interactionFrameInterval 
        : frameInterval;

      // Frame rate limiting
      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed < currentFrameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp - (elapsed % currentFrameInterval);

      // Skip animation entirely during interaction for better scroll performance
      if (isUserInteractingRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Calculate offset using sine wave (slower animation - 15 second cycle)
      const animationElapsed = (timestamp - startTimeRef.current) / 1000;
      const progress = (Math.sin(animationElapsed * 0.067 * Math.PI * 2) + 1) / 2;
      offsetRef.current.x = progress * 16;
      offsetRef.current.y = progress * 16;

      drawAnimatedPattern(offsetRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };

    resizeCanvas();
    window.addEventListener("resize", handleResize, { passive: true });

    // Track user interaction for adaptive performance
    window.addEventListener("scroll", handleUserInteraction, { passive: true });
    window.addEventListener("touchmove", handleUserInteraction, { passive: true });
    window.addEventListener("wheel", handleUserInteraction, { passive: true });

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Pause animations when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isAnimating = false;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
      } else {
        isAnimating = true;
        startTimeRef.current = performance.now();
        lastFrameTimeRef.current = 0;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isAnimating = false;
      clearTimeout(resizeTimeout);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("touchmove", handleUserInteraction);
      window.removeEventListener("wheel", handleUserInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleUserInteraction]);

  // If animations are disabled, render a static CSS background instead
  if (!isEnabled) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-30 dark:opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 7px,
            rgba(100, 150, 200, 0.05) 7px,
            rgba(100, 150, 200, 0.05) 8px
          )`,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-50 dark:opacity-60"
      aria-hidden="true"
    />
  );
}

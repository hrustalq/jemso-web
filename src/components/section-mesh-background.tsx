"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface SectionMeshBackgroundProps {
  variant?: "red" | "blue" | "purple" | "pink" | "multi" | "slate";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function SectionMeshBackground({ 
  variant = "multi", 
  intensity = "medium",
  className = "" 
}: SectionMeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container with device pixel ratio for crisp rendering
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    // Pure grayscale - no color tint
    const colorSchemes = {
      red: {
        dark: ["rgba(250, 250, 250, 0.035)", "rgba(248, 248, 248, 0.03)", "rgba(245, 245, 245, 0.025)"],
        light: ["rgba(25, 25, 25, 0.025)", "rgba(20, 20, 20, 0.02)", "rgba(15, 15, 15, 0.015)"],
      },
      blue: {
        dark: ["rgba(250, 250, 250, 0.035)", "rgba(248, 248, 248, 0.03)", "rgba(245, 245, 245, 0.025)"],
        light: ["rgba(25, 25, 25, 0.025)", "rgba(20, 20, 20, 0.02)", "rgba(15, 15, 15, 0.015)"],
      },
      purple: {
        dark: ["rgba(250, 250, 250, 0.035)", "rgba(248, 248, 248, 0.03)", "rgba(245, 245, 245, 0.025)"],
        light: ["rgba(25, 25, 25, 0.025)", "rgba(20, 20, 20, 0.02)", "rgba(15, 15, 15, 0.015)"],
      },
      pink: {
        dark: ["rgba(250, 250, 250, 0.035)", "rgba(248, 248, 248, 0.03)", "rgba(245, 245, 245, 0.025)"],
        light: ["rgba(25, 25, 25, 0.025)", "rgba(20, 20, 20, 0.02)", "rgba(15, 15, 15, 0.015)"],
      },
      slate: {
        dark: ["rgba(250, 250, 250, 0.035)", "rgba(248, 248, 248, 0.03)", "rgba(245, 245, 245, 0.025)"],
        light: ["rgba(25, 25, 25, 0.025)", "rgba(20, 20, 20, 0.02)", "rgba(15, 15, 15, 0.015)"],
      },
      multi: {
        dark: [
          "rgba(250, 250, 250, 0.035)",
          "rgba(248, 248, 248, 0.03)",
          "rgba(246, 246, 246, 0.028)",
          "rgba(245, 245, 245, 0.025)",
        ],
        light: [
          "rgba(25, 25, 25, 0.025)",
          "rgba(22, 22, 22, 0.022)",
          "rgba(20, 20, 20, 0.02)",
          "rgba(18, 18, 18, 0.018)",
        ],
      },
    };

    const intensityMap = {
      low: { radius: 200, count: 2, blur: 100 },
      medium: { radius: 300, count: 2, blur: 120 },
      high: { radius: 400, count: 3, blur: 140 },
    };

    const config = intensityMap[intensity];
    const isDark = document.documentElement.classList.contains("dark");
    const colors = colorSchemes[variant][isDark ? "dark" : "light"];

    // Get display dimensions for proper positioning
    const rect = container.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    // Create gradient points
    const points = Array.from({ length: config.count }, (_, i) => ({
      x: (displayWidth / (config.count + 1)) * (i + 1),
      y: displayHeight / 2 + (Math.random() - 0.5) * displayHeight * 0.5,
      radius: config.radius + Math.random() * 100,
      color: colors[i % colors.length] ?? colors[0] ?? "",
    }));

    // Animate points with GSAP
    points.forEach((point, i) => {
      gsap.to(point, {
        x: `+=${(Math.random() - 0.5) * displayWidth * 0.3}`,
        y: `+=${(Math.random() - 0.5) * displayHeight * 0.3}`,
        duration: 8 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw soft gradient circles with smooth blur
      ctx.filter = `blur(${config.blur * 0.8}px)`;
      points.forEach((point) => {
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          point.radius,
        );
        gradient.addColorStop(0, point.color);
        gradient.addColorStop(0.5, point.color.replace(/[\d.]+\)$/, "0.01)"));
        gradient.addColorStop(0.8, point.color.replace(/[\d.]+\)$/, "0.003)"));
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      gsap.killTweensOf(points);
    };
  }, [variant, intensity]);

  return (
    <div ref={containerRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}


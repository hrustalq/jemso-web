"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function AnimatedMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mesh gradient configuration
    const colors = {
      dark: [
        "oklch(0.09 0 0)",
        "oklch(0.12 0 0)",
        "oklch(0.60 0.24 25)",
        "oklch(0.55 0.18 220)",
        "oklch(0.15 0 0)",
      ],
      light: [
        "oklch(0.98 0 0)",
        "oklch(1 0 0)",
        "oklch(0.55 0.22 25)",
        "oklch(0.45 0.15 220)",
        "oklch(0.94 0 0)",
      ],
    };

    const isDark = document.documentElement.classList.contains("dark");
    const currentColors = isDark ? colors.dark : colors.light;

    // Create gradient points
    const points = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 300 + 200,
      color: currentColors[i % currentColors.length] ?? currentColors[0] ?? "",
    }));

    // Animate points
    points.forEach((point) => {
      gsap.to(point, {
        x: `+=${(Math.random() - 0.5) * 200}`,
        y: `+=${(Math.random() - 0.5) * 200}`,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient circles with blur
      ctx.filter = "blur(80px)";
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
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      gsap.killTweensOf(points);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-30"
      aria-hidden="true"
    />
  );
}


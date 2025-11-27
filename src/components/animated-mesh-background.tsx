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

    // Set canvas size with device pixel ratio for crisp rendering
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Pure grayscale mesh gradient - minimalistic
    const colors = {
      dark: [
        "rgba(250, 250, 250, 0.035)",
        "rgba(248, 248, 248, 0.03)",
        "rgba(246, 246, 246, 0.028)",
        "rgba(245, 245, 245, 0.025)",
        "rgba(243, 243, 243, 0.022)",
        "rgba(240, 240, 240, 0.02)",
      ],
      light: [
        "rgba(25, 25, 25, 0.025)",
        "rgba(22, 22, 22, 0.022)",
        "rgba(20, 20, 20, 0.02)",
        "rgba(18, 18, 18, 0.018)",
        "rgba(16, 16, 16, 0.016)",
        "rgba(15, 15, 15, 0.015)",
      ],
    };

    const isDark = document.documentElement.classList.contains("dark");
    const currentColors = isDark ? colors.dark : colors.light;

    // Create gradient points with smooth, large radius
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    
    const points = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * displayWidth,
      y: Math.random() * displayHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 350 + 250,
      color: currentColors[i % currentColors.length] ?? currentColors[0] ?? "",
    }));

    // Animate points with smooth, slow movement
    points.forEach((point) => {
      gsap.to(point, {
        x: `+=${(Math.random() - 0.5) * displayWidth * 0.3}`,
        y: `+=${(Math.random() - 0.5) * displayHeight * 0.3}`,
        duration: Math.random() * 15 + 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw soft gradient circles with smooth blur
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
        gradient.addColorStop(0.4, point.color.replace(/[\d.]+\)$/, "0.008)"));
        gradient.addColorStop(0.7, point.color.replace(/[\d.]+\)$/, "0.003)"));
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
      className="pointer-events-none fixed inset-0 -z-10 opacity-80 dark:opacity-90"
      aria-hidden="true"
    />
  );
}


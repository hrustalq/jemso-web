"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function AnimatedMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const offset = offsetRef.current;

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

    const isDark = document.documentElement.classList.contains("dark");
    
    // Carbon fiber inspired colors matching logo blue - adjusted for higher density
    const primaryColor = isDark ? "rgba(100, 150, 200, 0.06)" : "rgba(0, 75, 135, 0.06)";
    const secondaryColor = isDark ? "rgba(120, 160, 210, 0.04)" : "rgba(0, 85, 145, 0.04)";
    const accentColor = isDark ? "rgba(240, 245, 250, 0.02)" : "rgba(10, 70, 130, 0.02)";

    // Animate offset for subtle movement
    gsap.to(offset, {
      x: 20,
      y: 20,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Draw carbon fiber texture pattern
    const drawCarbonFiber = () => {
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pattern settings - increased density
      const spacing = 3; // Reduced from 8 to 3 for higher density
      const lineWidth = 1.5;
      const offset = offsetRef.current;

      // Calculate diagonal line positions
      const diagonal = Math.sqrt(displayWidth ** 2 + displayHeight ** 2);
      const numLines = Math.ceil(diagonal / spacing) * 2;

      // Draw primary diagonal lines (top-left to bottom-right)
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";

      for (let i = -numLines / 2; i < numLines / 2; i++) {
        const startX = i * spacing + offset.x;
        const startY = -diagonal + offset.y;
        const endX = startX + diagonal;
        const endY = diagonal + offset.y;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // Draw secondary parallel lines with slight offset for depth
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = lineWidth * 0.8;
      
      for (let i = -numLines / 2; i < numLines / 2; i++) {
        const startX = i * spacing + spacing / 3 + offset.x * 0.8;
        const startY = -diagonal + offset.y * 0.8;
        const endX = startX + diagonal;
        const endY = diagonal + offset.y * 0.8;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // Add subtle accent lines for texture depth
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = lineWidth * 0.5;
      
      for (let i = -numLines / 2; i < numLines / 2; i += 2) {
        const startX = i * spacing + spacing / 1.5 + offset.x * 0.6;
        const startY = -diagonal + offset.y * 0.6;
        const endX = startX + diagonal;
        const endY = diagonal + offset.y * 0.6;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(drawCarbonFiber);
    };

    drawCarbonFiber();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      gsap.killTweensOf(offset);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-50 dark:opacity-60"
      aria-hidden="true"
    />
  );
}


import { cn } from "~/lib/utils";

interface SectionBackgroundProps {
  variant?: "red" | "blue" | "purple" | "pink" | "multi" | "slate";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function SectionBackground({
  variant = "multi",
  intensity = "medium",
  className = "",
}: SectionBackgroundProps) {
  const intensityClasses = {
    low: "opacity-[0.03]",
    medium: "opacity-[0.06]",
    high: "opacity-[0.1]",
  };

  const variantClasses = {
    red: "mesh-background mesh-background-red",
    blue: "mesh-background",
    purple: "mesh-background mesh-background-purple",
    pink: "mesh-background mesh-background-pink",
    multi: "mesh-background",
    slate: "mesh-background mesh-background-slate",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        variantClasses[variant],
        intensityClasses[intensity],
        className
      )}
      aria-hidden="true"
    />
  );
}


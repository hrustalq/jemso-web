"use client";

interface PageLoaderProps {
  variant?: "default" | "minimal";
}

export function PageLoader({ variant = "default" }: PageLoaderProps) {
  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-1.5 animate-pulse">
          <div className="flex items-end gap-1">
            <div className="h-8 w-1 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-8 w-1 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-8 w-1 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            <div className="h-8 w-1 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "450ms" }} />
            <div className="h-8 w-1 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "600ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-background/98 backdrop-blur-md"
      style={{
        minHeight: "100dvh",
        height: "100vh",
        width: "100vw",
        isolation: "isolate",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="text-4xl font-bold uppercase tracking-wider text-foreground">
          JEMSO
        </div>

        {/* Animated bars */}
        <div className="flex items-end gap-1.5">
          <div className="h-12 w-2 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-12 w-2 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-12 w-2 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          <div className="h-12 w-2 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "450ms" }} />
          <div className="h-12 w-2 rounded-sm bg-primary animate-bounce" style={{ animationDelay: "600ms" }} />
        </div>

        {/* Loading text */}
        <p className="text-sm text-foreground/70">Загрузка...</p>
      </div>
    </div>
  );
}

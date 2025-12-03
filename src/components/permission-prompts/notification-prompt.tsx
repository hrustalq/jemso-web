"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bell, Calendar, Newspaper, Gift, X, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useNotificationPreferences } from "~/lib/hooks/use-notification-preferences";

type PromptState = "idle" | "loading" | "success" | "error" | "denied" | "unsupported";

interface NotificationPromptProps {
  className?: string;
  variant?: "card" | "banner" | "modal";
  onClose?: () => void;
}

export function NotificationPrompt({ 
  className, 
  variant = "card",
  onClose 
}: NotificationPromptProps) {
  const t = useTranslations("Permissions.notifications");
  const tCommon = useTranslations("Permissions.common");
  
  const { 
    permission, 
    isSupported, 
    requestPermission, 
    dismissPrompt, 
    isPromptDismissed 
  } = useNotificationPreferences();
  
  const [state, setState] = useState<PromptState>("idle");

  // Don't show if already dismissed, granted, or not supported
  if (isPromptDismissed || permission === "granted" || !isSupported) {
    return null;
  }

  const handleEnable = async () => {
    setState("loading");
    
    try {
      const result = await requestPermission();
      
      if (result === "granted") {
        setState("success");
        // Auto-close after success
        setTimeout(() => {
          onClose?.();
        }, 1500);
      } else if (result === "denied") {
        setState("denied");
      } else if (result === "unsupported") {
        setState("unsupported");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    onClose?.();
  };

  const benefits = [
    { icon: Calendar, text: t("benefits.events") },
    { icon: Newspaper, text: t("benefits.content") },
    { icon: Gift, text: t("benefits.offers") },
  ];

  const renderContent = () => {
    switch (state) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-500/10 p-3 mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-foreground font-medium">{t("success")}</p>
          </div>
        );

      case "denied":
        return (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-yellow-500/10 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-foreground font-medium mb-2">{t("denied")}</p>
            <p className="text-sm text-muted-foreground mb-4">{t("deniedDescription")}</p>
            <Button variant="ghost" onClick={handleDismiss}>
              {tCommon("dismiss")}
            </Button>
          </div>
        );

      case "unsupported":
        return (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-red-500/10 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-foreground font-medium mb-2">{t("unsupported")}</p>
            <p className="text-sm text-muted-foreground mb-4">{t("unsupportedDescription")}</p>
            <Button variant="ghost" onClick={handleDismiss}>
              {tCommon("dismiss")}
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-red-500/10 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-foreground font-medium mb-2">{t("error")}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setState("idle")}>
                {tCommon("dismiss")}
              </Button>
              <Button onClick={handleEnable}>{t("enable")}</Button>
            </div>
          </div>
        );

      default:
        return (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2.5">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t("title")}</h3>
                </div>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">
              {t("description")}
            </p>

            {/* Benefits */}
            <div className="space-y-2 mb-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <benefit.icon className="h-4 w-4 text-primary shrink-0" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Actions - stack on mobile, side-by-side on desktop */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button 
                variant="ghost" 
                className="flex-1 h-11 sm:h-10"
                onClick={handleDismiss}
              >
                {t("notNow")}
              </Button>
              <Button 
                className="flex-1 h-11 sm:h-10"
                onClick={handleEnable}
              >
                {t("enable")}
              </Button>
            </div>
          </>
        );
    }
  };

  // Mobile: full-width bottom sheet style, Desktop: card style
  const baseStyles = "bg-card border-border shadow-lg";
  
  const variantStyles = {
    card: cn(
      "p-4 w-full",
      // Mobile: bottom sheet style
      "rounded-t-xl border-t border-x sm:rounded-lg sm:border sm:max-w-sm",
      // Safe area padding for mobile devices
      "pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4"
    ),
    banner: "p-4 w-full border-t sm:border sm:rounded-lg",
    modal: "p-4 sm:p-6 w-full sm:max-w-md mx-auto rounded-t-xl sm:rounded-lg border-t sm:border",
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      {renderContent()}
    </div>
  );
}


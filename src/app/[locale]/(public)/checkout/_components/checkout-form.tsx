"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Link } from "~/i18n/navigation";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import {
  Check,
  CreditCard,
  Loader2,
  Tag,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

interface CheckoutFormProps {
  planId: string;
}

export function CheckoutForm({ planId }: CheckoutFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations("Checkout");
  const locale = useLocale();

  // Billing form state
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingPostal, setBillingPostal] = useState("");

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // General state
  const [error, setError] = useState("");
  
  // Ref to track initialization
  const isInitialized = useRef(false);

  // Create or get checkout session
  const createSession = api.subscriptions.checkout.getOrCreateSession.useMutation({
    onError: (err) => {
      setError(err.message);
    },
  });

  // Apply promo code
  const applyPromo = api.subscriptions.checkout.applyPromoCode.useMutation({
    onSuccess: () => {
      toast.success(t("promoApplied"));
      setIsApplyingPromo(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setIsApplyingPromo(false);
    },
  });

  // Remove promo code
  const removePromo = api.subscriptions.checkout.removePromoCode.useMutation({
    onSuccess: () => {
      toast.success(t("promoRemoved"));
    },
  });

  // Complete checkout
  const completeCheckout = api.subscriptions.checkout.complete.useMutation({
    onSuccess: () => {
      toast.success(t("subscriptionSuccess"));
      router.push("/account");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  // Initialize checkout session - runs only once on mount
  useEffect(() => {
    if (planId && !isInitialized.current) {
      isInitialized.current = true;
      createSession.mutate({ planId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  // Prefill billing info from session
  useEffect(() => {
    if (session?.user) {
      setBillingName(session.user.name ?? "");
      setBillingEmail(session.user.email ?? "");
    }
  }, [session]);

  // Prefill from session data if exists
  useEffect(() => {
    if (createSession.data?.billing) {
      setBillingName(createSession.data.billing.name);
      setBillingEmail(createSession.data.billing.email);
      setBillingAddress(createSession.data.billing.address ?? "");
      setBillingCity(createSession.data.billing.city ?? "");
      setBillingCountry(createSession.data.billing.country ?? "");
      setBillingPostal(createSession.data.billing.postalCode ?? "");
    }
  }, [createSession.data]);

  const sessionData = createSession.data;

  // Refetch session data
  const refetchSession = () => {
    createSession.mutate({ planId });
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim() || !sessionData?.id) return;
    setIsApplyingPromo(true);
    
    try {
      const result = await applyPromo.mutateAsync({
        sessionId: sessionData.id,
        promoCode: promoCode.trim(),
      });

      // Refetch session to update prices
      if (result.valid) {
        refetchSession();
      }
    } catch {
      // Error handled in mutation
    }
  };

  const handleRemovePromoCode = async () => {
    if (!sessionData?.id) return;
    await removePromo.mutateAsync({ sessionId: sessionData.id });
    refetchSession();
    setPromoCode("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!sessionData?.id) {
      setError(t("sessionNotFound"));
      return;
    }

    // Validate required fields
    if (!billingName.trim()) {
      setError(t("enterName"));
      return;
    }
    if (!billingEmail.trim()) {
      setError(t("enterEmail"));
      return;
    }

    // Generate mock payment method (in real app, use Stripe)
    let paymentMethodId: string | undefined;
    if (sessionData.finalPrice > 0) {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
        setError(t("fillCardDetails"));
        return;
      }
      paymentMethodId = cardNumber.startsWith("4000")
        ? "pm_card_error" // Trigger error for testing
        : `pm_${Math.random().toString(36).substring(2, 10)}`;
    }

    completeCheckout.mutate({
      sessionId: sessionData.id,
      paymentMethodId,
      billing: {
        name: billingName,
        email: billingEmail,
        address: billingAddress || undefined,
        city: billingCity || undefined,
        country: billingCountry || undefined,
        postalCode: billingPostal || undefined,
      },
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches?.[0] ?? "";
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (createSession.isPending) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (createSession.error || !sessionData) {
    return (
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>
              {createSession.error?.message ?? t("loadingError")}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-4">
            <Button onClick={() => router.push("/pricing")} variant="outline">
              {t("backToPricing")}
            </Button>
            <Button onClick={() => createSession.mutate({ planId })}>
              {t("tryAgain")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        {/* Left Column - Billing & Payment */}
        <div className="space-y-6">
          {/* Billing Details */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">{t("billingDetails")}</CardTitle>
              <CardDescription>
                {t("billingDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="billingName">{t("name")} *</Label>
                  <Input
                    id="billingName"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingEmail">{t("email")} *</Label>
                  <Input
                    id="billingEmail"
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">{t("address")}</Label>
                <Input
                  id="billingAddress"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder={t("addressPlaceholder")}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="billingCity">{t("city")}</Label>
                  <Input
                    id="billingCity"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    placeholder={t("cityPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingCountry">{t("country")}</Label>
                  <Input
                    id="billingCountry"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                    placeholder={t("countryPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingPostal">{t("postalCode")}</Label>
                  <Input
                    id="billingPostal"
                    value={billingPostal}
                    onChange={(e) => setBillingPostal(e.target.value)}
                    placeholder={t("postalPlaceholder")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method (only show if price > 0) */}
          {sessionData.finalPrice > 0 && (
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t("paymentMethod")}
                </CardTitle>
                <CardDescription>
                  {t("paymentDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">{t("cardNumber")} *</Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">{t("cardExpiry")} *</Label>
                    <Input
                      id="cardExpiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvc">{t("cardCvc")} *</Label>
                    <Input
                      id="cardCvc"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").substring(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {t("dataProtected")}
                </div>

                <p className="text-xs text-muted-foreground">
                  {t("testPaymentNote")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Plan Summary */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">{t("yourOrder")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{sessionData.plan.name}</h3>
                  {sessionData.plan.description && (
                    <p className="text-sm text-muted-foreground">
                      {sessionData.plan.description}
                    </p>
                  )}
                </div>
                {sessionData.plan.slug === "advanced" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Sparkles className="h-3 w-3" />
                    {t("popular")}
                  </span>
                )}
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t("included")}</p>
                {sessionData.plan.features.map((pf, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      {pf.feature.name}
                      {pf.value && pf.feature.featureType !== "boolean" && (
                        <span className="text-muted-foreground ml-1">({pf.value})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Label htmlFor="promoCode" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {t("promoCode")}
                </Label>
                
                {sessionData.promoCode ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div>
                      <p className="font-medium text-primary">{sessionData.promoCode.code}</p>
                      <p className="text-sm text-muted-foreground">
                        -{sessionData.promoCode.discountType === "percentage"
                          ? `${sessionData.promoCode.discountValue}%`
                          : formatPrice(sessionData.promoCode.discountValue, sessionData.currency)
                        }
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePromoCode}
                      disabled={removePromo.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder={t("enterCode")}
                      className="uppercase"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyPromoCode}
                      disabled={!promoCode.trim() || isApplyingPromo}
                    >
                      {isApplyingPromo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        t("apply")
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("planPrice")}</span>
                <span>{formatPrice(sessionData.originalPrice, sessionData.currency)}</span>
              </div>

              {sessionData.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>{t("discount")}</span>
                  <span>-{formatPrice(sessionData.discountAmount, sessionData.currency)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-baseline">
                <span className="font-semibold">{t("total")}</span>
                <div className="text-right">
                  <span className="text-2xl font-bold">
                    {formatPrice(sessionData.finalPrice, sessionData.currency)}
                  </span>
                  <span className="text-sm text-muted-foreground block">
                    /{sessionData.plan.billingInterval === "month" ? t("perMonth") : 
                      sessionData.plan.billingInterval === "year" ? t("perYear") : t("lifetime")}
                  </span>
                </div>
              </div>

              {sessionData.plan.trialDays > 0 && (
                <p className="text-sm text-primary text-center">
                  {t("firstDaysFree", { days: sessionData.plan.trialDays })}
                </p>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={completeCheckout.isPending}
              >
                {completeCheckout.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("processing")}
                  </>
                ) : sessionData.finalPrice > 0 ? (
                  t("payAmount", { amount: formatPrice(sessionData.finalPrice, sessionData.currency) })
                ) : (
                  t("subscribe")
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                {t("termsAgreement")}{" "}
                <Link href="/terms" className="underline hover:text-foreground">
                  {t("termsOfService")}
                </Link>{" "}
                {t("and")}{" "}
                <Link href="/privacy" className="underline hover:text-foreground">
                  {t("privacyPolicy")}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}


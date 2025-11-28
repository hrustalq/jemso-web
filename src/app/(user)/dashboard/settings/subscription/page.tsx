import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { SubscriptionSettings } from "~/app/(public)/account/_components/subscription-settings";
import { CreditCard } from "lucide-react";

export default function SubscriptionSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Подписка</h1>
        <p className="mt-2 text-muted-foreground">
          Управление тарифным планом и оплатой
        </p>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Управление подпиской
          </CardTitle>
          <CardDescription>
            Просмотр текущего плана и управление оплатой
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionSettings />
        </CardContent>
      </Card>
    </div>
  );
}


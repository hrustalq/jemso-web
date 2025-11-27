"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import { AlertCircle, CheckCircle2, Loader2, Bell, Mail } from "lucide-react";

export function NotificationSettings() {
  const { data: preferences, isLoading } = api.user.getPreferences.useQuery();
  const updatePreferences = api.user.updatePreferences.useMutation();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize state when data loads
  useEffect(() => {
    if (preferences) {
      setEmailNotifications(preferences.emailNotifications);
      setMarketingEmails(preferences.marketingEmails);
      setSecurityAlerts(preferences.securityAlerts);
      setNewsletterSubscribed(preferences.newsletterSubscribed);
    }
  }, [preferences]);

  const handleSave = () => {
    updatePreferences.mutate(
      {
        emailNotifications,
        marketingEmails,
        securityAlerts,
        newsletterSubscribed,
      },
      {
        onSuccess: () => {
          setHasChanges(false);
        },
      }
    );
  };

  const handleReset = () => {
    if (preferences) {
      setEmailNotifications(preferences.emailNotifications);
      setMarketingEmails(preferences.marketingEmails);
      setSecurityAlerts(preferences.securityAlerts);
      setNewsletterSubscribed(preferences.newsletterSubscribed);
      setHasChanges(false);
      updatePreferences.reset();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium">Настройки уведомлений</h3>
          <p className="text-sm text-muted-foreground">
            Управляйте способом получения уведомлений и обновлений
          </p>
        </div>
      </div>

      <Separator />

      {updatePreferences.isSuccess && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Настройки уведомлений успешно обновлены
          </AlertDescription>
        </Alert>
      )}

      {updatePreferences.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {updatePreferences.error.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="emailNotifications" className="cursor-pointer">
                Email-уведомления
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Получать email-уведомления о важных событиях в аккаунте
            </p>
          </div>
          <Switch
            id="emailNotifications"
            checked={emailNotifications}
            onCheckedChange={(checked) => {
              setEmailNotifications(checked);
              setHasChanges(true);
            }}
            disabled={updatePreferences.isPending}
          />
        </div>

        {/* Security Alerts */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="securityAlerts" className="cursor-pointer">
                Уведомления о безопасности
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Получать уведомления о важных событиях безопасности и попытках входа
            </p>
          </div>
          <Switch
            id="securityAlerts"
            checked={securityAlerts}
            onCheckedChange={(checked) => {
              setSecurityAlerts(checked);
              setHasChanges(true);
            }}
            disabled={updatePreferences.isPending}
          />
        </div>

        {/* Marketing Emails */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="marketingEmails" className="cursor-pointer">
                Маркетинговые email
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Получать письма о новых функциях, советах и специальных предложениях
            </p>
          </div>
          <Switch
            id="marketingEmails"
            checked={marketingEmails}
            onCheckedChange={(checked) => {
              setMarketingEmails(checked);
              setHasChanges(true);
            }}
            disabled={updatePreferences.isPending}
          />
        </div>

        {/* Newsletter Subscription */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="newsletterSubscribed" className="cursor-pointer">
                Подписка на рассылку
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Подписаться на нашу рассылку для получения регулярных обновлений и новостей
            </p>
          </div>
          <Switch
            id="newsletterSubscribed"
            checked={newsletterSubscribed}
            onCheckedChange={(checked) => {
              setNewsletterSubscribed(checked);
              setHasChanges(true);
            }}
            disabled={updatePreferences.isPending}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={!hasChanges || updatePreferences.isPending}
        >
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updatePreferences.isPending}
        >
          {updatePreferences.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            "Сохранить настройки"
          )}
        </Button>
      </div>
    </div>
  );
}


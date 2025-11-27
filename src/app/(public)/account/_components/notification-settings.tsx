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
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Manage how you receive notifications and updates
          </p>
        </div>
      </div>

      <Separator />

      {updatePreferences.isSuccess && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Notification preferences updated successfully
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
                Email Notifications
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Receive email notifications for important account activity
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
                Security Alerts
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Get notified about important security events and login attempts
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
                Marketing Emails
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Receive emails about new features, tips, and special offers
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
                Newsletter Subscription
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for regular updates and insights
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
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updatePreferences.isPending}
        >
          {updatePreferences.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  );
}


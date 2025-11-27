"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card } from "~/components/ui/card";
import { User, Lock, Bell, CreditCard } from "lucide-react";
import { ProfileSettings } from "./profile-settings";
import { SecuritySettings } from "./security-settings";
import { NotificationSettings } from "./notification-settings";
import { SubscriptionSettings } from "./subscription-settings";

export function AccountTabs() {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
        <TabsTrigger value="profile" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2">
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="subscription" className="gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Subscription</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card className="p-6">
          <ProfileSettings />
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card className="p-6">
          <SecuritySettings />
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="p-6">
          <NotificationSettings />
        </Card>
      </TabsContent>

      <TabsContent value="subscription">
        <Card className="p-6">
          <SubscriptionSettings />
        </Card>
      </TabsContent>
    </Tabs>
  );
}


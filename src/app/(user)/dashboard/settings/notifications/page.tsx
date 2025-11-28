import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { NotificationSettings } from "~/app/(public)/account/_components/notification-settings";
import { Bell } from "lucide-react";

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Уведомления</h1>
        <p className="mt-2 text-muted-foreground">
          Настройка уведомлений и рассылок
        </p>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Настройки уведомлений
          </CardTitle>
          <CardDescription>
            Управляйте способом получения уведомлений и обновлений
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationSettings />
        </CardContent>
      </Card>
    </div>
  );
}


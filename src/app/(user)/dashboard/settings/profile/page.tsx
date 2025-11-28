import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ProfileSettings } from "~/app/(public)/account/_components/profile-settings";
import { User } from "lucide-react";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
        <p className="mt-2 text-muted-foreground">
          Управление информацией вашего профиля
        </p>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Информация профиля
          </CardTitle>
          <CardDescription>
            Обновите информацию вашего профиля и аватар
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileSettings />
        </CardContent>
      </Card>
    </div>
  );
}


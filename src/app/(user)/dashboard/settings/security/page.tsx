import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { SecuritySettings } from "~/app/(public)/account/_components/security-settings";
import { Lock } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Безопасность</h1>
        <p className="mt-2 text-muted-foreground">
          Управление паролем и безопасностью аккаунта
        </p>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Настройки безопасности
          </CardTitle>
          <CardDescription>
            Изменение пароля и управление аккаунтом
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SecuritySettings />
        </CardContent>
      </Card>
    </div>
  );
}


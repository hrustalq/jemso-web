import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Настройки | Администратор",
  description: "Настройки панели администратора",
};

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="mt-2 text-muted-foreground">
          Конфигурация настроек панели администратора
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Общие настройки</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Конфигурация общих настроек скоро будет доступна...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Настройки Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Конфигурация email скоро будет доступна...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Настройки безопасности</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Настройки безопасности скоро будут доступны...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

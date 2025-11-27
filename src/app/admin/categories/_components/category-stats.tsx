import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Folder, FileText, Calendar } from "lucide-react";
import { api } from "~/trpc/server";

export async function CategoryStats() {
  const categories = await api.blog.categories.list();

  const totalPosts = categories.reduce(
    (sum, cat) => sum + cat._count.posts,
    0
  );
  const totalEvents = categories.reduce(
    (sum, cat) => sum + ((cat._count as { posts: number; events?: number }).events ?? 0),
    0
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Всего категорий
          </CardTitle>
          <Folder className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categories.length}</div>
          <p className="text-xs text-muted-foreground">
            Для статей блога и событий
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Статьи блога</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPosts}</div>
          <p className="text-xs text-muted-foreground">
            Всего статей в категориях
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">События</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEvents}</div>
          <p className="text-xs text-muted-foreground">
            Всего событий в категориях
          </p>
        </CardContent>
      </Card>
    </>
  );
}

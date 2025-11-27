import Link from "next/link";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { FeatureActions } from "./_components/feature-actions";

export const metadata = {
  title: "Manage Features | Admin",
  description: "Manage subscription plan features",
};

export default async function FeaturesPage() {
  const features = await api.subscriptions.features.list();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Features</h1>
          <p className="mt-2 text-muted-foreground">
            Manage features available for subscription plans
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/features/new">
            <Plus className="mr-2 h-4 w-4" />
            New Feature
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Features ({features.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Used In Plans</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No features found. Create your first feature!
                  </TableCell>
                </TableRow>
              ) : (
                features.map((feature) => (
                  <TableRow key={feature.id}>
                    <TableCell className="font-medium">
                      {feature.name}
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-xs">
                        {feature.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          feature.featureType === "boolean"
                            ? "default"
                            : feature.featureType === "numeric"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {feature.featureType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <span className="text-sm text-muted-foreground">
                        {feature.description ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {feature._count.planFeatures} plan(s)
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(feature.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <FeatureActions
                        featureId={feature.id}
                        featureName={feature.name}
                        usedInPlans={feature._count.planFeatures}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


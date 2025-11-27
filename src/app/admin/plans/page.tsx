import Link from "next/link";
import { db } from "~/server/db";
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
import { PlanActions } from "./_components/plan-actions";

export const metadata = {
  title: "Manage Subscription Plans | Admin",
  description: "Manage subscription plans and features",
};

export default async function PlansPage() {
  const plans = await db.subscriptionPlan.findMany({
    include: {
      features: {
        include: {
          feature: true,
        },
      },
      _count: {
        select: {
          subscriptions: true,
        },
      },
    },
    orderBy: {
      price: "asc",
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Subscription Plans
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage subscription plans and their features
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/plans/new">
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Plans ({plans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Billing Period</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Active Subs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No plans found. Create your first plan!
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>
                      ${plan.price.toString()}
                      {plan.currency}
                    </TableCell>
                    <TableCell className="capitalize">
                      {plan.billingInterval}
                    </TableCell>
                    <TableCell>{plan.features.length}</TableCell>
                    <TableCell>
                      {plan._count.subscriptions}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={plan.isActive ? "default" : "secondary"}
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <PlanActions planId={plan.id} planName={plan.name} />
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


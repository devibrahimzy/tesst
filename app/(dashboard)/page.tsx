"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FolderOpen, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.first_name}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your Scrum projects
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Projects
            </CardTitle>
            <CardDescription>
              Manage your Scrum projects and sprints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/projects">
              <Button variant="outline" className="w-full">
                View Projects
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Analytics
            </CardTitle>
            <CardDescription>
              Track your team&apos;s performance and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

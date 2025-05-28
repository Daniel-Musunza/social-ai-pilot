// src/app/(app)/settings/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center mb-8">
        <SettingsIcon className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage your application preferences and configurations here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is a placeholder for future settings.
            You'll be able to configure things like:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Profile information</li>
            <li>Notification preferences</li>
            <li>Connected social media accounts (requires API integration)</li>
            <li>Theme preferences (Light/Dark mode toggle)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

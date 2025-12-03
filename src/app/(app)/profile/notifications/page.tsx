"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "contributions",
      label: "Contribution Reminders",
      description: "Get notified when it's time to make your contribution",
      enabled: true,
    },
    {
      id: "investments",
      label: "Investment Updates",
      description: "Receive updates about group investments and returns",
      enabled: true,
    },
    {
      id: "claims",
      label: "Claim Status",
      description: "Notifications about your claim requests and approvals",
      enabled: true,
    },
    {
      id: "withdrawals",
      label: "Withdrawal Updates",
      description: "Updates on your withdrawal requests",
      enabled: false,
    },
    {
      id: "group_activity",
      label: "Group Activity",
      description: "Notifications about new members, contributions, and group events",
      enabled: true,
    },
    {
      id: "discounts",
      label: "New Discounts",
      description: "Get notified when new discounts become available",
      enabled: true,
    },
    {
      id: "email",
      label: "Email Notifications",
      description: "Receive notifications via email",
      enabled: false,
    },
    {
      id: "sms",
      label: "SMS Notifications",
      description: "Receive notifications via SMS",
      enabled: true,
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleSave = async () => {
    // TODO: Integrate with API
    console.log("Saving notification settings:", settings);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/profile" className="text-primary hover:text-primary/80 font-medium">
          Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-headline">Notifications</h1>
          <p className="text-muted-foreground">Manage your notification preferences</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {settings.map((setting, index) => (
            <div key={setting.id}>
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={setting.id} className="text-base font-medium">
                    {setting.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <Switch
                  id={setting.id}
                  checked={setting.enabled}
                  onCheckedChange={() => handleToggle(setting.id)}
                />
              </div>
              {index < settings.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1">
          Save Preferences
        </Button>
        <Button variant="outline" asChild>
          <Link href="/profile">Cancel</Link>
        </Button>
      </div>
    </div>
  );
}


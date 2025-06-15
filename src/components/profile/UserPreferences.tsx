"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const preferencesSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  language: z.string(),
  theme: z.string(),
  timezone: z.string(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface UserPreferencesProps {
  preferences: PreferencesFormData;
  onUpdate: (preferences: PreferencesFormData) => void;
}

export function UserPreferences({ preferences, onUpdate }: UserPreferencesProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: preferences,
  });

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users/profile/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      const updatedUser = await response.json();
      onUpdate(updatedUser.preferences);
      toast.success("Preferences updated successfully");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Email Notifications</label>
              <p className="text-sm text-gray-500">Receive email notifications about your bookings and events</p>
            </div>
            <Switch
              checked={watch("emailNotifications")}
              onCheckedChange={(checked) => setValue("emailNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Push Notifications</label>
              <p className="text-sm text-gray-500">Receive push notifications on your device</p>
            </div>
            <Switch
              checked={watch("pushNotifications")}
              onCheckedChange={(checked) => setValue("pushNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Marketing Emails</label>
              <p className="text-sm text-gray-500">Receive emails about new events and promotions</p>
            </div>
            <Switch
              checked={watch("marketingEmails")}
              onCheckedChange={(checked) => setValue("marketingEmails", checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Appearance & Language</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <Select
              value={watch("language")}
              onValueChange={(value) => setValue("language", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="id">Indonesian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <Select
              value={watch("theme")}
              onValueChange={(value) => setValue("theme", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Timezone</label>
            <Select
              value={watch("timezone")}
              onValueChange={(value) => setValue("timezone", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="Asia/Jakarta">Jakarta (GMT+7)</SelectItem>
                <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
} 
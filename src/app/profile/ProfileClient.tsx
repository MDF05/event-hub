"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import ProfileForm from "@/components/profile/ProfileForm";
import { UserWithPreferences } from "@/types/user";

type ProfileFormValues = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  occupation?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
};

type ProfileClientProps = {
  user: UserWithPreferences;
};

export default function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      router.refresh();
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your profile information and preferences.
        </p>
      </div>
      <ProfileForm user={user} onUpdate={handleUpdateProfile} />
    </div>
  );
} 
"use client";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import { UserPreferences } from "@/components/profile/UserPreferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  theme: string;
  timezone: string;
}

interface UserWithPreferences extends User {
  preferences?: UserPreferences;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
  occupation?: string | null;
  company?: string | null;
  website?: string | null;
  socialLinks?: any;
}

interface ProfileClientProps {
  user: UserWithPreferences;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  const defaultPreferences: UserPreferences = {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    language: "en",
    theme: "system",
    timezone: "UTC",
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/users/profile/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: Partial<UserWithPreferences>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

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
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePreferences = async (preferences: UserPreferences) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/profile/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            <div>
              <ProfileImageUpload
                currentImage={user.image || ""}
                onImageUpload={handleImageUpload}
              />
            </div>
            <div>
              <ProfileForm 
                user={user} 
                onUpdate={handleUpdateProfile}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <UserPreferences
            preferences={user.preferences || defaultPreferences}
            onUpdate={handleUpdatePreferences}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 
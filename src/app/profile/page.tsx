import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import ProfileClient from "./ProfileClient";
import { UserWithPreferences, UserPreferences } from "@/types/user";

export default async function ProfilePage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      redirect("/auth/signin");
    }

    const user = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      redirect("/auth/signin");
    }

    const defaultPreferences: UserPreferences = {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      language: "en",
      theme: "system",
      timezone: "UTC",
    };

    // Parse preferences from JSON if it exists
    let userPreferences: UserPreferences;
    try {
      userPreferences = user.preferences as unknown as UserPreferences;
    } catch {
      userPreferences = defaultPreferences;
    }

    const userWithDefaults: UserWithPreferences = {
      ...user,
      preferences: userPreferences,
    };

    return <ProfileClient user={userWithDefaults} />;
  } catch (error) {
    console.error("Profile page error:", error);
    redirect("/auth/signin");
  }
} 
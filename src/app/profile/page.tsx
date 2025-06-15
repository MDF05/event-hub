import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileClient from "@/app/profile/ProfileClient";
import { Role } from "@prisma/client";

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  theme: string;
  timezone: string;
}

type UserWithPreferences = {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  image: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
  occupation?: string | null;
  company?: string | null;
  website?: string | null;
  socialLinks?: any;
  preferences?: UserPreferences;
};

export default async function ProfilePage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    }) as any;

    if (!user) {
      redirect("/auth/signin");
    }

    // Cast user to UserWithPreferences
    const userWithDefaults = {
      ...user,
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth || null,
      occupation: user.occupation || "",
      company: user.company || "",
      website: user.website || "",
      socialLinks: user.socialLinks || {},
      preferences: (user.preferences as UserPreferences) || {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        language: "en",
        theme: "system",
        timezone: "UTC",
      },
    } as UserWithPreferences;

    return <ProfileClient user={userWithDefaults} />;
  } catch (error) {
    console.error("Profile page error:", error);
    redirect("/auth/signin");
  }
} 
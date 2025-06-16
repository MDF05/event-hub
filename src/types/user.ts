import { Role } from "@prisma/client";

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  theme: string;
  timezone: string;
}

export interface UserWithPreferences {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  password: string | null;
  image: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  phone: string | null;
  address: string | null;
  bio: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  occupation: string | null;
  company: string | null;
  website: string | null;
  socialLinks: any;
  preferences: UserPreferences;
} 
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function handleUpdateSettings(formData: FormData) {
  try {
    const settings = {
      siteName: formData.get('siteName') as string,
      siteDescription: formData.get('siteDescription') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
      midtransClientKey: formData.get('midtransClientKey') as string,
      midtransServerKey: formData.get('midtransServerKey') as string,
      facebookUrl: formData.get('facebookUrl') as string,
      twitterUrl: formData.get('twitterUrl') as string,
      instagramUrl: formData.get('instagramUrl') as string,
    };

    // Validate required fields
    if (!settings.siteName) {
      throw new Error('Site name is required');
    }

    if (!settings.contactEmail) {
      throw new Error('Contact email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.contactEmail)) {
      throw new Error('Invalid email format');
    }

    const existingSettings = await prisma.$queryRaw`
      SELECT * FROM "Settings" LIMIT 1
    `;

    if (existingSettings && Array.isArray(existingSettings) && existingSettings.length > 0) {
      await prisma.$executeRaw`
        UPDATE "Settings"
        SET 
          "siteName" = ${settings.siteName},
          "siteDescription" = ${settings.siteDescription},
          "contactEmail" = ${settings.contactEmail},
          "contactPhone" = ${settings.contactPhone},
          "midtransClientKey" = ${settings.midtransClientKey},
          "midtransServerKey" = ${settings.midtransServerKey},
          "facebookUrl" = ${settings.facebookUrl},
          "twitterUrl" = ${settings.twitterUrl},
          "instagramUrl" = ${settings.instagramUrl},
          "updatedAt" = NOW()
        WHERE id = ${existingSettings[0].id}
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO "Settings" (
          "id",
          "siteName",
          "siteDescription",
          "contactEmail",
          "contactPhone",
          "midtransClientKey",
          "midtransServerKey",
          "facebookUrl",
          "twitterUrl",
          "instagramUrl",
          "createdAt",
          "updatedAt"
        ) VALUES (
          gen_random_uuid(),
          ${settings.siteName},
          ${settings.siteDescription},
          ${settings.contactEmail},
          ${settings.contactPhone},
          ${settings.midtransClientKey},
          ${settings.midtransServerKey},
          ${settings.facebookUrl},
          ${settings.twitterUrl},
          ${settings.instagramUrl},
          NOW(),
          NOW()
        )
      `;
    }

    revalidatePath('/admin/settings');
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
} 
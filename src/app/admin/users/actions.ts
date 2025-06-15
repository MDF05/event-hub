'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function handleDeleteUser(formData: FormData) {
  const userId = formData.get('userId') as string;
  
  await prisma.user.delete({
    where: { id: userId },
  });
  
  revalidatePath('/admin/users');
} 
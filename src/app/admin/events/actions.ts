'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function togglePublish(eventId: string, currentStatus: boolean) {
  await prisma.event.update({
    where: { id: eventId },
    data: { isPublished: !currentStatus },
  });
  
  revalidatePath('/admin/events');
}

export async function deleteEvent(eventId: string) {
  await prisma.event.delete({
    where: { id: eventId },
  });
  
  revalidatePath('/admin/events');
}

export async function handleTogglePublish(formData: FormData) {
  const eventId = formData.get('eventId') as string;
  const currentStatus = formData.get('currentStatus') === 'true';
  await togglePublish(eventId, currentStatus);
}

export async function handleDeleteEvent(formData: FormData) {
  const eventId = formData.get('eventId') as string;
  await deleteEvent(eventId);
} 
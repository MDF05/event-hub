import { prisma } from '@/lib/prisma';

type NotificationType = 'BOOKING_UPDATE' | 'EVENT_REMINDER' | 'SYSTEM';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}

export async function createNotification({
  userId,
  title,
  message,
  type,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function createBookingNotification(
  userId: string,
  eventTitle: string,
  status: string
) {
  const title = 'Booking Update';
  const message = `Your booking for "${eventTitle}" has been ${status.toLowerCase()}.`;
  return createNotification({
    userId,
    title,
    message,
    type: 'BOOKING_UPDATE',
  });
}

export async function createEventReminderNotification(
  userId: string,
  eventTitle: string,
  eventDate: Date
) {
  const title = 'Event Reminder';
  const message = `Don't forget! "${eventTitle}" is happening tomorrow at ${eventDate.toLocaleTimeString()}.`;
  return createNotification({
    userId,
    title,
    message,
    type: 'EVENT_REMINDER',
  });
}

export async function createSystemNotification(
  userId: string,
  title: string,
  message: string
) {
  return createNotification({
    userId,
    title,
    message,
    type: 'SYSTEM',
  });
} 
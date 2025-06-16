import { db } from '@/lib/db';
import { NotificationType } from '@prisma/client';

export async function createNotification({
  userId,
  type,
  title,
  message,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}) {
  try {
    const notification = await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        isRead: false,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function createBookingNotification({
  userId,
  eventTitle,
  status,
}: {
  userId: string;
  eventTitle: string;
  status: string;
}) {
  const message = `Your booking for "${eventTitle}" has been ${status.toLowerCase()}.`;
  return createNotification({
    userId,
    type: NotificationType.BOOKING_UPDATE,
    title: 'Booking Update',
    message,
  });
}

export async function createEventReminderNotification({
  userId,
  eventTitle,
  eventDate,
}: {
  userId: string;
  eventTitle: string;
  eventDate: Date;
}) {
  const message = `Reminder: "${eventTitle}" is happening tomorrow at ${eventDate.toLocaleTimeString()}.`;
  return createNotification({
    userId,
    type: NotificationType.EVENT_REMINDER,
    title: 'Event Reminder',
    message,
  });
}

export async function createSystemNotification({
  userId,
  title,
  message,
}: {
  userId: string;
  title: string;
  message: string;
}) {
  return createNotification({
    userId,
    type: NotificationType.SYSTEM,
    title,
    message,
  });
} 
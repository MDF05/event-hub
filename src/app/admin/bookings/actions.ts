'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { BookingStatus } from '@prisma/client';
import { createBookingNotification } from '@/lib/notifications';

export async function getBookings() {
  try {
    const bookings = await db.booking.findMany({
      include: {
        event: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  try {
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status,
      },
      include: {
        event: true,
        user: true,
      },
    });

    // Create notification for booking status update
    await createBookingNotification({
      userId: booking.userId,
      eventTitle: booking.event.title,
      status,
    });

    revalidatePath('/admin/bookings');
    return booking;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    await db.booking.delete({
      where: {
        id: bookingId,
      },
    });
    revalidatePath('/admin/bookings');
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error('Failed to delete booking');
  }
} 
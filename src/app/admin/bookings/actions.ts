'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getBookings() {
  try {
    const bookings = await db.booking.findMany({
      include: {
        user: true,
        event: true,
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

export async function updateBookingStatus(bookingId: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
  try {
    const booking = await db.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status,
      },
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
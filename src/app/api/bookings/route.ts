import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createBookingNotification } from '@/lib/notifications';
import { BookingStatus } from '@prisma/client';

const bookingSchema = z.object({
  eventId: z.string(),
  quantity: z.number().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { eventId, quantity, name, email, phone } = bookingSchema.parse(body);

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        eventId,
        userId: session.user.id,
        status: 'PENDING',
        quantity: quantity,
      },
      include: {
        event: true,
      },
    });

    // Create notification for the booking
    await createBookingNotification(session.user.id, event.title, 'PENDING');

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        event: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('[BOOKINGS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
      },
    });

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }

    // Only event organizer can update booking status
    if (booking.event.organizerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as BookingStatus },
      include: {
        event: true,
      },
    });

    // Create notification for the booking status update
    await createBookingNotification(
      booking.userId,
      booking.event.title,
      status
    );

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('[BOOKINGS_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return new NextResponse('Booking ID is required', { status: 400 });
    }

    // Get booking with event details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
      },
    });

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }

    // Only booking owner or event organizer can delete booking
    if (booking.userId !== session.user.id && booking.event.organizerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[BOOKINGS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 
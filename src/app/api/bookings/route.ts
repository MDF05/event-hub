import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createBookingNotification } from '@/lib/notifications';

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

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // If userId is provided and user is admin, get bookings for that user
    // Otherwise, get bookings for the current user
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId && session.user.role === "ADMIN" ? userId : session.user.id,
      },
      include: {
        event: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return new NextResponse('Booking ID and status are required', { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        event: true,
        user: true,
      },
    });

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }

    // Only event organizer can update booking status
    if (booking.event.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        event: true,
        user: true,
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
    console.error('Error updating booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
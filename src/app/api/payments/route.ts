import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NotificationType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { bookingId, amount, paymentMethod } = body;

    if (!bookingId || !amount || !paymentMethod) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get booking details
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
        user: true,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        bookingId,
        amount: parseFloat(amount),
        status: 'SUCCESS',
        paymentMethod,
      },
    });

    // Update booking status
    await db.booking.update({
      where: { id: bookingId },
      data: { status: "PAID" },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: NotificationType.BOOKING_UPDATE,
        title: "Payment Successful",
        message: `Your payment of $${amount} for ${booking.event.title} has been processed successfully.`,
        isRead: false,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("[PAYMENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return new NextResponse("Booking ID is required", { status: 400 });
    }

    const payment = await db.payment.findUnique({
      where: {
        bookingId,
      },
      include: {
        booking: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!payment) {
      return new NextResponse("Payment not found", { status: 404 });
    }

    // Only booking owner can view payment details
    if (payment.booking.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("[PAYMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
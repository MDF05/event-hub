import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { bookingId, amount, eventTitle } = body;

    if (!bookingId || !amount || !eventTitle) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update booking status to paid
    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "PAID",
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        status: "COMPLETED",
        paymentMethod: "CREDIT_CARD",
      },
    });

    // Create notification for successful payment
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "PAYMENT_SUCCESS",
        title: "Payment Successful",
        message: `Your payment of $${amount} for ${eventTitle} has been processed successfully.`,
        read: false,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("[PAYMENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
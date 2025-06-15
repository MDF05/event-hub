import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        event: true,
        payment: true,
      },
    });

    if (!booking || booking.userId !== session.user.id) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
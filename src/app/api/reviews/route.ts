import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/reviews?eventId=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  if (!eventId) {
    return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
  }
  const reviews = await prisma.review.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(reviews);
}

// POST /api/reviews
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.json();
  const { eventId, rating, comment } = data;
  if (!eventId || !rating) {
    return NextResponse.json({ error: 'eventId and rating are required' }, { status: 400 });
  }
  // Cek apakah user sudah booking event ini
  const booking = await prisma.booking.findFirst({
    where: {
      userId: session.user.id,
      eventId,
      status: 'CONFIRMED',
    },
  });
  if (!booking) {
    return NextResponse.json({ error: 'You must book this event before reviewing.' }, { status: 403 });
  }
  // Cek apakah user sudah pernah review event ini
  const existing = await prisma.review.findUnique({
    where: {
      userId_eventId: {
        userId: session.user.id,
        eventId,
      },
    },
  });
  if (existing) {
    return NextResponse.json({ error: 'You have already reviewed this event.' }, { status: 409 });
  }
  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      eventId,
      rating,
      comment,
    },
  });
  return NextResponse.json(review);
} 
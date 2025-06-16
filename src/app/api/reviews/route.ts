import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BookingStatus } from '@prisma/client';

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
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { eventId, rating, comment } = body;

    if (!eventId || !rating) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if user has attended the event
    const booking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        eventId,
        status: BookingStatus.PAID,
      },
    });

    if (!booking) {
      return new NextResponse('You must attend the event to leave a review', { status: 403 });
    }

    // Check if user has already reviewed this event
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        eventId,
      },
    });

    if (existingReview) {
      return new NextResponse('You have already reviewed this event', { status: 400 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        eventId,
        rating: parseInt(rating),
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('[REVIEWS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 
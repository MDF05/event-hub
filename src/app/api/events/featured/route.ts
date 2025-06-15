import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
        date: {
          gte: new Date(),
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 6,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured events' },
      { status: 500 }
    );
  }
} 
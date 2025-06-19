import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    const events = await db.event.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        isPublished: true,
      },
      include: {
        organizer: true,
        category: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('[EVENTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const event = await db.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(`${body.date}T${body.time}`),
        location: body.location,
        categoryId: body.categoryId,
        price: parseFloat(body.price),
        capacity: parseInt(body.capacity),
        imageUrl: body.imageUrl,
        tags: body.tags,
        isPublished: body.isPublished,
        organizerId: session.user.id,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('[EVENTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 
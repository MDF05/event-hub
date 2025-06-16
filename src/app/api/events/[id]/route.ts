import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await db.event.findUnique({
      where: {
        id: params.id,
      },
      include: {
        organizer: true,
        category: true,
        bookings: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('[EVENT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const event = await db.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    if (event.organizerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedEvent = await db.event.update({
      where: {
        id: params.id,
      },
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
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('[EVENT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const event = await db.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    if (event.organizerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db.event.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[EVENT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 
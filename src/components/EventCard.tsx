'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    category: {
      name: string;
    };
    price: number;
    imageUrl: string | null;
    _count: {
      bookings: number;
      reviews: number;
    };
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <Image
          src={event.imageUrl || '/placeholder-event.jpg'}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold line-clamp-1">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <Badge variant="secondary">{event.category.name}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-sm">
            <span className="font-medium">Location:</span> {event.location}
          </p>
          <p className="text-sm">
            <span className="font-medium">Price:</span> Rp{' '}
            {event.price.toLocaleString()}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <p>{event._count.bookings} bookings</p>
            <p>{event._count.reviews} reviews</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 
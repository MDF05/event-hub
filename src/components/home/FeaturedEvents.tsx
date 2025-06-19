'use client';

import { useEffect, useState } from 'react';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Event {
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
}

export function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("data")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/featured');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching featured events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse"
          >
            <div className="aspect-video bg-muted" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-2xl font-semibold">No Featured Events</h3>
          <p className="text-muted-foreground">
            Check back later for featured events.
          </p>
        </div>
      </div>
    );
  }

 
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
    
  );
} 
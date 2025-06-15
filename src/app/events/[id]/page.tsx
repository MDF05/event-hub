"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { BookingForm } from "@/components/events/booking-form";
import { ReviewList } from '@/components/events/ReviewList';
import { ReviewForm } from '@/components/events/ReviewForm';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  capacity: number;
  imageUrl: string;
  createdAt: string;
}

export default function EventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  async function fetchEvent() {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch event");
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/events")}>
          Browse Events
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-muted-foreground capitalize">
              {event.category}
            </p>
          </div>

          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">About This Event</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Date & Time</h3>
                <p className="text-muted-foreground">
                  {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                  <br />
                  {event.time}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Location</h3>
                <p className="text-muted-foreground">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <BookingForm
              eventId={event.id}
              eventTitle={event.title}
              price={event.price}
              capacity={event.capacity}
              onSuccess={() => router.push("/bookings")}
            />
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-medium">Price</dt>
                <dd className="text-muted-foreground">
                  ${event.price.toFixed(2)} per ticket
                </dd>
              </div>
              <div>
                <dt className="font-medium">Available Capacity</dt>
                <dd className="text-muted-foreground">
                  {event.capacity} tickets
                </dd>
              </div>
              <div>
                <dt className="font-medium">Category</dt>
                <dd className="text-muted-foreground capitalize">
                  {event.category}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <ReviewForm eventId={event.id} />
        <div className="mt-8">
          <ReviewList eventId={event.id} />
        </div>
      </div>
    </div>
  );
} 
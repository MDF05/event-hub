"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventsListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function EventsList({ searchParams }: EventsListProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const page = Number(searchParams.page) || 1;
  const perPage = 9;

  // This is a placeholder for the actual data fetching
  const events = [
    {
      id: "1",
      title: "Summer Music Festival",
      description: "A three-day music festival featuring top artists",
      date: new Date("2024-07-15"),
      location: "Central Park, New York",
      category: "Music",
      price: 199.99,
      imageUrl: "/placeholder.jpg",
    },
    // Add more placeholder events here
  ];

  const totalPages = Math.ceil(events.length / perPage);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 
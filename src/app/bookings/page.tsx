"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Booking {
  id: string;
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
  };
  quantity: number;
  status: string;
  createdAt: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const response = await fetch("/api/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Button onClick={() => router.push("/events")}>
          Browse Events
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">
            You haven't made any bookings yet.
          </p>
          <Button onClick={() => router.push("/events")}>
            Find Events
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booked On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.event.title}</TableCell>
                  <TableCell>
                    {format(new Date(booking.event.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{booking.event.time}</TableCell>
                  <TableCell>{booking.event.location}</TableCell>
                  <TableCell>{booking.quantity}</TableCell>
                  <TableCell className="capitalize">
                    {booking.status.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 
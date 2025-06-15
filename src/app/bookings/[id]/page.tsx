"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { Button } from "@/components/ui/button";

interface BookingDetail {
  id: string;
  status: string;
  quantity: number;
  createdAt: string;
  event: {
    title: string;
    date: string;
    time?: string;
    location: string;
    price: number;
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
  };
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) fetchBooking();
    // eslint-disable-next-line
  }, [bookingId]);

  async function fetchBooking() {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) throw new Error("Failed to fetch booking");
      const data = await res.json();
      setBooking(data);
    } catch (e) {
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found.</div>;

  return (
    <div className="container mx-auto py-10 max-w-xl">
      <Button variant="ghost" onClick={() => router.push("/bookings")}>{"<- Back to My Bookings"}</Button>
      <h1 className="text-2xl font-bold mb-4 mt-4">Booking Details</h1>
      <div className="rounded-md border p-6 space-y-4 bg-card">
        <div>
          <span className="font-medium">Event:</span> {booking.event.title}
        </div>
        <div>
          <span className="font-medium">Quantity:</span> {booking.quantity} tickets
        </div>
        <div>
          <span className="font-medium">Total Amount:</span> ${(booking.event.price * booking.quantity).toFixed(2)}
        </div>
        <div>
          <span className="font-medium">Date:</span> {format(new Date(booking.event.date), "MMM dd, yyyy")}
        </div>
        {booking.event.time && (
          <div>
            <span className="font-medium">Time:</span> {booking.event.time}
          </div>
        )}
        <div>
          <span className="font-medium">Location:</span> {booking.event.location}
        </div>
        <div>
          <span className="font-medium">Status:</span> <span className="capitalize">{booking.status.toLowerCase()}</span>
        </div>
        <div>
          <span className="font-medium">Booked On:</span> {format(new Date(booking.createdAt), "MMM dd, yyyy")}
        </div>
        {booking.status === "PENDING" && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Complete Your Payment</h2>
            <PaymentForm
              bookingId={booking.id}
              amount={booking.event.price}
              quantity={booking.quantity}
              eventTitle={booking.event.title}
            />
          </div>
        )}
        {booking.status === "PAID" && booking.payment && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
            <div>
              <span className="font-medium">Amount:</span> ${booking.payment.amount.toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Method:</span> {booking.payment.paymentMethod}
            </div>
            <div>
              <span className="font-medium">Paid On:</span> {format(new Date(booking.payment.createdAt), "MMM dd, yyyy")}
            </div>
            <div className="text-green-600 font-semibold mt-2">Payment Completed</div>
          </div>
        )}
      </div>
    </div>
  );
} 
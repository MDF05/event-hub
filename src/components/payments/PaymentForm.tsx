"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  quantity: number;
  eventTitle: string;
}

export function PaymentForm({ bookingId, amount, quantity, eventTitle }: PaymentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const totalAmount = amount * quantity;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          amount: totalAmount,
          eventTitle,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const data = await response.json();
      toast.success("Payment successful!");
      router.push(`/bookings/${bookingId}`);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          type="text"
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="text"
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="text"
            placeholder="123"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name on Card</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
      </Button>
    </form>
  );
} 
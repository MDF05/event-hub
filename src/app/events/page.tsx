

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { prisma } from '@/lib/prisma';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { EventCard } from '@/components/EventCard';

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
}

export const dynamic = 'force-dynamic';

interface EventsPageProps {
  searchParams: {
    search?: string;
    category?: string;
    date?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const where: any = {
    isPublished: true,
  };

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
      { location: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  if (searchParams.category) {
    where.categoryId = searchParams.category;
  }

  if (searchParams.date) {
    const searchDate = new Date(searchParams.date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    where.date = {
      gte: searchDate,
      lt: nextDay,
    };
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) where.price.gte = parseFloat(searchParams.minPrice);
    if (searchParams.maxPrice) where.price.lte = parseFloat(searchParams.maxPrice);
  }

  let orderBy: any = {};
  switch (searchParams.sortBy) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'popularity':
      orderBy = { views: 'desc' };
      break;
    default:
      orderBy = { date: 'asc' };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy,
    include: {
      category: true,
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      
      <SearchAndFilter categories={categories} />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No events found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
} 
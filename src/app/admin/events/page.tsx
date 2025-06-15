'use server';

import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Pencil, Trash2, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { revalidatePath } from 'next/cache';
import { handleTogglePublish, handleDeleteEvent } from './actions';
import { id } from 'date-fns/locale';

interface SearchParams {
  search?: string;
  status?: string;
  category?: string;
}

interface EventWithDetails {
  id: string;
  title: string;
  date: Date;
  location: string;
  price: number;
  capacity: number;
  isPublished: boolean;
  category: {
    name: string;
  };
  _count: {
    bookings: number;
  };
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const where: any = {};
  
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
      { location: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  if (searchParams.status) {
    where.isPublished = searchParams.status === 'published';
  }

  if (searchParams.category) {
    where.categoryId = searchParams.category;
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      category: true,
      _count: {
        select: {
          bookings: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  }) as unknown as EventWithDetails[];

  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage your events and their details
          </p>
        </div>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link href="/admin/events/create" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <span>Create New Event</span>
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8"
            defaultValue={searchParams.search}
            name="search"
          />
        </div>
        <Select defaultValue={searchParams.status} name="status">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue={searchParams.category} name="category">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" type="submit">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.category?.name || 'N/A'}</TableCell>
                <TableCell>{format(new Date(event.date), 'PPP', { locale: id })}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>Rp {event.price.toLocaleString()}</TableCell>
                <TableCell>{event.capacity}</TableCell>
                <TableCell>{event._count?.bookings ?? 0}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    event.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.isPublished ? 'Published' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <form action={handleTogglePublish}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <input type="hidden" name="currentStatus" value={event.isPublished.toString()} />
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {event.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the event
                            and all associated bookings.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <form action={handleDeleteEvent}>
                            <input type="hidden" name="eventId" value={event.id} />
                            <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 
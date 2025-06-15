import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Calendar,
  Ticket,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EventWithCategory {
  id: string;
  title: string;
  date: Date;
  location: string;
  category: {
    name: string;
  };
}

export default async function AdminDashboard() {
  const [
    totalUsers,
    totalEvents,
    totalBookings,
    totalRevenue,
    recentBookings,
    upcomingEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: {
        status: 'PAID' as const,
      },
      _sum: {
        quantity: true,
      },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        event: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.event.findMany({
      take: 5,
      where: {
        date: {
          gte: new Date(),
        },
        isPublished: true,
      } as any,
      orderBy: {
        date: 'asc',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      } as any,
    }),
  ]);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Total Events',
      value: totalEvents,
      icon: Calendar,
      description: 'Created events',
    },
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Ticket,
      description: 'Event bookings',
    },
    {
      title: 'Total Revenue',
      value: `Rp ${(totalRevenue._sum?.quantity || 0).toLocaleString()}`,
      icon: TrendingUp,
      description: 'From paid bookings',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your event booking system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.user?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.event?.title || 'N/A'}</TableCell>
                    <TableCell className="capitalize">{booking.status?.toLowerCase() || 'N/A'}</TableCell>
                    <TableCell>{format(new Date(booking.createdAt), 'MMM dd, yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(upcomingEvents as unknown as EventWithCategory[]).map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title || 'N/A'}</TableCell>
                    <TableCell>{event.category?.name || 'N/A'}</TableCell>
                    <TableCell>{format(new Date(event.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{event.location || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Music',
        description: 'Music concerts and performances',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        description: 'Sports events and tournaments',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Technology',
        description: 'Tech conferences and workshops',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Food & Drink',
        description: 'Food festivals and culinary events',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Arts & Culture',
        description: 'Art exhibitions and cultural events',
      },
    }),
  ]);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: Role.USER,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    },
  });

  // Create events
  const events = await Promise.all([
    // Music Events
    prisma.event.create({
      data: {
        title: 'Summer Music Festival 2024',
        description: 'A three-day music festival featuring top artists from around the world. Enjoy live performances, food vendors, and amazing atmosphere.',
        date: new Date('2024-07-15T10:00:00Z'),
        location: 'Central Park, New York',
        categoryId: categories[0].id,
        price: 150.00,
        capacity: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
        isPublished: true,
        tags: ['music', 'festival', 'summer'],
        organizerId: admin.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Jazz Night',
        description: 'An intimate evening of jazz music featuring local and international jazz artists.',
        date: new Date('2024-06-20T19:00:00Z'),
        location: 'Blue Note Jazz Club, New York',
        categoryId: categories[0].id,
        price: 75.00,
        capacity: 200,
        imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
        isPublished: true,
        tags: ['jazz', 'music', 'night'],
        organizerId: admin.id,
      },
    }),

    // Sports Events
    prisma.event.create({
      data: {
        title: 'City Marathon 2024',
        description: 'Annual city marathon with different categories for all skill levels. Join thousands of runners in this exciting event.',
        date: new Date('2024-09-10T06:00:00Z'),
        location: 'City Center, New York',
        categoryId: categories[1].id,
        price: 50.00,
        capacity: 10000,
        imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5',
        isPublished: true,
        tags: ['marathon', 'running', 'sports'],
        organizerId: admin.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Basketball Tournament',
        description: '3v3 basketball tournament for amateur teams. Great prizes and fun atmosphere guaranteed.',
        date: new Date('2024-08-05T09:00:00Z'),
        location: 'Sports Complex, New York',
        categoryId: categories[1].id,
        price: 100.00,
        capacity: 500,
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109acd27b',
        isPublished: true,
        tags: ['basketball', 'tournament', 'sports'],
        organizerId: admin.id,
      },
    }),

    // Technology Events
    prisma.event.create({
      data: {
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring the latest innovations, workshops, and networking opportunities.',
        date: new Date('2024-10-15T08:00:00Z'),
        location: 'Convention Center, New York',
        categoryId: categories[2].id,
        price: 299.00,
        capacity: 2000,
        imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
        isPublished: true,
        tags: ['technology', 'conference', 'networking'],
        organizerId: admin.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Web Development Workshop',
        description: 'Hands-on workshop covering modern web development techniques and best practices.',
        date: new Date('2024-07-25T10:00:00Z'),
        location: 'Tech Hub, New York',
        categoryId: categories[2].id,
        price: 150.00,
        capacity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        isPublished: true,
        tags: ['workshop', 'web development', 'coding'],
        organizerId: admin.id,
      },
    }),

    // Food & Drink Events
    prisma.event.create({
      data: {
        title: 'Food Festival 2024',
        description: 'Annual food festival featuring local restaurants, food trucks, and cooking demonstrations.',
        date: new Date('2024-08-20T11:00:00Z'),
        location: 'Waterfront Park, New York',
        categoryId: categories[3].id,
        price: 25.00,
        capacity: 3000,
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
        isPublished: true,
        tags: ['food', 'festival', 'culinary'],
        organizerId: admin.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Wine Tasting Evening',
        description: 'An evening of wine tasting featuring selections from around the world, paired with gourmet appetizers.',
        date: new Date('2024-09-05T18:00:00Z'),
        location: 'Grand Hotel, New York',
        categoryId: categories[3].id,
        price: 85.00,
        capacity: 150,
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
        isPublished: true,
        tags: ['wine', 'tasting', 'culinary'],
        organizerId: admin.id,
      },
    }),

    // Arts & Culture Events
    prisma.event.create({
      data: {
        title: 'Modern Art Exhibition',
        description: 'Exhibition featuring contemporary artists and their latest works.',
        date: new Date('2024-07-01T10:00:00Z'),
        location: 'Modern Art Museum, New York',
        categoryId: categories[4].id,
        price: 20.00,
        capacity: 1000,
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
        isPublished: true,
        tags: ['art', 'exhibition', 'culture'],
        organizerId: admin.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Theater Performance',
        description: 'Special theater performance of a classic play with modern interpretation.',
        date: new Date('2024-08-15T19:30:00Z'),
        location: 'City Theater, New York',
        categoryId: categories[4].id,
        price: 65.00,
        capacity: 500,
        imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
        isPublished: true,
        tags: ['theater', 'performance', 'culture'],
        organizerId: admin.id,
      },
    }),
  ]);

  // Create some bookings
  await Promise.all([
    prisma.booking.create({
      data: {
        userId: user.id,
        eventId: events[0].id,
        quantity: 2,
        status: 'PENDING',
      },
    }),
    prisma.booking.create({
      data: {
        userId: user.id,
        eventId: events[2].id,
        quantity: 1,
        status: 'PAID',
      },
    }),
  ]);

  // Create some reviews
  await Promise.all([
    prisma.review.create({
      data: {
        userId: user.id,
        eventId: events[0].id,
        rating: 5,
        comment: 'Amazing event! The atmosphere was incredible.',
      },
    }),
    prisma.review.create({
      data: {
        userId: user.id,
        eventId: events[2].id,
        rating: 4,
        comment: 'Great organization and fun experience.',
      },
    }),
  ]);

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
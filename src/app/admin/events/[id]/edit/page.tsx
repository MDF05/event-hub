import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditEventForm from './EditEventForm';

interface EditEventPageProps {
  params: { id: string };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!event) return notFound();

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return <EditEventForm event={event} categories={categories} />;
} 
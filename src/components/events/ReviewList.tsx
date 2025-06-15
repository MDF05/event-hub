import { useEffect, useState } from 'react';

interface ReviewListProps {
  eventId: string;
}

export function ReviewList({ eventId }: ReviewListProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews?eventId=${eventId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <div>Loading reviews...</div>;
  if (!reviews.length) return <div className="text-muted-foreground">No reviews yet.</div>;

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center gap-2 mb-1">
            {review.user?.image && (
              <img src={review.user.image} alt={review.user.name} className="w-8 h-8 rounded-full" />
            )}
            <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
            <span className="ml-2 text-yellow-500">{'★'.repeat(review.rating)}</span>
          </div>
          {review.comment && <p className="text-muted-foreground text-sm">{review.comment}</p>}
          <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
} 
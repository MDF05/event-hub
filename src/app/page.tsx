import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";

export default function Home() {
  

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Discover Amazing Events
        </h1>
        <p className="max-w-[700px] text-muted-foreground sm:text-xl">
          Find and book tickets for the best events in your area. From concerts
          to conferences, we've got you covered.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/events">Browse Events</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Featured Events</h2>
          <Button asChild variant="ghost">
            <Link href="/events">View All</Link>
          </Button>
        </div>
        <FeaturedEvents />
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Popular Categories
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/events?category=${category.slug}`}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:bg-accent"
            >
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    name: "Music",
    slug: "music",
    description: "Concerts, festivals, and live performances",
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Games, tournaments, and competitions",
  },
  {
    name: "Arts & Theater",
    slug: "arts-theater",
    description: "Shows, exhibitions, and performances",
  },
  {
    name: "Business",
    slug: "business",
    description: "Conferences, workshops, and networking",
  },
  {
    name: "Anime",
    slug: "anime",
    description: "Meet And Great, Cosplayer, and Festival ",
  },
];

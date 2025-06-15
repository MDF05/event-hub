'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Slider } from '@/components/ui/slider';

interface Category {
  id: string;
  name: string;
}

interface SearchAndFilterProps {
  categories: Category[];
}

export function SearchAndFilter({ categories }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 1000000,
  ]);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'date');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    if (date) params.set('date', date.toISOString());
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 1000000) params.set('maxPrice', priceRange[1].toString());
    if (sortBy !== 'date') params.set('sortBy', sortBy);

    router.push(`/events?${params.toString()}`);
  }, [search, category, date, priceRange, sortBy, router]);

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DatePicker
          date={date}
          onSelect={setDate}
          placeholder="Select date"
        />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price Range</label>
        <Slider
          min={0}
          max={1000000}
          step={10000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Rp {priceRange[0].toLocaleString()}</span>
          <span>Rp {priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setSearch('');
          setCategory('');
          setDate(undefined);
          setPriceRange([0, 1000000]);
          setSortBy('date');
        }}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
} 
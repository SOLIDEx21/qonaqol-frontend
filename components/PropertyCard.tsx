import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { Heart, Star } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Fallback image handling
  const imageUrl = property.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

  return (
    <Link href={`/properties/${property.id}`} className="group cursor-pointer block">
      <div className="flex flex-col gap-3">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-200">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {/* Heart Icon */}
          <button className="absolute top-3 right-3 text-white/80 hover:text-white hover:scale-110 transition z-10">
            <Heart fill="rgba(0,0,0,0.4)" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 truncate pr-4 text-base">{property.location}</h3>
            <div className="flex items-center gap-1 text-sm shrink-0 mt-0.5">
              <Star size={14} className="fill-gray-900" />
              <span>4.9</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm truncate mt-0.5">{property.title}</p>
          <div className="mt-2 flex items-center gap-1 text-base">
            <span className="font-semibold text-gray-900">₺{property.pricePerNight}</span>
            <span className="text-gray-500 text-sm">gece</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

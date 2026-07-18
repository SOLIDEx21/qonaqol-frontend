'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { Heart, Star, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

// Fallback image pool for demo variety
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
];

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { wishlist, toggleWishlist } = useStore();
  const [imgIndex, setImgIndex] = useState(0);
  const [isWishAnimating, setIsWishAnimating] = useState(false);

  const isWishlisted = wishlist.includes(property.id);

  // Build image array — use property images if available, else fallback pool
  const images: string[] = (property.images && property.images.length > 0)
    ? property.images
    : [
        property.imageUrl || FALLBACK_IMAGES[property.id % FALLBACK_IMAGES.length],
        FALLBACK_IMAGES[(property.id + 1) % FALLBACK_IMAGES.length],
        FALLBACK_IMAGES[(property.id + 2) % FALLBACK_IMAGES.length],
      ];

  function prevImg(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex(i => (i === 0 ? images.length - 1 : i - 1));
  }

  function nextImg(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex(i => (i === images.length - 1 ? 0 : i + 1));
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsWishAnimating(true);
    toggleWishlist(property.id);
    setTimeout(() => setIsWishAnimating(false), 400);
  }

  const rating = property.rating ?? (4.5 + (property.id % 5) * 0.1).toFixed(1);
  const reviewCount = property.reviewCount ?? (10 + (property.id * 7) % 90);
  const isSuperhost = property.isSuperhost ?? (property.id % 3 === 0);

  return (
    <Link href={`/properties/${property.id}`} className="group cursor-pointer block">
      <div className="flex flex-col gap-3">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200">
          {/* Images */}
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`${property.name} - ${i + 1}`}
              fill
              className={`object-cover transition-all duration-500 ease-in-out ${
                i === imgIndex ? 'opacity-100 scale-105 group-hover:scale-110' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={i === 0}
            />
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

          {/* Superhost Badge */}
          {isSuperhost && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              <Award size={11} className="text-rose-500" />
              Super ev sahibi
            </div>
          )}

          {/* Wishlist Heart */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:scale-110 transition-transform duration-200"
          >
            <Heart
              size={22}
              strokeWidth={2}
              className={`transition-all duration-300 drop-shadow-sm ${
                isWishAnimating ? 'scale-125' : 'scale-100'
              }`}
              fill={isWishlisted ? '#f43f5e' : 'rgba(0,0,0,0.35)'}
              stroke={isWishlisted ? '#f43f5e' : 'white'}
            />
          </button>

          {/* Carousel Nav — only show on hover when multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIndex(i); }}
                    className={`rounded-full transition-all duration-200 ${
                      i === imgIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 truncate pr-4 text-base">{property.city}</h3>
            <div className="flex items-center gap-1 text-sm shrink-0 mt-0.5">
              <Star size={13} className="fill-gray-900 text-gray-900" />
              <span className="font-medium">{rating}</span>
              <span className="text-gray-400 text-xs">({reviewCount})</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm truncate">{property.name}</p>
          <p className="text-gray-400 text-sm">
            {property.address || property.city}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <span className="font-semibold text-gray-900">₼{property.dailyPrice || 0}</span>
            <span className="text-gray-500 text-sm">gecə</span>
          </div>
        </div>
      </div>
    </Link>
  );
}


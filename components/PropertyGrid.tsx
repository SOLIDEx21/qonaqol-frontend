'use client';

import { useQuery } from '@tanstack/react-query';
import { getProperties } from '@/lib/api';
import PropertyCard from './PropertyCard';
import { Property } from '@/types';
import Loading from '@/app/loading';
import { useStore } from '@/store/useStore';

export default function PropertyGrid() {
  const { searchQuery, selectedCategory } = useStore();

  const { data: properties, isLoading, isError, error } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 font-medium">Mülkler yüklenirken bir hata oluştu.</p>
        <p className="text-gray-500 text-sm mt-2">Lütfen backend servisinin çalıştığından emin olun.</p>
      </div>
    );
  }

  // Handle empty state or fallback data
  const data = properties && properties.length > 0 ? properties : getMockProperties();

  // Simple client-side filtering based on Zustand store
  const filteredData = data.filter((prop) => {
    const matchesSearch = prop.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prop.title.toLowerCase().includes(searchQuery.toLowerCase());
    // For demo purposes, we randomly assign a category logic, 
    // or just assume all match if a category is selected since we don't have category in Property DTO
    return matchesSearch; 
  });

  if (filteredData.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-900 font-semibold text-xl">Eşleşen sonuç bulunamadı</p>
        <p className="text-gray-500 mt-2">Arama kriterlerinizi değiştirmeyi deneyin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
        {filteredData.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

function getMockProperties(): Property[] {
  return [
    {
      id: 1,
      title: "Modern Sea View Villa",
      description: "A beautiful villa.",
      location: "Antalya, Turkey",
      pricePerNight: 2500,
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Cozy Mountain Cabin",
      description: "Perfect for winter.",
      location: "Bursa, Turkey",
      pricePerNight: 1200,
      imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Luxury City Apartment",
      description: "Heart of the city.",
      location: "Istanbul, Turkey",
      pricePerNight: 3000,
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      title: "Beachfront Bungalow",
      description: "Step right onto the sand.",
      location: "Bodrum, Turkey",
      pricePerNight: 4500,
      imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800",
    },
  ];
}

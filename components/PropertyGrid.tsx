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
        <p className="text-red-500 font-medium">Elanlar yüklənərkən xəta baş verdi.</p>
        <p className="text-gray-500 text-sm mt-2">Zəhmət olmasa backend servisinin işlədiyindən əmin olun.</p>
      </div>
    );
  }

  // Handle empty state
  const data = properties || [];

  // Simple client-side filtering based on Zustand store
  const filteredData = data.filter((prop) => {
    const loc = prop.city || prop.address || '';
    const name = prop.name || '';
    const matchesSearch = loc.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          name.toLowerCase().includes(searchQuery.toLowerCase());
    // For demo purposes, we randomly assign a category logic, 
    // or just assume all match if a category is selected since we don't have category in Property DTO
    return matchesSearch; 
  });

  if (filteredData.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-900 font-semibold text-xl">Heç bir nəticə tapılmadı</p>
        <p className="text-gray-500 mt-2">Axtarış kriteriyalarınızı dəyişdirməyi sınayın.</p>
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



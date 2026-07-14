'use client';

import { useStore } from '@/store/useStore';
import { Palmtree, Waves, Mountain, Flame, Castle, Sailboat, Building, Coffee } from 'lucide-react';

const CATEGORIES = [
  { label: 'Sahil', icon: Waves },
  { label: 'Adalar', icon: Palmtree },
  { label: 'Dağ evleri', icon: Mountain },
  { label: 'Trend', icon: Flame },
  { label: 'Şatolar', icon: Castle },
  { label: 'Tekneler', icon: Sailboat },
  { label: 'Şehir', icon: Building },
  { label: 'Bed & Breakfast', icon: Coffee },
];

export default function Categories() {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center space-x-8 overflow-x-auto hide-scrollbar pb-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          const Icon = cat.icon;

          return (
            <div
              key={cat.label}
              onClick={() => setSelectedCategory(isSelected ? null : cat.label)}
              className={`flex flex-col items-center gap-2 cursor-pointer transition min-w-max pb-2 border-b-2 ${
                isSelected
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Icon size={24} strokeWidth={isSelected ? 2 : 1.5} />
              <span className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                {cat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

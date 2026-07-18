import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  rooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
}

export interface GuestState {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

const initialFilters: FilterState = {
  minPrice: 0,
  maxPrice: 5000,
  rooms: 0,
  beds: 0,
  bathrooms: 0,
  amenities: [],
};

const initialGuests: GuestState = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
};

interface StoreState {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Category
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  // Dates
  checkIn: string | null;
  checkOut: string | null;
  setCheckIn: (date: string | null) => void;
  setCheckOut: (date: string | null) => void;
  // Guests
  guests: GuestState;
  setGuests: (guests: Partial<GuestState>) => void;
  resetGuests: () => void;
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  // Wishlist
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  // Locale
  locale: 'az' | 'en' | 'ru';
  setLocale: (locale: 'az' | 'en' | 'ru') => void;
  currency: 'AZN' | 'USD' | 'EUR';
  setCurrency: (currency: 'AZN' | 'USD' | 'EUR') => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      // Category
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      // Dates
      checkIn: null,
      checkOut: null,
      setCheckIn: (date) => set({ checkIn: date }),
      setCheckOut: (date) => set({ checkOut: date }),
      // Guests
      guests: initialGuests,
      setGuests: (g) => set((state) => ({ guests: { ...state.guests, ...g } })),
      resetGuests: () => set({ guests: initialGuests }),
      // User
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      // Filters
      filters: initialFilters,
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: initialFilters }),
      // Wishlist
      wishlist: [],
      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((w) => w !== id)
            : [...state.wishlist, id],
        })),
      // Locale
      locale: 'az',
      setLocale: (locale) => set({ locale }),
      currency: 'AZN',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'qonaqol-storage',
    }
  )
);

export interface Property {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  ownerId?: number;
  propertyType?: string;
  dailyPrice?: number;
  roomLayout?: string;
  // Frontend only
  imageUrl?: string;
  images?: string[];
  amenities?: string[];
  // Reviews & trust
  rating?: number;
  reviewCount?: number;
  isSuperhost?: boolean;
}

export interface Room {
  id: number;
  propertyId: number;
  roomType: string;
  capacity: number;
  price?: number;
  pricePerNight?: number;
}

export interface ReservationRequest {
  propertyId: number;
  roomId?: number;
  userId?: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}

export interface Reservation {
  id: number;
  propertyId: number;
  roomId?: number;
  guestId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export interface User {
  id: number;
  fullName: string;
  email: string;
}

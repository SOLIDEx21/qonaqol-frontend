export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrl?: string;
}

export interface Room {
  id: number;
  propertyId: number;
  roomType: string;
  capacity: number;
  price: number;
}

export interface ReservationRequest {
  propertyId: number;
  roomId?: number;
  guestId?: number;
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
  firstName: string;
  lastName: string;
  email: string;
}

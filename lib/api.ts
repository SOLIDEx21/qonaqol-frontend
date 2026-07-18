import axios from 'axios';
import { Property, Room, ReservationRequest, User } from '@/types';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, add interceptors here later to inject JWT tokens
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Properties
export const getProperties = async (): Promise<Property[]> => {
  const response = await api.get<Property[]>('/properties');
  return response.data;
};

export const getPropertyById = async (id: number): Promise<Property> => {
  const response = await api.get<Property>(`/properties/${id}`);
  return response.data;
};

export const createProperty = async (data: any): Promise<any> => {
  const response = await api.post('/properties', data);
  return response.data;
};

export const updateProperty = async (id: number, data: any): Promise<any> => {
  const response = await api.put(`/properties/${id}`, data);
  return response.data;
};

export const deleteProperty = async (id: number): Promise<void> => {
  await api.delete(`/properties/${id}`);
};

// Rooms
export const getRoomsByPropertyId = async (propertyId: number): Promise<Room[]> => {
  const response = await api.get<Room[]>(`/properties/${propertyId}/rooms`);
  return response.data;
};

export const createRoom = async (data: any): Promise<any> => {
  const response = await api.post('/rooms', data);
  return response.data;
};

// Reservations
export const createReservation = async (data: ReservationRequest): Promise<any> => {
  const response = await api.post('/reservations', data);
  return response.data;
};

export const getReservationsByUserId = async (userId: number): Promise<any[]> => {
  const response = await api.get(`/reservations/user/${userId}`);
  return response.data;
};

// Auth
export const login = async (credentials: any) => {
  const response = await api.post('/users/login', null, { params: { email: credentials.email, password: credentials.password } });
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export default api;

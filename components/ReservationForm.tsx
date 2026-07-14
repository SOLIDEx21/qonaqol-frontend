'use client';

import { useState } from 'react';
import { createReservation } from '@/lib/api';
import { Property, Room } from '@/lib/api';

interface ReservationFormProps {
  property: Property;
  rooms: Room[];
}

export default function ReservationForm({ property, rooms }: ReservationFormProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<number | ''>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await createReservation({
        propertyId: property.id,
        roomId: selectedRoomId ? Number(selectedRoomId) : undefined,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        guestId: 1, // Mock user ID for now
      });
      setStatus('success');
    } catch (error) {
      console.error('Reservation failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl sticky top-28">
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-2xl font-bold">₺{property.pricePerNight}</span>
        <span className="text-gray-500">gece</span>
      </div>

      <form onSubmit={handleReserve} className="flex flex-col gap-4">
        <div className="flex flex-col rounded-xl border border-gray-400 overflow-hidden">
          <div className="flex border-b border-gray-400">
            <div className="flex-1 p-3 border-r border-gray-400">
              <label className="block text-[10px] font-bold uppercase mb-1">Giriş</label>
              <input 
                type="date" 
                required
                className="w-full text-sm outline-none" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="flex-1 p-3">
              <label className="block text-[10px] font-bold uppercase mb-1">Çıkış</label>
              <input 
                type="date" 
                required
                className="w-full text-sm outline-none" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="p-3">
            <label className="block text-[10px] font-bold uppercase mb-1">Misafirler</label>
            <select 
              className="w-full text-sm outline-none bg-transparent"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} misafir</option>
              ))}
            </select>
          </div>
        </div>

        {rooms && rooms.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Oda Seçimi</label>
            <select
              className="w-full p-3 border border-gray-400 rounded-xl text-sm"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(Number(e.target.value))}
            >
              <option value="">Oda seçin (İsteğe bağlı)</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.roomType} - ₺{room.price}/gece
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3.5 mt-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition duration-200"
        >
          {status === 'loading' ? 'İşleniyor...' : 'Rezerve edin'}
        </button>
      </form>

      {status === 'success' && (
        <p className="mt-4 text-green-600 text-sm text-center font-medium">Rezervasyon başarıyla oluşturuldu!</p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-red-600 text-sm text-center font-medium">Bir hata oluştu. Lütfen tekrar deneyin.</p>
      )}

      <div className="text-center text-gray-500 text-sm mt-4">
        Henüz sizden ücret alınmayacaktır
      </div>
    </div>
  );
}

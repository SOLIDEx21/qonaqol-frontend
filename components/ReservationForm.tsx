'use client';

import { useState, useMemo } from 'react';
import { createReservation } from '@/lib/api';
import { Property, Room } from '@/types';
import { useStore } from '@/store/useStore';
import { Star, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface ReservationFormProps {
  property: Property;
  rooms: Room[];
}

const SERVICE_FEE_RATE = 0.12;
const CLEANING_FEE = 50;
const TAX_RATE = 0.1;

function nightsBetween(ci: string, co: string): number {
  if (!ci || !co) return 0;
  const diff = new Date(co).getTime() - new Date(ci).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

export default function ReservationForm({ property, rooms }: ReservationFormProps) {
  const { user, currency } = useStore();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<number | ''>(rooms && rooms.length > 0 ? rooms[0].id : '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);

  const currSymbol = currency === 'AZN' ? 'â‚¼' : currency === 'USD' ? '$' : 'â‚¬';
  const nightlyPrice = property.dailyPrice || 0;
  const nights = nightsBetween(checkIn, checkOut);

  const pricing = useMemo(() => {
    if (nights === 0) return null;
    const roomTotal = nightlyPrice * nights;
    const serviceFee = Math.round(roomTotal * SERVICE_FEE_RATE);
    const tax = Math.round((roomTotal + serviceFee + CLEANING_FEE) * TAX_RATE);
    const total = roomTotal + serviceFee + CLEANING_FEE + tax;
    return { roomTotal, serviceFee, tax, total };
  }, [nights, nightlyPrice]);

  const rating = property.rating ?? 4.9;
  const reviewCount = property.reviewCount ?? 42;

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('ZÉ™hmÉ™t olmasa É™vvÉ™lcÉ™ hesabÄ±nÄ±za daxil olun.');
      return;
    }
    if (!selectedRoomId && rooms.length > 0) {
      alert('ZÉ™hmÉ™t olmasa otaq seÃ§in.');
      return;
    }
    setStatus('loading');
    try {
      await createReservation({
        propertyId: property.id,
        roomId: selectedRoomId ? Number(selectedRoomId) : undefined,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        userId: user.id,
      });
      setStatus('success');
    } catch (error) {
      console.error('Reservation failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl sticky top-28">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{currSymbol}{nightlyPrice}</span>
          <span className="text-gray-500 text-sm">/ gecÉ™</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star size={13} className="fill-gray-900" />
          <span className="font-semibold">{rating}</span>
          <span className="text-gray-400">({reviewCount} rÉ™y)</span>
        </div>
      </div>

      <form onSubmit={handleReserve} className="flex flex-col gap-4">
        {/* Date + Guest Block */}
        <div className="flex flex-col rounded-xl border border-gray-400 overflow-hidden">
          <div className="flex border-b border-gray-400">
            <div className="flex-1 p-3 border-r border-gray-400">
              <label className="block text-[10px] font-bold uppercase mb-1 text-gray-500">GiriÅŸ</label>
              <input
                type="date"
                required
                className="w-full text-sm outline-none"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="flex-1 p-3">
              <label className="block text-[10px] font-bold uppercase mb-1 text-gray-500">Ã‡Ä±xÄ±ÅŸ</label>
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
            <label className="block text-[10px] font-bold uppercase mb-1 text-gray-500">Qonaqlar</label>
            <select
              className="w-full text-sm outline-none bg-transparent"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} qonaq</option>
              ))}
            </select>
          </div>
        </div>

        {/* Room selection for hotels */}
        {property.propertyType === 'Otel' && rooms && rooms.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Otaq seÃ§imi</label>
            <select
              className="w-full p-3 border border-gray-400 rounded-xl text-sm"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(Number(e.target.value))}
            >
              <option value="">Otaq seÃ§in (isteÄŸe baÄŸlÄ±)</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.roomType} â€” {currSymbol}{room.price || room.pricePerNight}/gecÉ™
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Price Breakdown */}
        {pricing && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setPriceBreakdownOpen(!priceBreakdownOpen)}
              className="w-full flex items-center justify-between p-3 text-sm font-semibold hover:bg-gray-50 transition"
            >
              <span>QiymÉ™t tÉ™fÉ™rrÃ¼atÄ± ({nights} gecÉ™)</span>
              {priceBreakdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {priceBreakdownOpen && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 underline decoration-dashed cursor-help">
                    {currSymbol}{nightlyPrice} Ã— {nights} gecÉ™
                  </span>
                  <span>{currSymbol}{pricing.roomTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 underline decoration-dashed cursor-help">TÉ™mizlik haqqÄ±</span>
                  <span>{currSymbol}{CLEANING_FEE}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 underline decoration-dashed cursor-help">QonaqOl xidmÉ™t haqqÄ±</span>
                  <span>{currSymbol}{pricing.serviceFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 underline decoration-dashed cursor-help">VergilÉ™r (%10)</span>
                  <span>{currSymbol}{pricing.tax}</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between font-bold text-base">
                  <span>CÉ™mi</span>
                  <span>{currSymbol}{pricing.total}</span>
                </div>
              </div>
            )}

            {!priceBreakdownOpen && (
              <div className="flex justify-between items-center px-4 pb-3 text-sm font-bold border-t border-gray-100 pt-3">
                <span>CÉ™mi</span>
                <span>{currSymbol}{pricing.total}</span>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-60"
        >
          {status === 'loading' ? 'Emal olunur...' : nights > 0 ? `Rezerv et â€” ${currSymbol}${pricing?.total}` : 'Rezerv et'}
        </button>
      </form>

      {status === 'success' && (
        <p className="mt-4 text-green-600 text-sm text-center font-medium">✅ Rezervasiya uğurla yaradıldı!</p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-red-600 text-sm text-center font-medium">❌ Xəta baş verdi. Yenidən cəhd edin.</p>
      )}

      {/* Trust indicators */}
      <div className="flex flex-col items-center gap-2 mt-4 text-center text-gray-500 text-xs">
        <div className="flex items-center gap-1.5">
          <Shield size={13} className="text-gray-400" />
          <span>Rezervasiya etdikdən sonra ödəniş tutulmur</span>
        </div>
      </div>
    </div>
  );
}

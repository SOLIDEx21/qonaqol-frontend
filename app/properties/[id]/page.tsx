import Image from 'next/image';
import { getPropertyById, getRoomsByPropertyId } from '@/lib/api';
import { Property, Room } from '@/types';
import ReservationForm from '@/components/ReservationForm';

// Notice params in Next 15+ is a Promise, so we must await it:
export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  
  let property: Property | null = null;
  let rooms: Room[] = [];

  try {
    property = await getPropertyById(id);
    rooms = await getRoomsByPropertyId(id);
  } catch (error) {
    console.error("Failed to fetch property details:", error);
  }

  if (!property) {
    return <div className="text-center py-20 text-xl font-bold text-gray-500">Elan tapılmadı.</div>;
  }

  const displayProperty: Property = property;
  const displayRooms: Room[] = rooms || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">{displayProperty.name}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-700">
          <span className="flex items-center gap-1 underline">★ 4.95</span>
          <span className="underline">{displayProperty.city}, {displayProperty.address}</span>
          <span>•</span>
          <span className="bg-gray-100 px-2 py-1 rounded-md">{displayProperty.propertyType}</span>
          {displayProperty.roomLayout && (
            <>
              <span>•</span>
              <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-md">{displayProperty.roomLayout}</span>
            </>
          )}
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[3/1] md:aspect-[4/1] lg:aspect-[21/9] rounded-2xl overflow-hidden mb-8">
        <Image 
          src={displayProperty.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'} 
          alt={displayProperty.name} 
          fill 
          className="object-cover" 
        />
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column - Details */}
        <div className="flex-1">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">Bu ev haqqında</h2>
            <p className="text-gray-600 leading-relaxed">{displayProperty.description}</p>
          </div>

          {displayProperty.amenities && displayProperty.amenities.length > 0 && (
            <div className="pb-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Üstünlüklər</h2>
              <div className="grid grid-cols-2 gap-4">
                {displayProperty.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl">✨</span> {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {displayProperty.propertyType === 'Otel' && displayRooms && displayRooms.length > 0 && (
            <div className="pb-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Otaqlar və Seçimlər</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayRooms.map(room => (
                  <div key={room.id} className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-lg">{room.roomType}</h3>
                    <p className="text-gray-500 text-sm mt-1">Tutum: {room.capacity} Nəfər</p>
                    <p className="text-gray-900 font-medium mt-2">₼{room.pricePerNight || room.price || 0} / gecə</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Reservation Form */}
        <div className="w-full lg:w-[400px]">
          <ReservationForm property={displayProperty} rooms={displayRooms} />
        </div>
      </div>
    </div>
  );
}

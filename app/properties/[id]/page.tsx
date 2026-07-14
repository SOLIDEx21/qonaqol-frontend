import Image from 'next/image';
import { getPropertyById, getRoomsByPropertyId, Property, Room } from '@/lib/api';
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

  // Fallback mock data if backend is not available
  if (!property) {
    property = {
      id: id,
      title: "Harika Manzaralı Lüks Villa",
      description: "Doğa ile iç içe, deniz manzaralı, özel havuzlu ve geniş bahçeli mükemmel bir tatil deneyimi sunan lüks villa. Sevdiklerinizle huzurlu bir tatil için ihtiyacınız olan her şey burada mevcut.",
      location: "Antalya, Turkey",
      pricePerNight: 2500,
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
    };
    rooms = [
      { id: 1, propertyId: id, roomType: "Master Bedroom", capacity: 2, price: 1500 },
      { id: 2, propertyId: id, roomType: "Guest Room", capacity: 2, price: 1000 }
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">{property.title}</h1>
        <div className="flex items-center gap-4 text-sm font-medium underline">
          <span className="flex items-center gap-1">★ 4.95</span>
          <span>{property.location}</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[3/1] md:aspect-[4/1] lg:aspect-[21/9] rounded-2xl overflow-hidden mb-8">
        <Image 
          src={property.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'} 
          alt={property.title} 
          fill 
          className="object-cover" 
        />
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column - Details */}
        <div className="flex-1">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">Bu ev hakkında</h2>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          <div className="pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Ne sunuyor?</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-xl">🌊</span> Deniz manzarası
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-xl">📶</span> Hızlı Wi-Fi
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-xl">🚗</span> Ücretsiz otopark
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-xl">❄️</span> Klima
              </div>
            </div>
          </div>
          
          {rooms && rooms.length > 0 && (
            <div className="pb-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Odalar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rooms.map(room => (
                  <div key={room.id} className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-lg">{room.roomType}</h3>
                    <p className="text-gray-500 text-sm mt-1">Kapasite: {room.capacity} Kişi</p>
                    <p className="text-gray-900 font-medium mt-2">₺{room.price} / gece</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Reservation Form */}
        <div className="w-full lg:w-[400px]">
          <ReservationForm property={property} rooms={rooms} />
        </div>
      </div>
    </div>
  );
}

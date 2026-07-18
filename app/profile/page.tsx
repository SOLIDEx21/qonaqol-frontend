'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { User, Lock, Phone, Mail, MapPin, Calendar, Home, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getReservationsByUserId, getProperties, deleteProperty } from '@/lib/api';

export default function ProfilePage() {
  const { user } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!mounted || !user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-200px)]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-6 px-4">Profilim</h2>
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => setActiveTab('account')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'account' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User size={20} />
                Hesab Məlumatları
              </button>
              <button 
                onClick={() => setActiveTab('reservations')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'reservations' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Calendar size={20} />
                Son Rezervasiyalar
              </button>
              <button 
                onClick={() => setActiveTab('listings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'listings' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Home size={20} />
                Mənim Elanlarım
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            {activeTab === 'account' && <AccountSettings user={user} />}
            {activeTab === 'reservations' && <ReservationsList user={user} router={router} />}
            {activeTab === 'listings' && <MyListings user={user} router={router} />}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Subcomponents ---

function AccountSettings({ user }: { user: any }) {
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Məlumatlar yadda saxlanıldı!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Şifrə uğurla dəyişdirildi!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Şəxsi Məlumatlar</h3>
        <p className="text-gray-500 text-sm">Hesabınızın əsas məlumatlarını buradan yeniləyə bilərsiniz.</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Ad və Soyad</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="text" defaultValue={user.fullName} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email ünvanı</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="email" defaultValue={user.email} disabled className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Telefon nömrəsi</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="tel" placeholder="+994 (__) ___-__-__" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-rose-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-600 transition shadow-sm hover:shadow-md">
          Məlumatları Yadda Saxla
        </button>
      </form>

      <div className="h-px bg-gray-200 my-8"></div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Şifrəni Yenilə</h3>
        <p className="text-gray-500 text-sm mb-6">Hesabınızın təhlükəsizliyi üçün şifrənizi mütəmadi olaraq yeniləyin.</p>
        
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Cari şifrə</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input required type="password" autoComplete="current-password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Yeni şifrə</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input required type="password" autoComplete="new-password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Yeni şifrənin təkrarı</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input required type="password" autoComplete="new-password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition" />
            </div>
          </div>
          <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-sm mt-4">
            Şifrəni Dəyişdir
          </button>
        </form>
      </div>
    </div>
  );
}

function ReservationsList({ user, router }: { user: any, router: any }) {
  
  const { data: properties } = useQuery({ queryKey: ['properties'], queryFn: getProperties });
  const { data: reservations, isLoading } = useQuery({ 
    queryKey: ['reservations', user.id], 
    queryFn: () => getReservationsByUserId(user.id) 
  });

  if (isLoading) {
    return <div className="py-10 text-center text-gray-500">Yüklənir...</div>;
  }

  const hasReservations = reservations && reservations.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Son Rezervasiyalar</h3>
        <p className="text-gray-500 text-sm">Səyahət tarixçənizi və qarşıdan gələn planlarınızı buradan izləyə bilərsiniz.</p>
      </div>

      <div className="space-y-4 mt-6">
        {hasReservations ? (
          reservations.map((res: any) => {
            const property = properties?.find(p => p.id === res.propertyId);
            const propertyName = property?.name || `Əmlak #${res.propertyId}`;
            const propertyImg = property?.imageUrl || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200";
            const location = property?.city ? `${property.city}, ${property.address || ''}` : "Bilinmir";

            return (
              <div key={res.id} className="flex flex-col sm:flex-row border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition bg-white">
                <div className="w-full sm:w-48 h-32 sm:h-auto">
                  <img src={propertyImg} alt={propertyName} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-gray-900">{propertyName}</h4>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {res.status === 'CONFIRMED' ? 'Təsdiqlənib' : res.status === 'PENDING' ? 'Gözləmədədir' : 'Ləğv edilib'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin size={16} className="mr-1" />
                      {location}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Calendar size={16} className="mr-1" />
                      {new Date(res.checkInDate).toLocaleDateString()} - {new Date(res.checkOutDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                    <div className="text-rose-600 font-bold text-sm">
                      Qonaq Sayı: {res.numberOfGuests}
                    </div>
                    <button className="text-sm font-semibold text-gray-600 hover:text-gray-900 underline underline-offset-4">Detallar</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">Hələ heç bir rezervasiyanız yoxdur</h4>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Yeni yerlər kəşf edin və səyahətinizə başlayın.</p>
            <button onClick={() => router.push('/')} className="bg-rose-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-600 transition shadow-sm">
              Rezerv et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MyListings({ user, router }: { user: any, router: any }) {
  
  const { data: properties, isLoading, refetch } = useQuery({ queryKey: ['properties'], queryFn: getProperties });

  const handleDelete = async (id: number) => {
    if (confirm("Bu elanı silmək istədiyinizə əminsiniz?")) {
      try {
        await deleteProperty(id);
        alert("Elan uğurla silindi.");
        refetch();
      } catch (e) {
        alert("Silinərkən xəta baş verdi.");
      }
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center text-gray-500">Yüklənir...</div>;
  }

  // Filter properties where ownerId matches user.id
  const myListings = properties?.filter(p => p.ownerId === user.id) || [];
  const hasListings = myListings.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Mənim Elanlarım</h3>
          <p className="text-gray-500 text-sm">QonaqOl-da yerləşdirdiyiniz evləri və qazancınızı idarə edin.</p>
        </div>
        <button onClick={() => router.push('/add-listing')} className="bg-rose-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-rose-600 transition shadow-sm flex items-center gap-2">
          <Home size={18} />
          Yeni Elan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {hasListings ? (
          myListings.map(listing => {
            const img = listing.imageUrl || "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800";
            return (
              <div key={listing.id} className="border border-gray-200 rounded-2xl p-0 hover:shadow-md transition bg-white relative overflow-hidden flex flex-col">
                <div className="h-40 w-full relative">
                  <img src={img} alt={listing.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    <CheckCircle size={14} />
                    Aktiv
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-lg text-gray-900 line-clamp-1">{listing.name}</h4>
                  <div className="flex items-center text-gray-500 text-sm mt-1 mb-4">
                    <MapPin size={16} className="mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{listing.city}, {listing.address}</span>
                  </div>
                  
                  <div className="mt-auto flex gap-3">
                    <button onClick={() => router.push(`/edit-listing/${listing.id}`)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-50 transition text-sm">Redaktə et</button>
                    <button onClick={() => handleDelete(listing.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl font-bold hover:bg-red-100 transition text-sm border border-red-100">Elanı Qaldır</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <Home size={48} className="mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">Hələ heç bir elanınız yoxdur</h4>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Evinizi platformaya əlavə edərək pul qazanmağa başlayın.</p>
            <button onClick={() => router.push('/add-listing')} className="bg-rose-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-600 transition shadow-sm">
              İlk Elanınızı Əlavə Edin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

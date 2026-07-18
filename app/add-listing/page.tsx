'use client';

import { useState, useRef } from 'react';
import { Home, MapPin, DollarSign, Image as ImageIcon, CheckCircle, Info, Loader2, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { createProperty, createRoom } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-400">Xəritə yüklənir...</div> });

export default function AddListingPage() {
  const { user } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Mənzil');
  const [roomLayout, setRoomLayout] = useState('1+1');
  const [capacity, setCapacity] = useState('2');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('50');
  const [images, setImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const AVAILABLE_AMENITIES = ['Dəniz mənzərəsi', 'Sürətli Wi-Fi', 'Pulsuz parkinq', 'Kondisioner', 'Hovuz', 'Mətbəx', 'Televizor', 'Camaşırxana'];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock upload functionality
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, upload to S3/Cloudinary. Here we mock it by adding a high quality unsplash image
    if (e.target.files && e.target.files.length > 0) {
      // Simulate adding a random beautiful house image
      const mockImages = [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
      ];
      const newImg = mockImages[Math.floor(Math.random() * mockImages.length)];
      setImages([...images, newImg]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Zəhmət olmasa əvvəlcə hesabınıza daxil olun.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create property
      const propertyData = {
        name: name,
        propertyType: propertyType,
        address: address,
        city: city,
        description: description,
        imageUrl: images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        dailyPrice: parseFloat(price) || 0,
        roomLayout: roomLayout,
        amenities: selectedAmenities,
        ownerId: user.id
      };
      const property = await createProperty(propertyData);

      // 2. Create room for capacity and price
      const roomData = {
        propertyId: property.id,
        roomType: 'Entire Property',
        capacity: parseInt(capacity) || 2,
        pricePerNight: parseFloat(price) || 50
      };
      await createRoom(roomData);

      alert('Təbriklər! Elanınız uğurla yayımlandı!');
      router.push('/profile');
    } catch (error) {
      console.error(error);
      alert('Elan yayımlanarkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-200px)]">

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Evinizi QonaqOl-a əlavə edin</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Milyonlarla səyahətçiyə evinizi təqdim edin və əlavə gəlir qazanmağa başlayın.
          Sadəcə bir neçə addımla elanınızı aktivləşdirin.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Progress Bar */}
        <div className="flex border-b border-gray-200">
          <div className={`flex-1 py-4 text-center font-semibold text-sm ${step >= 1 ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-gray-400'}`}>
            1. Əsas Məlumatlar
          </div>
          <div className={`flex-1 py-4 text-center font-semibold text-sm ${step >= 2 ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-gray-400'}`}>
            2. Mövqe
          </div>
          <div className={`flex-1 py-4 text-center font-semibold text-sm ${step >= 3 ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-gray-400'}`}>
            3. Şəkillər və Qiymət
          </div>
        </div>

        <div className="p-8">

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Home className="text-rose-500" />
                Eviniz haqqında məlumat verin
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Elan Başlığı</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Məsələn: Dəniz kənarında lüks villa"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ətraflı Təsvir</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Qonaqlarınızı nə gözləyir? Evin xüsusiyyətlərindən bəhs edin..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Əmlak Tipi</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition appearance-none bg-white"
                  >
                    <option>Mənzil</option>
                    <option>Villa</option>
                    <option>Kottec</option>
                    <option>Otel</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Otaq sayı (Layout)</label>
                  <select
                    value={roomLayout}
                    onChange={(e) => setRoomLayout(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition appearance-none bg-white"
                  >
                    <option>1+0</option>
                    <option>1+1</option>
                    <option>2+1</option>
                    <option>3+1</option>
                    <option>4+1</option>
                    <option>5+1</option>
                    <option>Digər</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Qonaq tutumu</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Neçə nəfər qala bilər?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Üstünlüklər</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVAILABLE_AMENITIES.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        className="rounded text-rose-500 focus:ring-rose-500 w-4 h-4"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  onClick={() => {
                    if (!name || !description) return alert("Zəhmət olmasa başlanğıc məlumatları doldurun.");
                    setStep(2);
                  }}
                  className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition shadow-sm"
                >
                  Növbəti Addım
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-rose-500" />
                Evinizin yerləşdiyi mövqe
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Ölkə</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-white">
                    <option>Azərbaycan</option>
                    <option>Türkiyə</option>
                    <option>Gürcüstan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Şəhər</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Məsələn: Bakı"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Dəqiq Ünvan</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Küçə adı, bina, mənzil..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                />
              </div>

              <div className="bg-gray-100 rounded-xl h-64 border border-gray-200 mt-6 relative z-0">
                <MapPicker />
              </div>

              <div className="pt-6 flex justify-between">
                <button onClick={() => setStep(1)} className="px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition text-gray-700">
                  Geri
                </button>
                <button
                  onClick={() => {
                    if (!city || !address) return alert("Zəhmət olmasa şəhər və ünvanı doldurun.");
                    setStep(3);
                  }}
                  className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition shadow-sm"
                >
                  Növbəti Addım
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon className="text-rose-500" />
                Şəkillər və Qiymətləndirmə
              </h2>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700">Evin Şəkilləri</label>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={img} className="w-full h-full object-cover" alt="upload" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center"
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div className="bg-rose-100 p-4 rounded-full text-rose-500 mb-4">
                    <ImageIcon size={32} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Şəkilləri bura sürükləyin və ya seçin</h4>
                  <p className="text-sm text-gray-500 mb-4">Maksimum 10 şəkil, hər biri ən çox 5MB</p>
                  <button className="border border-gray-300 bg-white shadow-sm px-6 py-2 rounded-lg font-medium text-sm hover:bg-gray-50">
                    Kompüterdən Seç
                  </button>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Bir gecəlik qiymət</label>
                <div className="relative max-w-sm">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition font-semibold text-lg"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium">AZN</span>
                </div>
                <div className="flex items-start gap-2 mt-2 bg-blue-50 p-3 rounded-lg text-blue-700 text-sm">
                  <Info size={16} className="mt-0.5 flex-shrink-0" />
                  <p>Məsləhət görülən qiymət aralığı: 50 - 150 AZN. Qiymətə QonaqOl-un 5% xidmət haqqı daxildir.</p>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <button onClick={() => setStep(2)} disabled={isSubmitting} className="px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition text-gray-700 disabled:opacity-50">
                  Geri
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-sm flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                  {isSubmitting ? 'Yayımlanır...' : 'Elanı Yayımla'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

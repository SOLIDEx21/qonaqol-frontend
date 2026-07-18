'use client';

import { useState, useEffect, useRef } from 'react';
import { Home, MapPin, DollarSign, Image as ImageIcon, CheckCircle, Info, Loader2, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getRoomsByPropertyId, updateProperty, createRoom } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { use } from 'react';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-400">Xəritə yüklənir...</div> });

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const propertyId = parseInt(resolvedParams.id);
  const { user } = useStore();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Mənzil');
  const [capacity, setCapacity] = useState('2');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('50');
  const [images, setImages] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch existing data
  const { data: propertyData, isLoading: isPropertyLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const api = axios.create({ baseURL: 'http://localhost:8080/api' });
      const res = await api.get(`/properties/${propertyId}`);
      return res.data;
    },
    enabled: !!propertyId
  });

  const { data: roomsData } = useQuery({
    queryKey: ['rooms', propertyId],
    queryFn: () => getRoomsByPropertyId(propertyId),
    enabled: !!propertyId
  });

  useEffect(() => {
    if (propertyData) {
      setName(propertyData.name || '');
      setDescription(propertyData.description || '');
      setPropertyType(propertyData.propertyType || 'Mənzil');
      setCity(propertyData.city || '');
      setAddress(propertyData.address || '');
    }
  }, [propertyData]);

  useEffect(() => {
    if (roomsData && roomsData.length > 0) {
      setCapacity(roomsData[0].capacity?.toString() || '2');
      setPrice(roomsData[0].pricePerNight?.toString() || '50');
    }
  }, [roomsData]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const mockImages = [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
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
      const updatedData = {
        name,
        description,
        propertyType,
        city,
        address,
        ownerId: user.id
      };
      await updateProperty(propertyId, updatedData);
      
      // Note: Full room updating requires a Room update endpoint, 
      // but we update the property data for now.
      
      alert('Təbriklər! Elanınız uğurla yeniləndi!');
      router.push('/profile');
    } catch (error) {
      console.error(error);
      alert('Yenilənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPropertyLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-rose-500" size={48} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-200px)]">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Elanınızı Redaktə Edin</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Evinizin məlumatlarını yeniləyərək qonaqlar üçün ən doğru məlumatı təmin edin.
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-white"
                  >
                    <option>Mənzil</option>
                    <option>Villa</option>
                    <option>Kottec</option>
                    <option>Otel Otağı</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Qonaq tutumu</label>
                  <input 
                    type="number" 
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Neçə nəfər qala bilər?" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-gray-50" 
                    disabled
                  />
                  <p className="text-xs text-gray-500">Tutum hələlik dəyişdirilə bilməz.</p>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={() => {
                    if(!name || !description) return alert("Zəhmət olmasa başlanğıc məlumatları doldurun.");
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
                    if(!city || !address) return alert("Zəhmət olmasa şəhər və ünvanı doldurun.");
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
                <DollarSign className="text-rose-500" /> 
                Şəkillər və Qiymət
              </h2>
              
              <div className="space-y-2 mb-6">
                <label className="text-sm font-semibold text-gray-700">Gecəlik Qiymət (AZN)</label>
                <div className="relative max-w-xs">
                  <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="50" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-gray-50" 
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500">Qiymət hələlik dəyişdirilə bilməz.</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700">Evin Şəkilləri</label>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={img} alt="Property" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <div 
                    onClick={handleUploadClick}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-rose-500 hover:border-rose-500 hover:bg-rose-50 cursor-pointer transition"
                  >
                    <ImageIcon size={28} />
                    <span className="text-sm font-medium">Şəkil Əlavə et</span>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start mt-6">
                <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-blue-800">
                  Məlumatlarınızı düzgün daxil etdiyinizə əmin olun. Eviniz haqqında ətraflı və doğru məlumatlar daha çox müştəri cəlb etməyə kömək edəcək.
                </p>
              </div>

              <div className="pt-6 flex justify-between">
                <button onClick={() => setStep(2)} className="px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition text-gray-700">
                  Geri
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-md flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  {isSubmitting ? 'Yadda Saxlanılır...' : 'Dəyişiklikləri Yadda Saxla'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

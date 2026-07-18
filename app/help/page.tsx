'use client';

import { useState } from 'react';
import { HelpCircle, MessageSquare, PhoneCall, ChevronDown, ChevronUp, Send } from 'lucide-react';

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "QonaqOl-da necə ev kiralaya bilərəm?",
      a: "Ana səhifədə axtarış bölməsinə getmək istədiyiniz yeri və tarixləri daxil edin. Sizə uyğun nəticələrdən birini seçərək, 'Rezerv et' düyməsini sıxın və ödəniş addımlarını tamamlayın."
    },
    {
      q: "Öz evimi necə elan edə bilərəm?",
      a: "Yuxarı sağ küncdəki 'Elan əlavə et' düyməsinə klikləyin. Üç sadə addımda evinizin məlumatlarını, mövqeyini və şəkillərini daxil edərək elanınızı yayımlaya bilərsiniz."
    },
    {
      q: "Ödəniş üsulları nələrdir?",
      a: "Biz bütün əsas kredit və debet kartlarını (Visa, MasterCard), eləcə də bəzi elektron pul kisələrini qəbul edirik. Ödənişlər tamamilə təhlükəsiz və şifrəli şəkildə həyata keçirilir."
    },
    {
      q: "Rezervasiyanı necə ləğv edə bilərəm?",
      a: "Profilinizdəki 'Son Rezervasiyalar' bölməsinə daxil olun. İlgili rezervasiyanın üzərinə klikləyərək detallar səhifəsindən 'Ləğv et' seçimini edə bilərsiniz. Ləğv qaydaları ev sahibinin siyasətindən asılı olaraq dəyişə bilər."
    },
    {
      q: "QonaqOlCover nədir?",
      a: "QonaqOlCover həm ev sahiblərini, həm də qonaqları gözlənilməz hallardan (zərər, ləğv problemləri) qoruyan pulsuz qoruma proqramıdır. Hər bir rezervasiya ilə avtomatik aktivləşir."
    }
  ];

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-200px)]">
      
      {/* Header */}
      <div className="text-center mb-16 bg-rose-50 rounded-3xl p-10 sm:p-16 border border-rose-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Sizə necə kömək edə bilərik?</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Tez-tez verilən sualları nəzərdən keçirin və ya birbaşa dəstək komandamızla əlaqə saxlayın.
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Sualınızı bura yazın (məs: ödəniş qaydaları)..." 
            className="w-full px-6 py-4 rounded-full border-2 border-transparent focus:border-rose-300 shadow-md outline-none text-lg"
          />
          <button className="absolute right-2 top-2 bg-rose-500 text-white p-2.5 rounded-full hover:bg-rose-600 transition">
            <HelpCircle size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* FAQs */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="text-rose-500" />
            Tez-tez verilən suallar
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${openFaq === index ? 'border-rose-500 bg-white shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <button 
                  className="w-full px-6 py-5 flex justify-between items-center text-left font-semibold text-gray-900"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg">{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="text-rose-500" /> : <ChevronDown className="text-gray-400" />}
                </button>
                
                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 animate-in slide-in-from-top-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="text-rose-500" />
              Bizə Yazın
            </h2>
            <p className="text-gray-500 text-sm mb-6">Sualınıza cavab tapmadınız? Aşağıdakı form vasitəsilə bizə göndərin, komandamız qısa zamanda sizinlə əlaqə saxlayacaq.</p>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Adınız</label>
                <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="Ad və Soyad" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Emailiniz</label>
                <input type="email" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="email@numune.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Mövzu</label>
                <select className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none text-sm bg-white">
                  <option>Rezervasiya problemi</option>
                  <option>Ödəniş</option>
                  <option>Ev sahibliyi</option>
                  <option>Digər</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Mesajınız</label>
                <textarea rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none text-sm resize-none" placeholder="Problemi ətraflı izah edin..."></textarea>
              </div>
              
              <button type="button" className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-sm flex justify-center items-center gap-2 mt-2">
                <Send size={18} />
                Mesajı Göndər
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Birbaşa Əlaqə</h3>
              <div className="flex items-center gap-3 text-gray-600 mb-2">
                <div className="bg-rose-100 p-2 rounded-full text-rose-600"><PhoneCall size={16} /></div>
                <span className="font-medium text-sm">+994 12 345 67 89</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-rose-100 p-2 rounded-full text-rose-600"><MessageSquare size={16} /></div>
                <span className="font-medium text-sm">destek@qonaqol.az</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

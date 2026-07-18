import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-900 border-t border-gray-200 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-200 pb-8">
          
          {/* Column 1 */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-lg">Dəstək</h3>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Yardım Mərkəzi</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">QonaqOlCover</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Ayrı-seçkiliyə qarşı mübarizə</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Əlilliyi olanlar üçün dəstək</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Ləğv etmə seçimləri</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-lg">Ev Sahibliyi</h3>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Elan əlavə et</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Ev sahibləri üçün QonaqOlCover</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Ev sahibliyi resursları</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">İcma forumu</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Məsuliyyətli ev sahibliyi</Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-lg">QonaqOl</h3>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Xəbərlər otağı</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Yeni xüsusiyyətlər</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Karyera</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Sərmayəçilər</Link>
          </div>
          
          {/* Column 4 - Brand & Localization */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 cursor-pointer hover:underline text-sm font-medium">
              <Globe size={18} />
              <span>Azərbaycanca (AZ)</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:underline text-sm font-medium">
              <span>₼ AZN</span>
            </div>
            
            <div className="flex gap-4 mt-4">
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </Link>
            </div>
          </div>
          
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center md:justify-start">
            <span>© 2026 QonaqOl, Inc.</span>
            <span className="hidden md:inline">·</span>
            <Link href="#" className="hover:underline">Məxfilik</Link>
            <span className="hidden md:inline">·</span>
            <Link href="#" className="hover:underline">Şərtlər</Link>
            <span className="hidden md:inline">·</span>
            <Link href="#" className="hover:underline">Sayt xəritəsi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

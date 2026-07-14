'use client';

import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useStore();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-rose-500 font-bold text-2xl tracking-tighter">
              QonaqOl
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 justify-center px-8">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 px-2 py-2 w-full max-w-md">
              <input 
                type="text"
                placeholder="Hər hansı bir yer"
                className="flex-1 font-medium text-sm px-4 outline-none bg-transparent text-gray-900 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="bg-rose-500 rounded-full p-2 text-white cursor-pointer hover:bg-rose-600 transition">
                <Search size={16} strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full cursor-pointer transition">
              Evinizi QonaqOl-a köçürün
            </div>
            
            <div className="flex items-center space-x-2 border border-gray-300 p-2 rounded-full hover:shadow-md transition cursor-pointer bg-white group relative">
              <Menu size={20} className="text-gray-500 ml-1" />
              <div className="bg-gray-500 text-white rounded-full p-1 overflow-hidden">
                <User size={20} />
              </div>
              
              {/* Dropdown Menu (Hover for simplicity in this demo) */}
              <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 flex flex-col">
                <Link href="/login" className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">Giriş yapın</Link>
                <Link href="/register" className="px-4 py-3 hover:bg-gray-50 text-sm">Kaydolun</Link>
                <div className="h-px bg-gray-200 my-1"></div>
                <div className="px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer">Evinizi QonaqOl-a köçürün</div>
                <div className="px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer">Yardım Merkezi</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
}

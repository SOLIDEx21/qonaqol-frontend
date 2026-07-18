'use client';

import { useState } from 'react';
import Link from 'next/link';
import { register } from '@/lib/api';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register({ fullName, email, password });
      setStatus('success');
      // In a real app, redirect to login
      window.location.href = '/login';
    } catch (error: any) {
      console.log('Registration error:', error?.response?.data || error.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aramıza katılın</h1>
          <p className="text-gray-500">QonaqOl-da yeni bir hesab yaradın</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Adınız" 
                required
                className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Soyadınız" 
                required
                className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <input 
              type="email" 
              placeholder="E-posta" 
              required
              className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Şifre" 
              required
              autoComplete="new-password"
              className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 mt-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition duration-200"
          >
            {status === 'loading' ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        {status === 'error' && (
          <p className="mt-4 text-red-600 text-sm text-center">Kayıt başarısız. Lütfen tekrar deneyin.</p>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
          Zaten bir hesabınız var mı?{' '}
          <Link href="/login" className="font-semibold text-rose-600 hover:underline">
            Giriş Yapın
          </Link>
        </div>
      </div>
    </div>
  );
}

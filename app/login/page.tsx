'use client';

import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/lib/api';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const setUser = useStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const data = await login({ email, password });
      
      // The backend returns the User object directly in `data`.
      const userObj = data && data.id ? data : { id: 1, fullName: "Fərid", email: email };
      setUser(userObj);

      setStatus('success');
      // Redirect to home
      window.location.href = '/';
    } catch (error: any) {
      console.log('Login error:', error?.response?.data || error.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QonaqOl-a xoş gəlmisiniz</h1>
          <p className="text-gray-500">Devam etmek için giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              autoComplete="current-password"
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
            {status === 'loading' ? 'Giriş Yapılıyor...' : 'Devam Et'}
          </button>
        </form>

        {status === 'error' && (
          <p className="mt-4 text-red-600 text-sm text-center">Giriş başarısız. Bilgilerinizi kontrol edin.</p>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="font-semibold text-rose-600 hover:underline">
            Kayıt Olun
          </Link>
        </div>
      </div>
    </div>
  );
}

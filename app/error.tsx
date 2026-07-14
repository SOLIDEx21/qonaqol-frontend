'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Bir şeyler ters gitti!</h2>
        <p className="text-gray-500 mb-8">Sayfayı yüklerken beklenmedik bir hata oluştu. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.</p>
        <button
          onClick={() => reset()}
          className="bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}

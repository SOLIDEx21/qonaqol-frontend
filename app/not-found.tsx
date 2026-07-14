import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">404</h2>
        <h3 className="text-xl font-semibold mb-2">Sayfa bulunamadı</h3>
        <p className="text-gray-500 mb-8">Aradığınız sayfa silinmiş veya adresi değiştirilmiş olabilir.</p>
        <Link
          href="/"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}

import Categories from '@/components/Categories';
import PropertyGrid from '@/components/PropertyGrid';

export default function Home() {
  return (
    <>
      <div className="sticky top-20 z-40 bg-white border-b border-gray-200">
        <Categories />
      </div>
      <PropertyGrid />
    </>
  );
}

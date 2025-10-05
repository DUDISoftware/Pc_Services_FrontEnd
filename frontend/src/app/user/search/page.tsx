'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Link, Star } from 'lucide-react';
import { searchProducts } from '@/services/search.service';
import { Product } from '@/types/Product';

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get('query')?.toLowerCase() || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await searchProducts(query);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  const filtered = products;
    // query === ''
    //   ? []
    //   : products.filter((p) =>
    //     p.name.toLowerCase().includes(query) ||
    //     p.description?.toLowerCase().includes(query) ||
    //     p.tags?.some((tag) => tag.toLowerCase().includes(query))
    //   );

  

  if (loading) {
    return <p className='text-center py-8'>Đang tải sản phẩm...</p>;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <h1 className='text-xl font-semibold mb-6'>
        Kết quả tìm kiếm:{' '}
        <span className='text-blue-600 font-medium'> `{query}` </span>
      </h1>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filtered.map((item) => (
          <div
            key={item._id}
            className='border border-gray-200 rounded-lg p-3 hover:shadow-md transition'
          >
          <a href={`/user/product/detail/${item.slug}`}>
            <div className='relative w-full h-40 mb-3'>
              <Image
                src={item.images?.[0]?.url || '/images/product.png'}
                alt={item.name}
                fill
                className='object-contain rounded'
              />
            </div>
            <h3 className='text-sm font-medium line-clamp-2'>{item.name}</h3>
            <div className='flex items-center justify-between mt-2'>
              <span className='text-red-500 font-semibold text-sm'>
                {item.price.toLocaleString()}₫
              </span>
              <div className='flex items-center text-xs text-gray-500'>
                <Star className='w-4 h-4 text-yellow-400 mr-1' />
                4.5
              </div>
            </div>
            </a>
          </div>
        ))}

      {filtered.length === 0 && (
        <p className='text-gray-500 text-sm col-span-full'>
          Không tìm thấy sản phẩm phù hợp với từ khóa.
        </p>
      )}
    </div>
    </div >
  );
}

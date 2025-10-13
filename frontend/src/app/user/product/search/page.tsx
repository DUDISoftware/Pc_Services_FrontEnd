'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { searchProducts } from '@/services/search.service';
import { Product } from '@/types/Product';
import Link from 'next/link';

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get('query')?.toLowerCase() || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Phân trang
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await searchProducts(query, itemsPerPage, currentPage);
        setProducts(fetchedProducts.products);
        setTotal(fetchedProducts.total);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, itemsPerPage, currentPage]);

  // Nếu query thay đổi, reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  if (loading) {
    return <p className='text-center py-8'>Đang tải sản phẩm...</p>;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <h1 className='text-xl font-semibold mb-6'>
        Kết quả tìm kiếm:{' '}
        <span className='text-blue-600 font-medium'>`{query}`</span>
      </h1>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.map((item) => (
          <div
            key={item._id}
            className='border border-gray-200 rounded-lg p-3 hover:shadow-md transition'
          >
            <Link href={`/user/product/detail/${item.slug}`}>
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
            </Link>
          </div>
        ))}

        {products.length === 0 && (
          <p className='text-gray-500 text-sm col-span-full'>
            Không tìm thấy sản phẩm phù hợp với từ khóa.
          </p>
        )}
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className='mt-8 flex justify-center items-center gap-2 flex-wrap'>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className='px-3 py-1 border rounded disabled:opacity-50'
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className='px-3 py-1 border rounded disabled:opacity-50'
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

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

  // Reset về trang 1 khi query thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  function getPaginationPages(current: number, total: number): (number | '...')[] {
    const pages: (number | '...')[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);

      if (current > 3) pages.push('...');
      if (current === total) {
        pages.push(total - 2);
      }
      if (current > 2) pages.push(current - 1);
      if (current !== 1 && current !== total) pages.push(current);
      if (current < total - 1) pages.push(current + 1);
      if (current < total - 2) pages.push('...');

      if (total !== 1) pages.push(total);
    }

    return Array.from(new Set(pages)).filter((p) => typeof p === 'number' || p === '...');
  }

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
  <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
    {/* Nút Trước */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className={`px-3 py-1.5 rounded border text-sm ${
        currentPage === 1
          ? 'text-gray-400 border-gray-300 cursor-not-allowed bg-white'
          : 'hover:bg-gray-100 border-gray-300'
      }`}
    >
      Trước
    </button>

    {/* Danh sách trang */}
    {getPaginationPages(currentPage, totalPages).map((page, index) =>
      page === '...' ? (
        <span key={`dots-${index}`} className="px-2 select-none text-gray-500">…</span>
      ) : (
        <button
          key={page}
          onClick={() => setCurrentPage(Number(page))}
          className={`px-3 py-1.5 rounded border text-sm ${
            currentPage === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      )
    )}

    {/* Nút Sau */}
    <button
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
      className={`px-3 py-1.5 rounded border text-sm ${
        currentPage === totalPages
          ? 'text-gray-400 border-gray-300 cursor-not-allowed bg-white'
          : 'hover:bg-gray-100 border-gray-300'
      }`}
    >
      Sau
    </button>
  </div>
)}

    </div>
  );
}

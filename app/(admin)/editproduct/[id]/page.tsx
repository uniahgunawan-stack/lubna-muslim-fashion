'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import FormEditProduct from '@/components/formEditProduct';
import FormUlasan from '@/components/formUlasan';
import { Button } from '@/components/ui/button';
import ActionButtons from '@/components/alert-dialog/ActionButton';
interface ProductImage {
  id: string;
  url: string;
  publicId: string;
}

interface ReviewImage {
  id: string;
  url: string;
  publicId: string;
}

interface Review {
  id: string;
  comment: string;
  rating: number;
  images: ReviewImage[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  images: ProductImage[];
  reviews: Review[];
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchProduct = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        throw new Error('Gagal mengambil data produk.');
      }
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      setIsError(true);
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  },[id] );

  const handleUpdateSuccess = () => {
    toast.success('Produk berhasil diperbarui!');
    router.push('/dasboard'); 
  };

  const handleCancelChanges = () => {
    router.push('/dasboard');
    toast.info('Perubahan dibatalkan.');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Memuat data produk...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <p className="text-red-500 text-lg">Produk tidak ditemukan atau terjadi kesalahan.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
    {/* HEADER */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-6 flex-wrap">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
        Edit Produk: {product.name}
      </h1>
      <ActionButtons 
      onCancelChanges={handleCancelChanges} 
      backUrl="/dasboard" 
        />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormEditProduct
        product={product}
        onUpdateSuccess={handleUpdateSuccess}
      />
      <FormUlasan
        product={product}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  </div>
);

}
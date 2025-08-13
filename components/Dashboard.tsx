'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2,  Home, PlusCircle, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { DeleteConfirmationDialog } from './alert-dialog/deletconfirm';
import Image from 'next/image';
import { Product, Category, ProductImage } from "@/types/product";

export default function ProductsAdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error('Gagal mengambil data produk.');
      }
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus produk.');
      }
      toast.success('Produk berhasil dihapus!');
      fetchProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
      toast.error(errorMessage);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/publish/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mengubah status publikasi.');
      }
      toast.success('Status publikasi berhasil diubah!');
      fetchProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
      toast.error(errorMessage);
    }
  };

  const publishedProducts = products.filter((p) => p.isPublished);
  const unpublishedProducts = products.filter((p) => !p.isPublished);

  const handleBackToHome = () => router.push('/');

  if (isLoading) {
    return <div className="p-8 text-center">Memuat data produk...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  const renderProductList = (productsList: Product[], title: string) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">{title} ({productsList.length})</h3>
      {productsList.length === 0 ? (
        <p>Belum ada produk yang {title.toLowerCase()}.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Gambar</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="w-28">Harga</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="text-right w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-30 h-30 flex-shrink-0">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          priority={true }
                          sizes="150px"
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-nowrap">{product.name}</TableCell>
                  <TableCell className="font-medium text-nowrap">{product.category.name}</TableCell>
                  <TableCell className="text-nowrap">Rp {product.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isPublished}
                      onCheckedChange={() => handleTogglePublish(product.id, product.isPublished)}
                      aria-label="Toggle publish bg-green-600 dark:bg-green-500"
                    />
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-2">
                    <Link href={`/editproduct/${product.id}`} passHref>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteConfirmationDialog
                      trigger={
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                      onConfirm={() => handleDelete(product.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen lg:max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950">
      <header className="mb-6  flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Kelola Produk</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Link href="/products" passHref>
            <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white transition-colors duration-200">
              <ImageIcon className="mr-2 h-4 w-4" /> Tambah Produk
            </Button>
          </Link>
          <Link href="/banners" passHref>
            <Button variant="secondary" className="w-full sm:w-auto">
              <ImageIcon className="mr-2 h-4 w-4" /> Kelola Banner
            </Button>
          </Link>
          <Link href="/category" passHref>
            <Button variant="secondary" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kategori
            </Button>
          </Link>
        </div>
      </header>

      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBackToHome}
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
        >
        <Home className='h-6 w-6'/>  ← Kembali ke Beranda
        </Button>
      </div>

      {renderProductList(publishedProducts, 'Produk Dipublikasikan')}
      {renderProductList(unpublishedProducts, 'Produk Belum Dipublikasikan')}
    </div>
  );
}
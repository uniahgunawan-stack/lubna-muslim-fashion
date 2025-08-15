'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, ShoppingBasket, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  newProductFormSchema,
  NewProductFormType,
  NewProductFormBaseType,
  ProductImageUpload,
} from '@/lib/validation/products';
import { toast } from 'sonner';
import Link from 'next/link';
import { uploadImageToCloudinary } from '@/lib/utils/cloudynary'; // Panggil utilitas yang baru

interface Category {
  id: string;
  name: string;
}

export default function FormProduct() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NewProductFormBaseType>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discountPrice: null,
      categoryId: '',
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data: Category[] = await res.json();
          setCategories(data);
          if (data.length > 0) {
            setValue('categoryId', data[0].id);
          }
        }
      } catch (error) {
        toast.error('Gagal memuat kategori.');
      }
    }
    fetchCategories();
  }, [setValue]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).filter((file) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} bukan gambar.`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} melebihi batas 10MB.`);
          return false;
        }
        return true;
      });
      if (newImages.length === 0) return;
      setImages((prevImages) => [...prevImages, ...newImages]);
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagePreviews((prevPreviews) => {
      const newPreviews = prevPreviews.filter((_, index) => index !== indexToRemove);
      // Revoke URL for the removed image
      URL.revokeObjectURL(prevPreviews[indexToRemove]);
      return newPreviews;
    });
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const onSubmit = async (data: NewProductFormBaseType) => {
    try {
      if (images.length === 0) {
        toast.error('Minimal satu gambar diperlukan.');
        return;
      }

      const imageUrls: ProductImageUpload[] = await Promise.all(
        images.map((file) => uploadImageToCloudinary(file, 'ImageKaira'))
      );
      
      const productData: NewProductFormType = { ...data, images: imageUrls };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan produk.');
      }

      toast.success('Produk berhasil ditambahkan!');
      router.push('/dasboard');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan yang tidak diketahui.');
      }
    }
  };

  return (
    // ... (UI code remains the same)
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Tambah Produk Baru</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Nama Produk</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Gambar Produk</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    src={img}
                    alt={`Preview ${index}`}
                    width={80}
                    height={80}
                    className="object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <label className="w-20 h-20 border-dashed border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500">
                <PlusCircle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
              </label>
            </div>
            {images.length === 0 && <p className="text-red-500 text-sm mt-2">Minimal satu gambar diperlukan.</p>}
          </div>
          <div>
            <Label htmlFor="categoryId">Kategori</Label>
            <select
              id="categoryId"
              {...register('categoryId')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-800"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Harga</Label>
              <Input
                id="price"
                type="number"
                step="1"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="discountPrice">Harga Diskon (Opsional)</Label>
              <Input
                id="discountPrice"
                type="number"
                step="1"
                {...register('discountPrice', { valueAsNumber: true })}
              />
              {errors.discountPrice && <p className="text-red-500 text-sm">{errors.discountPrice.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" rows={5} {...register('description')} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/dasboard')}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-black to-green-500 text-white"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? 'Menyimpan...' : 'Tambah Produk'}
            </Button>
          </div>
        </form>
        <div className="flex text-blue-600 items-center gap-2">
          <ShoppingBasket className="h-6 w-6 " />
          <Link href="/dasboard" className="text-blue-600 dark:text-blue-400 hover:underline">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
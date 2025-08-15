'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Trash2, PlusCircle, Replace } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { uploadImageToCloudinary } from '@/lib/utils/cloudynary'; // Menggunakan utilitas yang terpusat

// Definisikan tipe dan skema validasi
interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  file?: File;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  images: ProductImage[];
}

const formSchema = z.object({
  name: z.string().min(1, 'Nama produk harus diisi.'),
  price: z.number().min(0, 'Harga harus angka positif.'),
  discountPrice: z.number().min(0, 'Harga diskon harus angka positif.').nullable().optional(),
  description: z.string().min(1, 'Deskripsi produk harus diisi.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function FormEditProduct({
  product,
  onUpdateSuccess,
}: {
  product: Product;
  onUpdateSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
    clearErrors,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || undefined,
    },
  });

  const [imagePreviews, setImagePreviews] = useState<ProductImage[]>(product.images);
  const [deletedImagePublicIds, setDeletedImagePublicIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || undefined,
    });
    setImagePreviews(product.images);
    setDeletedImagePublicIds([]);
  }, [product, reset]);
  
  useEffect(() => {
    return () => {
      imagePreviews.forEach(img => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [imagePreviews]);

  const handleImageChange = (index: number, files: FileList | null) => {
    if (files && files[0]) {
      const newImageFile = files[0];
      const newImageUrl = URL.createObjectURL(newImageFile);

      setImagePreviews(prev => {
        const updated = [...prev];
        const oldImage = updated[index];
        
        if (oldImage && oldImage.publicId) {
          setDeletedImagePublicIds(prevIds => [...prevIds, oldImage.publicId]);
        }
        
        if (oldImage && oldImage.url.startsWith('blob:')) {
          URL.revokeObjectURL(oldImage.url);
        }

        updated[index] = {
          id: uuidv4(),
          url: newImageUrl,
          file: newImageFile,
          publicId: '',
        };
        return updated;
      });
    }
  };
  
  const handleAddImageInput = (files: FileList | null) => {
    if (files) {
      const remainingSlots = 7 - imagePreviews.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots);

      if (filesToAdd.length < files.length) {
        toast.warning(`Hanya ${remainingSlots} gambar yang bisa ditambahkan.`);
      }

      const newPreviews = filesToAdd.map(file => ({
        id: uuidv4(),
        url: URL.createObjectURL(file),
        publicId: '',
        file,
      }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImageInput = (index: number) => {
    setImagePreviews(prev => {
      const updated = [...prev];
      const removedImage = updated[index];

      if (removedImage.publicId) {
        setDeletedImagePublicIds(prevIds => [...prevIds, removedImage.publicId]);
      }
      
      if (removedImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(removedImage.url);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleProductUpdate: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    if (imagePreviews.length === 0) {
      setError('root.images', { type: 'manual', message: 'Produk harus memiliki setidaknya satu gambar.' });
      setIsSubmitting(false);
      return;
    }
    clearErrors('root.images');

    try {
      const existingImages = imagePreviews.filter(img => img.publicId);
      const newImageFiles = imagePreviews.filter(img => img.file);

      const newUploadedImages = await Promise.all(
        newImageFiles.map(img => uploadImageToCloudinary(img.file!, 'Imagelubna'))
      );

      const finalImages = [...existingImages, ...newUploadedImages];
      
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          images: finalImages,
          deletedImagePublicIds,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal memperbarui produk.');
      }

      onUpdateSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Detail Produk</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleProductUpdate)} className="space-y-6">
          <div>
            <Label>Gambar Produk</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((img, index) => (
                <div key={img.id} className="relative w-30 h-30">
                  <Image
                    src={img.url}
                    alt={`Gambar Produk ${index}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveImageInput(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <label className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-slate-800 text-white flex items-center justify-center cursor-pointer">
                    <Replace className="h-3 w-3" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(index, e.target.files)}
                    />
                  </label>
                </div>
              ))}
              {imagePreviews.length < 7 && (
                <label className="w-30 h-30 border-dashed border-2 flex items-center justify-center cursor-pointer">
                  <PlusCircle className="h-6 w-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAddImageInput(e.target.files)}
                    multiple
                  />
                </label>
              )}
            </div>
            {errors.root?.images && (
              <p className="text-red-500 text-sm mt-1">{errors.root.images.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Maksimal 7 gambar.</p>
          </div>
          <div>
            <Label htmlFor="name">Nama Produk</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="discountPrice">Harga Diskon (Rp) (Opsional)</Label>
              <Input
                id="discountPrice"
                type="number"
                {...register('discountPrice', { valueAsNumber: true })}
              />
              {errors.discountPrice && <p className="text-red-500 text-sm">{errors.discountPrice.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Deskripsi Produk</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={5}
              placeholder="Masukkan deskripsi produk di sini. Gunakan Enter untuk baris baru."
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <Button
            type="submit"
            className="w-full sm:w-40 cursor-pointer bg-gradient-to-r from-black to-green-400 text-white hover:from-green-500 hover:to-black transition-all duration-300"
            disabled={isSubmitting}>
            {isSubmitting ? 'Memperbarui...' : 'Perbarui Produk'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
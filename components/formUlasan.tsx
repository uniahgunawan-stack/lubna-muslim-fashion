'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Trash2, PlusCircle, Star, Edit } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { uploadImageToCloudinary,  } from '@/lib/utils/cloudynary';

// Definisikan tipe data untuk ulasan
interface ReviewImage {
  id: string;
  url: string;
  publicId: string;
  file?: File;
}

interface Review {
  id: string;
  comment: string;
  rating: number;
  images: ReviewImage[];
}

interface Product {
  id: string;
  reviews: Review[];
}

const reviewSchema = z.object({
  comment: z.string().min(1, 'Ulasan tidak boleh kosong.'),
  rating: z.number().min(1, 'Rating harus antara 1-5.').max(5, 'Rating harus antara 1-5.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function FormUlasan({
  product,
  onUpdateSuccess,
}: {
  product: Product;
  onUpdateSuccess: () => void;
}) {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [newReviewImageFiles, setNewReviewImageFiles] = useState<File[]>([]);
  const [newReviewImagePreviews, setNewReviewImagePreviews] = useState<ReviewImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState<number>(0);

  useEffect(() => {
    return () => {
      newReviewImagePreviews.forEach(img => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [newReviewImagePreviews]);

  const resetReviewState = () => {
    reset();
    setEditingReviewId(null);
    setNewReviewImageFiles([]);
    newReviewImagePreviews.forEach(img => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
    setNewReviewImagePreviews([]);
    setNewReviewRating(0);
  };

  const handleAddReviewImage = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      const previews = newFiles.map(file => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        publicId: '',
        file,
      }));
      setNewReviewImageFiles(prev => [...prev, ...newFiles]);
      setNewReviewImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const handleDeleteReviewImage = (index: number) => {
    setNewReviewImagePreviews(prev => {
      const updated = [...prev];
      const removedImage = updated[index];
      if (removedImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(removedImage.url);
      }
      updated.splice(index, 1);
      return updated;
    });
    setNewReviewImageFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleAddReview: SubmitHandler<ReviewFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const uploadedImages = await Promise.all(
        newReviewImageFiles.map(file => uploadImageToCloudinary(file, 'Imagelubna/reviews'))
      );
      
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images: uploadedImages }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menambahkan ulasan.');
      }
      toast.success('Ulasan berhasil ditambahkan!');
      resetReviewState();
      onUpdateSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setValue('comment', review.comment, { shouldValidate: true });
    setValue('rating', review.rating, { shouldValidate: true });
    setNewReviewRating(review.rating);
    setNewReviewImagePreviews(review.images);
    setNewReviewImageFiles([]);
  };

  const handleUpdateReview: SubmitHandler<ReviewFormValues> = async (data) => {
    if (!editingReviewId) return;
    setIsSubmitting(true);
    try {
      const uploadedImages = await Promise.all(
        newReviewImageFiles.map(file => uploadImageToCloudinary(file, 'ImageKaira/reviews'))
      );
      const finalImages = [...newReviewImagePreviews, ...uploadedImages];
      
      const res = await fetch(`/api/products/${product.id}/reviews/${editingReviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images: finalImages }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal memperbarui ulasan.');
      }
      toast.success('Ulasan berhasil diperbarui!');
      resetReviewState();
      onUpdateSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/products/${product.id}/reviews/${reviewId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus ulasan.');
      }
      toast.success('Ulasan berhasil dihapus!');
      onUpdateSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    }
  };

  const handleDeleteAllReviewImages = async () => {
    if (!editingReviewId) return;
    try {
      const res = await fetch(`/api/reviews/${editingReviewId}/images`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus semua gambar ulasan.');
      }
      toast.success('Semua gambar ulasan berhasil dihapus!');
      setNewReviewImagePreviews([]);
      onUpdateSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Ulasan Produk ({product.reviews.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(editingReviewId ? handleUpdateReview : handleAddReview)} className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold">{editingReviewId ? 'Edit Ulasan' : 'Tambah Ulasan Baru'}</h3>
          <div>
            <Label htmlFor="reviewText">Teks Ulasan</Label>
            <Textarea
              id="reviewText"
              {...register('comment')}
              rows={3}
            />
            {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
          </div>
          <div>
            <Label htmlFor="reviewRating">Rating</Label>
            <Select
              value={newReviewRating.toString()}
              onValueChange={(value) => {
                const numValue = parseInt(value);
                setValue('rating', numValue, { shouldValidate: true });
                setNewReviewRating(numValue);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Pilih Rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Bintang
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
          </div>
          <div>
            <Label>Gambar Ulasan</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {newReviewImagePreviews.map((img, index) => (
                <div key={img.id} className="relative w-30 h-30">
                  <Image
                    src={img.url}
                    alt={`Review ${index}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleDeleteReviewImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {newReviewImagePreviews.length < 5 && (
                <label className="w-30 h-30 border-dashed border-2 flex items-center justify-center cursor-pointer">
                  <PlusCircle className="h-6 w-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleAddReviewImage(e.target.files);
                      e.target.value = '';
                    }}
                    multiple
                  />
                </label>
              )}
            </div>
            {editingReviewId && newReviewImagePreviews.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" size="sm" className="mt-2 w-full sm:w-auto">
                    Hapus Semua Gambar Ulasan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan menghapus semua gambar dari ulasan ini secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllReviewImages}>
                      Hapus Semua
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            {editingReviewId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetReviewState}
                className="w-full sm:w-auto"
              >
                Batal Edit
              </Button>
            )}
            <Button
              type="submit"
              className="w-full cursor-pointer sm:w-auto bg-gradient-to-r from-black to-green-400 text-white hover:from-green-500 hover:to-black transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : editingReviewId ? 'Perbarui Ulasan' : 'Tambah Ulasan'}
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {product.reviews.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Belum ada ulasan untuk produk ini.</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{review.rating} Bintang</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 mb-3 line-clamp-3">{review.comment}</p>
                {review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {review.images.map((img, idx) => ( 
                      <Image
                        key={img.id || idx} // Use a unique key
                        src={img.url}
                        alt={`Review ${idx}`}
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditReview(review)}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                        <Trash2 className="h-4 w-4 mr-1" /> Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini akan menghapus ulasan ini secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )))}
        </div>
      </CardContent>
    </Card>
  );
}
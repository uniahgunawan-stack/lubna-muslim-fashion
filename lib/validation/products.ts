import { z } from "zod";

export const productImageSchema = z.object({
  url: z.string().url("URL gambar tidak valid."),
  publicId: z.string().min(1, "Public ID diperlukan."),
});

export type ProductImageUpload = z.infer<typeof productImageSchema>;

// Skema yang diubah: Hapus validasi 'images'
export const newProductFormSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter."),
  description: z.string().min(10, "Deskripsi produk minimal 10 karakter."),
  price: z.number().int().positive("Harga harus angka positif."),
  discountPrice: z.number().int().positive("Harga diskon harus angka positif.").nullable().optional(),
  categoryId: z.string().cuid("ID kategori tidak valid."),
});

// Tipe form untuk data produk (tanpa gambar)
export type NewProductFormBaseType = z.infer<typeof newProductFormSchema>;

// Tipe form lengkap (untuk server)
export type NewProductFormType = NewProductFormBaseType & {
  images: ProductImageUpload[];
};
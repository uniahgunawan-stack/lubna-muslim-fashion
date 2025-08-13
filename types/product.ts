export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string; // kalau mau include slug juga
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  category: Category;
  isPublished: boolean;
  images: ProductImage[];
}
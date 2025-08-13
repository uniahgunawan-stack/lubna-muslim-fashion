export interface ProductImage {
  url: string;
  publicId: string;
}
 export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice: string;
  category: Category;
  isPublished: boolean;
  rating: number;
  images: ProductImage[];
}
export interface Category {
  id: string;
  name: string;
}
export interface BannerImage {
  url: string;
  publicId: string;
}

export interface Banner {
  id: string;
  description: string;
  bannerImages: BannerImage[];
}
export interface ProductDetailData {
  id: string;
  images: ProductImage[];
  name: string;
  price: number;
  discountPrice?: number | null;
  rating: number;
  description: string;
  category: string;
  reviews: Review[];
  isPublished: boolean;
  createdAt: string;
  favoritedBy: { id: string }[];
}
export interface Review {
  id: string;
  rating: number;
  comment: string;
  images: ReviewImage[];
  productId: string;
}
export interface ReviewImage {
  id: string;
  url: string;
  publicId?: string;
}
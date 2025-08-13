"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
export type ProductImage = Prisma.ProductImageGetPayload<{}>;
export type ReviewImage = Prisma.ReviewImageGetPayload<{}>;
export type Review = Prisma.ReviewGetPayload<{
  include: { images: true };
}>;

export type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    images: true;
    reviews: {
      include: {
        images: true;
      };
    };
    favorites: {
      select: { id: true };
    };
  };
}>;
export type ProductTransformed = Omit<ProductWithDetails, 'createdAt'> & {
  createdAt: string;
  slug:string;
   avgRating: number;
};
export async function getProducts(options?: {
  limit?: number;
  skip?: number;
  orderBy?: 'createdAt' | 'price' | 'name' | 'rating';
  orderDirection?: 'asc' | 'desc';
  search?: string;
  category?: string
}): Promise<ProductTransformed[]> { 
  const { limit, skip, orderBy, orderDirection, search, category } = options || {};

  try {
    const product = await prisma.product.findMany({
      where: {
        isPublished: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
         ...(category && {
                    category: {
                        name: {
                            equals: category,
                            mode: 'insensitive'
                        }
                    }
                })
      },
      include: {
        images: true,
        favorites: {
          select: { id: true },
        },
        reviews: {
          include: { images: true }
        },
      },
      orderBy: {
        [orderBy || 'createdAt']: orderDirection || 'desc',
      },
      take: limit,
      skip: skip,
    });
       const avgRatings = await prisma.review.groupBy({
      by: ['productId'],
      _avg: { rating: true },
    });

    return product.map((product) => {
      const avg = avgRatings.find(r => r.productId === product.id)?._avg.rating || 0;
      return {
        ...product,
        createdAt: product.createdAt.toISOString(),
        avgRating: avg,
      };
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Gagal mengambil data produk.');
  }
}

export async function getProductBySlug({id, slug}: { id?: string; slug?: string }): Promise<ProductTransformed | null> {
 try {
    if (!id && !slug) {
      throw new Error("ID atau slug harus diisi.");
    }
    const whereClause = slug ? { slug } : { id };
    const product = await prisma.product.findUnique({
      where:whereClause,
      include: {
        images: true,
        favorites: {
          select: { id: true },
        },
        reviews: {
          include: { images: true }
        },
      },
  });

    if (!product) {
      return null;
    }

    const avgRatings = await prisma.review.groupBy({
      by: ['productId'],
      _avg: { rating: true },
      where: { productId: product.id },
    });

    const avg = avgRatings[0]?._avg.rating || 0;

    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
      avgRating: avg,
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error('Gagal mengambil produk berdasarkan ID.');
  }
}

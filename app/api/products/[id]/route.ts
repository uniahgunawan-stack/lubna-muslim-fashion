// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import  cloudinary from '@/lib/cloudinary';
import slugify from 'slugify';

interface Context {
  params:Promise< { id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) { 
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id},
      include: {
        images:{
          select:{ id: true, url: true, publicId: true, order: true},
          orderBy: { order: 'asc'}
        } ,
        category: true,
        reviews:{
          include:{
            images:true,
          }
        }
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    console.log('hilang:',id)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Context)  {
  try {
    const { id } =await params;
    const { name, description, price, discountPrice, images, deletedImagePublicIds } = await req.json();

    if (!name || !description || !price) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
    }
    
   const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Hapus gambar lama dari Cloudinary
    if (deletedImagePublicIds && deletedImagePublicIds.length > 0) {
      const deletePromises = deletedImagePublicIds.map((publicId: string) =>
        cloudinary.uploader.destroy(publicId)
      );
      await Promise.allSettled(deletePromises);
    }
    
    // Perbarui produk dan gambar
    const updatedProduct = await prisma.product.update({
  where: { id },
  data: {
    name,
    slug,
    description,
    price,
    discountPrice,
    images: {
      deleteMany: {},
      createMany: {
        
        data: images.map((img: { url: string; publicId: string }, index: number) => ({
          url: img.url,
          publicId: img.publicId,
          order: index, // <-- Tambahkan ini
        })),
      },
    },
  },
  include: {
    images: {
      select: { id: true, url: true, publicId: true, order: true },
      orderBy: { order: 'asc' },
    },
  },
});

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request, { params }: Context) {
  try {
    const { id } = await params;

    const productToDelete = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!productToDelete) {
      return NextResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 });
    }
    const productPublicIds = productToDelete.images
      .filter(image => image.publicId)
      .map(image => image.publicId);
      
    const reviewImagePublicIds = productToDelete.reviews.flatMap(review =>
      review.images
        .filter(image => image.publicId)
        .map(image => image.publicId)
    );

    const allPublicIds = [...productPublicIds, ...reviewImagePublicIds];
    
    // Kirim semua permintaan penghapusan ke Cloudinary secara paralel
    if (allPublicIds.length > 0) {
      const deletePromises = allPublicIds.map(publicId => cloudinary.uploader.destroy(publicId));
      const results = await Promise.allSettled(deletePromises);
      
      results.forEach(result => {
        if (result.status === 'rejected') {
          console.error(`Gagal menghapus beberapa gambar di Cloudinary:`, (result as PromiseRejectedResult).reason);
        }
      });
    }
    await prisma.product.delete({
      where: { id },
    });

    console.log(`Prisma: Produk ${id} dan data terkait berhasil dihapus dari DB.`);
    return NextResponse.json({ message: 'Produk, ulasan, dan semua gambar berhasil dihapus.' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting product and images:', error);
    return NextResponse.json({ error: 'Gagal menghapus produk dan gambar.' }, { status: 500 });
  }
}
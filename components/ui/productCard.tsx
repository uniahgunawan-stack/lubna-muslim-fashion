"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Currency from "./currency";
import { cn } from "@/lib/utils";
import { ProductTransformed } from "@/actions/get-products";
import FavoriteButton from "@/components/ui/FavoritButton";
import { Star } from "lucide-react";

interface ProductCardProps {
    data: ProductTransformed
    isInitialFavorite: boolean;
    userRole: "USER" | "ADMIN" | "GUEST" | undefined;
}

const ProductCard: React.FC<ProductCardProps> = ({data, isInitialFavorite, userRole}) => {
    const router = useRouter();
    const handleProductClick = () => router.push(`/products/${data?.slug}`);
     const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();}
    return (
        <div className="bg-white group rounded-sm border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
            <div onClick={handleProductClick} className="flex-grow  cursor-pointer">
                {/* Gambar */}
                <div className="aspect-square bg-gray-100 relative w-full h-[100] overflow-hidden">
                    <Image
                        alt="Gambar product"
                        src={data?.images?.[0].url}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={true}
                    />
                    <div onClick={handleFavoriteClick}>
                    <FavoriteButton
                    productId={data.id}
                    isInitialFavorite={isInitialFavorite}
                    userRole={userRole as "USER" | "ADMIN" | "GUEST"}/>
                    </div>
                </div>
                {/* Nama Produk */}
                <h3 className="text-lg md:text-base lg:text-lg px-2 mt-2 font-semibold text-start text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-green-600 transition-colors duration-200">
                    {data.name}
                </h3>
                {/* Rating */}
                <div className="flex   items-center px-2 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={cn(
                                "w-3 h-3 md:w-4 md:h-4",
                                i < Math.floor(data.avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                            )}
                        />
                    ))}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({data.avgRating.toFixed(1)})
                    </span>
                </div>
            </div>

            {/* Bagian Harga dan Tombol Favorit (di luar div navigasi) */}
            <div className="flex mb-2 py-2 flex-row items-center text-xs md:text-base lg:text-lg px-2 gap-2">
                {data.price && (
                    <span className="text-gray-500 line-through">
                        <Currency value={data.price}/>
                    </span>
                )}
                <span className="text-red-600 md:text-lg font-bold">
                    <Currency value={data.discountPrice} />
                </span>
                
            </div>
        </div>
    )
}
export default ProductCard;
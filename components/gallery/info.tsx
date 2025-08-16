"use client";
import { ProductTransformed } from "@/actions/get-products";
import { rP } from "@/lib/utils";
import { Star } from "lucide-react";

interface ProductInfoProps {
  product: ProductTransformed;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-2 border-b">
      <h1 className="text-xl mt-4 font-bold line-clamp-1 md:line-clamp-2">{product.name}</h1>
      {/* Rating */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.round(product.avgRating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-sm text-gray-500">
          {product.avgRating.toFixed(1)}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {product.discountPrice ? (
          <>
            <span className="text-xl font-semibold text-orange-500">
              Rp {rP(product.discountPrice)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              Rp {rP(product.price)}
            </span>
          </>
        ) : (
          <span className="text-xl font-semibold">
            Rp{rP(product.price)}
          </span>
        )}
      </div>
     <p className=" text-xl border-t-1 py-2 text-green-700 font-bold">Deskripsi produk :</p>
      <p className="text-gray-500 leading-relaxed whitespace-pre-wrap">{product.description}</p>
      </div>    
  );
}

"use client";

import { ProductImage } from "@/actions/get-products";
import { cn } from "@/lib/utils";
import { Tab } from "@headlessui/react";
import Image from "next/image";

interface GalleryTabProps {
  images: ProductImage;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ images }) => {
  return (
    <Tab className="relative flex aspect-square min-w-[90px] sm:min-w-[100px] lg:min-w-[110px] cursor-pointer items-center justify-center bg-white">
      {({ selected }) => (
        <div className="relative w-full h-full">
          {/* Gambar */}
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <Image
              fill
              src={images.url}
              alt="image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={selected}
            />
          </span>

          {/* Border highlight */}
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2",
              selected ? "ring-orange-400" : "ring-transparent"
            )}
          ></span>
        </div>
      )}
    </Tab>
  );
};

export default GalleryTab;

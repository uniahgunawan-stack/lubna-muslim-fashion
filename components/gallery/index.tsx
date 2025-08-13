"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { ProductImage } from "@/actions/get-products";

interface GalleryProps {
  images: ProductImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null >(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      {/* MAIN IMAGE */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Thumbs]}
          spaceBetween={10}
          navigation={{
            prevEl: ".main-prev",
            nextEl: ".main-next",
          }}
          thumbs={{ swiper: thumbsSwiper }}
          className="aspect-square w-full rounded-lg overflow-hidden"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {images.map((image, idx) => (
            <SwiperSlide key={image.id}>
              <div
                className="relative w-full h-full cursor-zoom-in"
                onClick={() => {
                  setActiveIndex(idx);
                  setZoomOpen(true);
                }}
              >
                <Image
                  src={image.url}
                  alt="Gambar produk"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Tombol navigasi */}
        <Button
          variant="ghost"
          size="icon"
          className="main-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-white/80 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="main-next absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-white/80 rounded-full"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>

      {/* THUMBNAILS */}
      <div className="mt-4">
        <Swiper
          modules={[Navigation, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView="auto"
          watchSlidesProgress
          className="!overflow-hidden"
        >
          {images.map((image) => (
            <SwiperSlide key={image.id} className="!w-20 !h-20 cursor-pointer">
              <Image
                src={image.url}
                alt="Thumbnail"
                width={80}
                height={80}
                className="object-cover object-center rounded-md border"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ZOOM MODAL */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setZoomOpen(false)}
          >
            <X className="h-8 w-8" />
          </Button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            navigation={{
              prevEl: ".zoom-prev",
              nextEl: ".zoom-next",
            }}
            initialSlide={activeIndex}
            className="w-full max-w-5xl"
          >
            {images.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={image.url}
                    alt="Zoom produk"
                    fill
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Tombol zoom nav */}
          <Button
            variant="ghost"
            size="icon"
            className="zoom-prev absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="zoom-next absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
          >
            <ArrowRight className="h-8 w-8" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Gallery;

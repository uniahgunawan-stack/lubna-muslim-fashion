"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";

interface ReviewImage {
  id: string;
  url: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  images: ReviewImage[];
}

interface ReviewSliderProps {
  reviews: Review[];
}

export default function ReviewSlider({ reviews }: ReviewSliderProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

   const allReviewImages = reviews.flatMap((review) => review.images);
   const handleImageClick = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setZoomOpen(true);
  };
   
  return (
    <div className="px-0 relative w-full h-auto overflow-hidden">
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        className="mySwiper rounded-lg"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className="flex flex-col items-center p-4">

             {/* Rating */}
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 md:h-5 md:w-5 ${
                    i < Math.round(review.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="mb-4 text-gray-700 border-b">{review.comment}</p>

            {/* Images */}
            {review.images.length > 0 && (
              <div className="relative w-full h-64 mb-4">
                {review.images.map((image, idx) => {
                  // Find the global index of this image in allReviewImages
                  const globalImageIndex = allReviewImages.findIndex(
                    (img) => img.id === image.id
                  );
                  return (
                    <div
                      key={image.id}
                      className="relative w-full h-full cursor-zoom-in rounded-lg overflow-hidden"
                      onClick={() => handleImageClick(globalImageIndex)}
                    >
                      <Image
                        src={image.url}
                        alt={`Review Image ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        className="object-contain object-center"
                      />
                    </div>
                  );
                })}
              </div>
            )}            
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 text-gray-800 rounded-full"
        aria-label="Previous slide"
      >
        <ArrowLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 text-gray-800 rounded-full"
        aria-label="Next slide"
      >
        <ArrowRight className="h-8 w-8" />
      </Button>
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
            initialSlide={currentImageIndex}
            className="w-full max-w-5xl"
          >
            {allReviewImages.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={image.url} // Perbaiki dari images.id ke image.
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
}

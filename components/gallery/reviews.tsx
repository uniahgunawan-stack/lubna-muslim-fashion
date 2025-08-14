"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
                  className={`h-5 w-5 ${
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
                <Image
                  src={review.images[0].url}
                  alt="Review Image"
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center rounded-lg"
                />
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
    </div>
  );
}

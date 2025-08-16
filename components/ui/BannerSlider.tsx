"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination, } from "swiper/modules";

import {  BannerWithImagesTransformed } from "@/actions/get-Banner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";

interface BannerSliderProps {
  banners: BannerWithImagesTransformed[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
  if (!banners || banners.length === 0) {
    return null;
  }
 return(
    <div className="px-0 relative w-full h-[300px] md:h-[400px] md:mt-4 overflow-hidden">
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{clickable: true}}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        className="mySwiper h-[100%] rounded-lg"
      >
        {banners.map((banner) => {
          const imageUrl =
            banner.bannerImages?.[0]?.url || "/placeholder-banner.jpg";
            const altText = banner.description ? `Banner: ${banner.description}` : "Gambar banner promosi";
          return (
            <SwiperSlide key={banner.id} className="flex flex-col">
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={altText}
                  fill
                  sizes="100vw"
                  className=" object-contain object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {banner.description && (
                <div className=" flex-1 text-center mt-4 md:text-2xl font-semibold  ">
                  {banner.description}
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
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
};

export default BannerSlider;
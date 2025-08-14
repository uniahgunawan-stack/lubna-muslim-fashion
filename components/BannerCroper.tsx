"use client";

import React, { useState, useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BannerCropperProps {
  onCropped: (file: File) => void;
}

const BannerCropper: React.FC<BannerCropperProps> = ({ onCropped }) => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

  // pakai tipe bawaan react-cropper
  const cropperRef = useRef<ReactCropperElement>(null);

  // handle upload gambar
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  // simpan hasil crop
  const cropImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas({
        width: 1600, // output lebar final
        height: 900, // output tinggi final (16:9)
      }).toBlob((blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
          setCroppedPreview(URL.createObjectURL(file));
          onCropped(file);
        }
      }, "image/jpeg");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload input */}
      <input type="file" accept="image/*" onChange={onSelectFile} />

      {/* Cropper */}
      {image && (
        <div className="max-w-3xl mx-auto">
          <Cropper
            src={image}
            style={{ height: 400, width: "100%" }}
            aspectRatio={16 / 9}
            guides={false}
            ref={cropperRef}
            viewMode={1}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
          />
          <Button onClick={cropImage} className="mt-2">
            Simpan Crop
          </Button>
        </div>
      )}

      {/* Preview hasil crop */}
      {croppedPreview && (
        <div className="mt-4">
          <p className="font-semibold">Preview Final (Sama seperti di BannerSlider):</p>
          <div className="relative w-full h-[300px]">
            <Image
              src={croppedPreview}
              alt="Cropped Banner"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerCropper;

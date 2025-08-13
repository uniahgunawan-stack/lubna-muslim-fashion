"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/container";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MessageCircle } from "lucide-react";

interface StickyHeaderProps {
  productName: string;
  phoneNumber: string;
  whatsappMessage: string;
}

export default function StickyHeader({
  productName,
  phoneNumber,
  whatsappMessage,
}: StickyHeaderProps) {
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) { // Tampilkan header setelah scroll 200px
        setIsStickyHeaderVisible(true);
      } else {
        setIsStickyHeaderVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 shadow-md z-10000 transition-transform duration-300 ease-in-out",
        isStickyHeaderVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <Container>
        <div className="container mx-auto max-w-4xl p-4 flex items-center justify-between">
          <span className="font-semibold text-sm line-clamp-1">
            Pesan {productName} Sekarang!
          </span>
          <WhatsAppButton
            phoneNumber={phoneNumber}
            message={whatsappMessage}
            variant="default"
            size="sm"
            className="text-sm px-3 py-1"
          >
            <MessageCircle className="mr-1 h-4 w-4" /> Pesan Sekarang
          </WhatsAppButton>
        </div>
      </Container>
    </div>
  );
}
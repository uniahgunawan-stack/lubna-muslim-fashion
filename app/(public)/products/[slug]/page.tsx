import Gallery from "@/components/gallery";
import ProductInfo from "@/components/gallery/info";
import {  getProductBySlug } from "@/actions/get-products";
import ReviewSlider from "@/components/gallery/reviews";
import { SiteFooter } from "@/components/(tampilan)/Footer";
import Container from "@/components/ui/container";
import { Separator } from "@radix-ui/react-select";
import WhatsAppButton from "@/components/WhatsAppButton";
import { FaWhatsapp } from "react-icons/fa";
import { rP } from "@/lib/utils";
import StickyHeader from "@/components/(tampilan)/StickyHeader";
import ProductSection from "@/components/(public)/ProductSection";
import Link from "next/link";
import { Home } from "lucide-react";
import { CountdownTimer } from "@/components/TimerDown";

export const revalidate = 0

interface DetailProductPageProps {
  params: Promise<{ slug: string }>;
}
export default async function DetailProductPage({
  params
}: DetailProductPageProps) {
  const { slug } =await params;
  const product = await getProductBySlug({slug});

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  if (!product) {
    return <div>Product tidak ditemukan</div>;
  }

  const productUrl = `${siteUrl}/products/${slug}`;
  const whatsappMessage = `Halo, saya tertarik dengan produk ${
    product.name
  } ❤️ yang Anda jual seharga Rp ${rP(product.price)}.
Apakah produk ini masih tersedia? Cek produk:
${productUrl}`;
  return (
    <>
    <StickyHeader
        productName={product.name}
        phoneNumber={phoneNumber}
        whatsappMessage={whatsappMessage}
      />
    <div className="bg-white">
      <Container> 
        <div className="py-0 md:py-10">      
            <div className="overflow-hidden  grid grid-cols-1 items-start md:grid-cols-2 gap-x-8">
              <Gallery images={product.images}/>
                <div className="mt-2 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                  <ProductInfo product={product} />
                </div>
            </div>
        </div>

        <section className="mt-4 bg-gray-200 rounded-t-2xl shadow-inner ">
                  <h2 className="text-2xl mt-4 md:text-3xl font-bold text-center text-primary"> {/* Judul section gold */}
                    Diskon Berakhir Dalam:
                  </h2>
                  <div className="mb-4">
                  <CountdownTimer className="" />
                  </div>
                  </section>

        <section className="container mx-auto px-4 py-2">
          <div className="bg-gradient-to-r from-gray-900 to-green-900 text-white p-6 md:p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Beli Banyak Lebih Murah, Kami Melayani Grosir!
            </h2>
            <p className="text-sm md:text-xl">
              Dapatkan harga spesial untuk pembelian dalam jumlah besar. Cocok
              untuk reseller dan kebutuhan bisnis Anda.
            </p>
           <WhatsAppButton
                className="mt-4"
                phoneNumber={phoneNumber}
                message={whatsappMessage}
              >
               <FaWhatsapp className="h-8 w-8" /> Tanya Harga Grosir
              </WhatsAppButton>
          </div>
        </section>
        
          <h1 className="font-bold px-4 text-xs md:text-sm py-2 bg-green-200 rounded-t-2xl text-center">
            Kata Meraka 💕
          </h1>
          {product.reviews.length === 0 ? (
            <div className="border-l-1 border-r-1 rounded-b-xl px-4 py-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">Belum ada ulasan untuk produk ini</p>
            </div>
          ) : (
            <div className="border-l-1 border-r-1 flex flex-col items-center px-2 md:px-50">
              <ReviewSlider reviews={product.reviews} />
            </div>
          )}
        <section className="border-l-1 border-r-1 border-b-1 bg-[radial-gradient(circle,_#FFF5E1,_#FAF9F6)] bg-background-alt-1 rounded-b-lg mb-4">
        <div className="flex items-center px-2 justify-between py-4">
              <hr className="w-20 md:w-60 border-t border-gray-400"/>
              <span className="text-sm md:text-2xl text-black font-bold select-none">
                kamu mungkin juga suka
              </span>
              <hr className="w-20 md:w-60  border-t border-gray-400"/>
            </div>
        <ProductSection />
        </section>
        <Link 
        href="/"
        target="blank"
        
        ><span className="flex flex-nowrap text-xs justify-center md:text-sm text-blue-600 mb-4">
          <Home className="mr-2" />Kembali beranda
          </span>
        </Link>
      </Container>
    </div>
    <SiteFooter/>
    </>
    
  );
}

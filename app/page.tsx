import { getFavorites } from "@/actions/get-favorits";
import { getCategory } from "@/actions/getCategory";
import HeroSection from "@/components/(public)/hero-section";
import ProductSection from "@/components/(public)/ProductSection";
import { SiteFooter } from "@/components/(tampilan)/Footer";
import Header from "@/components/(tampilan)/Header";
import { PurchaseNotification } from "@/components/purchase-notif"
import { CountdownTimer } from "@/components/TimerDown";
import IconWhatsapp from "@/components/ui/icon-wa";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const categories = await getCategory();
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role || "GUEST";
  const favoriteProductIds = new Set<string>();
  if (userRole === "USER") {
    try {
      const favorites = await getFavorites();
      favorites.forEach(p => favoriteProductIds.add(p.id));
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  }
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const pesan= "Halo, saya ingin bertanya tentang product di website anda.";

   
  return (
<> 
<Header categories={categories} session={session}/>
      <div className="min-h-screen  justify-between lg:max-w-7xl mx-auto p-1 sm:p-6 lg:p-8  dark:bg-gray-950">
        <div className="items-center text-center flex-col justify-between block">      
      <div className="flex flex-col items-center">
        <HeroSection/>
        </div>
        <section className="mt-4 bg-gray-200 rounded-t-lg shadow-inner ">
          <h2 className="text-lg mt-4 md:text-xl font-bold text-center text-primary"> {/* Judul section gold */}
            Diskon Berakhir Dalam:
          </h2>
          <div className="mb-8">
          <CountdownTimer className="" />
          <section className="rounded-t-lg py-2 md:py-4 bg-[radial-gradient(circle,_#FFF5E1,_#FAF9F6)] bg-background-alt-1 shadow-inner"> {/* Background putih */}
          <h2 id="produk" className="text-lg md:text-xl font-bold text-center mb-2 "> {/* Judul section gold */}
            Produk Terbaru
          </h2>          
              <ProductSection />
              </section>
          </div>         
        </section>
        </div>
        <IconWhatsapp phoneNumber={phoneNumber} message={pesan}/>
      </div>
      <SiteFooter/>
      <PurchaseNotification/>
</>
  )
}
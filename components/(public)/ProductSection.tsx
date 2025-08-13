// components/ProductSection.tsx
import { getAuthSession } from "@/lib/auth";
import { getProducts } from "@/actions/get-products";
import { getFavorites } from "@/actions/get-favorits";
import { getCategory } from "@/actions/getCategory";
import FilteredProductDisplay from "./FilterProduct"; // Komponen klien baru

export default async function ProductSection() {
  const session = await getAuthSession();
  const userRole = session?.user?.role || "GUEST";
  
  // Ambil semua kategori untuk filter
  const categories = await getCategory();
  
  // Ambil daftar ID produk favorit pengguna
  const favoriteProductIds = new Set<string>();
  if (userRole === "USER") {
    try {
      const favorites = await getFavorites();
      favorites.forEach(p => favoriteProductIds.add(p.id));
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  }

  const initialProducts = await getProducts({
    limit: 4,
  });

  return (
    <FilteredProductDisplay
      categories={categories}
      initialProducts={initialProducts}
      userRole={userRole}
      favoriteProductIds={Array.from(favoriteProductIds)}
    />
  );
}
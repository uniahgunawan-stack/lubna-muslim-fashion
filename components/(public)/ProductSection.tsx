import { getAuthSession } from "@/lib/auth";
import { getProducts } from "@/actions/get-products";
import { getCategory } from "@/actions/getCategory";
import FilteredProductDisplay from "./FilterProduct";

interface ProductSectionProps {
  currentProductSlug?: string;
}

export default async function ProductSection({ currentProductSlug }: ProductSectionProps) {
  const session = await getAuthSession();
  const userRole = session?.user?.role || "GUEST";
  const categories = await getCategory();
  
 
  const initialProducts = await getProducts({
    excludeSlug: currentProductSlug,
    limit: 4,
  });

  return (
    <FilteredProductDisplay
      categories={categories}
      initialProducts={initialProducts}
      userRole={userRole}
      favoriteProductIds={[]}
      excludeSlug={currentProductSlug}
    />
  );
}
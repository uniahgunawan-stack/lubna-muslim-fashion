"use client";

import { useState, useEffect } from "react";
import ProductList from '@/components/ProductList';
import { getProducts, ProductTransformed } from '@/actions/get-products';
import { getFavorites } from "@/actions/get-favorits"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalize } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface FilteredProductDisplayProps {
  initialProducts: ProductTransformed[];
  userRole: "USER" | "ADMIN" | "GUEST";
  favoriteProductIds: string[];
  categories: Category[];
}

const INITIAL_LIMIT = 4;

export default function FilteredProductDisplay({
  initialProducts,
  userRole,
  favoriteProductIds,
  categories,
}: FilteredProductDisplayProps) {
  const [products, setProducts] = useState<ProductTransformed[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === INITIAL_LIMIT);
   const [favorites, setFavorites] = useState<string[]>(favoriteProductIds);

   useEffect(() => {
    if (userRole === "USER") {
      getFavorites().then((res) => {
        setFavorites(res.map(p => p.id));
      }).catch(err => console.error("Failed to load favorites", err));
    }
  }, [userRole]);

  const loadProducts = async (isNewFilter = false) => {
    setIsLoading(true);
    const querySkip = isNewFilter ? 0 : products.length;
    const categoryQuery = selectedCategory === "all" ? undefined : selectedCategory;

    const newProducts = await getProducts({
      limit: INITIAL_LIMIT,
      skip: querySkip,
      orderBy: "createdAt",
      orderDirection: "desc",
      category: categoryQuery,
    });

    if (isNewFilter) {
      setProducts(newProducts);
    } else {
      setProducts(prevProducts => [...prevProducts, ...newProducts]);
    }
    
    setHasMore(newProducts.length === INITIAL_LIMIT);
    setIsLoading(false);
  };

  // Pemicu saat kategori berubah
  useEffect(() => {
    loadProducts(true);
  }, [selectedCategory]);

  return (
    <>
      <div className="flex text-sm justify-center mb-6">
        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                {capitalize(cat.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ProductList
        products={products}
        userRole={userRole}
        favoriteProductIds={favorites}
        onLoadMore={() => loadProducts()}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    </>
  );
}
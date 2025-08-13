import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductsAdminPageClient from "@/components/Dashboard"; // komponen client

export default async function ProductsAdminPage() {
  const session = await getAuthSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <ProductsAdminPageClient />;
}
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import BannerAdminPage from "@/components/FormBanners";

export default async function ProductsAdminPage() {
  const session = await getAuthSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <BannerAdminPage />;
}
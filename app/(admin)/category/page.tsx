import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import KelolaCategory from "@/components/FormCategory";

export default async function ProductsAdminPage() {
  const session = await getAuthSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <KelolaCategory />;
}
import FormProduct from '@/components/FormProduct'
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
    const session = await getAuthSession();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }
    return <FormProduct/>;
}
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (pathname === "/" || pathname.startsWith("/products") ||
  pathname.startsWith("/category")) {
      return;
    }
    if (status === "unauthenticated" || !session?.user?.id) {
      if (pathname !== "/login") {
        toast.error("Sesi Anda telah berakhir atau akun tidak tersedia. Silakan login ulang.", {
          duration: 5000,
        });
        signOut({ callbackUrl: "/login" }).catch((error) => {
          console.error("Sign out failed:", error);
          toast.error("Gagal keluar. Silakan coba lagi.", { duration: 5000 });
        });
      }
      return;
    }
    const userRole = session.user.role;
    if (pathname.startsWith("/dasboard") && userRole !== "ADMIN") {
      toast.error("Akses ditolak. Hanya admin yang dapat mengakses dashboard.",
        {duration:5000}
      );
      router.push("/");
      return;
    }

    if (pathname.startsWith("/favorites") && userRole !== "USER") {
      toast.error("Akses ditolak. Hanya user yang dapat mengakses favorit.");
      router.push("/");
      return;
    }
    if (session.user.id === "" && pathname !== "/login") {
      toast.error("Akun tidak tersedia. Anda telah logout.",{duration:5000});
      signOut({ callbackUrl: "/login" }).catch((error) => {
        console.error("Sign out failed:", error);
        toast.error("Gagal keluar. Silakan coba lagi.",{duration:5000});
      });
    }
  }, [status, session, pathname, router]);

  return <>{children}</>;
}
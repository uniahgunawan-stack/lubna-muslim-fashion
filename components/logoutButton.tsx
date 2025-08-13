"use client";

import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function LogoutButton() {
  const handleLogout = async () => {
    toast.success("Berhasil logout.");
    // Tunggu sebentar biar toast sempat tampil, lalu redirect logout
    setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, 1000); // 1 detik
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}

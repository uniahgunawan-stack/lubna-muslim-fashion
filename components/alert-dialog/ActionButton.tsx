"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ActionButtonsProps {
  onCancelChanges: () => void;
  backUrl?: string;
}

export default function ActionButtons({
  onCancelChanges,
  backUrl = "/dasboard",
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Tombol AlertDialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-orange-600 hover:text-white w-full sm:w-auto"
          >
            Batal Perubahan & Kembali
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan membatalkan semua perubahan yang belum disimpan
              pada produk ini dan kembali ke dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tidak</AlertDialogCancel>
            <AlertDialogAction onClick={onCancelChanges}>
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tombol Kembali */}
      <Link href={backUrl} className="w-full sm:w-auto">
        <Button
          variant="outline"
          className="hover:bg-orange-500 hover:text-white w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Produk
        </Button>
      </Link>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      toast.success(`Selamat datang, ${session.user.name || "User"}!`);
      const role = session.user.role;
      if (role === "ADMIN") router.push("/dasboard");
      else if (role === "USER") router.push("/");
      else router.push("/");
    }
  }, [status, session, router]);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

       if (!res.ok) {
        toast.error(data.error || "Signup gagal");
        throw new Error(data.error || "Signup gagal");
      }

      toast.success("Pendaftaran berhasil! Silakan login.");
      await handleLogin(); // langsung login otomatis
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan tidak dikenal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error || !result?.ok) {
    let message = "Login gagal. Periksa email dan password.";
    if (result?.error === "CredentialsSignin") {
      message = "Email atau password salah.";
    }
    toast.error(message);
    setError(message);
  } else {
    toast.success(`Selamat datang, ${email}!`);
  }

  setIsLoading(false);
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) handleLogin();
    else handleSignUp();
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/login" });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    isLogin,
    setIsLogin,
    error,
    setError,
    isLoading,
    handleSubmit,
    handleGoogleSignIn,
  };
};

"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { redirect: false });
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010]">
      <div className="bg-[#181818] p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h2>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label
              htmlFor="email"
              className="block text-white text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 p-3 w-full rounded-lg bg-[#202020] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A69686]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 p-3 w-full rounded-lg bg-[#202020] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A69686]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#A69686] text-white text-lg font-semibold hover:bg-[#8C7A5A] transition duration-200">
            Login
          </button>
        </form>

        <div className="mt-4 text-center border-b border-white pb-[30px]">
          <p className="text-sm text-white">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#A69686] hover:text-[#8C7A5A]">
              Sign up
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center pt-[30px]">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-lg bg-[#4285F4] text-white text-lg font-semibold hover:bg-[#357ae8] transition duration-200">
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}

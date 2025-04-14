"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Something went wrong.");
        return;
      }

      const data = await res.json();
      router.push("/auth/login");
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010]">
      <div className="bg-[#181818] p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <form className="space-y-6" onSubmit={handleRegister}>
          {error && <div className="text-red-500 text-center">{error}</div>}

          <div>
            <label
              htmlFor="name"
              className="block text-white text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2 p-3 w-full rounded-lg bg-[#202020] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A69686]"
            />
          </div>

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
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#A69686] hover:text-[#8C7A5A]">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

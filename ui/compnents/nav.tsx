"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import SearchSection from "./search";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function Nav() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    sessionStorage.clear();
  };

  return (
    <nav className="bg-gray-900 w-full fixed top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-cyan-400">
              J&B
            </Link>
            {status === "authenticated" && (
              <p className="text-gray-300 text-sm">{session?.user?.name}</p>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <SearchSection placeholder="Search posts..." />
            <Link
              href="/"
              className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/posts/createpost"
              className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Post
            </Link>
            {status === "authenticated" && (
              <button
                onClick={handleSignOut}
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-cyan-400"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 p-4">
            <SearchSection placeholder="Search posts..." className="mb-4" />
            <Link
              href="/"
              className="block text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/posts/createpost"
              className="block text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Post
            </Link>
            {status === "authenticated" && (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

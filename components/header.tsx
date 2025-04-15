"use client";

import Link from "next/link";
import { Home, Search, User, Menu, Calendar, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-3 text-xl font-bold text-gray-800 dark:text-white transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-sm">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="tracking-tight">
              {process.env.NEXT_PUBLIC_APP_NAME || "Filipino World"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/properties"
              className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 rounded-full py-2 px-4 transition-all duration-300 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800"
            >
              <Search className="h-4 w-4" />
              <span className="font-medium text-xs">Properties</span>
            </Link>

            <Link
              href="/events"
              className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 rounded-full py-2 px-4 transition-all duration-300 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800"
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium text-xs">Events</span>
            </Link>

            <ThemeToggle />

            <Link
              href="/profile"
              className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-800/30 hover:bg-yellow-200 dark:hover:bg-yellow-700/40 rounded-full py-2 px-4 transition-all duration-300 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700"
            >
              <User className="h-4 w-4" />
              <span className="font-medium text-xs">Profile</span>
            </Link>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40 rounded-full p-2 text-blue-800 dark:text-blue-400"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <Link
                href="/properties"
                className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 rounded-lg py-3 px-4 transition-all duration-300 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5" />
                <span className="font-medium">Properties</span>
              </Link>

              <Link
                href="/events"
                className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 rounded-lg py-3 px-4 transition-all duration-300 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Events</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-800/30 hover:bg-yellow-200 dark:hover:bg-yellow-700/40 rounded-lg py-3 px-4 transition-all duration-300 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

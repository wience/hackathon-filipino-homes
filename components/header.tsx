import Link from "next/link";
import Image from "next/image";
import { Search, User, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <div className="container mx-auto px-6 py-5">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-3 text-xl font-bold text-gray-800 dark:text-white transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <div className="relative w-10 h-10">
              <Image
                src="/images/filipinoworldlogo.png"
                alt="Filipino World Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="tracking-tight">Filipino World</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/properties"
              className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 rounded-full py-2 px-4 transition-all duration-300 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800"
            >
              <Search className="h-4 w-4" />
              <span className="font-medium text-xs hidden sm:inline">
                Properties
              </span>
            </Link>

            <ThemeToggle />

            <Link
              href="/profile"
              className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-800/30 hover:bg-yellow-200 dark:hover:bg-yellow-700/40 rounded-full py-2 px-4 transition-all duration-300 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700"
            >
              <User className="h-4 w-4" />
              <span className="font-medium text-xs hidden sm:inline">
                Profile
              </span>
            </Link>

            <button className="md:hidden bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40 rounded-full p-2 text-blue-800 dark:text-blue-400">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

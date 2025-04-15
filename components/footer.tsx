import Link from "next/link";
import { Home, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-1.5 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-500">
                Filipino World
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your trusted partner in finding the perfect home in the Philippines.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="text-blue-500 hover:text-blue-600">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-red-500 hover:text-red-600">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-blue-400 hover:text-blue-500">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">About Us</Link></li>
              <li><Link href="/properties" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Properties</Link></li>
              <li><Link href="/agents" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Agents</Link></li>
              <li><Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Blog</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Property Types</h3>
            <ul className="space-y-2">
              <li><Link href="/houses" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Houses & Lots</Link></li>
              <li><Link href="/condos" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Condominiums</Link></li>
              <li><Link href="/commercial" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Commercial</Link></li>
              <li><Link href="/land" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">Land</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 text-blue-500" />
                <span>+63 (2) 8123 4567</span>
              </p>
              <p className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 text-red-500" />
                <span>info@filipinohomes.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-6 text-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} Filipino World. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

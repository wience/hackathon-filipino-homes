import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/filipinoworldlogo.png"
                  alt="Filipino World Logo"
                  fill
                  className="object-contain"
                />
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
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">+63 912 345 6789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">info@filipinoworld.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          © {currentYear} Filipino World. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

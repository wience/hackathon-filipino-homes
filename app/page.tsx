"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Home as HomeIcon, MapPin, Building, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const router = useRouter();

  // Array of placeholder texts to cycle through
  const placeholderTexts = [
    "I want to buy a house in Lahug",
    "I'm looking for a house with 2 bedrooms",
    "Condo for rent in Cebu City",
    "Affordable apartments near Ayala Mall",
    "House and lot for sale in Mandaue",
    "Commercial property in Makati",
    "Beachfront property in Mactan",
    "Townhouse with parking in BGC"
  ];

  useEffect(() => {
    const typingEffect = () => {
      const currentText = placeholderTexts[currentPlaceholderIndex];

      // If deleting
      if (isDeleting) {
        setPlaceholderText(currentText.substring(0, placeholderText.length - 1));
        setTypingSpeed(30); // Faster deletion speed (was 50)
      }
      // If typing
      else {
        setPlaceholderText(currentText.substring(0, placeholderText.length + 1));
        setTypingSpeed(40 + Math.random() * 50); // Faster typing speed (was 100 + random 100)
      }

      // If completed typing the current text
      if (!isDeleting && placeholderText === currentText) {
        // Shorter pause at the end before deleting
        setTimeout(() => setIsDeleting(true), 1000); // Reduced from 1500ms
        setTypingSpeed(50); // Faster transition
      }
      // If completed deleting
      else if (isDeleting && placeholderText === '') {
        setIsDeleting(false);
        setCurrentPlaceholderIndex((currentPlaceholderIndex + 1) % placeholderTexts.length);
        setTypingSpeed(300); // Shorter pause before new text (was 500)
      }
    };

    const timer = setTimeout(typingEffect, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, currentPlaceholderIndex, placeholderTexts, typingSpeed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // Use our semantic search API endpoint
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) {
        throw new Error(`Search request failed with status: ${response.status}`);
      }

      const data = await response.json();

      // For now, just redirect to properties page with the search query
      // In a real implementation, you would display the results or redirect to a results page
      router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Error processing search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section - Full Viewport Height */}
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-full max-w-4xl px-4 flex flex-col items-center justify-center">
          {/* Heading - Large and Bold */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-blue-800 dark:text-blue-400 leading-tight">
              Find Your Dream Home
            </h1>
          </motion.div>

          {/* Simple Search Form */}
          <motion.div
            className="w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 h-6 w-6" />
              <Input
                id="search-query"
                placeholder={placeholderText}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-36 py-8 text-lg border-2 border-blue-500 dark:border-blue-600 shadow-lg focus:border-blue-600 focus:ring-blue-500 rounded-full dark:bg-gray-800 dark:text-white placeholder:text-gray-500"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 h-12"
                disabled={isLoading || !searchQuery.trim()}
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </form>
          </motion.div>

          {/* Short Description */}
          <motion.div
            className="text-center mt-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Search thousands of properties across the Philippines. Find houses, condos, apartments, and more.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Feature Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-blue-600 dark:text-blue-400">Filipino Homes</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We&apos;re committed to helping you find the perfect property in the Philippines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-800/40 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Extensive Listings</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access thousands of properties across the Philippines, from luxurious condos to affordable homes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-red-100 dark:bg-red-800/40 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <Building className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Expert Agents</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our professional agents have deep knowledge of local markets to guide you through your property journey.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-8 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-yellow-100 dark:bg-yellow-800/40 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Prime Locations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find properties in the most desirable locations, from city centers to peaceful provincial areas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
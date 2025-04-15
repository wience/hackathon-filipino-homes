"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Home as HomeIcon, MapPin, Building, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    "3-bedroom house in Banilad, Cebu City with garden under 6M pesos",
    "Luxury condo in Cebu Business Park with swimming pool and gym access",
    "Studio apartment for rent in IT Park, Cebu City for 15-20K monthly",
    "Beachfront property in Mactan, Cebu with direct ocean access",
    "Commercial space for lease in Mandaue City, at least 150sqm",
    "House and lot in Maria Luisa Subdivision with 24/7 security",
    "Affordable 1-bedroom condo in Mabolo for young professionals",
    "Lot for sale in Talisay City, Cebu with mountain view",
    "Townhouse in Talamban near schools and universities",
    "Office space in Cebu IT Park, 200-300sqm with parking slots",
    "Duplex house in Lapu-Lapu City with separate entrance",
    "Pre-selling condo in Cebu Downtown with flexible payment terms"
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
      // Directly redirect to properties page with the search query
      router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Error navigating:", error);
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
              Your Future is Here
            </h1>
          </motion.div>

          {/* Simple Search Form */}
          <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-6 top-8 text-blue-600 dark:text-blue-400 h-8 w-8 z-10" />
              <Textarea
                id="search-query"
                placeholder={placeholderText}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-20 pr-10 py-6 text-xl border-2 border-blue-500 dark:border-blue-600 shadow-xl focus:border-blue-600 focus:ring-blue-500 rounded-3xl dark:bg-gray-800 dark:text-white placeholder:text-gray-500"
                rows={4}
              />
              <Button
                type="submit"
                className="absolute right-4 bottom-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 text-lg"
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
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Search thousands of listings across the Philippines — residential, commercial, and investment properties all in one place.
            </p>
            <Button
              onClick={() => router.push('/properties')}
              variant="outline"
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 font-medium text-lg px-8 py-3 rounded-xl"
            >
              <HomeIcon className="mr-2 h-5 w-5" /> View All Properties
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Feature Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-blue-600 dark:text-blue-400">Filipino World</span>
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Property Search Agent</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our intelligent search agent helps you find properties that match your specific requirements and preferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-red-100 dark:bg-red-800/40 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <Building className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI Property Appraisal</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get accurate property valuations powered by our advanced AI system that analyzes market trends and comparable properties.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-8 text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-yellow-100 dark:bg-yellow-800/40 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Extensive Listings</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access thousands of properties across the Philippines, from luxurious condos to affordable homes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
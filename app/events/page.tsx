"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { loadGoogleMapsApi } from "@/utils/loadGoogleMapsApi";
import { EventsModal } from "@/components/events-modal";

export default function Events() {
    const [location, setLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [placeholderText, setPlaceholderText] = useState("");
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(100);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const autocompleteInputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Array of placeholder texts to cycle through
    const placeholderTexts = [
        "Cebu City",
        "Manila",
        "Davao",
        "Makati",
        "Quezon City",
        "Tagaytay",
        "Boracay",
        "Baguio"
    ];

    // Initialize Google Places Autocomplete
    useEffect(() => {
        const initializeAutocomplete = async () => {
            try {
                await loadGoogleMapsApi();

                if (autocompleteInputRef.current && window.google) {
                    // Using any type to bypass the TypeScript limitation
                    const options: any = {
                        componentRestrictions: { country: "ph" },
                        types: ["geocode", "establishment"]
                    };

                    autocompleteRef.current = new window.google.maps.places.Autocomplete(
                        autocompleteInputRef.current,
                        options
                    );

                    autocompleteRef.current.addListener("place_changed", () => {
                        const place = autocompleteRef.current?.getPlace();
                        if (place && place.formatted_address) {
                            setLocation(place.formatted_address);
                        }
                    });
                }
            } catch (error) {
                console.error("Error initializing Google Places Autocomplete:", error);
            }
        };

        initializeAutocomplete();
    }, []);

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
                setTypingSpeed(40 + Math.random() * 50); // Faster typing speed
            }

            // If completed typing the current text
            if (!isDeleting && placeholderText === currentText) {
                // Shorter pause at the end before deleting
                setTimeout(() => setIsDeleting(true), 1000);
                setTypingSpeed(50);
            }
            // If completed deleting
            else if (isDeleting && placeholderText === '') {
                setIsDeleting(false);
                setCurrentPlaceholderIndex((currentPlaceholderIndex + 1) % placeholderTexts.length);
                setTypingSpeed(300);
            }
        };

        const timer = setTimeout(typingEffect, typingSpeed);
        return () => clearTimeout(timer);
    }, [placeholderText, isDeleting, currentPlaceholderIndex, placeholderTexts, typingSpeed]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) return;

        setIsLoading(true);
        try {
            // Open the modal to display events
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error processing search:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
                            Discover Local Events
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
                            <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 h-6 w-6 z-10" />
                            <Input
                                ref={autocompleteInputRef}
                                id="location-input"
                                placeholder={`Enter location (e.g., ${placeholderText})`}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="pl-16 pr-36 py-6 text-xl h-16 border-2 border-blue-500 dark:border-blue-600 shadow-xl focus:border-blue-600 focus:ring-blue-500 rounded-full dark:bg-gray-800 dark:text-white placeholder:text-gray-500"
                            />
                            <Button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 text-lg"
                                disabled={isLoading || !location.trim()}
                            >
                                {isLoading ? "Searching..." : "Find Events"}
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
                            Discover upcoming events, festivals, and activities across the Philippines. Find out what&apos;s happening in your area.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Feature Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Why Explore <span className="text-blue-600 dark:text-blue-400">Filipino Events</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Discover the rich cultural experiences and exciting events happening throughout the Philippines
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center transition-transform hover:transform hover:scale-105">
                            <div className="bg-blue-100 dark:bg-blue-800/40 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Local Festivals</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Experience traditional Filipino festivals and celebrations that showcase our vibrant culture.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center transition-transform hover:transform hover:scale-105">
                            <div className="bg-red-100 dark:bg-red-800/40 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                                <Search className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Curated Events</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Discover carefully selected events ranging from cultural showcases to modern entertainment.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-8 text-center transition-transform hover:transform hover:scale-105">
                            <div className="bg-yellow-100 dark:bg-yellow-800/40 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                                <MapPin className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Nationwide Coverage</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Find events from all across the Philippines, from major cities to hidden local gems.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Events Modal */}
            <EventsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                location={location}
            />
        </>
    );
} 
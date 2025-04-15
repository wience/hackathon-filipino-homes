"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

interface EventData {
    "Event Name": string;
    "Event Details": string;
    "Source": string;
}

interface EventsModalProps {
    isOpen: boolean;
    onClose: () => void;
    location: string;
}

export function EventsModal({ isOpen, onClose, location }: EventsModalProps) {
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && location) {
            fetchEvents(location);
        } else {
            // Reset state when modal closes
            setEvents([]);
            setError(null);
        }
    }, [isOpen, location]);

    const fetchEvents = async (location: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ location }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch events");
            }

            const data = await response.json();
            console.log(data);
            setEvents(data.events || []);
        } catch (error) {
            console.error("Error fetching events:", error);
            setError((error as Error).message || "Failed to fetch events");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Events in {location}</DialogTitle>
                </DialogHeader>

                <div className="mt-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative w-24 h-24 mb-6">
                                {/* Multiple pulsing circles */}
                                <div className="absolute inset-0 bg-blue-400 rounded-full opacity-25 animate-ping"></div>
                                <div className="absolute inset-1 bg-blue-500 rounded-full opacity-50 animate-pulse"></div>
                                <div className="absolute inset-2 bg-blue-600 rounded-full opacity-75"></div>

                                {/* Animated dots in the center */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-white rounded-full animate-[pulse_1.4s_ease-in-out_infinite] delay-0"></div>
                                        <div className="w-3 h-3 bg-white rounded-full animate-[pulse_1.4s_ease-in-out_infinite] delay-[0.2s]"></div>
                                        <div className="w-3 h-3 bg-white rounded-full animate-[pulse_1.4s_ease-in-out_infinite] delay-[0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">
                                Discovering events in {location}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 max-w-md text-center">
                                We&apos;re searching multiple sources to find the best events happening in your area.
                            </p>

                            {/* Loading progress messages */}
                            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                                <p>Scraping the web for local events...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-lg">
                            <p className="font-medium">Error: {error}</p>
                            <p className="mt-2 text-sm">Please try again later or with a different location.</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 dark:text-gray-400">No events found for {location}.</p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                                Try searching for a different location or check back later.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {events.map((event, index) => (
                                <div
                                    key={index}
                                    className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                                        {event["Event Name"]}
                                    </h3>
                                    <div className="mt-3 mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {event["Event Details"].split('\n').map((paragraph, i) => (
                                            <p key={i} className="mb-2">{paragraph}</p>
                                        ))}
                                    </div>
                                    <div className="flex items-center mt-4 text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Source: {event["Source"]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 
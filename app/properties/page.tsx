"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Home, Bath, Maximize, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

// Type for property data
interface Property {
    id: number;
    property_name: string;
    property_price: string;
    property_address: string;
    property_bedroom: string;
    property_bathroom: string;
    property_floor: string;
    property_type: string;
    property_subtype: string;
    property_featured_photo: string;
    category: {
        property_category_name: string;
    };
}

// Type for pagination
interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export default function Properties() {
    return (
        <Suspense fallback={<PropertiesLoading />}>
            <PropertiesContent />
        </Suspense>
    );
}

function PropertiesLoading() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="w-full max-w-3xl mx-auto mb-12">
                <div className="relative">
                    <Skeleton className="h-16 w-full rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="relative h-56 w-full">
                            <Skeleton className="h-full w-full" />
                        </div>
                        <div className="p-5 flex flex-col h-64">
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-6 w-1/3 mb-4" />

                            <div className="flex justify-between mb-4">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                            </div>

                            <div className="mt-auto">
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function PropertiesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [properties, setProperties] = useState<Property[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Get the current page from URL or default to 1
    const currentPage = Number(searchParams.get("page") || 1);
    const urlSearchQuery = searchParams.get("search") || "";

    // Format currency
    const formatCurrency = (amount: string) => {
        const number = parseFloat(amount);
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
        }).format(number);
    };

    useEffect(() => {
        // Initialize search input with the URL search query
        setSearchQuery(urlSearchQuery);

        const fetchProperties = async () => {
            setIsLoading(true);

            try {
                // Determine if we should call search API or regular properties API
                let url;
                if (urlSearchQuery) {
                    url = `/api/semantic-search?q=${encodeURIComponent(urlSearchQuery)}&limit=12`;
                } else {
                    url = `/api/properties?page=${currentPage}&limit=12`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();

                // Handle different response structures
                if (urlSearchQuery) {
                    // Handle search results format
                    setProperties(data.results || []);

                    // Create a simple pagination object for search results
                    const totalItems = data.results?.length || 0;
                    setPagination({
                        total: totalItems,
                        page: 1,
                        limit: 12,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPrevPage: false
                    });
                } else {
                    // Handle paginated results format
                    setProperties(data.properties || []);
                    setPagination(data.pagination || null);
                }
            } catch (err) {
                console.error("Failed to fetch properties:", err);
                setError("Failed to load properties. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, [currentPage, urlSearchQuery]);

    // Generate page URL for pagination
    const getPageUrl = (page: number) => {
        if (urlSearchQuery) {
            return `/properties?search=${encodeURIComponent(urlSearchQuery)}&page=${page}`;
        }
        return `/properties?page=${page}`;
    };

    // Handle search submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        // Navigate to properties page with the new search query
        router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            {/* Search Component */}
            <div className="w-full max-w-3xl mx-auto mb-12">
                <form onSubmit={handleSubmit} className="relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 h-7 w-7" />
                    <Input
                        id="search-query"
                        placeholder="Search for properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-16 pr-40 py-8 text-xl border-2 border-blue-500 dark:border-blue-600 shadow-lg focus:border-blue-600 focus:ring-blue-500 rounded-full dark:bg-gray-800 dark:text-white"
                    />
                    <Button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 text-lg h-14"
                    >
                        Search
                    </Button>
                </form>
            </div>

            {isLoading ? (
                <div>
                    {/* Skeleton Loading State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Card key={index} className="overflow-hidden">
                                <div className="relative h-56 w-full">
                                    <Skeleton className="h-full w-full" />
                                </div>
                                <div className="p-5 flex flex-col h-64">
                                    <Skeleton className="h-4 w-2/3 mb-2" />
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-6 w-1/3 mb-4" />

                                    <div className="flex justify-between mb-4">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>

                                    <div className="mt-auto">
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    {error}
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">No properties found</h2>
                    <p className="mb-8">Try adjusting your search criteria or browse our available listings.</p>
                    <Link href="/">
                        <Button className="bg-blue-600 hover:bg-blue-700">Back to Home</Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Property Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property) => (
                            <div
                                key={property.id}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col"
                            >
                                <div className="relative h-56 w-full overflow-hidden">
                                    <Image
                                        src={property.property_featured_photo}
                                        alt={property.property_name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className="hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-0 left-0 bg-blue-600 text-white py-1 px-3 m-2 rounded-md text-sm font-medium">
                                        {property.property_type}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                                            {property.property_address}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-2">
                                        {property.property_name}
                                    </h3>

                                    <p className="text-blue-600 text-xl font-bold mb-4">
                                        {formatCurrency(property.property_price)}
                                    </p>

                                    <div className="flex justify-between text-sm text-gray-600">
                                        {property.property_bedroom && parseInt(property.property_bedroom) > 0 && (
                                            <span className="flex items-center">
                                                <Home className="w-4 h-4 mr-1" />
                                                {property.property_bedroom} Bed{parseInt(property.property_bedroom) !== 1 ? 's' : ''}
                                            </span>
                                        )}

                                        {property.property_bathroom && parseInt(property.property_bathroom) > 0 && (
                                            <span className="flex items-center">
                                                <Bath className="w-4 h-4 mr-1" />
                                                {property.property_bathroom} Bath{parseInt(property.property_bathroom) !== 1 ? 's' : ''}
                                            </span>
                                        )}

                                        {property.property_floor && parseInt(property.property_floor) > 0 && (
                                            <span className="flex items-center">
                                                <Maximize className="w-4 h-4 mr-1" />
                                                {property.property_floor} m²
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-6">
                                        <Link href={`/property/${property.id}`}>
                                            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-12 space-x-2">
                            {pagination.hasPrevPage && (
                                <Link href={getPageUrl(pagination.page - 1)}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </Button>
                                </Link>
                            )}

                            <div className="flex items-center px-4">
                                <span className="text-gray-600">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                            </div>

                            {pagination.hasNextPage && (
                                <Link href={getPageUrl(pagination.page + 1)}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 
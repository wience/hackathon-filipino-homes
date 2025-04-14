"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Home, Bath, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState<Property[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get the current page from URL or default to 1
    const currentPage = Number(searchParams.get("page") || 1);
    const searchQuery = searchParams.get("search") || "";

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
        const fetchProperties = async () => {
            setIsLoading(true);

            try {
                // Determine if we should call search API or regular properties API
                let url;
                if (searchQuery) {
                    url = `/api/semantic-search?q=${encodeURIComponent(searchQuery)}&limit=12`;
                } else {
                    url = `/api/properties?page=${currentPage}&limit=12`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();

                // Handle different response structures
                if (searchQuery) {
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
    }, [currentPage, searchQuery]);

    // Generate page URL for pagination
    const getPageUrl = (page: number) => {
        if (searchQuery) {
            return `/properties?search=${encodeURIComponent(searchQuery)}&page=${page}`;
        }
        return `/properties?page=${page}`;
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-8">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Properties"}
            </h1>

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
                                                {property.property_floor} sqm
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-5">
                                        <Link href={`/property/${property.id}`}>
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center space-x-2">
                                {pagination.hasPrevPage && (
                                    <Link href={getPageUrl(currentPage - 1)}>
                                        <Button
                                            variant="outline"
                                            className="flex items-center"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>
                                    </Link>
                                )}

                                <div className="flex space-x-1">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            // Always show first page, last page, current page, and pages around current
                                            return (
                                                page === 1 ||
                                                page === pagination.totalPages ||
                                                Math.abs(page - currentPage) <= 1
                                            );
                                        })
                                        .map((page, index, array) => {
                                            // Add ellipsis between non-consecutive numbers
                                            const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                                            const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;

                                            return (
                                                <div key={page} className="flex items-center">
                                                    {showEllipsisBefore && (
                                                        <span className="px-3 py-2">...</span>
                                                    )}

                                                    <Link href={getPageUrl(page)}>
                                                        <Button
                                                            variant={currentPage === page ? "default" : "outline"}
                                                            className={`w-10 h-10 p-0 ${currentPage === page ? 'bg-blue-600' : ''}`}
                                                        >
                                                            {page}
                                                        </Button>
                                                    </Link>

                                                    {showEllipsisAfter && (
                                                        <span className="px-3 py-2">...</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>

                                {pagination.hasNextPage && (
                                    <Link href={getPageUrl(currentPage + 1)}>
                                        <Button
                                            variant="outline"
                                            className="flex items-center"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 
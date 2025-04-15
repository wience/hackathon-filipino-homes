"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Home, Bath, Maximize, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";

interface PanoramaCardProps {
    property: Property;
}

export function PanoramaCard({ property }: PanoramaCardProps) {
    // Format currency
    const formatCurrency = (amount: string) => {
        const number = parseFloat(amount);
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
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
                <div className="absolute top-0 right-0 bg-blue-600 text-white py-1 px-3 m-2 rounded-md text-sm font-medium flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    360° Tour
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-blue-500 dark:text-blue-400" />
                        {property.property_address}
                    </span>
                </div>

                <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-gray-100 line-clamp-2">
                    {property.property_name}
                </h3>

                <p className="text-blue-600 dark:text-blue-400 text-xl font-bold mb-4">
                    {formatCurrency(property.property_price)}
                </p>

                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
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

                <div className="mt-auto pt-4">
                    <Link href={`/property/${property.id}`}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-700 dark:to-blue-500 dark:hover:from-blue-800 dark:hover:to-blue-600">
                            View 360° Tour
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
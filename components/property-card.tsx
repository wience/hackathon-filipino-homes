import Link from "next/link";
import Image from "next/image";
import { Home, MapPin, Maximize, Bath, Globe } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    property_description: string;
    category: {
        property_category_name: string;
    };
    isPanorama?: boolean;
}

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
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
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
                <Image
                    src={property.property_featured_photo}
                    alt={property.property_name}
                    fill
                    className="object-cover"
                />
                {property.isPanorama && (
                    <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700">
                        360° Tour
                    </Badge>
                )}
            </div>
            <CardContent className="p-4">
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{property.property_name}</h3>
                    <p className="text-sm text-gray-500">{property.property_address}</p>
                    <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(property.property_price)}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            <span>{property.property_bedroom} beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.property_bathroom} baths</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Maximize className="h-4 w-4" />
                            <span>{property.property_floor} sqm</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Link href={`/property/${property.id}`} className="w-full">
                    <Button className="w-full">
                        {property.isPanorama ? "View 360° Tour" : "View Details"}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
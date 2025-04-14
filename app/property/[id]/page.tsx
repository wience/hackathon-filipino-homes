"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Home, Bath, Maximize, Calendar, ArrowLeft, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    property_photos_url: string;
    property_description: string;
    category: {
        property_category_name: string;
    };
    property_date_listed: string;
    user?: {
        name: string;
        email: string;
        phone: string;
        photo: string;
    };
}

export default function PropertyDetail() {
    const params = useParams();
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);

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
        const fetchProperty = async () => {
            if (!params.id) return;

            setIsLoading(true);

            try {
                const response = await fetch(`/api/property/${params.id}`);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setProperty(data.property);

                // Parse photos URL if it exists
                if (data.property.property_photos_url) {
                    try {
                        const parsedPhotos = JSON.parse(data.property.property_photos_url);
                        setPhotos(Array.isArray(parsedPhotos) ? parsedPhotos : [data.property.property_featured_photo]);
                    } catch (e) {
                        // If parsing fails, use featured photo
                        setPhotos([data.property.property_featured_photo]);
                    }
                } else {
                    setPhotos([data.property.property_featured_photo]);
                }
            } catch (err) {
                console.error("Failed to fetch property:", err);
                setError("Failed to load property details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperty();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-20 px-4 flex justify-center items-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="container mx-auto py-20 px-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-8">
                    {error || "Property not found"}
                </div>
                <Link href="/properties">
                    <Button className="flex items-center bg-blue-600 hover:bg-blue-700">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Properties
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            {/* Back button */}
            <div className="mb-8">
                <Link href="/properties">
                    <Button variant="outline" className="flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Properties
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left column: Images and Details */}
                <div className="lg:col-span-2">
                    {/* Main Image */}
                    <div className="relative h-[400px] mb-4 rounded-xl overflow-hidden">
                        <Image
                            src={photos[selectedImageIndex] || property.property_featured_photo}
                            alt={property.property_name}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-xl"
                        />
                    </div>

                    {/* Image Gallery */}
                    {photos.length > 1 && (
                        <div className="flex overflow-x-auto space-x-2 mb-8">
                            {photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className={`relative h-20 w-32 flex-shrink-0 cursor-pointer rounded-md overflow-hidden ${index === selectedImageIndex ? "ring-2 ring-blue-600" : ""
                                        }`}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <Image
                                        src={photo}
                                        alt={`Property image ${index + 1}`}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Property Details */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{property.property_name}</h1>

                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                            <span>{property.property_address}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="bg-blue-50 rounded-md px-4 py-2 flex items-center">
                                <Home className="h-5 w-5 mr-2 text-blue-600" />
                                <span>
                                    {property.property_bedroom} Bed{parseInt(property.property_bedroom) !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="bg-blue-50 rounded-md px-4 py-2 flex items-center">
                                <Bath className="h-5 w-5 mr-2 text-blue-600" />
                                <span>
                                    {property.property_bathroom} Bath{parseInt(property.property_bathroom) !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="bg-blue-50 rounded-md px-4 py-2 flex items-center">
                                <Maximize className="h-5 w-5 mr-2 text-blue-600" />
                                <span>{property.property_floor} sqm</span>
                            </div>

                            <div className="bg-blue-50 rounded-md px-4 py-2 flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                <span>Listed on {property.property_date_listed}</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Description</h2>
                            <p className="text-gray-700 whitespace-pre-line">{property.property_description}</p>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Type</span>
                                    <span className="font-medium">{property.property_type}</span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Subtype</span>
                                    <span className="font-medium">{property.property_subtype}</span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-medium">{property.category?.property_category_name}</span>
                                </div>

                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Price</span>
                                    <span className="font-medium text-blue-600">{formatCurrency(property.property_price)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column: Agent contact and similar properties */}
                <div className="lg:col-span-1">
                    {/* Price Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">{formatCurrency(property.property_price)}</h2>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-4">Contact Agent</Button>
                        <Button variant="outline" className="w-full">Schedule Viewing</Button>
                    </div>

                    {/* Agent Card */}
                    {property.user && (
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4">Listed By</h2>
                            <div className="flex items-center mb-4">
                                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                                    <Image
                                        src={property.user.photo || "https://via.placeholder.com/100"}
                                        alt={property.user.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium">{property.user.name}</h3>
                                    <p className="text-gray-600 text-sm">Real Estate Agent</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {property.user.phone && (
                                    <a
                                        href={`tel:${property.user.phone}`}
                                        className="flex items-center text-gray-700 hover:text-blue-600"
                                    >
                                        <Phone className="h-5 w-5 mr-2" />
                                        <span>{property.user.phone}</span>
                                    </a>
                                )}

                                {property.user.email && (
                                    <a
                                        href={`mailto:${property.user.email}`}
                                        className="flex items-center text-gray-700 hover:text-blue-600"
                                    >
                                        <Mail className="h-5 w-5 mr-2" />
                                        <span>{property.user.email}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
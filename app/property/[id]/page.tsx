"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Home, Bath, Maximize, Calendar, ArrowLeft, Phone, Mail, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

// Hardcoded properties with panorama
const PANORAMA_PROPERTIES = {
    1: {
        id: 1,
        property_name: "Modern Living Room with Panoramic View",
        property_price: "5000000",
        property_address: "123 Panorama Street, Manila",
        property_bedroom: "3",
        property_bathroom: "2",
        property_floor: "150",
        property_type: "Residential",
        property_subtype: "Condominium",
        property_featured_photo: "/images/panorama-living-room.jpg",
        property_photos_url: "[]",
        property_description: "Experience this stunning modern living room in 360° view. The space features contemporary design with ample natural light and premium finishes.",
        category: {
            property_category_name: "Luxury"
        },
        property_date_listed: "2024-04-14",
        user: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+63 912 345 6789",
            photo: "https://via.placeholder.com/100"
        }
    },
    2: {
        id: 2,
        property_name: "Modern Empty Interior with Panoramic View",
        property_price: "4500000",
        property_address: "456 Modern Avenue, Makati",
        property_bedroom: "2",
        property_bathroom: "2",
        property_floor: "120",
        property_type: "Residential",
        property_subtype: "Condominium",
        property_featured_photo: "/images/empty-modern-room.jpg",
        property_photos_url: "[]",
        property_description: "A modern empty interior space perfect for customization. Features clean lines, abundant natural light, and a contemporary design aesthetic.",
        category: {
            property_category_name: "Modern"
        },
        property_date_listed: "2024-04-14",
        user: {
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+63 917 654 3210",
            photo: "https://via.placeholder.com/100"
        }
    }
};

export default function PropertyDetail() {
    const params = useParams();
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);
    const [favorite, setFavorite] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

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
            if (!params.id || Array.isArray(params.id)) return;

            setIsLoading(true);

            try {
                // If it's a panorama property, use hardcoded data
                const propertyId = parseInt(params.id);
                if (propertyId === 1 || propertyId === 2) {
                    const property = PANORAMA_PROPERTIES[propertyId as keyof typeof PANORAMA_PROPERTIES];
                    setProperty(property);
                    setPhotos([property.property_featured_photo]);
                    setIsLoading(false);
                    return;
                }

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

    useEffect(() => {
        if (!containerRef.current) return;

        // Create scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Create camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 1;
        cameraRef.current = camera;

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controlsRef.current = controls;

        // Create sphere geometry
        const geometry = new THREE.SphereGeometry(1, 60, 40);
        geometry.scale(-1, 1, 1);

        // Load texture
        const textureLoader = new THREE.TextureLoader();
        const imageUrl = property?.property_featured_photo || "";
        console.log("Loading texture from:", imageUrl);

        textureLoader.load(
            imageUrl,
            (texture: THREE.Texture) => {
                console.log("Texture loaded successfully");
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });
                const sphere = new THREE.Mesh(geometry, material);
                scene.add(sphere);
            },
            undefined,
            (error) => {
                console.error("Error loading texture:", error);
            }
        );

        // Handle window resize
        const handleResize = () => {
            if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            if (controlsRef.current) {
                controlsRef.current.update();
            }
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            if (containerRef.current && rendererRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, [property]);

    const navigateImages = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setSelectedImageIndex((prev) => (prev + 1) % photos.length);
        } else {
            setSelectedImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                {/* Skeleton Hero Section */}
                <div className="relative bg-gradient-to-b from-blue-900/80 to-blue-900/40">
                    <div className="container mx-auto py-8 px-4">
                        <div className="h-10 w-32 mb-4">
                            <Skeleton className="h-full w-full rounded-md" />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div className="space-y-2 w-full md:w-2/3">
                                <Skeleton className="h-8 w-32 mb-2" />
                                <Skeleton className="h-10 w-3/4 mb-2" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto py-8 px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left column skeletons */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Image Gallery Skeleton */}
                            <Card>
                                <Skeleton className="h-[500px] w-full rounded-t-lg" />
                                <div className="flex p-2 gap-2 bg-gray-50">
                                    {[1, 2, 3, 4].map((_, i) => (
                                        <Skeleton key={i} className="h-20 w-32 rounded-md" />
                                    ))}
                                </div>
                            </Card>

                            {/* Property Stats Skeleton */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((_, i) => (
                                    <Card key={i} className="p-4">
                                        <div className="flex flex-col items-center space-y-2">
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-6 w-8" />
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* About Property Skeleton */}
                            <Card className="p-6">
                                <Skeleton className="h-7 w-48 mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </Card>

                            {/* Property Details Skeleton */}
                            <Card className="p-6">
                                <Skeleton className="h-7 w-48 mb-4" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-2" />
                                            <Skeleton className="h-6 w-32" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-2" />
                                            <Skeleton className="h-6 w-32" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-2" />
                                            <Skeleton className="h-6 w-32" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-2" />
                                            <Skeleton className="h-6 w-32" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right column skeletons */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Actions Card Skeleton */}
                            <Card className="p-6">
                                <div className="h-full flex flex-col">
                                    <Skeleton className="h-7 w-48 mb-4" />
                                    <div className="grow"></div>
                                    <div className="space-y-3 mt-auto">
                                        <Skeleton className="h-12 w-full" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                </div>
                            </Card>

                            {/* Agent Card Skeleton */}
                            <Card className="p-6">
                                <Skeleton className="h-7 w-32 mb-4" />
                                <div className="flex items-center mb-6">
                                    <Skeleton className="h-16 w-16 rounded-full mr-4" />
                                    <div>
                                        <Skeleton className="h-6 w-32 mb-2" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                </div>
                            </Card>

                            {/* Map Preview Skeleton */}
                            <Card>
                                <Skeleton className="h-[200px] w-full rounded-t-lg" />
                                <div className="p-4">
                                    <Skeleton className="h-6 w-32 mb-2" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </Card>
                        </div>
                    </div>
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
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-blue-900/80 to-blue-900/40 text-white">
                <div className="container mx-auto py-8 px-4">
                    {/* Back button */}
                    <div className="mb-4">
                        <Link href="/properties">
                            <Button variant="ghost" className="flex items-center text-white hover:bg-white/20">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Properties
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <Badge className="mb-2 bg-blue-500 hover:bg-blue-600">{property.category?.property_category_name}</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.property_name}</h1>
                            <div className="flex items-center text-gray-100">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm md:text-base">{property.property_address}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <h2 className="text-2xl md:text-3xl font-bold">{formatCurrency(property.property_price)}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column: Images and Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <Card className="overflow-hidden">
                            {/* Main Image */}
                            <div className="relative h-[500px] overflow-hidden group">
                                {(params.id === "1" || params.id === "2") ? (
                                    <div className="h-[500px] w-full" ref={containerRef} />
                                ) : (
                                    <Image
                                        src={photos[selectedImageIndex] || property?.property_featured_photo || ""}
                                        alt={property?.property_name || ""}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className="transition-transform duration-500 group-hover:scale-105"
                                    />
                                )}

                                {/* Image Navigation - Only show for non-panorama properties */}
                                {params.id !== "1" && params.id !== "2" && photos.length > 1 && (
                                    <>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute top-1/2 left-4 -translate-y-1/2 opacity-80 hover:opacity-100 bg-white/90 text-gray-800 shadow-md"
                                            onClick={() => navigateImages('prev')}
                                        >
                                            <ChevronLeft />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute top-1/2 right-4 -translate-y-1/2 opacity-80 hover:opacity-100 bg-white/90 text-gray-800 shadow-md"
                                            onClick={() => navigateImages('next')}
                                        >
                                            <ChevronRight />
                                        </Button>
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="bg-white/90 text-gray-800 shadow-md hover:bg-white"
                                        onClick={() => setFavorite(!favorite)}
                                    >
                                        <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="bg-white/90 text-gray-800 shadow-md hover:bg-white"
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {photos.length > 1 && (
                                <div className="flex overflow-x-auto p-2 gap-2 bg-gray-50">
                                    {photos.map((photo, index) => (
                                        <div
                                            key={index}
                                            className={`relative h-20 w-32 flex-shrink-0 cursor-pointer rounded-md overflow-hidden
                                                ${index === selectedImageIndex ? "ring-2 ring-blue-600" : "opacity-70 hover:opacity-100"}`}
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
                        </Card>

                        {/* Property Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="p-4 flex flex-col items-center justify-center text-center">
                                <Home className="h-6 w-6 text-blue-600 mb-2" />
                                <span className="text-sm text-gray-500">Bedrooms</span>
                                <span className="text-xl font-bold">{property.property_bedroom}</span>
                            </Card>

                            <Card className="p-4 flex flex-col items-center justify-center text-center">
                                <Bath className="h-6 w-6 text-blue-600 mb-2" />
                                <span className="text-sm text-gray-500">Bathrooms</span>
                                <span className="text-xl font-bold">{property.property_bathroom}</span>
                            </Card>

                            <Card className="p-4 flex flex-col items-center justify-center text-center">
                                <Maximize className="h-6 w-6 text-blue-600 mb-2" />
                                <span className="text-sm text-gray-500">Area</span>
                                <span className="text-xl font-bold">{property.property_floor} sqm</span>
                            </Card>

                            <Card className="p-4 flex flex-col items-center justify-center text-center">
                                <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                                <span className="text-sm text-gray-500">Listed on</span>
                                <span className="text-sm font-medium">{property.property_date_listed}</span>
                            </Card>
                        </div>

                        {/* About Property */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">About this property</h2>
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{property.property_description}</p>
                        </Card>

                        {/* Property Details */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Property Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-gray-500 block">Property Type</span>
                                        <span className="font-medium">{property.property_type}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 block">Subtype</span>
                                        <span className="font-medium">{property.property_subtype}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-gray-500 block">Category</span>
                                        <span className="font-medium">{property.category?.property_category_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 block">Price</span>
                                        <span className="font-medium text-blue-600">{formatCurrency(property.property_price)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right column: Agent contact and actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Actions Card */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Interested in this property?</h2>
                            <div className="space-y-3">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6">Contact Agent</Button>
                                <Button variant="outline" className="w-full py-6">Schedule Viewing</Button>
                            </div>
                        </Card>

                        {/* Agent Card */}
                        {property.user && (
                            <Card className="p-6 bg-gradient-to-br from-white to-blue-50">
                                <h2 className="text-xl font-semibold mb-4">Listed By</h2>
                                <div className="flex items-center mb-6">
                                    <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 ring-2 ring-blue-100">
                                        <Image
                                            src={property.user.photo || "https://via.placeholder.com/100"}
                                            alt={property.user.name}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">{property.user.name}</h3>
                                        <p className="text-gray-600 text-sm">Real Estate Agent</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {property.user.phone && (
                                        <a
                                            href={`tel:${property.user.phone}`}
                                            className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow text-gray-700 hover:text-blue-600 transition-all"
                                        >
                                            <Phone className="h-5 w-5 mr-3 text-blue-500" />
                                            <span>{property.user.phone}</span>
                                        </a>
                                    )}

                                    {property.user.email && (
                                        <a
                                            href={`mailto:${property.user.email}`}
                                            className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow text-gray-700 hover:text-blue-600 transition-all"
                                        >
                                            <Mail className="h-5 w-5 mr-3 text-blue-500" />
                                            <span>{property.user.email}</span>
                                        </a>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Map Preview Card */}
                        <Card className="overflow-hidden">
                            <div className="relative h-[200px] bg-gray-200">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MapPin className="h-8 w-8 text-blue-600" />
                                    <span className="text-sm text-gray-600 absolute mt-8">Map view coming soon</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium">Property Location</h3>
                                <p className="text-sm text-gray-600">{property.property_address}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
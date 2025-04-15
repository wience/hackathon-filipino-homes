"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Home, Bath, Maximize, Calendar, ArrowLeft, Phone, Mail, Heart, Share2, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MapboxMap from "@/components/MapboxMap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PanoramaCard } from "@/components/panorama-card";

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
    property_location_geo_coordinates?: string;
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
    const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
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

                // Parse geo coordinates if they exist
                if (data.property.property_location_geo_coordinates) {
                    try {
                        const parsedCoordinates = JSON.parse(data.property.property_location_geo_coordinates);
                        if (Array.isArray(parsedCoordinates) && parsedCoordinates.length > 0) {
                            const coordinates = parsedCoordinates[0];
                            setMapCoordinates({
                                lat: parseFloat(coordinates.latitude),
                                lng: parseFloat(coordinates.longitude)
                            });
                        }
                    } catch (e) {
                        console.error("Failed to parse coordinates:", e);
                    }
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
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                {/* Skeleton Hero Section */}
                <div className="relative bg-gradient-to-b from-blue-900/80 to-blue-900/40 dark:from-blue-950/90 dark:to-gray-900/100">
                    <div className="container mx-auto py-8 px-4">
                        <div className="h-10 w-32 mb-4">
                            <Skeleton className="h-full w-full rounded-md dark:bg-gray-700" />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div className="space-y-2 w-full md:w-2/3">
                                <Skeleton className="h-8 w-32 mb-2 dark:bg-gray-700" />
                                <Skeleton className="h-10 w-3/4 mb-2 dark:bg-gray-700" />
                                <Skeleton className="h-6 w-1/2 dark:bg-gray-700" />
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Skeleton className="h-10 w-32 dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto py-8 px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left column skeletons */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Image Gallery Skeleton */}
                            <Card className="dark:bg-gray-800 dark:border-gray-700">
                                <Skeleton className="h-[500px] w-full rounded-t-lg dark:bg-gray-700" />
                                <div className="flex p-2 gap-2 bg-gray-50 dark:bg-gray-700">
                                    {[1, 2, 3, 4].map((_, i) => (
                                        <Skeleton key={i} className="h-20 w-32 rounded-md dark:bg-gray-600" />
                                    ))}
                                </div>
                            </Card>

                            {/* Property Stats Skeleton */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((_, i) => (
                                    <Card key={i} className="p-4 dark:bg-gray-800 dark:border-gray-700">
                                        <div className="flex flex-col items-center space-y-2">
                                            <Skeleton className="h-6 w-6 rounded-full dark:bg-gray-700" />
                                            <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                                            <Skeleton className="h-6 w-8 dark:bg-gray-700" />
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* About Property Skeleton */}
                            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                                <Skeleton className="h-7 w-48 mb-4 dark:bg-gray-700" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full dark:bg-gray-700" />
                                    <Skeleton className="h-4 w-full dark:bg-gray-700" />
                                    <Skeleton className="h-4 w-full dark:bg-gray-700" />
                                    <Skeleton className="h-4 w-3/4 dark:bg-gray-700" />
                                </div>
                            </Card>

                            {/* Property Details Skeleton */}
                            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                                <Skeleton className="h-7 w-48 mb-4 dark:bg-gray-700" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-2 dark:bg-gray-700" />
                                            <Skeleton className="h-6 w-32 dark:bg-gray-700" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-2 dark:bg-gray-700" />
                                            <Skeleton className="h-6 w-32 dark:bg-gray-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-2 dark:bg-gray-700" />
                                            <Skeleton className="h-6 w-32 dark:bg-gray-700" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-2 dark:bg-gray-700" />
                                            <Skeleton className="h-6 w-32 dark:bg-gray-700" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right column skeletons */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Actions Card Skeleton */}
                            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                                <div className="h-full flex flex-col">
                                    <Skeleton className="h-7 w-48 mb-4 dark:bg-gray-700" />
                                    <div className="grow"></div>
                                    <div className="space-y-3 mt-auto">
                                        <Skeleton className="h-12 w-full dark:bg-gray-700" />
                                        <Skeleton className="h-12 w-full dark:bg-gray-700" />
                                    </div>
                                </div>
                            </Card>

                            {/* Agent Card Skeleton */}
                            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                                <Skeleton className="h-7 w-32 mb-4 dark:bg-gray-700" />
                                <div className="flex items-center mb-6">
                                    <Skeleton className="h-16 w-16 rounded-full mr-4 dark:bg-gray-700" />
                                    <div>
                                        <Skeleton className="h-6 w-32 mb-2 dark:bg-gray-700" />
                                        <Skeleton className="h-4 w-24 dark:bg-gray-700" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-12 w-full rounded-lg dark:bg-gray-700" />
                                    <Skeleton className="h-12 w-full rounded-lg dark:bg-gray-700" />
                                </div>
                            </Card>

                            {/* Map Preview Skeleton */}
                            <Card className="dark:bg-gray-800 dark:border-gray-700">
                                <Skeleton className="h-[200px] w-full rounded-t-lg dark:bg-gray-700" />
                                <div className="p-4">
                                    <Skeleton className="h-6 w-32 mb-2 dark:bg-gray-700" />
                                    <Skeleton className="h-4 w-48 dark:bg-gray-700" />
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
                <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-4 py-3 rounded-md mb-8">
                    {error || "Property not found"}
                </div>
                <Link href="/properties">
                    <Button className="flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Properties
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-blue-900/80 to-blue-900/40 dark:from-blue-950/90 dark:to-gray-900/100 text-white">
                <div className="container mx-auto py-8 px-4">
                    {/* Back button */}
                    <div className="mb-4">
                        <Link href="/properties">
                            <Button variant="ghost" className="flex items-center text-white hover:bg-white/20 dark:hover:bg-gray-800/30">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Properties
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <Badge className="mb-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">{property.category?.property_category_name}</Badge>
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
                        <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
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
                                            className="absolute top-1/2 left-4 -translate-y-1/2 opacity-80 hover:opacity-100 bg-white/90 text-gray-800 dark:bg-gray-800/90 dark:text-gray-200 shadow-md"
                                            onClick={() => navigateImages('prev')}
                                        >
                                            <ChevronLeft />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute top-1/2 right-4 -translate-y-1/2 opacity-80 hover:opacity-100 bg-white/90 text-gray-800 dark:bg-gray-800/90 dark:text-gray-200 shadow-md"
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
                                        className="bg-white/90 text-gray-800 shadow-md hover:bg-white dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-800"
                                        onClick={() => setFavorite(!favorite)}
                                    >
                                        <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="bg-white/90 text-gray-800 shadow-md hover:bg-white dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-800"
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {photos.length > 1 && (
                                <div className="flex overflow-x-auto p-2 gap-2 bg-gray-50 dark:bg-gray-700">
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
                            <Card className="p-4 flex flex-col items-center justify-center text-center dark:bg-gray-800 dark:border-gray-700">
                                <Home className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</span>
                                <span className="text-xl font-bold dark:text-gray-100">{property.property_bedroom}</span>
                            </Card>

                            <Card className="p-4 flex flex-col items-center justify-center text-center dark:bg-gray-800 dark:border-gray-700">
                                <Bath className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</span>
                                <span className="text-xl font-bold dark:text-gray-100">{property.property_bathroom}</span>
                            </Card>

                            <Card className="p-4 flex flex-col items-center justify-center text-center dark:bg-gray-800 dark:border-gray-700">
                                <Maximize className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Area</span>
                                <span className="text-xl font-bold dark:text-gray-100">{property.property_floor} sqm</span>
                            </Card>

                            <Card className="p-4 flex flex-col items-center justify-center text-center dark:bg-gray-800 dark:border-gray-700">
                                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Listed on</span>
                                <span className="text-sm font-medium dark:text-gray-300">{property.property_date_listed}</span>
                            </Card>
                        </div>

                        {/* About Property */}
                        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b dark:border-gray-700 dark:text-gray-100">About this property</h2>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{property.property_description}</p>
                        </Card>

                        {/* Property Details */}
                        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b dark:border-gray-700 dark:text-gray-100">Property Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 block">Property Type</span>
                                        <span className="font-medium dark:text-gray-200">{property.property_type}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 block">Subtype</span>
                                        <span className="font-medium dark:text-gray-200">{property.property_subtype}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 block">Category</span>
                                        <span className="font-medium dark:text-gray-200">{property.category?.property_category_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 block">Price</span>
                                        <span className="font-medium text-blue-600 dark:text-blue-400">{formatCurrency(property.property_price)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right column: Agent contact and actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Actions Card */}
                        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Interested in this property?</h2>
                            <div className="space-y-3">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 py-6">Contact Agent</Button>
                                <Button variant="outline" className="w-full py-6 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">Schedule Viewing</Button>
                            </div>
                        </Card>

                        {/* Agent Card */}
                        {property.user && (
                            <Card className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
                                <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Listed By</h2>
                                <div className="flex items-center mb-6">
                                    <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 ring-2 ring-blue-100 dark:ring-blue-900">
                                        <Image
                                            src={property.user.photo || "https://via.placeholder.com/100"}
                                            alt={property.user.name}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg dark:text-gray-100">{property.user.name}</h3>
                                        <p className="text-gray-600 text-sm dark:text-gray-400">Real Estate Agent</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {property.user.phone && (
                                        <a
                                            href={`tel:${property.user.phone}`}
                                            className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                        >
                                            <Phone className="h-5 w-5 mr-3 text-blue-500 dark:text-blue-400" />
                                            <span>{property.user.phone}</span>
                                        </a>
                                    )}

                                    {property.user.email && (
                                        <a
                                            href={`mailto:${property.user.email}`}
                                            className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                        >
                                            <Mail className="h-5 w-5 mr-3 text-blue-500 dark:text-blue-400" />
                                            <span>{property.user.email}</span>
                                        </a>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Map Preview Card */}
                        <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                            <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
                                <DialogTrigger asChild>
                                    <div className="relative h-[200px] bg-gray-200 dark:bg-gray-700 cursor-pointer hover:opacity-95 transition-opacity">
                                        {mapCoordinates ? (
                                            <div className="h-full w-full relative">
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10 flex items-center justify-center">
                                                    <Button
                                                        variant="secondary"
                                                        className="bg-white/90 text-gray-800 dark:bg-gray-800/90 dark:text-gray-200 shadow-md hover:bg-white dark:hover:bg-gray-800 hover:scale-105 transition-transform"
                                                    >
                                                        <MapPin className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                                        View on Map
                                                    </Button>
                                                </div>
                                                <div className="h-full w-full">
                                                    <MapboxMap
                                                        center={mapCoordinates}
                                                        zoom={15}
                                                        radius={20}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                                                <span className="text-sm text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full">No map coordinates available</span>
                                            </div>
                                        )}
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 overflow-hidden dark:bg-gray-800">
                                    <div className="relative h-[80vh] w-full">
                                        <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 m-4 rounded-lg shadow-md">
                                            <DialogTitle className="flex items-center dark:text-gray-100">
                                                <MapPin className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                                Property Location
                                            </DialogTitle>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{property.property_address}</p>
                                        </DialogHeader>

                                        {mapCoordinates ? (
                                            <MapboxMap
                                                center={mapCoordinates}
                                                zoom={16}
                                                radius={20}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
                                                <p className="text-gray-500 dark:text-gray-400">No location coordinates available for this property</p>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <div className="p-4">
                                <h3 className="font-medium flex items-center dark:text-gray-100">
                                    <MapPin className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                    Property Location
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{property.property_address}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
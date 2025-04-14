"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Building, Home, MapPin, Save, Upload, X, Loader2, CheckCircle, CalculatorIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import PropertyAppraisalModal from '../../../components/property-appraisal-modal';

export default function NewPropertyPage() {
    const router = useRouter();
    // Form state
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        propertyType: "",
        propertySubtype: "For Sale", // Default value
        address: "",
        city: "",
        province: "",
        price: "",
        landSize: "",
        floorArea: "",
        bedrooms: "",
        bathrooms: "",
        garageSpaces: "",
        amenities: [] as string[],
        mainImage: "",
        additionalImages: [] as string[]
    });

    // Modal state for appraisal
    const [showAppraisalModal, setShowAppraisalModal] = React.useState(false);
    const [appraisalData, setAppraisalData] = React.useState<any>(null);
    const [isLoadingAppraisal, setIsLoadingAppraisal] = React.useState(false);
    const [appraisalError, setAppraisalError] = React.useState<string | null>(null);

    // Form submission state
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitStatus, setSubmitStatus] = React.useState<{
        success: boolean;
        message: string;
    } | null>(null);

    // State for image URLs
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [additionalImageUrls, setAdditionalImageUrls] = React.useState<string[]>([]);
    const [errorImages, setErrorImages] = React.useState<Set<string>>(new Set());

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({
                ...formData,
                amenities: [...formData.amenities, value]
            });
        } else {
            setFormData({
                ...formData,
                amenities: formData.amenities.filter(amenity => amenity !== value)
            });
        }
    };

    // Handle main image change
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setMainImageUrl(url);
        setFormData({
            ...formData,
            mainImage: url
        });
    };

    // Handle additional images change
    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Split by newlines and filter out empty lines
        const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
        setAdditionalImageUrls(urls);
        setFormData({
            ...formData,
            additionalImages: urls
        });
    };

    // Handle image load error
    const handleImageError = (url: string) => {
        setErrorImages(prev => new Set(prev).add(url));
    };

    // Remove an additional image
    const removeAdditionalImage = (index: number) => {
        const newUrls = [...additionalImageUrls];
        newUrls.splice(index, 1);
        setAdditionalImageUrls(newUrls);
        setFormData({
            ...formData,
            additionalImages: newUrls
        });

        // Update the textarea with the new URLs
        const textarea = document.getElementById('additional-images') as HTMLTextAreaElement;
        if (textarea) {
            textarea.value = newUrls.join('\n');
        }
    };

    // Clear main image
    const clearMainImage = () => {
        setMainImageUrl("");
        setFormData({
            ...formData,
            mainImage: ""
        });
        const input = document.getElementById('main-image') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
    };

    // Get property appraisal
    const getAppraisalValue = async () => {
        setIsLoadingAppraisal(true);
        setAppraisalError(null);

        try {
            // Format property data for the appraisal API
            const propertyDataPrompt = `
Property Title: ${formData.title}
Property Type: ${formData.propertyType}
Listing Type: ${formData.propertySubtype}
Address: ${formData.address}
City: ${formData.city}
Province: ${formData.province}
Price: PHP ${formData.price}
Land Size: ${formData.landSize} sqm
Floor Area: ${formData.floorArea} sqm
Bedrooms: ${formData.bedrooms}
Bathrooms: ${formData.bathrooms}
Garage Spaces: ${formData.garageSpaces}
Amenities: ${formData.amenities.join(', ')}
Description: ${formData.description}
            `;

            const response = await fetch('/api/property/appraisal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ propertyData: propertyDataPrompt }),
            });

            if (!response.ok) {
                throw new Error('Failed to get property appraisal');
            }

            const data = await response.json();
            setAppraisalData(data);
            setShowAppraisalModal(true);
        } catch (error) {
            console.error('Error getting property appraisal:', error);
            setAppraisalError('Failed to get property appraisal. Please try again later.');
        } finally {
            setIsLoadingAppraisal(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/property/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus({
                    success: true,
                    message: result.message || 'Property created successfully!'
                });

                // Redirect to profile after a brief delay
                setTimeout(() => {
                    router.push('/profile');
                }, 2000);
            } else {
                setSubmitStatus({
                    success: false,
                    message: result.error || 'Failed to create property'
                });
            }
        } catch (error) {
            setSubmitStatus({
                success: false,
                message: 'An unexpected error occurred'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render the appraisal modal
    const AppraisalModal = () => {
        return (
            <PropertyAppraisalModal
                isOpen={showAppraisalModal}
                onClose={() => setShowAppraisalModal(false)}
                appraisalData={appraisalData}
            />
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <Link
                        href="/profile"
                        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        <span className="text-sm">Back to Profile</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Listing</h1>
                </div>

                {submitStatus && (
                    <div className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'}`}>
                        <div className="flex items-center">
                            {submitStatus.success ? (
                                <CheckCircle className="h-5 w-5 mr-2" />
                            ) : (
                                <X className="h-5 w-5 mr-2" />
                            )}
                            <p>{submitStatus.message}</p>
                        </div>
                    </div>
                )}

                {appraisalError && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                        <div className="flex items-center">
                            <X className="h-5 w-5 mr-2" />
                            <p>{appraisalError}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Basic Info Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Home className="h-5 w-5 mr-2 text-blue-500" />
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Property Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. Beautiful House and Lot in Cebu City"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Description *
                                        </label>
                                        <textarea
                                            rows={4}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Describe your property..."
                                            required
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Property Type *
                                        </label>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="House and Lot">House and Lot</option>
                                            <option value="Condominium">Condominium</option>
                                            <option value="Apartment">Apartment</option>
                                            <option value="Land">Land</option>
                                            <option value="Commercial Property">Commercial Property</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Listing Type *
                                        </label>
                                        <select
                                            name="propertySubtype"
                                            value={formData.propertySubtype}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="For Sale">For Sale</option>
                                            <option value="For Rent">For Rent</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Location Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-red-500" />
                                    Location
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 123 Main Street"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. Cebu City"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Province *
                                        </label>
                                        <input
                                            type="text"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. Cebu"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Building className="h-5 w-5 mr-2 text-yellow-500" />
                                    Property Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Price (PHP) *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 5000000"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Land Size (sqm)
                                        </label>
                                        <input
                                            type="number"
                                            name="landSize"
                                            value={formData.landSize}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 150"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Floor Area (sqm)
                                        </label>
                                        <input
                                            type="number"
                                            name="floorArea"
                                            value={formData.floorArea}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Bedrooms
                                        </label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Bathrooms
                                        </label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Garage Spaces
                                        </label>
                                        <input
                                            type="number"
                                            name="garageSpaces"
                                            value={formData.garageSpaces}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Amenities Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Amenities
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {["Swimming Pool", "Gym", "Security", "Parking", "Garden", "Balcony",
                                        "Air Conditioning", "Furnished", "Pet Friendly", "WiFi"].map((amenity) => (
                                            <div key={amenity} className="flex items-center">
                                                <input
                                                    id={`amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                                                    type="checkbox"
                                                    name="amenities"
                                                    value={amenity}
                                                    onChange={handleCheckboxChange}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                />
                                                <label
                                                    htmlFor={`amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                                >
                                                    {amenity}
                                                </label>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Photos Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Upload className="h-5 w-5 mr-2 text-green-500" />
                                    Photos
                                </h2>

                                <div className="space-y-6">
                                    {/* Main Image */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Main Image URL *
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                id="main-image"
                                                type="text"
                                                name="mainImage"
                                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g. https://example.com/image.jpg"
                                                onChange={handleMainImageChange}
                                                required
                                            />
                                            {mainImageUrl && (
                                                <button
                                                    type="button"
                                                    onClick={clearMainImage}
                                                    className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Image Preview */}
                                        {mainImageUrl && (
                                            <div className="mt-3">
                                                <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-64 w-full bg-gray-100 dark:bg-gray-800">
                                                    {!errorImages.has(mainImageUrl) ? (
                                                        <img
                                                            src={mainImageUrl}
                                                            alt="Property main image"
                                                            className="h-full w-full object-cover"
                                                            onError={() => handleImageError(mainImageUrl)}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full w-full text-red-500">
                                                            <p className="text-sm">Failed to load image</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Images */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Additional Image URLs (one per line)
                                        </label>
                                        <textarea
                                            id="additional-images"
                                            name="additionalImages"
                                            rows={3}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                            onChange={handleAdditionalImagesChange}
                                        ></textarea>

                                        {/* Additional Images Preview */}
                                        {additionalImageUrls.length > 0 && (
                                            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {additionalImageUrls.map((url, index) => (
                                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-36 bg-gray-100 dark:bg-gray-800">
                                                        {!errorImages.has(url) ? (
                                                            <>
                                                                <img
                                                                    src={url}
                                                                    alt={`Property image ${index + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                    onError={() => handleImageError(url)}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeAdditionalImage(index)}
                                                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full w-full text-red-500">
                                                                <p className="text-xs">Failed to load image</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeAdditionalImage(index)}
                                                                    className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Contact Information
                                </h2>
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        Your contact information will be shown with this listing:
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24">Name:</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Maria Santos</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24">Phone:</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">+63 912 345 6789</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24">Email:</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">maria.santos@example.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit and Appraisal Buttons */}
                            <div className="flex justify-center gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={getAppraisalValue}
                                    disabled={isLoadingAppraisal}
                                    className="py-3 px-8 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoadingAppraisal ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CalculatorIcon className="h-5 w-5" />
                                            Get Appraisal Value
                                        </>
                                    )}
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5" />
                                            Create Listing
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Render the appraisal modal */}
            <AppraisalModal />
        </div>
    );
} 
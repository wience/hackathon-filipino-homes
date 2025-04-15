import React from "react";
import { X, ChevronDown, ChevronUp, BarChart, Building, MapPin, Home, Calculator, Clock, FileText, Award, Calendar, Globe, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ProjectReportPDF } from "./pdf/project-report-pdf";

interface AppraisalData {
    market_data: {
        comparable_sales: string;
        active_listings: string;
        government_values: string;
    };
    purpose_of_appraisal: string;
    rental_income_potential: {
        monthly_rental_income: number;
        occupancy_rates: number;
    };
    valuation_process: {
        base_valuation: string;
        adjustment_factors: string;
        market_comparison: string;
        rental_income_valuation: string;
        aggregate_valuation: string;
        agent_fee: number;
    };
    proximity_data: {
        nearest_locations: string;
        festivals_events: string;
    };
    error?: string;
}

// Define the property project data interface
interface PropertyProjectData {
    project_name: string;
    location: {
        city: string;
        province: string;
        country: string;
        latitude: string;
        longitude: string;
    };
    last_updated: string;
    property_details: {
        type: string;
        subtype: string;
        bedrooms: string;
        bathrooms: string;
        land_size: string;
        floor_area: string;
        amenities: string[];
    };
    price: string;
    description: string;
}

interface PropertyAppraisalModalProps {
    isOpen: boolean;
    onClose: () => void;
    appraisalData: AppraisalData | null;
    formData?: any; // Form data from the page
}

interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    icon,
    defaultOpen = false,
    children,
}) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between font-medium text-gray-900 dark:text-white"
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
            </button>
            {isOpen && <div className="p-4">{children}</div>}
        </div>
    );
};

const PropertyAppraisalModal: React.FC<PropertyAppraisalModalProps> = ({
    isOpen,
    onClose,
    appraisalData,
    formData
}) => {
    if (!isOpen || !appraisalData) return null;

    // Check if there's an error in the appraisal data
    if (appraisalData.error) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Error</h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="p-6">
                        <p className="text-red-500 dark:text-red-400">{appraisalData.error}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Prepare project data structure based on the form data
    const projectData: PropertyProjectData = {
        project_name: formData?.title || "Property Listing",
        location: {
            city: formData?.city || "",
            province: formData?.province || "",
            country: "Philippines",
            latitude: "14.5995",  // Defaults for Philippines
            longitude: "120.9842"
        },
        last_updated: new Date().toISOString(),
        property_details: {
            type: formData?.propertyType || "",
            subtype: formData?.propertySubtype || "",
            bedrooms: formData?.bedrooms || "",
            bathrooms: formData?.bathrooms || "",
            land_size: formData?.landSize || "",
            floor_area: formData?.floorArea || "",
            amenities: formData?.amenities || []
        },
        price: formData?.price || "",
        description: formData?.description || ""
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                            <Calculator className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Property Appraisal Result</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">AI-generated valuation and market analysis</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Valuation Process */}
                    <CollapsibleSection
                        title="Valuation Process"
                        icon={<Calculator className="h-5 w-5 text-green-500" />}
                        defaultOpen={true}
                    >
                        <div className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                                <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Aggregate Valuation</p>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                    {appraisalData.valuation_process.aggregate_valuation}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Base Valuation</p>
                                    <p className="text-gray-900 dark:text-white">{appraisalData.valuation_process.base_valuation}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Agent Fee</p>
                                    <p className="text-gray-900 dark:text-white">PHP {appraisalData.valuation_process.agent_fee.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Adjustment Factors</p>
                                <p className="text-gray-900 dark:text-white">{appraisalData.valuation_process.adjustment_factors}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Market Comparison</p>
                                    <p className="text-gray-900 dark:text-white">{appraisalData.valuation_process.market_comparison}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Rental Income Valuation</p>
                                    <p className="text-gray-900 dark:text-white">{appraisalData.valuation_process.rental_income_valuation}</p>
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Rental Income Potential */}
                    <CollapsibleSection
                        title="Rental Income Potential"
                        icon={<Award className="h-5 w-5 text-amber-500" />}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Rental Income</p>
                                <p className="text-gray-900 dark:text-white">
                                    PHP {appraisalData.rental_income_potential.monthly_rental_income.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Occupancy Rates</p>
                                <p className="text-gray-900 dark:text-white">
                                    {appraisalData.rental_income_potential.occupancy_rates}%
                                </p>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Market Data */}
                    <CollapsibleSection
                        title="Market Data"
                        icon={<BarChart className="h-5 w-5 text-orange-500" />}
                    >
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Comparable Sales</p>
                                <p className="text-gray-900 dark:text-white">{appraisalData.market_data.comparable_sales}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Active Listings</p>
                                <p className="text-gray-900 dark:text-white">{appraisalData.market_data.active_listings}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Government Values</p>
                                <p className="text-gray-900 dark:text-white">{appraisalData.market_data.government_values}</p>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Proximity Data */}
                    <CollapsibleSection
                        title="Proximity Data"
                        icon={<Globe className="h-5 w-5 text-cyan-500" />}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Nearest Locations</p>
                                <p className="text-gray-900 dark:text-white">{appraisalData.proximity_data.nearest_locations}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">Festivals & Events</p>
                                <p className="text-gray-900 dark:text-white">{appraisalData.proximity_data.festivals_events}</p>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Purpose of Appraisal */}
                    <CollapsibleSection
                        title="Purpose of Appraisal"
                        icon={<Calendar className="h-5 w-5 text-rose-500" />}
                    >
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-gray-900 dark:text-white">{appraisalData.purpose_of_appraisal}</p>
                        </div>
                    </CollapsibleSection>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <PDFDownloadLink
                        document={<ProjectReportPDF projectData={projectData} appraisalData={appraisalData} />}
                        fileName="property-appraisal-report.pdf"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? (
                                "Loading document..."
                            ) : (
                                <>
                                    <Download className="h-4 w-4" />
                                    Download full report
                                </>
                            )
                        }
                    </PDFDownloadLink>
                </div>
            </div>
        </div>
    );
};

export default PropertyAppraisalModal;
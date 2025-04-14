import React from "react";
import Link from "next/link";
import { Building2, Edit, LogOut, MapPin, MessageCircle, Phone, Plus, User2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                        <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-colors">
                            <Edit className="h-4 w-4 text-white" />
                        </button>
                    </div>
                    <div className="relative px-6 py-5">
                        <div className="absolute -top-16 left-6">
                            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <div className="h-full w-full flex items-center justify-center">
                                    <User2 className="h-16 w-16 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div className="ml-36 flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maria Santos</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                    <MapPin className="h-3.5 w-3.5 mr-1" />
                                    Cebu City, Philippines
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                    <Phone className="h-3.5 w-3.5 mr-1" />
                                    +63 912 345 6789
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <span className="px-2.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full font-medium">
                                        Verified Seller
                                    </span>
                                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full font-medium">
                                        Member since 2022
                                    </span>
                                </div>
                            </div>
                            <Link
                                href="/property/new"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center gap-2 font-medium"
                            >
                                <Plus className="h-4 w-4" />
                                List Property
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Sidebar */}
                    <div className="col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
                            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Profile Menu</h2>
                            <nav className="space-y-1">
                                <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                                    <User2 className="h-4 w-4 mr-3" />
                                    My Profile
                                </a>
                                <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30">
                                    <Building2 className="h-4 w-4 mr-3" />
                                    My Properties
                                </a>
                                <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30">
                                    <MessageCircle className="h-4 w-4 mr-3" />
                                    Messages
                                </a>
                                <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <LogOut className="h-4 w-4 mr-3" />
                                    Logout
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">My Properties</h2>
                                <Link
                                    href="/property/new"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add new
                                </Link>
                            </div>

                            {/* Empty state */}
                            <div className="py-8 text-center">
                                <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center rounded-full mb-4">
                                    <Building2 className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                                </div>
                                <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-1">No properties listed yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Start by listing your first property</p>
                                <Link
                                    href="/property/new"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
                                >
                                    <Plus className="h-4 w-4" />
                                    List Your Property
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
                            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Agent Stats</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Properties Listed</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                </div>
                                <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Inquiries</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                </div>
                                <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Profile Views</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                                </div>
                                <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Response Rate</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">N/A</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

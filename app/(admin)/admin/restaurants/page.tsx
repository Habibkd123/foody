"use client"
import React, { useState, useEffect } from "react";
import { Search, Filter, Store, Eye, Check, X, Clock, MapPin, Phone, Mail, Star } from "lucide-react";

interface Restaurant {
    _id: string;
    name: string;
    owner: {
        name: string;
        email: string;
        phone: string;
    };
    address: string;
    cuisine: string[];
    rating: number;
    status: "pending" | "approved" | "rejected";
    documents: {
        license: string;
        fssai: string;
        gst: string;
    };
    createdAt: string;
    description: string;
    deliveryRadius: number;
    averageDeliveryTime: string;
}

const RestaurantApprovalPage = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (searchQuery.trim()) params.set('q', searchQuery.trim());
            if (statusFilter !== 'all') params.set('status', statusFilter);

            const url = params.toString()
                ? `/api/admin/restaurants?${params.toString()}`
                : '/api/admin/restaurants';

            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to fetch restaurants');
            }

            setRestaurants(Array.isArray(data.data) ? data.data : []);
        } catch (e: any) {
            setError(e?.message || 'Failed to fetch restaurants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(() => {
            fetchRestaurants();
        }, 300);

        return () => clearTimeout(t);
    }, [searchQuery, statusFilter]);

    const handleApprove = async (restaurantId: string) => {
        try {
            const res = await fetch(`/api/admin/restaurants/${restaurantId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' }),
            });
            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to approve restaurant');
            }

            setRestaurants(prev => prev.map(restaurant =>
                restaurant._id === restaurantId
                    ? { ...restaurant, status: 'approved' as const }
                    : restaurant
            ));
            if (selectedRestaurant && selectedRestaurant._id === restaurantId) {
                setSelectedRestaurant({ ...selectedRestaurant, status: 'approved' });
            }
        } catch (error) {
            alert((error as any)?.message || "Error approving restaurant");
        }
    };

    const handleReject = async (restaurantId: string) => {
        if (window.confirm("Are you sure you want to reject this restaurant?")) {
            try {
                const res = await fetch(`/api/admin/restaurants/${restaurantId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'rejected' }),
                });
                const data = await res.json();
                if (!data?.success) {
                    throw new Error(data?.error || 'Failed to reject restaurant');
                }

                setRestaurants(prev => prev.map(restaurant =>
                    restaurant._id === restaurantId
                        ? { ...restaurant, status: 'rejected' as const }
                        : restaurant
                ));
                if (selectedRestaurant && selectedRestaurant._id === restaurantId) {
                    setSelectedRestaurant({ ...selectedRestaurant, status: 'rejected' });
                }
            } catch (error) {
                alert((error as any)?.message || "Error rejecting restaurant");
            }
        }
    };

    const handleViewDetails = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setShowModal(true);
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800"
        };
        return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
    };

    const filteredRestaurants = restaurants;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-lg text-muted-foreground animate-pulse">Loading restaurants...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">


                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6 border-none">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-yellow-500 shadow-lg shadow-yellow-500/20">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    Pending
                                </p>
                                <p className="text-3xl font-black text-foreground">
                                    {restaurants.filter(r => r.status === "pending").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-xl shadow-soft p-6 border-none">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-green-500 shadow-lg shadow-green-500/20">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    Approved
                                </p>
                                <p className="text-3xl font-black text-foreground">
                                    {restaurants.filter(r => r.status === "approved").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-xl shadow-soft p-6 border-none">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-red-500 shadow-lg shadow-red-500/20">
                                <X className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    Rejected
                                </p>
                                <p className="text-3xl font-black text-foreground">
                                    {restaurants.filter(r => r.status === "rejected").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                        {error}
                    </div>
                )}

                {/* Search and Filters */}
                <div className="bg-card rounded-xl shadow-soft mb-8 p-4 border-none">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search restaurants..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Restaurants Table */}
                <div className="bg-card rounded-xl shadow-soft border-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        Restaurant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        Owner
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        Cuisine
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredRestaurants.map((restaurant) => (
                                    <tr key={restaurant._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <Store className="h-5 w-5 text-gray-500" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {restaurant.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {restaurant.address.split(",")[0]}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {restaurant.owner.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {restaurant.owner.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {restaurant.cuisine.join(", ")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {restaurant.rating}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(restaurant.status)}`}>
                                                {restaurant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewDetails(restaurant)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {restaurant.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(restaurant._id)}
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(restaurant._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Restaurant Details Modal */}
                {showModal && selectedRestaurant && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Restaurant Details
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                            Restaurant Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.name}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.description}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Address:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.address}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Cuisine:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.cuisine.join(", ")}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Delivery Radius:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.deliveryRadius} km</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Avg. Delivery Time:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.averageDeliveryTime}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                            Owner Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.owner.name}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.owner.email}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.owner.phone}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-900 dark:text-white">
                                            Documents
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">License:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.documents.license}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">FSSAI:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.documents.fssai}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">GST:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedRestaurant.documents.gst}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    {selectedRestaurant.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    handleApprove(selectedRestaurant._id);
                                                    setShowModal(false);
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleReject(selectedRestaurant._id);
                                                    setShowModal(false);
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantApprovalPage;
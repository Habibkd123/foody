"use client"
import React, { useState, useEffect } from "react";
import { Search, Filter, Utensils, Eye, Check, X, Clock, DollarSign, Star, Store } from "lucide-react";

interface FoodItem {
    _id: string;
    name: string;
    description: string;
    restaurant: {
        _id: string;
        name: string;
        owner: string;
    };
    category: string;
    price: number;
    images: string[];
    ingredients: string[];
    nutritionalInfo: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    dietary: string[];
    status: "pending" | "approved" | "rejected";
    rating: number;
    preparationTime: string;
    createdAt: string;
}

const FoodApprovalPage = () => {
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [showModal, setShowModal] = useState(false);

    const categories = ["Main Course", "Starter", "Beverage", "Dessert", "Bread", "Soup"];

    const fetchFoodApprovals = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (searchQuery.trim()) params.set('q', searchQuery.trim());
            if (statusFilter !== 'all') params.set('status', statusFilter);

            const url = params.toString()
                ? `/api/admin/food-approval?${params.toString()}`
                : '/api/admin/food-approval';

            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to fetch food approvals');
            }
            setFoodItems(Array.isArray(data.data) ? data.data : []);
        } catch (e: any) {
            setError(e?.message || 'Failed to fetch food approvals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(() => {
            fetchFoodApprovals();
        }, 300);

        return () => clearTimeout(t);
    }, [searchQuery, statusFilter]);

    const handleApprove = async (foodId: string) => {
        try {
            const res = await fetch(`/api/admin/food-approval/${foodId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' }),
            });
            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to approve food item');
            }

            setFoodItems(prev => prev.map(item =>
                item._id === foodId
                    ? { ...item, status: 'approved' as const }
                    : item
            ));
            if (selectedFood && selectedFood._id === foodId) {
                setSelectedFood({ ...selectedFood, status: 'approved' });
            }
        } catch (error) {
            alert((error as any)?.message || "Error approving food item");
        }
    };

    const handleReject = async (foodId: string) => {
        if (window.confirm("Are you sure you want to reject this food item?")) {
            try {
                const res = await fetch(`/api/admin/food-approval/${foodId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'rejected' }),
                });
                const data = await res.json();
                if (!data?.success) {
                    throw new Error(data?.error || 'Failed to reject food item');
                }

                setFoodItems(prev => prev.map(item =>
                    item._id === foodId
                        ? { ...item, status: 'rejected' as const }
                        : item
                ));
                if (selectedFood && selectedFood._id === foodId) {
                    setSelectedFood({ ...selectedFood, status: 'rejected' });
                }
            } catch (error) {
                alert((error as any)?.message || "Error rejecting food item");
            }
        }
    };

    const handleViewDetails = (food: FoodItem) => {
        setSelectedFood(food);
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

    const filteredFoodItems = foodItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading food items...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Food Approval
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review and approve food items from restaurants
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-blue-500">
                                <Utensils className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Items
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {foodItems.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-yellow-500">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Pending
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {foodItems.filter(item => item.status === "pending").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-green-500">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Approved
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {foodItems.filter(item => item.status === "approved").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-red-500">
                                <X className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Rejected
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {foodItems.filter(item => item.status === "rejected").length}
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search food items or restaurants..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Food Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFoodItems.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="relative">
                                <img 
                                    src={item.images[0] || "/api/placeholder/300/200"} 
                                    alt={item.name}
                                    className="w-full h-48 object-cover"
                                />
                                <span className={`absolute top-2 right-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                            
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.rating}
                                        </span>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                    {item.description}
                                </p>
                                
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    <Store className="h-4 w-4 mr-1" />
                                    {item.restaurant.name}
                                </div>
                                
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        ${item.price}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.category}
                                    </span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {item.preparationTime}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                        {item.dietary.slice(0, 2).map((diet, index) => (
                                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                                {diet}
                                            </span>
                                        ))}
                                        {item.dietary.length > 2 && (
                                            <span className="text-xs text-gray-500">+{item.dietary.length - 2}</span>
                                        )}
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleViewDetails(item)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        {item.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(item._id)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Food Details Modal */}
                {showModal && selectedFood && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Food Item Details
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
                                        <img 
                                            src={selectedFood.images[0] || "/api/placeholder/400/300"} 
                                            alt={selectedFood.name}
                                            className="w-full h-64 object-cover rounded-lg mb-4"
                                        />
                                        
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            {selectedFood.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {selectedFood.description}
                                        </p>
                                        
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ${selectedFood.price}
                                            </span>
                                            <div className="flex items-center">
                                                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                                <span className="text-lg text-gray-600 dark:text-gray-400">
                                                    {selectedFood.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                            Restaurant Information
                                        </h3>
                                        <div className="space-y-3 mb-6">
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedFood.restaurant.name}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Owner:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedFood.restaurant.owner}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedFood.category}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Preparation Time:</span>
                                                <p className="text-gray-900 dark:text-white">{selectedFood.preparationTime}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                            Nutritional Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Calories</span>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {selectedFood.nutritionalInfo.calories}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Protein</span>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {selectedFood.nutritionalInfo.protein}g
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Carbs</span>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {selectedFood.nutritionalInfo.carbs}g
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Fat</span>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {selectedFood.nutritionalInfo.fat}g
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                            Ingredients
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {selectedFood.ingredients.map((ingredient, index) => (
                                                <span key={index} className="inline-flex px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                                                    {ingredient}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                            Dietary Information
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedFood.dietary.map((diet, index) => (
                                                <span key={index} className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                                                    {diet}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    {selectedFood.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    handleApprove(selectedFood._id);
                                                    setShowModal(false);
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleReject(selectedFood._id);
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

export default FoodApprovalPage;
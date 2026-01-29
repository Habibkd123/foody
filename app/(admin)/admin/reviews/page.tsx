"use client"
import React, { useState, useEffect } from "react";
import { Search, Star, Trash2, User, Store, Truck, Calendar, MessageSquare } from "lucide-react";
import { useCustomToast } from "@/hooks/useCustomToast";

const AdminReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const toast = useCustomToast();

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/reviews');
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDeleteReview = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success("Review Deleted", "The review has been removed.");
                setReviews(reviews.filter(r => r._id !== id));
            } else {
                toast.error("Failed", data.message);
            }
        } catch (error) {
            toast.error("Error", "Failed to delete review");
        }
    };

    const filteredReviews = reviews.filter(r =>
        (r.restaurant?.restaurant?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.user?.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.order?.orderId || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-gray-600 animate-pulse">Loading all reviews...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h1>
                        <p className="text-gray-500">Manage feedback for restaurants and delivery partners</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by restaurant, user or order ID..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border rounded-xl w-full md:w-80"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredReviews.map((review) => (
                        <div key={review._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
                            <div className="p-5 space-y-4">
                                {/* Header: User & Order */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold">
                                            {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{review.user?.firstName} {review.user?.lastName}</p>
                                            <p className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded inline-block uppercase font-black">
                                                Order #{review.order?.orderId}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteReview(review._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Restaurant Feedback */}
                                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold flex items-center gap-1.5">
                                            <Store className="w-3 h-3" /> {review.restaurant?.restaurant?.name || 'Restaurant'}
                                        </span>
                                        {renderStars(review.restaurantRating)}
                                    </div>
                                    {review.restaurantComment && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                            "{review.restaurantComment}"
                                        </p>
                                    )}
                                </div>

                                {/* Driver Feedback */}
                                {review.driverRating && (
                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold flex items-center gap-1.5">
                                                <Truck className="w-3 h-3" /> {review.driver?.firstName || 'Delivery Partner'}
                                            </span>
                                            {renderStars(review.driverRating)}
                                        </div>
                                        {review.driverComment && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                                "{review.driverComment}"
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2 text-[10px] text-gray-400 border-t border-gray-100 dark:border-gray-700">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" /> ID: {review._id.slice(-6)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredReviews.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500">No reviews found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviewsPage;

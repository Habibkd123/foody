"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Power, Search } from 'lucide-react';

interface FoodItem {
    _id: string;
    name: string;
    price: number;
    category: 'Veg' | 'Non-Veg';
    imageUrl?: string;
    availability: boolean;
    status: 'pending' | 'approved' | 'rejected';
}

const FoodManagementPage = () => {
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editOpen, setEditOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [editFood, setEditFood] = useState<FoodItem | null>(null);
    const [editForm, setEditForm] = useState({ name: '', price: '', category: 'Veg', imageUrl: '' });

    const fetchFoods = async (q?: string) => {
        try {
            setLoading(true);
            setError(null);

            const url = q && q.trim().length > 0
                ? `/api/restaurant/foods?q=${encodeURIComponent(q.trim())}`
                : '/api/restaurant/foods';

            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to fetch foods');
            }
            setFoodItems(Array.isArray(data.data) ? data.data : []);
        } catch (e: any) {
            setError(e?.message || 'Failed to fetch foods');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return foodItems;
        return foodItems.filter((i) => i.name.toLowerCase().includes(q));
    }, [foodItems, search]);

    const handleToggleAvailability = async (item: FoodItem) => {
        try {
            const res = await fetch(`/api/restaurant/foods/${item._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ availability: !item.availability }),
            });
            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to update availability');
            }
            setFoodItems((prev) => prev.map((p) => (p._id === item._id ? data.data : p)));
        } catch (e: any) {
            alert(e?.message || 'Failed to update availability');
        }
    };

    const handleDelete = async (id: string) => {
        const ok = window.confirm('Delete this food item?');
        if (!ok) return;

        try {
            const res = await fetch(`/api/restaurant/foods/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to delete food');
            }
            setFoodItems((prev) => prev.filter((p) => p._id !== id));
        } catch (e: any) {
            alert(e?.message || 'Failed to delete food');
        }
    };

    const openEdit = (item: FoodItem) => {
        setEditError(null);
        setEditFood(item);
        setEditForm({
            name: item.name,
            price: String(item.price),
            category: item.category,
            imageUrl: item.imageUrl || '',
        });
        setEditOpen(true);
    };

    const submitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editFood) return;

        try {
            setEditLoading(true);
            setEditError(null);

            const payload = {
                name: editForm.name,
                price: Number(editForm.price),
                category: editForm.category,
                imageUrl: editForm.imageUrl || undefined,
            };

            const res = await fetch(`/api/restaurant/foods/${editFood._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to update food');
            }

            setFoodItems((prev) => prev.map((p) => (p._id === editFood._id ? data.data : p)));
            setEditOpen(false);
            setEditFood(null);
        } catch (e: any) {
            setEditError(e?.message || 'Failed to update food');
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Food Management</h1>
                <Link
                    href="/restaurant/food/add"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add Food</span>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search food items..."
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    {error}
                </div>
            )}

            {/* Food Items Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Food Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Availability</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-6 text-sm text-gray-700 dark:text-gray-200">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-6 text-sm text-gray-700 dark:text-gray-200">
                                        No food items found.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img src={item.imageUrl || '/api/placeholder/150/150'} alt={item.name} className="h-10 w-10 rounded-full object-cover"/>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₹{item.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            item.category === 'Veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleToggleAvailability(item)} className={`p-1 rounded-full ${
                                            item.availability ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                            <Power size={16} className="text-white" />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                            item.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : item.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Food Item</h2>

                        {editError && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
                                {editError}
                            </div>
                        )}

                        <form onSubmit={submitEdit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Food Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                    <input
                                        type="number"
                                        value={editForm.price}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option>Veg</option>
                                        <option>Non-Veg</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Food Image URL</label>
                                    <input
                                        type="text"
                                        value={editForm.imageUrl}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm((p) => ({ ...p, imageUrl: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditOpen(false);
                                        setEditFood(null);
                                        setEditError(null);
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                                >
                                    {editLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodManagementPage;

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddFoodPage = () => {
    const router = useRouter();
    const [newFood, setNewFood] = useState({ name: '', price: '', category: 'Veg', imageUrl: '', availability: true });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setNewFood({ ...newFood, [name]: checked });
            return;
        }
        setNewFood({ ...newFood, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const payload = {
                name: newFood.name,
                price: Number(newFood.price),
                category: newFood.category,
                imageUrl: newFood.imageUrl || undefined,
                availability: newFood.availability,
            };

            const res = await fetch('/api/restaurant/foods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!data?.success) {
                throw new Error(data?.error || 'Failed to create food item');
            }

            alert('Food item added successfully! (pending admin approval)');
            router.push('/restaurant/food');
        } catch (e: any) {
            setError(e?.message || 'Failed to create food item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Food Item</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Food Name</label>
                                <input type="text" name="name" value={newFood.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                <input type="number" name="price" value={newFood.price} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <select name="category" value={newFood.category} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                    <option>Veg</option>
                                    <option>Non-Veg</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Food Image URL</label>
                                <input type="text" name="imageUrl" value={newFood.imageUrl} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-2 flex items-center">
                                <input type="checkbox" name="availability" checked={newFood.availability} onChange={handleInputChange} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Available for order</label>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-8">
                            <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Cancel</button>
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60">{loading ? 'Adding...' : 'Add Item'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddFoodPage;

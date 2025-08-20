
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Plus, Minus } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
}

interface ProductFormData {
    name: string;
    description: string;
    category: string;
    sku: string;
    brand: string;
    price: number;
    originalPrice: number;
    stock: number;
    inStock: boolean;
    weight: string;
    dimensions: string;
    tags: string[];
    features: string[];
    specifications: Record<string, string>;
    nutritionalInfo: Record<string, string>;
    deliveryInfo: {
        freeDelivery: boolean;
        estimatedDays: string;
        expressAvailable: boolean;
        expressDays: string;
    };
    warranty: string;
    warrantyPeriod: string;
    status: 'active' | 'inactive' | 'draft';
    images: string[];
}

const initialFormData: ProductFormData = {
    name: '',
    description: '',
    category: '',
    sku: '',
    brand: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    inStock: true,
    weight: '',
    dimensions: '',
    tags: [],
    features: [],
    specifications: {},
    nutritionalInfo: {},
    deliveryInfo: {
        freeDelivery: false,
        estimatedDays: '2-3 days',
        expressAvailable: false,
        expressDays: ''
    },
    warranty: '',
    warrantyPeriod: '',
    status: 'active',
    images: []
};

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string | undefined;
    const isEditMode = !!id;

    const [formData, setFormData] = useState<ProductFormData>(initialFormData);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Temporary state for adding new items
    const [newTag, setNewTag] = useState('');
    const [newFeature, setNewFeature] = useState('');
    const [newSpecKey, setNewSpecKey] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');
    const [newNutritionKey, setNewNutritionKey] = useState('');
    const [newNutritionValue, setNewNutritionValue] = useState('');

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);

                // Fetch categories
                const categoriesResponse = await fetch('/api/categories');
                if (!categoriesResponse.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const categoriesData = await categoriesResponse.json();
                console.log('Categories:', categoriesData);
                setCategories(categoriesData.data?.categories || categoriesData.categories || []);

                // If editing, fetch product data
                if (isEditMode && id) {
                    const productResponse = await fetch(`/api/auth/products/${id}`);
                    if (!productResponse.ok) {
                        throw new Error('Failed to fetch product');
                    }

                    const productData = await productResponse.json();
                    console.log('Product Response:', productResponse);

                    // Handle different response structures
                    const product = productData.data || productData;
                    setFormData({
                        name: product.name || '',
                        description: product.description || '',
                        category: product.category?.id || product.category || '',
                        sku: product.sku || '',
                        brand: product.brand || '',
                        price: product.price || 0,
                        originalPrice: product.originalPrice || 0,
                        stock: product.stock || 0,
                        inStock: product.inStock !== undefined ? product.inStock : true,
                        weight: product.weight || '',
                        dimensions: product.dimensions || '',
                        tags: product.tags || [],
                        features: product.features || [],
                        specifications: product.specifications || {},
                        nutritionalInfo: product.nutritionalInfo || {},
                        deliveryInfo: {
                            freeDelivery: product.deliveryInfo?.freeDelivery || false,
                            estimatedDays: product.deliveryInfo?.estimatedDays || '2-3 days',
                            expressAvailable: product.deliveryInfo?.expressAvailable || false,
                            expressDays: product.deliveryInfo?.expressDays || ''
                        },
                        warranty: product.warranty || '',
                        warrantyPeriod: product.warrantyPeriod || '',
                        status: product.status || 'active',
                        images: product.images || []
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error instanceof Error ? error.message : 'Failed to load data');
            } finally {
                setPageLoading(false);
            }
        };
        // const fetchProductData = async (ids:string|undefined) => {
        //     try {
        //         setError(null);

        //         // Fetch categories
        //         const categoriesResponse = await fetch('/api/auth/products/' + ids);
        //         if (!categoriesResponse.ok) {
        //             throw new Error('Failed to fetch categories');
        //         }

        //         const categoriesData = await categoriesResponse.json();
        //         console.log('Categories:', categoriesData);
        //         setCategories(categoriesData.data?.categories || categoriesData.categories || []);

        //         // If editing, fetch product data
        //         if (isEditMode && id) {
        //             const productResponse = await fetch(`/api/auth/products/${id}`);
        //             if (!productResponse.ok) {
        //                 throw new Error('Failed to fetch product');
        //             }

        //             const productData = await productResponse.json();

        //             // Handle different response structures
        //             const product = productData.data || productData;
        //             setFormData({
        //                 name: product.name || '',
        //                 description: product.description || '',
        //                 category: product.category?._id || product.category || '',
        //                 sku: product.sku || '',
        //                 brand: product.brand || '',
        //                 price: product.price || 0,
        //                 originalPrice: product.originalPrice || 0,
        //                 stock: product.stock || 0,
        //                 inStock: product.inStock !== undefined ? product.inStock : true,
        //                 weight: product.weight || '',
        //                 dimensions: product.dimensions || '',
        //                 tags: product.tags || [],
        //                 features: product.features || [],
        //                 specifications: product.specifications || {},
        //                 nutritionalInfo: product.nutritionalInfo || {},
        //                 deliveryInfo: {
        //                     freeDelivery: product.deliveryInfo?.freeDelivery || false,
        //                     estimatedDays: product.deliveryInfo?.estimatedDays || '2-3 days',
        //                     expressAvailable: product.deliveryInfo?.expressAvailable || false,
        //                     expressDays: product.deliveryInfo?.expressDays || ''
        //                 },
        //                 warranty: product.warranty || '',
        //                 warrantyPeriod: product.warrantyPeriod || '',
        //                 status: product.status || 'active',
        //                 images: product.images || []
        //             });
        //         }
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //         setError(error instanceof Error ? error.message : 'Failed to load data');
        //     } finally {
        //         setPageLoading(false);
        //     }
        // };
        // if (id) {
        //     fetchProductData(id)
        // }

        fetchData();
    }, [id, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate required fields
            if (!formData.name.trim()) {
                throw new Error('Product name is required');
            }
            if (!formData.category) {
                throw new Error('Category is required');
            }
            if (formData.price <= 0) {
                throw new Error('Price must be greater than 0');
            }
            const cleanedFormData = Object.entries(formData).reduce((acc: any, [key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (typeof value === 'string' && value.trim() !== '') {
                        acc[key] = value.trim();
                    } else if (typeof value !== 'string') {
                        acc[key] = value;
                    }
                }
                return acc;
            }, {});

            console.log('Sending cleaned data:', cleanedFormData);

            const url = isEditMode ? `/api/auth/products/${id}` : '/api/auth/products';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedFormData),
            });

            const data = await response.json();

            if (response.ok) {
                // Success - redirect to products page
                router.push('/admin/products');
            } else {
                throw new Error(data.message || data.error || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            setError(error instanceof Error ? error.message : 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        setError(null);

        try {
            const uploadFormData = new FormData();
            let validFiles = 0;

            // Validate and append each valid image file to FormData
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (!file.type.startsWith('image/')) {
                    console.warn(`File ${file.name} is not an image`);
                    continue;
                }

                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    console.warn(`File ${file.name} is too large`);
                    continue;
                }

                uploadFormData.append('images', file);
                validFiles++;
            }

            if (validFiles === 0) {
                throw new Error('No valid image files selected');
            }

            // Make API call to upload images
            const response = await fetch('/api/auth/products/uploads', {
                method: 'POST',
                body: uploadFormData,
            });

            const data = await response.json();

            if (response.ok && data.success && data.imagesAdded) {
                // data.imagesAdded contains the URLs/paths of uploaded images
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...data.imagesAdded] // Append new image URLs
                }));
            } else {
                throw new Error(data.error || data.message || 'Failed to upload images');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            setError(error instanceof Error ? error.message : 'Failed to upload images');
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Helper functions for dynamic arrays and objects
    const addTag = () => {
        if (newTag.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const addSpecification = () => {
        if (newSpecKey.trim() && newSpecValue.trim()) {
            setFormData(prev => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [newSpecKey.trim()]: newSpecValue.trim()
                }
            }));
            setNewSpecKey('');
            setNewSpecValue('');
        }
    };

    const removeSpecification = (key: string) => {
        setFormData(prev => {
            const { [key]: removed, ...rest } = prev.specifications;
            return {
                ...prev,
                specifications: rest
            };
        });
    };

    const addNutrition = () => {
        if (newNutritionKey.trim() && newNutritionValue.trim()) {
            setFormData(prev => ({
                ...prev,
                nutritionalInfo: {
                    ...prev.nutritionalInfo,
                    [newNutritionKey.trim()]: newNutritionValue.trim()
                }
            }));
            setNewNutritionKey('');
            setNewNutritionValue('');
        }
    };

    const removeNutrition = (key: string) => {
        setFormData(prev => {
            const { [key]: removed, ...rest } = prev.nutritionalInfo;
            return {
                ...prev,
                nutritionalInfo: rest
            };
        });
    };

    const handleCancel = () => {
        router.push('/admin/products');
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products">
                            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isEditMode ? 'Edit Product' : 'Add New Product'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isEditMode ? 'Update product information' : 'Create a new product for your store'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-6xl mx-auto px-4 py-2">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Content */}
            <div className="max-w-6xl mx-auto px-4 py-2">
                <div className="bg-white rounded-lg shadow">
                    <form onSubmit={handleSubmit} className="p-6 space-y-8 text-black">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                                <p className="text-sm text-gray-600 mt-1">Essential product details</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter product name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.category}
                                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        >
                                            <option value="">Select a category</option>
                                            {Array.isArray(categories) && categories.map((category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Brand
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter brand name"
                                            value={formData.brand}
                                            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SKU
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter SKU"
                                            value={formData.sku}
                                            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter product description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Weight
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., 500g, 1.2kg"
                                            value={formData.weight}
                                            onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dimensions
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., 10x5x2 cm"
                                            value={formData.dimensions}
                                            onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>
                                <p className="text-sm text-gray-600 mt-1">Set pricing and stock information</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0.00"
                                            value={formData.price || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Original Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0.00"
                                            value={formData.originalPrice || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0"
                                        value={formData.stock || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'draft' }))}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="inStock"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={formData.inStock}
                                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                                />
                                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                                    In Stock
                                </label>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
                                <p className="text-sm text-gray-600 mt-1">Add tags to help customers find your product</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Add a tag"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    // onClick={() => removeNutrition(key)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Delivery Information</h2>
                                <p className="text-sm text-gray-600 mt-1">Set delivery options and timeframes</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estimated Delivery Days
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., 2-3 days"
                                        value={formData.deliveryInfo.estimatedDays}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            deliveryInfo: { ...prev.deliveryInfo, estimatedDays: e.target.value }
                                        }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Express Delivery Days
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Same day"
                                        value={formData.deliveryInfo.expressDays}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            deliveryInfo: { ...prev.deliveryInfo, expressDays: e.target.value }
                                        }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="freeDelivery"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        checked={formData.deliveryInfo.freeDelivery}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            deliveryInfo: { ...prev.deliveryInfo, freeDelivery: e.target.checked }
                                        }))}
                                    />
                                    <label htmlFor="freeDelivery" className="ml-2 block text-sm text-gray-700">
                                        Free Delivery Available
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="expressAvailable"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        checked={formData.deliveryInfo.expressAvailable}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            deliveryInfo: { ...prev.deliveryInfo, expressAvailable: e.target.checked }
                                        }))}
                                    />
                                    <label htmlFor="expressAvailable" className="ml-2 block text-sm text-gray-700">
                                        Express Delivery Available
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Warranty */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Warranty</h2>
                                <p className="text-sm text-gray-600 mt-1">Warranty information and coverage</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Warranty Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe warranty coverage"
                                        value={formData.warranty}
                                        onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Warranty Period
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., 1 year, 6 months"
                                        value={formData.warrantyPeriod}
                                        onChange={(e) => setFormData(prev => ({ ...prev, warrantyPeriod: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                                <p className="text-sm text-gray-600 mt-1">Upload product photos</p>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                <div className="text-center">
                                    <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                    <div className="flex text-base text-gray-600 justify-center">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>{uploadingImages ? 'Uploading...' : 'Upload images'}</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                accept="image/*"
                                                disabled={uploadingImages}
                                                onChange={(e) => handleImageUpload(e.target.files)}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, WEBP up to 5MB each</p>
                                </div>
                            </div>

                            {/* Image Preview */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                onError={(e) => {
                                                    // Handle broken image
                                                    (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Features */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Features</h2>
                                <p className="text-sm text-gray-600 mt-1">List key features of your product</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Add a feature"
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {formData.features.length > 0 && (
                                    <ul className="space-y-2">
                                        {formData.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <span>{feature}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                                <p className="text-sm text-gray-600 mt-1">Add technical specifications</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Specification name"
                                        value={newSpecKey}
                                        onChange={(e) => setNewSpecKey(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Value"
                                        value={newSpecValue}
                                        onChange={(e) => setNewSpecValue(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={addSpecification}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {Object.entries(formData.specifications).length > 0 && (
                                    <div className="space-y-2">
                                        {Object.entries(formData.specifications).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <span><strong>{key}:</strong> {value}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSpecification(key)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Nutritional Information */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Nutritional Information</h2>
                                <p className="text-sm text-gray-600 mt-1">Add nutritional facts (for food products)</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nutrient name"
                                        value={newNutritionKey}
                                        onChange={(e) => setNewNutritionKey(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Amount (e.g., 10g, 200mg)"
                                        value={newNutritionValue}
                                        onChange={(e) => setNewNutritionValue(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={addNutrition}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {Object.entries(formData.nutritionalInfo).length > 0 && (
                                    <div className="space-y-2">
                                        {Object.entries(formData.nutritionalInfo).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <span><strong>{key}:</strong> {value}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNutrition(key)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* {/* </div> */}
                        </div>
                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || uploadingImages}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading
                                    ? 'Saving...'
                                    : isEditMode
                                        ? 'Update Product'
                                        : 'Create Product'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );


}


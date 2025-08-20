
"use client"
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Star, Package, Truck, Shield, Tag, Info, FileText, Utensils } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

// Types
interface Category {
    _id: string;
    name: string;
}

interface ProductData {
    _id: string;
    name: string;
    description: string;
    category: Category | string;
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
    createdAt?: string;
    updatedAt?: string;
}

export default function ProductViewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string | undefined;

    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Mock product data - replace with actual API call
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productResponse = await fetch(`/api/auth/products/${id}`);
                if (!productResponse.ok) {
                    throw new Error('Failed to fetch product');
                }

                const productData = await productResponse.json();
                const product = productData.data || productData;
                setProduct(product);
            } catch (err) {
                setError('Failed to fetch product details');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleEdit = () => {
        // Navigate to edit page
        console.log('Navigate to edit page');
        router.push(`/admin/products/${id}`);
    };


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStockStatus = (stock: number, inStock: boolean) => {
        if (!inStock) return { text: 'Out of Stock', color: 'text-red-600' };
        if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600' };
        if (stock < 10) return { text: 'Low Stock', color: 'text-orange-600' };
        return { text: 'In Stock', color: 'text-green-600' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading product details...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-2">{error || 'Product not found'}</div>
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => router.push('/admin/products')}>
                        <ArrowLeft className="inline w-4 h-4 mr-1" />
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const stockStatus = getStockStatus(product.stock, product.inStock);
    const discount = product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="text-gray-600">SKU: {product.sku}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                        {/* {product.status.charAt(0).toUpperCase() + product.status.slice(1)} */}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Edit size={16} />
                                Edit Product
                            </button>
                            {/* <button 
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Images and Basic Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
                            {product.images.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Main Image */}
                                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={product.images[selectedImageIndex]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Thumbnail Grid */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {product.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                                                        ? 'border-blue-500'
                                                        : 'border-transparent hover:border-gray-300'
                                                    }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Package className="h-16 w-16 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} />
                                Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Features */}
                        {product.features.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Star size={20} />
                                    Key Features
                                </h2>
                                <ul className="space-y-2">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Specifications */}
                        {Object.keys(product.specifications).length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Info size={20} />
                                    Specifications
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">{key}:</span>
                                            <span className="text-gray-600">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Nutritional Information */}
                        {Object.keys(product.nutritionalInfo).length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Utensils size={20} />
                                    Nutritional Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">{key}:</span>
                                            <span className="text-gray-600">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="space-y-6">
                        {/* Price and Stock */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Stock</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.originalPrice > product.price && (
                                            <>
                                                <span className="text-lg text-gray-500 line-through">
                                                    {formatPrice(product.originalPrice)}
                                                </span>
                                                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                                    {discount}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Stock:</span>
                                    <div className="text-right">
                                        <div className={`font-semibold ${stockStatus.color}`}>
                                            {stockStatus.text}
                                        </div>
                                        <div className="text-sm text-gray-600">{product.stock} units</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Category:</span>
                                    <span className="text-gray-900 font-medium">
                                        {typeof product.category === 'object' ? product.category.name : product.category}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Brand:</span>
                                    <span className="text-gray-900 font-medium">{product.brand}</span>
                                </div>
                                {product.weight && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Weight:</span>
                                        <span className="text-gray-900 font-medium">{product.weight}</span>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Dimensions:</span>
                                        <span className="text-gray-900 font-medium">{product.dimensions}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Tag size={20} />
                                    Tags
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delivery Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Truck size={20} />
                                Delivery Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Standard Delivery:</span>
                                    <span className="text-gray-900 font-medium">{product.deliveryInfo.estimatedDays}</span>
                                </div>
                                {product.deliveryInfo.expressAvailable && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Express Delivery:</span>
                                        <span className="text-gray-900 font-medium">{product.deliveryInfo.expressDays}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Free Delivery:</span>
                                    <span className={`font-medium ${product.deliveryInfo.freeDelivery ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.deliveryInfo.freeDelivery ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Warranty */}
                        {(product.warranty || product.warrantyPeriod) && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Shield size={20} />
                                    Warranty
                                </h2>
                                <div className="space-y-3">
                                    {product.warrantyPeriod && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Period:</span>
                                            <span className="text-gray-900 font-medium">{product.warrantyPeriod}</span>
                                        </div>
                                    )}
                                    {product.warranty && (
                                        <div>
                                            <span className="text-gray-700">Coverage:</span>
                                            <p className="text-gray-900 mt-1 text-sm">{product.warranty}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        {(product.createdAt || product.updatedAt) && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h2>
                                <div className="space-y-3">
                                    {product.createdAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Created:</span>
                                            <span className="text-gray-900 font-medium">{formatDate(product.createdAt)}</span>
                                        </div>
                                    )}
                                    {product.updatedAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Last Updated:</span>
                                            <span className="text-gray-900 font-medium">{formatDate(product.updatedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
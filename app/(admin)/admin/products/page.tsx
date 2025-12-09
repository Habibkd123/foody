"use client";
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const router = useRouter();
  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    page: 1,
    limit: 10
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    status: 'active',
    sku: '',
    images: []
  });

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/auth/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      console.log('Categories response:', data);

      if (data.success) {
        setCategories(data.data?.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);


  // Delete product
  const handleDelete = async (productId: any) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/auth/products/${productId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts();
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };



  // Edit product
  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category._id,
      stock: product.stock,
      status: product.status,
      sku: product.sku || '',
      images: product.images || []
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Manage your product inventory, pricing, and availability
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col bs-lg:flex-row justify-between items-start bs-lg:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">

            {/* Search */}
            <div className="relative flex-1 max-w-full sm:max-w-md">

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex gap-2 sm:gap-3">

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map((category: any) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <button onClick={()=>router.push('/admin/products/add')} className="inline-flex items-center px-4 py-2 bs-md:px-5 bs-md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">

            <PlusIcon className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 bs-lg:grid-cols-3 xl:grid-cols-4 bs-2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">

          {products.map((product: any, index: any) => {
            const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-900/20">
                {/* Product Image */}
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 transition-colors duration-200">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center transition-colors duration-200">
                  <img src={product.images[0] || '/placeholder.png'} alt={product.name} className="object-cover w-full h-full" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <button
                      // onClick={() => toggleActive(product._id)}
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${product.status
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                        }`}
                    >
                      {product.status ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2 transition-colors duration-200">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-200">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through transition-colors duration-200">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      SKU: {product.sku}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Category: {categoryName}
                    </span>
                    <span className={`text-xs font-medium transition-colors duration-200 ${product.stock > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                      }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link href={`/admin/products/view/${product._id}`} >
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      </Link>
                      <Link href={`/admin/products/${product._id}`} >
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product?._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-200">
            Loading products...
          </div>

        ) : products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4 transition-colors duration-200">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
              Try adjusting your search or filter criteria
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Your First Product
            </button>
          </div>
        )}


      </div>
    </div>
  );
};

export default ProductManagement;
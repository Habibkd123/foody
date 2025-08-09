import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '../../icons';
import { useProductService } from '../../apiservices/useProductService';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: { _id: string; name: string; id: string } | string;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  images: string[];
  mainImage?: string;
  sku: string;
  createdAt: string;
}
const API_URL = import.meta.env.VITE_API_URL;
const Products: React.FC = () => {
  const { getProducts, deleteProduct } = useProductService();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from ProductService
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      // Assuming response.data is the array of products
      setProducts(response.data);
      // Extract unique categories from products
      const uniqueCategories = Array.from(new Set(response.data.map((p: Product) => typeof p.category === 'object' ? p.category.name : p.category))) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
    const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
    const matchesStatus = selectedStatus === 'all' ||
      (selectedStatus === 'active' && product.isActive) ||
      (selectedStatus === 'inactive' && !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id)
        .then(() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
          fetchProducts();
        })
        .catch(() => {
          setError('Failed to delete product. Please try again.');
          setLoading(false);
        });
    }
  };

  const toggleActive = (productId: string) => {
    setProducts(products.map(prod =>
      prod.id === productId ? { ...prod, isActive: !prod.isActive } : prod
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Products
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your product inventory, pricing, and availability
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      {/* {loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading product..</div>
      )}
      {error && (
        <div className="text-center py-8 text-red-500 dark:text-red-400">{error}</div>
      )} */}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
          // Prefer mainImage, then images[0], fallback
          let imageSrc = product.mainImage || (product.images && product.images[0]) || '/images/product/product-01.jpg';
          if (imageSrc?.startsWith('data:image')) {
            imageSrc = imageSrc;
          }else{
            imageSrc = `${API_URL}upload/products/${imageSrc}`;
          }
          // If imageSrc is base64, use as is, else treat as path
          const isBase64 = imageSrc && imageSrc.startsWith('data:image');
          return (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  style={isBase64 ? {} : { background: '#f3f4f6' }}
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <button
                    onClick={() => toggleActive(product.id)}
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${product.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    SKU: {product.sku}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Category: {categoryName}
                  </span>
                  {/* <span className={`text-xs font-medium ${product.lowStockThreshold > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                    {product.lowStockThreshold > 0 ? `${product.lowStockThreshold} in stock` : 'Out of stock'}
                  </span> */}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading product..
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500 dark:text-red-400">
          {error}
        </div>
      ) : filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Your First Product
          </Link>
        </div>
      )}


      {/* Empty State */}
      {/* {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Your First Product
          </Link>
        </div>
      )} */}


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Product
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 
"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
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
  const handleDelete = async (productId:any) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products?id=${productId}`, {
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
  const handleEdit = (product:any) => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your product inventory, pricing, and availability</p>
            </div>
            <button
              onClick={()=>router.push('/admin/products/add')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>
            
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
            >
              <option value="">All Categories</option>
              {Array.isArray(categories) && categories.map((category:any)=> (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.limit}
              onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {Array.isArray(products) && products.map((product:any) => (
                  <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      {product.images?.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' ? 'bg-green-100 text-green-800' :
                          product.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Stock: {product.stock}</span>
                        <span>SKU: {product.sku}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{product.category?.name}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.totalItems)} of {pagination.totalItems} products
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={!pagination.hasPrev}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={!pagination.hasNext}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

       

      </div>
    </div>
  );
};

export default ProductManagement;
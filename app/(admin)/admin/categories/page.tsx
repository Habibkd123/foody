"use client";
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Search, Plus, Edit2, Trash2, MoreHorizontal, Check, X, ChevronDown, ChevronRight, Upload, Image as ImageIcon, Loader, Moon, Sun } from 'lucide-react';
import CategoriesToolbar from '@/components/admin/CategoriesToolbar';
import CategoriesTable from '@/components/admin/CategoriesTable';

// Types
interface Category {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  image?: string;
  createdAt: string;
  updated_at: string;
  products_count: number;
  parent_id?: string;
  subcategories?: Category[];
}

interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  success: boolean;
  message?: string;
}

interface SearchFilters {
  status?: 'active' | 'inactive';
  has_products?: boolean;
  parent_id?: string;
}

interface ImageFile {
  file: File;
  data_url: string;
  name: string;
  size: number;
}

interface Pagination {
  total: number;
  pages: number;
}

interface GetCategoriesResponse {
  success: boolean;
  categories: Category[];
  pagination: Pagination;
  message?: string;
}

interface CategorySearchResponse {
  query: string;
  results: Category[];
  count: number;
  Optional: Pagination;
}

// Mock data for demo
const mockCategories: Category[] = [
  {
    _id: '1',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    createdAt: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    products_count: 45
  },
  {
    _id: '2',
    name: 'Clothing',
    description: 'Fashion and apparel items',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    createdAt: '2024-01-14T09:20:00Z',
    updated_at: '2024-01-14T09:20:00Z',
    products_count: 32
  },
  {
    _id: '3',
    name: 'Books',
    description: 'Books and educational materials',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    createdAt: '2024-01-13T14:45:00Z',
    updated_at: '2024-01-13T14:45:00Z',
    products_count: 18
  },
  {
    _id: '4',
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    createdAt: '2024-01-12T11:15:00Z',
    updated_at: '2024-01-12T11:15:00Z',
    products_count: 67
  }
];

// API Service (Mock for demo)
class CategoryAPI {
  private baseUrl = '/api/categories';

  async getCategories(page = 1, limit = 10): Promise<ApiResponse<GetCategoriesResponse>> {
    const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`);
    return response.json();
  }

  async uploadImage(file: File, name: string): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);

    try {
      const response = await fetch(`${this.baseUrl}/uploads`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'products_count'>): Promise<ApiResponse<Category>> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    return response.json();
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    return response.json();
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    return response.json();
  }

  async deleteCategory(id: string, force = false): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/${id}?force=${force}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  async getCategoryTree(): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${this.baseUrl}/tree`);
    return response.json();
  }

  async searchCategories(query: string, filters?: SearchFilters): Promise<ApiResponse<CategorySearchResponse>> {
    if (filters && Object.keys(filters).length > 0) {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters }),
      });
      return response.json();
    } else {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      return response.json();
    }
  }

  async bulkCreate(categories: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'products_count'>[]): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${this.baseUrl}/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories }),
    });
    return response.json();
  }

  async bulkUpdate(updates: { id: string; data: Partial<Category> }[]): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${this.baseUrl}/bulk`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
    return response.json();
  }

  async bulkDelete(ids: string[], force = false): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/bulk?force=${force}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    return response.json();
  }
}

// Image Upload Component
const ImageUpload: React.FC<{
  value?: string;
  onChange: (imageUrl: string) => void;
  onImageFile?: (file: ImageFile | null) => void;
  className?: string;
}> = ({ value, onChange, onImageFile, className = "" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB');
      return;
    }

    const dataUrl = URL.createObjectURL(file);
    setPreviewUrl(dataUrl);

    const imageFile: ImageFile = {
      file,
      data_url: dataUrl,
      name: file.name,
      size: file.size
    };

    onImageFile?.(imageFile);
    onChange(dataUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setPreviewUrl('');
    onChange('');
    onImageFile?.(null);

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Category preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Drag and drop an image here, or click to select
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Image
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      )}
    </div>
  );
};

// Category Row Component
const CategoryRow: React.FC<{
  category: Category;
  selected: boolean;
  onToggleSelection: () => void;
  onEdit: () => void;
  onDelete: (force: boolean) => void;
  viewMode: 'table' | 'tree';
  level?: number;
}> = ({ category, selected, onToggleSelection, onEdit, onDelete, viewMode, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelection}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            {viewMode === 'tree' && category.subcategories && category.subcategories.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}

            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="w-12 h-12 object-cover rounded-lg mr-4 border border-gray-200 dark:border-gray-600"
              />
            )}

            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{category.description}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {category.products_count} products
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.status === 'active'
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
            }`}>
            {category.status === 'active' ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <X className="w-3 h-3 mr-1" />
                Inactive
              </>
            )}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {new Date(category.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              title="Edit category"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(false)}
              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {viewMode === 'tree' && expanded && category.subcategories?.map(subcategory => (
        <CategoryRow
          key={subcategory._id}
          category={subcategory}
          selected={selected}
          onToggleSelection={onToggleSelection}
          onEdit={onEdit}
          onDelete={onDelete}
          viewMode={viewMode}
          level={level + 1}
        />
      ))}
    </>
  );
};

// Category Form Component
const CategoryForm: React.FC<{
  category?: Category;
  onClose: () => void;
  onSuccess: (category: Category) => void;
  api: CategoryAPI;
}> = ({ category, onClose, onSuccess, api }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    status: category?.status || 'active' as const,
    image: category?.image || '',
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleImageFile = (file: ImageFile | null) => {
    setImageFile(file);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image;

    setUploadingImage(true);
    try {
      const response = await api.uploadImage(imageFile.file, formData.name || 'new-category');
      if (response.success) {
        return response.data.url;
      }
      return formData.image;
    } catch (error) {
      console.error('Image upload failed:', error);
      return formData.image;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let categoryData: Partial<Category>;

      if (imageFile) {
        // Nayi image file hai, upload karein
        const imageUrl = await uploadImage();
        categoryData = {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          image: imageUrl,
        };
      } else {
        // Image file change nahi hui, image field ko update object mein mat bhejo
        categoryData = {
          name: formData.name,
          description: formData.description,
          status: formData.status,
        };
      }

      if (category) {
        const updatedCategory = {
          ...category,
          ...categoryData,
          updated_at: new Date().toISOString(),
        };
        await api.updateCategory(category._id, updatedCategory);
        onSuccess(updatedCategory);
      } else {
        const newCategory: Category = {
          _id: Date.now().toString(),
          name: categoryData.name!,
          description: categoryData.description!,
          status: categoryData.status || 'active',
          image: categoryData.image || '',
          createdAt: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          products_count: 0,
        };
        await api.createCategory(newCategory);
        onSuccess(newCategory);
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter category description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Image
            </label>
            <ImageUpload
              value={formData.image}
              onChange={handleImageChange}
              onImageFile={handleImageFile}
            />
            {uploadingImage && (
              <div className="mt-2 flex items-center text-sm text-blue-600 dark:text-blue-400">
                <Loader className="animate-spin w-4 h-4 mr-2" />
                Uploading image...
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  status: e.target.checked ? 'active' : 'inactive'
                }))}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active Category</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Inactive categories won't be visible to customers
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin w-4 h-4" />
                  {category ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                category ? 'Update Category' : 'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 4,
    pages: 1,
  });

  const api = new CategoryAPI();

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getCategories(pagination.page, pagination.limit);

      if (response.success) {
        const data = response.data?.categories || [];
        setCategories(data);

        setPagination(prev => ({
          ...prev,
          total: response.data?.pagination?.total ?? 0,
          pages: response.data?.pagination?.pages ?? 1,
        }));
      } else {
        console.error('Failed to load categories:', response.message);
      }
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadCategories();
      return;
    }

    setLoading(true);
    try {
      const response = await api.searchCategories(query);
      if (response.success) {
        setCategories(response.data.results);
        setPagination(prev => ({
          ...prev,
          total: response.data.count ?? response.data.results.length ?? 0,
          pages: 1,
        }));
      } else {
        console.error('Failed to search categories:', response.message);
      }
    } catch (error) {
      console.error('Error searching categories:', error);
    } finally {
      setLoading(false);
    }
  }, [loadCategories]);

  const handleDelete = async (id: string, force = false) => {
    if (!confirm(`Are you sure you want to delete this category${force ? ' and all its data' : ''}?`)) {
      return;
    }
    try {
      const result = await api.deleteCategory(id);
      if (!result.success) {
        console.error('Failed to delete category:', result.message);
        return;
      }
      setCategories(prev => prev.filter(cat => cat._id !== id));
      setSelectedCategories(prev => new Set([...prev].filter(catId => catId !== id)));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleBulkDelete = async (force = false) => {
    if (selectedCategories.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedCategories.size} categories${force ? ' and all their data' : ''}?`)) {
      return;
    }

    setCategories(prev => prev.filter(cat => !selectedCategories.has(cat._id)));
    setSelectedCategories(new Set());
  };

  const toggleSelection = (id: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (categories.length === 0) return;
    if (selectedCategories.size === categories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(categories.map(cat => cat._id)));
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, handleSearch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Categories</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your product categories and organize your inventory</p>
          </div>
        </div>

        {/* Actions Bar */}
        <CategoriesToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={(v) => setViewMode(v)}
          selectedCount={selectedCategories.size}
          onBulkDelete={() => handleBulkDelete(false)}
          onForceDelete={() => handleBulkDelete(true)}
          onAddClick={() => setShowCreateForm(true)}
        />

        {/* Categories Table */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading categories...</p>
          </div>
        ) : (
          <CategoriesTable
            categories={categories as any}
            selectedIds={selectedCategories}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelection={toggleSelection}
            viewMode={viewMode}
            onEdit={(c: any) => setEditingCategory(c)}
            onDelete={(id: string) => handleDelete(id)}
          />
        )}
        {viewMode === 'table' && pagination.pages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            {/* Mobile pagination */}
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.page === page
                          ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
        {showCreateForm && (
          <CategoryForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={(newCategory) => {
              setShowCreateForm(false);
              setCategories(prev => [newCategory, ...prev]);
            }}
            api={api}
          />
        )}

        {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
            onSuccess={(updatedCategory) => {
              setEditingCategory(null);
              setCategories(prev => prev.map(cat =>
                cat._id === updatedCategory._id ? updatedCategory : cat
              ));
            }}
            api={api}
          />
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
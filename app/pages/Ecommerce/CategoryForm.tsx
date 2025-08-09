import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ChevronLeftIcon, CheckLineIcon } from '../../icons';
import { useCategoryService } from '../../apiservices/useCategoryService';

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const CategoryForm: React.FC = () => {
  const { addCategory, updateCategory, getCategory } = useCategoryService();
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(categoryId);

  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Mock data for editing - in real app, fetch from API
  useEffect(() => {
    if (isEditing && categoryId) {
      // Simulate fetching category data
      // const mockCategory = {
      //   id: categoryId,
      //   name: 'Electronics',
      //   description: 'Electronic devices and accessories',
      //   isActive: true
      // };

      // Fetch the category data from the API for editing
      (async () => {
        try {
          const responce = await getCategory(categoryId);
          const data = responce.data.category;
          if (data) {
            setFormData({
              name: data.name,
              description: data.description,
              isActive: data.isActive
            });
          }
        } catch (err) {
          // Optionally handle error (e.g., show notification)
          console.log("err", err);
        }
      })();

    }
  }, [isEditing, categoryId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && categoryId) {
        // Call updateCategory API
        await updateCategory(categoryId, formData);
      } else {
        // Call addCategory API
        await addCategory(formData);
      }
      // Navigate back to categories list
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      setErrors({ submit: 'Failed to save category. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/categories"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditing ? 'Update category information' : 'Create a new product category'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.name
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.description
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
                }`}
              placeholder="Enter category description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Category
              </span>
            </label>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Inactive categories won't be visible to customers
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/admin/categories"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <CheckLineIcon className="w-5 h-5 mr-2" />
                  {isEditing ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm; 

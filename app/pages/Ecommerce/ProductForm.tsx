import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ChevronLeftIcon, CheckLineIcon, TrashIcon } from '../../icons';
import { useCategoryService } from '../../apiservices/useCategoryService';
import { useProductService } from '../../apiservices/useProductService';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  isActive: boolean;
  images: string[];
  thumbnail: string;
  thumbnailPreview: string;
  video: string;
  videoPreview: string;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  gender: string;
}

const ProductForm: React.FC = () => {
  const { addProduct, getProduct, updateProduct } = useProductService();
  const { getCategories } = useCategoryService();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(productId);


  const [formData, setFormData] = useState<Omit<Product, 'id'> & {
    imageFiles?: File[];
    imagePreviews?: string[];
  }>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    stock: 0,
    isActive: true,
    images: [],
    thumbnail: '',
    thumbnailPreview: '',
    video: '',
    videoPreview: '',
    sku: '',
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    gender: '',
    imageFiles: [],
    imagePreviews: [],
  });


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArr = Array.from(files);
    const previews = fileArr.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      imageFiles: [...(prev.imageFiles || []), ...fileArr],
      imagePreviews: [...(prev.imagePreviews || []), ...previews],
    }));

    // Reset input
    e.target.value = '';
  };

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.data.categories || []);
    } catch (err) {
      console.log('Failed to fetch categories', err);
    }
  };

  // Mock data for editing - in real app, fetch from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId) {
          const response = await getProduct(productId);
          const product = response.data;

          setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category._id,
            stock: product.lowStockThreshold,
            isActive: product.isActive,
            images: product.images || [],
            thumbnail: product.thumbnail,
            thumbnailPreview: product.thumbnailPreview,
            video: product.video,
            videoPreview: product.videoPreview,
            sku: product.sku,
            weight: product.weight,
            dimensions: product.dimensions,
            gender: product.gender || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
      }
    };

    if (isEditing) {
      fetchProduct();
    }
  }, [isEditing, productId]);


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    // if (formData.price <= 0) {
    //   newErrors.price = 'Price must be greater than 0';
    // }

    // if (formData.stock < 0) {
    //   newErrors.stock = 'Stock cannot be negative';
    // }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', String(formData.price));
      payload.append('originalPrice', String(formData.originalPrice));
      payload.append('category', formData.category);
      payload.append('stock', String(formData.stock));
      payload.append('isActive', String(formData.isActive));
      payload.append('sku', formData.sku);
      payload.append('gender', formData.gender);
      if (formData.weight) payload.append('weight', String(formData.weight));
      if (formData.dimensions) {
        payload.append('dimensions', JSON.stringify(formData.dimensions));
      }

      (formData.imageFiles || []).forEach(file => {
        payload.append('images', file);
      });

      if (isEditing) {
        await updateProduct(productId!, payload); // updateProduct should handle FormData
      } else {
        await addProduct(payload);
      }

      navigate('/admin/products');
    } catch (error) {
      setErrors({ submit: 'Failed to save product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // const handleDimensionChange = (dimension: keyof typeof formData.dimensions, value: number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     dimensions: {
  //       ...prev.dimensions!,
  //       [dimension]: value
  //     }
  //   }));
  // };

  const generateSKU = () => {
    const prefix = formData.category ? formData.category.substring(0, 2).toUpperCase() : 'PR';
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sku = `${prefix}-${random}`;
    setFormData(prev => ({ ...prev, sku }));
  };
  const removeImage = (index: number) => {
    const newFiles = [...(formData.imageFiles || [])];
    const newPreviews = [...(formData.imagePreviews || [])];

    newFiles.splice(index, 1);
    URL.revokeObjectURL(newPreviews[index]); // 🧼 clean up memory
    newPreviews.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      imageFiles: newFiles,
      imagePreviews: newPreviews,
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/products"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditing ? 'Update product information' : 'Create a new product listing'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
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
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.category
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.gender
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                >
                  <option value="">Select gender</option>
                  <option value="UNISEX">Unisex</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gender}</p>
                )}
              </div>

              {/* SKU */}
              <div className='md:col-span-2'>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="sku"
                    value={formData.sku}
                    disabled={productId ? true : false}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.sku
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                      }`}
                    placeholder="Enter SKU"
                  />
                  {!productId && (
                    <button
                      type="button"
                      onClick={generateSKU}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Generate
                    </button>
                  )}


                </div>
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sku}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
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
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing & Inventory</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price */}
              <div className="md:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.price
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                      }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                )}
              </div>

              {/* Original Price */}
              <div style={{ display: "none" }}>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Original Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="originalPrice"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Leave empty if no discount</p>
              </div>

              {/* Stock */}
              <div style={{ display: "none" }}>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${errors.stock
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock}</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Images</h2>

            {/* Image Uploader */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
            </div>
            {formData?.imagePreviews&&formData?.imagePreviews?.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {formData?.imagePreviews?.map((src, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="object-cover w-full h-full rounded border"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1"
                      onClick={() => removeImage(index)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Image Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData?.images&&formData?.images?.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Details</h2> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="0.00"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={formData.dimensions?.length || 0}
                    onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 0)}
                    placeholder="L"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    value={formData.dimensions?.width || 0}
                    onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
                    placeholder="W"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    value={formData.dimensions?.height || 0}
                    onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
                    placeholder="H"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div> */}

            {/* Status */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Product
                </span>
              </label>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Inactive products won't be visible to customers
              </p>
            </div>
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
              to="/admin/products"
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
                  {isEditing ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 
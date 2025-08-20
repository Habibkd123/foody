// // pages/products/add.tsx or pages/products/[id]/edit.tsx
// "use client";
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { ArrowLeft, Upload, X } from 'lucide-react';

// interface Category {
//   _id: string;
//   name: string;
// }

// interface ProductFormData {
//   name: string;
//   category: string;
//   sku: string;
//   description: string;
//   price: string;
//   stock: string;
//   status: 'active' | 'inactive' | 'draft';
//   images: string[];
// }

// const initialFormData: ProductFormData = {
//   name: '',
//   category: '',
//   sku: '',
//   description: '',
//   price: '',
//   stock: '',
//   status: 'active',
//   images: []
// };

// export default function AddEditProductPage() {
//   const router = useRouter();
//   const { id } = router.query; // For edit mode
//   const isEditMode = !!id;

//   const [formData, setFormData] = useState<ProductFormData>(initialFormData);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [uploadingImages, setUploadingImages] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);

//   // Fetch data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch categories
//         const categoriesResponse = await fetch('/api/categories');
//         const categoriesData = await categoriesResponse.json();
//         setCategories(categoriesData);

//         // If editing, fetch product data
//         if (isEditMode && id) {
//           const productResponse = await fetch(`/api/products/${id}`);
//           const productData = await productResponse.json();
//           setFormData(productData);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setPageLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, isEditMode]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const url = isEditMode ? `/api/products/${id}` : '/api/products';
//       const method = isEditMode ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         // Success - redirect to products page
//         router.push('/products');
//       } else {
//         throw new Error('Failed to save product');
//       }
//     } catch (error) {
//       console.error('Error saving product:', error);
//       // Handle error (show toast, etc.)
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = async (files: FileList | null) => {
//     if (!files || files.length === 0) return;

//     setUploadingImages(true);
    
//     try {
//       const uploadedImages: string[] = [];
      
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
        
//         // Validate file
//         if (!file.type.startsWith('image/')) continue;
//         if (file.size > 5 * 1024 * 1024) continue; // 5MB limit
        
//         // Convert to base64 (or replace with your upload logic)
//         const base64 = await fileToBase64(file);
//         uploadedImages.push(base64);
//       }
      
//       setFormData(prev => ({
//         ...prev,
//         images: [...prev.images, ...uploadedImages]
//       }));
//     } catch (error) {
//       console.error('Error uploading images:', error);
//     } finally {
//       setUploadingImages(false);
//     }
//   };

//   const fileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = error => reject(error);
//     });
//   };

//   const removeImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const handleCancel = () => {
//     router.push('/products');
//   };

//   if (pageLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-lg text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/products"
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <ArrowLeft size={20} />
//             </Link>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {isEditMode ? 'Edit Product' : 'Add New Product'}
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 {isEditMode ? 'Update product information' : 'Create a new product for your store'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Form Content */}
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="bg-white rounded-lg shadow">
//           <form onSubmit={handleSubmit} className="p-6 space-y-8">
//             {/* Basic Information */}
//             <div className="space-y-6">
//               <div className="border-b border-gray-200 pb-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
//                 <p className="text-sm text-gray-600 mt-1">Essential product details</p>
//               </div>
              
//               <div className="grid grid-cols-1 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter product name"
//                     value={formData.name}
//                     onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category *
//                     </label>
//                     <select
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       value={formData.category}
//                       onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
//                     >
//                       <option value="">Select a category</option>
//                       {categories.map((category) => (
//                         <option key={category._id} value={category._id}>
//                           {category.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       SKU
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter SKU (optional)"
//                       value={formData.sku}
//                       onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     rows={5}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter product description"
//                     value={formData.description}
//                     onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Pricing & Inventory */}
//             <div className="space-y-6">
//               <div className="border-b border-gray-200 pb-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>
//                 <p className="text-sm text-gray-600 mt-1">Set pricing and stock information</p>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price *
//                   </label>
//                   <div className="relative">
//                     <span className="absolute left-4 top-3 text-gray-500">$</span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       required
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="0.00"
//                       value={formData.price}
//                       onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Stock Quantity
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="0"
//                     value={formData.stock}
//                     onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Status
//                   </label>
//                   <select
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={formData.status}
//                     onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'draft' }))}
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="draft">Draft</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Product Images */}
//             <div className="space-y-6">
//               <div className="border-b border-gray-200 pb-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
//                 <p className="text-sm text-gray-600 mt-1">Upload product photos</p>
//               </div>
              
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
//                 <div className="text-center">
//                   <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//                   <div className="flex text-base text-gray-600 justify-center">
//                     <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
//                       <span>{uploadingImages ? 'Uploading...' : 'Upload images'}</span>
//                       <input
//                         type="file"
//                         className="sr-only"
//                         multiple
//                         accept="image/*"
//                         disabled={uploadingImages}
//                         onChange={(e) => handleImageUpload(e.target.files)}
//                       />
//                     </label>
//                     <p className="pl-1">or drag and drop</p>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-2">PNG, JPG, WEBP up to 5MB each</p>
//                 </div>
//               </div>

//               {/* Image Preview */}
//               {formData.images.length > 0 && (
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                   {formData.images.map((image, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={image}
//                         alt={`Product ${index + 1}`}
//                         className="w-full h-32 object-cover rounded-lg border border-gray-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <X size={14} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading || uploadingImages}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {loading 
//                   ? 'Saving...' 
//                   : isEditMode 
//                     ? 'Update Product' 
//                     : 'Create Product'
//                 }
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



import React from 'react'
import ProductPage from '@/components/AdminProducts'

const page = () => {
  return (
    <div>
      <ProductPage />
    </div>
  )
}

export default page
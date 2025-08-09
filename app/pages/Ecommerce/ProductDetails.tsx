import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronLeftIcon, PencilIcon } from '../../icons';
import { useProductService } from '../../apiservices/useProductService';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import { UserCircle2Icon } from 'lucide-react';
// import { useDashboardService } from '../../apiservices/useDashboardService';
// import { API_URL } from '../../config';
// import { UserCircle2Icon } from 'lucide-react';
// import { EnvelopeIcon } from '../../icons';
// import { CalenderIcon } from '../../icons';
// import { Badge } from '../../components/ui/badge';
// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   originalPrice?: number;
//   category: string;
//   stock: number;
//   lowStockThreshold: number;
//   isActive: boolean;
//   images: string[];
//   sku: string;
//   mainImage: string;
//   weight?: number;
//   dimensions?: {
//     length: number;
//     width: number;
//     height: number;
//   };
//   createdAt: string;
//   updatedAt: string;
// }
const API_URL = import.meta.env.VITE_API_URL;
const ProductDetails: React.FC = () => {
  const { getProduct } = useProductService();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [buyers, setBuyers] = useState<any>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const data = await getProduct(productId);
          console.log("buyers",data.buyers);
          setProduct(data.data);
          setBuyers(data.buyers);
        } catch {
          setProduct(null);
        }
      }
    };
    fetchProduct();
  }, [productId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!product) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/products"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Product Details
              </p>
            </div>
          </div>
          <Link
            to={`/admin/products/${productId}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <PencilIcon className="w-5 h-5 mr-2" />
            Edit Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={product.mainImage || '/images/product/product-01.jpg'}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="max-w-full overflow-x-auto mt-5 mb-5 border border-gray-200 rounded-lg p-5">

            Product Buyers
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Signup Date
                  </TableCell>
               
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              {buyers?.length > 0 ? (
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {buyers.map((buyer: any, index: number) => (
                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <TableCell className="px-6 py-4 text-start">
                        <div className="flex items-center gap-3">
                          {buyer.avatar && !buyer.avatar.endsWith("default-avatar.jpg") ? (

                            <div className="w-10 h-10 overflow-hidden rounded-full">
                              <img
                                width={40}
                                height={40}
                                src={API_URL + "uploads/profile/" + buyer.avatar}
                                alt={buyer.firstName + " " + buyer.lastName}
                                className="w-full h-full object-cover"
                              />

                            </div>) : (
                            <UserCircle2Icon className="text-blue-600 size-10 ml-0 dark:text-blue-400" />
                          )}
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {buyer.firstName + " " + buyer.lastName}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                            {buyer.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start">
                        <div className="flex items-center gap-2" style={{ color: buyer.isActive == true ? "green" : "red"   , borderRadius: "5px" , padding: "2px 5px"}}>
                         
                            {buyer.isActive == true ? "Active" : "Inactive"}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                            {formatDate(buyer.updatedAt)}
                          </span>
                        </div>
                      </TableCell>
                     
                      
                      
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <div className="flex items-center justify-center h-24 text-center w-full">
                  No buyers found
                </div>
              )}
            </Table>
          </div>
          {/* Thumbnail Images */}
          {/* {product?.images.length > 1 && (
            <div className="flex space-x-2">
              {product?.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === index
                      ? 'border-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
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
          )} */}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Product Name
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {product.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {product.category?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    SKU
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {product.sku}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pricing
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Current Price
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
              </div>

              {product.originalPrice && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Original Price
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              )}

              {/* <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Stock Level
                </span>
                <span className={`text-lg font-medium ${product.lowStockThreshold > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                  {product.lowStockThreshold > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div> */}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Specifications
            </h2>

            <div className="space-y-4">
              {product.weight && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Weight
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {product.weight} kg
                  </span>
                </div>
              )}

              {product.dimensions && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Dimensions
                  </span>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <span className="block text-sm text-gray-500 dark:text-gray-400">Length</span>
                      <span className="text-gray-900 dark:text-white">{product.dimensions.length} cm</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-sm text-gray-500 dark:text-gray-400">Width</span>
                      <span className="text-gray-900 dark:text-white">{product.dimensions.width} cm</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-sm text-gray-500 dark:text-gray-400">Height</span>
                      <span className="text-gray-900 dark:text-white">{product.dimensions.height} cm</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div> */}

          {/* Timestamps */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timestamps
            </h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(product.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Updated
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDate(product.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 
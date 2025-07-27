// 'use client';

// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';

// // Types
// type Variant = {
//   label: string;
//   price: string;
//   perKg: string;
//   selected?: boolean;
// };

// type Section = {
//   key: string;
//   title: string;
//   content: string;
// };

// const ProductPage: React.FC = () => {
//   const images: string[] = [
//     'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
//     'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
//     'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
//     'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
//   ];

//   const variants: Variant[] = [
//     { label: '1 kg', price: '₹248.00', perKg: '₹248.00/kg', selected: true },
//     { label: '500 g', price: '₹124.00', perKg: '₹248.00/kg' },
//     { label: '800 g', price: '₹198.00', perKg: '₹247.50/kg' },
//     { label: '250 g', price: '₹62.00', perKg: '₹248.00/kg' },
//   ];

//   const [mainImage, setMainImage] = useState<string>(images[0]);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [selectedVariant, setSelectedVariant] = useState<string>(variants[0].label);
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({});

//   const toggleSection = (sectionKey: string) => {
//     setExpanded(prev => ({
//       ...prev,
//       [sectionKey]: !prev[sectionKey],
//     }));
//   };

//   const detailSections: Section[] = [
//     {
//       key: 'about',
//       title: 'About the Product',
//       content: 'Coriander leaf is aromatic and adds fresh flavors to dishes. Use it for garnishing and flavoring.',
//     },
//     {
//       key: 'benefits',
//       title: 'Benefits',
//       content: 'Coriander can lower blood sugar and support heart health.',
//     },
//     {
//       key: 'storage',
//       title: 'Storage and Uses',
//       content: 'Store in cool place. Wrap with paper towel to keep fresh.',
//     },
//     {
//       key: 'other',
//       title: 'Other Product Info',
//       content: 'Country of Origin: India. FSSAI license info available on request.',
//     },
//   ];

//   return (
//     <div className="p-4 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
//       {/* Left: Image Gallery */}
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex md:flex-col gap-2">
//           {images.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt={`Thumbnail ${i + 1}`}
//               className={`w-16 h-16 object-cover border rounded cursor-pointer transition ${
//                 mainImage === img ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300'
//               }`}
//               onClick={() => setMainImage(img)}
//             />
//           ))}
//         </div>
//         <img
//           src={mainImage}
//           alt="Main product"
//           className="rounded-lg w-full max-h-[400px] object-contain border"
//         />
//       </div>

//       {/* Right: Product Info */}
//       <div>
//         <h1 className="text-xl font-semibold">Refcel Coriander Leaves, 1 kg</h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Price: <span className="text-black">₹248.00 (incl. of all taxes)</span>
//         </p>

//         {/* Quantity Selector */}
//         <div className="mt-4 flex items-center gap-2">
//           <span className="text-sm">Quantity:</span>
//           <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
//             <Minus className="w-5 h-5 text-gray-700" />
//           </button>
//           <span className="px-3">{quantity}</span>
//           <button onClick={() => setQuantity(q => q + 1)}>
//             <Plus className="w-5 h-5 text-gray-700" />
//           </button>
//         </div>

//         {/* Variant Selector */}
//         <div className="mt-4 space-y-2">
//           {variants.map((v, i) => (
//             <div
//               key={i}
//               className={`border p-2 rounded flex justify-between items-center cursor-pointer transition ${
//                 selectedVariant === v.label
//                   ? 'border-orange-500 bg-orange-50'
//                   : 'border-gray-300 hover:border-orange-300'
//               }`}
//               onClick={() => setSelectedVariant(v.label)}
//             >
//               <span className="font-medium">{v.label}</span>
//               <div className="text-right text-sm">
//                 <div>{v.price}</div>
//                 <div className="text-gray-500">{v.perKg}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Highlight Tag */}
//         <div className="mt-6">
//           <button className="bg-gray-100 px-3 py-1 text-sm rounded">
//             Coriander &amp; similar articles
//           </button>
//         </div>

//         {/* Expandable Sections */}
//         {detailSections.map(({ key, title, content }) => (
//           <div key={key} className="mt-4 border border-gray-200 rounded">
//             <div
//               onClick={() => toggleSection(key)}
//               className="flex justify-between items-center p-2 cursor-pointer bg-gray-50"
//             >
//               <span className="font-medium">{title}</span>
//               {expanded[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//             {expanded[key] && <div className="p-2 text-sm text-gray-600">{content}</div>}
//           </div>
//         ))}

//         {/* Rating and Review Section */}
//         <div className="mt-6 border-t pt-4">
//           <p className="text-sm text-gray-500">
//             You can rate this product only after purchasing from Refcelcart
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;



// Image Gallery Component
"use client";
import React, { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useWishListContext } from '@/context/WishListsContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 



// Type Definitions
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
  rating: number;
  reviews: Review[];
  totalReviews: number;
  category: string;
  discount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  brand: string;
  sku: string;
  weight: string;
  dimensions: string;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface CartItem extends Product {
  quantity: number;
}
const ImageGallery: React.FC<{ images: string[]; productName: string }> = ({ images, productName }) => {
  const [currentImage, setCurrentImage] = useState<number>(0);

  const nextImage = (): void => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (): void => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
        <img
          src={images[currentImage]}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImage ? 'bg-white' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImage
                  ? 'border-orange-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Reviews Component
const ReviewsSection: React.FC<{ reviews: Review[]; rating: number; totalReviews: number }> = ({
  reviews,
  rating,
  totalReviews
}) => {
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const RatingStars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${i < Math.floor(rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
            }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
        <div className="flex items-center space-x-2">
          <RatingStars rating={rating} size={20} />
          <span className="font-semibold text-lg">{rating}</span>
          <span className="text-gray-500">({totalReviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{review.userName}</p>
                  <div className="flex items-center space-x-2">
                    <RatingStars rating={review.rating} />
                    {review.verified && (
                      <span className="text-xs text-green-600 flex items-center">
                        <Check size={12} className="mr-1" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
        </button>
      )}
    </div>
  );
};

// Main Product Details Component
const ProductDetailsPage: React.FC = () => {
  const { wishListsData, setWistListsData } = useWishListContext();
  const { addToCart } = useCart();
 const router = useRouter();

  const handleGo = () => {
    router.push('/productList');
  };
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Sample product data
  const product: Product = {
    id: 1,
    name: 'Premium Organic Red Apples',
    price: 180,
    originalPrice: 220,
    images: [
      'https://picsum.photos/600/600?random=1',
      'https://picsum.photos/600/600?random=2',
      'https://picsum.photos/600/600?random=3',
      'https://picsum.photos/600/600?random=4'
    ],
    rating: 4.5,
    totalReviews: 128,
    category: 'fruits',
    discount: 18,
    description: 'Fresh, crispy, and naturally sweet organic red apples sourced directly from premium orchards. These apples are rich in fiber, vitamins, and antioxidants, making them a perfect healthy snack for the whole family.',
    features: [
      '100% Organic & Natural',
      'Rich in Fiber & Vitamins',
      'Crispy & Fresh',
      'No Artificial Preservatives',
      'Hand-picked Quality'
    ],
    specifications: {
      'Weight': '1 kg',
      'Origin': 'Himachal Pradesh, India',
      'Variety': 'Red Delicious',
      'Shelf Life': '7-10 days',
      'Storage': 'Cool & Dry Place',
      'Organic Certified': 'Yes'
    },
    inStock: true,
    stockCount: 45,
    brand: 'FreshMart Organic',
    sku: 'FMO-APL-001',
    weight: '1 kg',
    dimensions: '15cm x 10cm x 8cm',
    reviews: [
      {
        id: 1,
        userName: 'Priya Sharma',
        rating: 5,
        comment: 'Excellent quality apples! Very fresh and crispy. My family loved them.',
        date: '2 days ago',
        verified: true,
        helpful: 12
      },
      {
        id: 2,
        userName: 'Rajesh Kumar',
        rating: 4,
        comment: 'Good quality but slightly expensive. Worth it for organic produce.',
        date: '1 week ago',
        verified: true,
        helpful: 8
      },
      {
        id: 3,
        userName: 'Anjali Patel',
        rating: 5,
        comment: 'Perfect for my kids lunch boxes. Great taste and quality.',
        date: '2 weeks ago',
        verified: false,
        helpful: 5
      }
    ]
  };

  const isInWishlist = wishListsData.some(item => item.id === product.id);

  const handleQuantityChange = (change: number): void => {
    setQuantity(prev => Math.max(1, Math.min(prev + change, product.stockCount)));
  };

  const toggleWishlist = (): void => {
    if (isInWishlist) {
      setWistListsData(prev => prev.filter(item => item.id !== product.id));
    } else {
      // setWistListsData(prev => [...prev, product]);
    }
  };

  const handleAddToCart = (): void => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200" onClick={handleGo}>
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
            <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              🛒
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-6">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500">{product.brand}</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-lg">{product.rating}</span>
                <span className="text-gray-500">({product.totalReviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                {product.inStock ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">In Stock ({product.stockCount} available)</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-3 font-semibold min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stockCount}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg disabled:cursor-not-allowed disabled:transform-none"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-4 border-2 rounded-xl transition-all duration-200 hover:scale-105 ${isInWishlist
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500'
                  }`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
              <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
                <Truck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Free Delivery</p>
                <p className="text-sm text-gray-500">On orders above ₹500</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
                <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Easy Returns</p>
                <p className="text-sm text-gray-500">7-day return policy</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
                <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Quality Assured</p>
                <p className="text-sm text-gray-500">100% authentic products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { key: 'description', label: 'Description' },
                { key: 'specifications', label: 'Specifications' },
                { key: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as typeof selectedTab)}
                  className={`px-8 py-4 font-medium transition-all duration-200 ${selectedTab === tab.key
                      ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <ReviewsSection
                reviews={product.reviews}
                rating={product.rating}
                totalReviews={product.totalReviews}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProductDetailsPage;
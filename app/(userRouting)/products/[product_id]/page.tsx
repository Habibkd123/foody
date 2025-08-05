// // // // 'use client';

// // // // import React, { useState } from 'react';
// // // // import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';

// // // // // Types
// // // // type Variant = {
// // // //   label: string;
// // // //   price: string;
// // // //   perKg: string;
// // // //   selected?: boolean;
// // // // };

// // // // type Section = {
// // // //   key: string;
// // // //   title: string;
// // // //   content: string;
// // // // };

// // // // const ProductPage: React.FC = () => {
// // // //   const images: string[] = [
// // // //     'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
// // // //     'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
// // // //     'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
// // // //     'https://bokksumarket.com/cdn/shop/collections/Drinks_small.svg?v=1752738381',
// // // //   ];

// // // //   const variants: Variant[] = [
// // // //     { label: '1 kg', price: '₹248.00', perKg: '₹248.00/kg', selected: true },
// // // //     { label: '500 g', price: '₹124.00', perKg: '₹248.00/kg' },
// // // //     { label: '800 g', price: '₹198.00', perKg: '₹247.50/kg' },
// // // //     { label: '250 g', price: '₹62.00', perKg: '₹248.00/kg' },
// // // //   ];

// // // //   const [mainImage, setMainImage] = useState<string>(images[0]);
// // // //   const [quantity, setQuantity] = useState<number>(1);
// // // //   const [selectedVariant, setSelectedVariant] = useState<string>(variants[0].label);
// // // //   const [expanded, setExpanded] = useState<Record<string, boolean>>({});

// // // //   const toggleSection = (sectionKey: string) => {
// // // //     setExpanded(prev => ({
// // // //       ...prev,
// // // //       [sectionKey]: !prev[sectionKey],
// // // //     }));
// // // //   };

// // // //   const detailSections: Section[] = [
// // // //     {
// // // //       key: 'about',
// // // //       title: 'About the Product',
// // // //       content: 'Coriander leaf is aromatic and adds fresh flavors to dishes. Use it for garnishing and flavoring.',
// // // //     },
// // // //     {
// // // //       key: 'benefits',
// // // //       title: 'Benefits',
// // // //       content: 'Coriander can lower blood sugar and support heart health.',
// // // //     },
// // // //     {
// // // //       key: 'storage',
// // // //       title: 'Storage and Uses',
// // // //       content: 'Store in cool place. Wrap with paper towel to keep fresh.',
// // // //     },
// // // //     {
// // // //       key: 'other',
// // // //       title: 'Other Product Info',
// // // //       content: 'Country of Origin: India. FSSAI license info available on request.',
// // // //     },
// // // //   ];

// // // //   return (
// // // //     <div className="p-4 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
// // // //       {/* Left: Image Gallery */}
// // // //       <div className="flex flex-col md:flex-row gap-4">
// // // //         <div className="flex md:flex-col gap-2">
// // // //           {images.map((img, i) => (
// // // //             <img
// // // //               key={i}
// // // //               src={img}
// // // //               alt={`Thumbnail ${i + 1}`}
// // // //               className={`w-16 h-16 object-cover border rounded cursor-pointer transition ${
// // // //                 mainImage === img ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300'
// // // //               }`}
// // // //               onClick={() => setMainImage(img)}
// // // //             />
// // // //           ))}
// // // //         </div>
// // // //         <img
// // // //           src={mainImage}
// // // //           alt="Main product"
// // // //           className="rounded-lg w-full max-h-[400px] object-contain border"
// // // //         />
// // // //       </div>

// // // //       {/* Right: Product Info */}
// // // //       <div>
// // // //         <h1 className="text-xl font-semibold">Refcel Coriander Leaves, 1 kg</h1>
// // // //         <p className="text-sm text-gray-500 mt-1">
// // // //           Price: <span className="text-black">₹248.00 (incl. of all taxes)</span>
// // // //         </p>

// // // //         {/* Quantity Selector */}
// // // //         <div className="mt-4 flex items-center gap-2">
// // // //           <span className="text-sm">Quantity:</span>
// // // //           <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
// // // //             <Minus className="w-5 h-5 text-gray-700" />
// // // //           </button>
// // // //           <span className="px-3">{quantity}</span>
// // // //           <button onClick={() => setQuantity(q => q + 1)}>
// // // //             <Plus className="w-5 h-5 text-gray-700" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Variant Selector */}
// // // //         <div className="mt-4 space-y-2">
// // // //           {variants.map((v, i) => (
// // // //             <div
// // // //               key={i}
// // // //               className={`border p-2 rounded flex justify-between items-center cursor-pointer transition ${
// // // //                 selectedVariant === v.label
// // // //                   ? 'border-orange-500 bg-orange-50'
// // // //                   : 'border-gray-300 hover:border-orange-300'
// // // //               }`}
// // // //               onClick={() => setSelectedVariant(v.label)}
// // // //             >
// // // //               <span className="font-medium">{v.label}</span>
// // // //               <div className="text-right text-sm">
// // // //                 <div>{v.price}</div>
// // // //                 <div className="text-gray-500">{v.perKg}</div>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         {/* Highlight Tag */}
// // // //         <div className="mt-6">
// // // //           <button className="bg-gray-100 px-3 py-1 text-sm rounded">
// // // //             Coriander &amp; similar articles
// // // //           </button>
// // // //         </div>

// // // //         {/* Expandable Sections */}
// // // //         {detailSections.map(({ key, title, content }) => (
// // // //           <div key={key} className="mt-4 border border-gray-200 rounded">
// // // //             <div
// // // //               onClick={() => toggleSection(key)}
// // // //               className="flex justify-between items-center p-2 cursor-pointer bg-gray-50"
// // // //             >
// // // //               <span className="font-medium">{title}</span>
// // // //               {expanded[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
// // // //             </div>
// // // //             {expanded[key] && <div className="p-2 text-sm text-gray-600">{content}</div>}
// // // //           </div>
// // // //         ))}

// // // //         {/* Rating and Review Section */}
// // // //         <div className="mt-6 border-t pt-4">
// // // //           <p className="text-sm text-gray-500">
// // // //             You can rate this product only after purchasing from Refcelcart
// // // //           </p>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ProductPage;



// // // // Image Gallery Component
// // // "use client";
// // // import React, { useState } from 'react';
// // // import {
// // //   Heart,
// // //   ShoppingCart,
// // //   Star,
// // //   Plus,
// // //   Minus,
// // //   Share2,
// // //   Truck,
// // //   Shield,
// // //   RefreshCw,
// // //   ArrowLeft,
// // //   Check,
// // //   X,
// // //   ChevronLeft,
// // //   ChevronRight
// // // } from 'lucide-react';
// // // import { useWishListContext } from '@/context/WishListsContext';
// // // import { useCart } from '@/context/CartContext';
// // // import Link from 'next/link';
// // // import { useParams, useRouter } from 'next/navigation';
// // // import { useOrder } from '@/context/OrderContext';
// // // import { useProductsContext } from '@/context/AllProductContext';
// // // import { Product } from '@/types/global';
// // // interface Review {
// // //   id: number;
// // //   userName: string;
// // //   rating: number;
// // //   comment: string;
// // //   date: string;
// // //   verified: boolean;
// // //   helpful: number;
// // // }

// // // interface CartItem extends Product {
// // //   quantity: number;
// // // }
// // // const ImageGallery: React.FC<{ images: string[]; productName: string }> = ({ images, productName }) => {
// // //   const [currentImage, setCurrentImage] = useState<number>(0);

// // //   const nextImage = (): void => {
// // //     setCurrentImage((prev) => (prev + 1) % images.length);
// // //   };

// // //   const prevImage = (): void => {
// // //     setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
// // //   };

// // //   return (
// // //     <div className="space-y-4">
// // //       {/* Main Image */}
// // //       <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
// // //         <img
// // //           src={images[currentImage]}
// // //           alt={productName}
// // //           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
// // //         />
// // //         {images.length > 1 && (
// // //           <>
// // //             <button
// // //               onClick={prevImage}
// // //               className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
// // //             >
// // //               <ChevronLeft size={20} />
// // //             </button>
// // //             <button
// // //               onClick={nextImage}
// // //               className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
// // //             >
// // //               <ChevronRight size={20} />
// // //             </button>
// // //           </>
// // //         )}
// // //         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
// // //           {images.map((_, index) => (
// // //             <div
// // //               key={index}
// // //               className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImage ? 'bg-white' : 'bg-white/50'
// // //                 }`}
// // //             />
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Thumbnail Images */}
// // //       {images.length > 1 && (
// // //         <div className="flex space-x-2 overflow-x-auto pb-2">
// // //           {images.map((image, index) => (
// // //             <button
// // //               key={index}
// // //               onClick={() => setCurrentImage(index)}
// // //               className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImage
// // //                 ? 'border-orange-500 shadow-lg'
// // //                 : 'border-gray-200 hover:border-gray-300'
// // //                 }`}
// // //             >
// // //               <img
// // //                 src={image}
// // //                 alt={`${productName} ${index + 1}`}
// // //                 className="w-full h-full object-cover"
// // //               />
// // //             </button>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // Reviews Component
// // // const ReviewsSection: React.FC<{ reviews: Review[]; rating: number; totalReviews: number }> = ({
// // //   reviews,
// // //   rating,
// // //   totalReviews
// // // }) => {
// // //   const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
// // //   const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

// // //   const RatingStars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => (
// // //     <div className="flex items-center">
// // //       {[...Array(5)].map((_, i) => (
// // //         <Star
// // //           key={i}
// // //           size={size}
// // //           className={`${i < Math.floor(rating)
// // //             ? 'text-yellow-400 fill-current'
// // //             : 'text-gray-300'
// // //             }`}
// // //         />
// // //       ))}
// // //     </div>
// // //   );

// // //   return (
// // //     <div className="space-y-6">
// // //       <div className="flex items-center justify-between">
// // //         <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
// // //         <div className="flex items-center space-x-2">
// // //           <RatingStars rating={rating} size={20} />
// // //           <span className="font-semibold text-lg">{rating}</span>
// // //           <span className="text-gray-500">({totalReviews} reviews)</span>
// // //         </div>
// // //       </div>

// // //       <div className="space-y-4">
// // //         {displayedReviews.map((review) => (
// // //           <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
// // //             <div className="flex items-start justify-between mb-2">
// // //               <div className="flex items-center space-x-2">
// // //                 <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
// // //                   {review.userName.charAt(0).toUpperCase()}
// // //                 </div>
// // //                 <div>
// // //                   <p className="font-medium text-gray-900">{review.userName}</p>
// // //                   <div className="flex items-center space-x-2">
// // //                     <RatingStars rating={review.rating} />
// // //                     {review.verified && (
// // //                       <span className="text-xs text-green-600 flex items-center">
// // //                         <Check size={12} className="mr-1" />
// // //                         Verified Purchase
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //               <span className="text-sm text-gray-500">{review.date}</span>
// // //             </div>
// // //             <p className="text-gray-700 mb-2">{review.comment}</p>
// // //             <button className="text-sm text-gray-500 hover:text-gray-700">
// // //               Helpful ({review.helpful})
// // //             </button>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {reviews.length > 3 && (
// // //         <button
// // //           onClick={() => setShowAllReviews(!showAllReviews)}
// // //           className="text-orange-600 hover:text-orange-700 font-medium"
// // //         >
// // //           {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
// // //         </button>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // Main Product Details Component
// // // const ProductDetailsPage: React.FC = () => {
// // //   const { wishListsData, setWistListsData } = useWishListContext();
// // //     const { productsData, setProductsData } = useProductsContext();
// // //   const {product_id }:any = useParams()
// // //   const { addToCart } = useCart();
// // //   const { state, dispatch } = useOrder();
// // //   const router = useRouter();

// // //   const handleGo = () => {
// // //     router.push('/productList');
// // //   };
// // //   const [quantity, setQuantity] = useState<number>(1);
// // //   const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');
// // //   let product = productsData.filter((item: any) => item?.id == product_id)
// // //   // console.log("params", getsingleProducts)

// // //   // Sample product data
// // //   const products: Product =
// // //   {
// // //     id: 1,
// // //     name: 'Premium Organic Red Apples',
// // //     price: 180,
// // //     originalPrice: 220,
// // //     images: [
// // //       'https://picsum.photos/600/600?random=1',
// // //       'https://picsum.photos/600/600?random=2',
// // //       'https://picsum.photos/600/600?random=3',
// // //       'https://picsum.photos/600/600?random=4'
// // //     ],
// // //     rating: 4.5,
// // //     totalReviews: 128,
// // //     category: 'fruits',
// // //     discount: 18,
// // //     description: 'Fresh, crispy, and naturally sweet organic red apples sourced directly from premium orchards. These apples are rich in fiber, vitamins, and antioxidants, making them a perfect healthy snack for the whole family.',
// // //     features: [
// // //       '100% Organic & Natural',
// // //       'Rich in Fiber & Vitamins',
// // //       'Crispy & Fresh',
// // //       'No Artificial Preservatives',
// // //       'Hand-picked Quality'
// // //     ],
// // //     specifications: {
// // //       'Weight': '1 kg',
// // //       'Origin': 'Himachal Pradesh, India',
// // //       'Variety': 'Red Delicious',
// // //       'Shelf Life': '7-10 days',
// // //       'Storage': 'Cool & Dry Place',
// // //       'Organic Certified': 'Yes'
// // //     },
// // //     inStock: true,
// // //     stockCount: 45,
// // //     brand: 'FreshMart Organic',
// // //     sku: 'FMO-APL-001',
// // //     weight: '1 kg',
// // //     dimensions: '15cm x 10cm x 8cm',
// // //     reviews: [
// // //       {
// // //         id: 1,
// // //         userName: 'Priya Sharma',
// // //         rating: 5,
// // //         comment: 'Excellent quality apples! Very fresh and crispy. My family loved them.',
// // //         date: '2 days ago',
// // //         verified: true,
// // //         helpful: 12
// // //       },
// // //       {
// // //         id: 2,
// // //         userName: 'Rajesh Kumar',
// // //         rating: 4,
// // //         comment: 'Good quality but slightly expensive. Worth it for organic produce.',
// // //         date: '1 week ago',
// // //         verified: true,
// // //         helpful: 8
// // //       },
// // //       {
// // //         id: 3,
// // //         userName: 'Anjali Patel',
// // //         rating: 5,
// // //         comment: 'Perfect for my kids lunch boxes. Great taste and quality.',
// // //         date: '2 weeks ago',
// // //         verified: false,
// // //         helpful: 5
// // //       }
// // //     ]
// // //   };

// // //   const isInWishlist = wishListsData.some((item:any )=> item.id === product.id);

// // //   const handleQuantityChange = (change: number): void => {
// // //     setQuantity(prev => Math.max(1, Math.min(prev + change, product.stockCount)));
// // //   };

// // //   const toggleWishlist = (): void => {
// // //     if (isInWishlist) {
// // //       setWistListsData(prev => prev.filter(item => item.id !== product.id));
// // //     } else {
// // //       // setWistListsData(prev => [...prev, product]);
// // //     }
// // //   };

// // //   const handleAddToCart = (): void => {
// // //     addToCart(product, quantity);
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
// // //       {/* Header */}
// // //       <header className="bg-white shadow-sm border-b sticky top-0 z-50">
// // //         <div className="max-w-7xl mx-auto px-4 py-4">
// // //           <div className="flex items-center space-x-4">
// // //             <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200" onClick={handleGo}>
// // //               <ArrowLeft className="w-6 h-6 text-gray-600" />
// // //             </button>
// // //             <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
// // //               🛒
// // //             </h1>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       {/* Main Content */}
// // //       <div className="max-w-7xl mx-auto px-4 py-8">
// // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// // //           {/* Left Column - Images */}
// // //           <div className="space-y-6">
// // //             <ImageGallery images={product[0].images} productName={product.name} />
// // //           </div>

// // //           {/* Right Column - Product Info */}
// // //           <div className="space-y-6">
// // //             {/* Product Header */}
// // //             <div>
// // //               <div className="flex items-center space-x-2 mb-2">
// // //                 <span className="text-sm text-gray-500">{product.brand}</span>
// // //                 <span className="text-sm text-gray-300">•</span>
// // //                 <span className="text-sm text-gray-500">SKU: {product.sku}</span>
// // //               </div>
// // //               <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

// // //               {/* Rating */}
// // //               <div className="flex items-center space-x-3 mb-4">
// // //                 <div className="flex items-center">
// // //                   {[...Array(5)].map((_, i) => (
// // //                     <Star
// // //                       key={i}
// // //                       className={`w-5 h-5 ${i < Math.floor(product.rating)
// // //                         ? 'text-yellow-400 fill-current'
// // //                         : 'text-gray-300'
// // //                         }`}
// // //                     />
// // //                   ))}
// // //                 </div>
// // //                 <span className="font-semibold text-lg">{product.rating}</span>
// // //                 <span className="text-gray-500">({product.totalReviews} reviews)</span>
// // //               </div>

// // //               {/* Price */}
// // //               <div className="flex items-center space-x-4 mb-6">
// // //                 <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
// // //                 <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
// // //                 <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
// // //                   {product.discount}% OFF
// // //                 </span>
// // //               </div>

// // //               {/* Stock Status */}
// // //               <div className="flex items-center space-x-2 mb-6">
// // //                 {product.inStock ? (
// // //                   <>
// // //                     <Check className="w-5 h-5 text-green-500" />
// // //                     <span className="text-green-600 font-medium">In Stock ({product.stockCount} available)</span>
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <X className="w-5 h-5 text-red-500" />
// // //                     <span className="text-red-600 font-medium">Out of Stock</span>
// // //                   </>
// // //                 )}
// // //               </div>
// // //             </div>

// // //             {/* Quantity Selector */}
// // //             <div className="flex items-center space-x-4">
// // //               <span className="font-medium text-gray-700">Quantity:</span>
// // //               <div className="flex items-center border-2 border-gray-200 rounded-lg">
// // //                 <button
// // //                   onClick={() => handleQuantityChange(-1)}
// // //                   disabled={quantity <= 1}
// // //                   className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
// // //                 >
// // //                   <Minus size={16} />
// // //                 </button>
// // //                 <span className="px-4 py-3 font-semibold min-w-[60px] text-center">{quantity}</span>
// // //                 <button
// // //                   onClick={() => handleQuantityChange(1)}
// // //                   disabled={quantity >= product.stockCount}
// // //                   className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
// // //                 >
// // //                   <Plus size={16} />
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             {/* Action Buttons */}
// // //             <div className="flex space-x-4">
// // //               <button
// // //                 onClick={handleAddToCart}
// // //                 disabled={!product.inStock}
// // //                 className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg disabled:cursor-not-allowed disabled:transform-none"
// // //               >
// // //                 <ShoppingCart className="w-5 h-5 mr-2" />
// // //                 Add to Cart
// // //               </button>
// // //               <button
// // //                 onClick={toggleWishlist}
// // //                 className={`p-4 border-2 rounded-xl transition-all duration-200 hover:scale-105 ${isInWishlist
// // //                   ? 'border-red-500 bg-red-50 text-red-500'
// // //                   : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500'
// // //                   }`}
// // //               >
// // //                 <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
// // //               </button>
// // //               <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105">
// // //                 <Share2 className="w-6 h-6 text-gray-600" />
// // //               </button>
// // //             </div>

// // //             {/* Features */}
// // //             <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
// // //               <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
// // //               <div className="grid grid-cols-1 gap-3">
// // //                 {product.features.map((feature, index) => (
// // //                   <div key={index} className="flex items-center space-x-3">
// // //                     <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
// // //                     <span className="text-gray-700">{feature}</span>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             {/* Delivery Info */}
// // //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// // //               <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
// // //                 <Truck className="w-8 h-8 text-green-500 mx-auto mb-2" />
// // //                 <p className="font-medium text-gray-900">Free Delivery</p>
// // //                 <p className="text-sm text-gray-500">On orders above ₹500</p>
// // //               </div>
// // //               <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
// // //                 <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
// // //                 <p className="font-medium text-gray-900">Easy Returns</p>
// // //                 <p className="text-sm text-gray-500">7-day return policy</p>
// // //               </div>
// // //               <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
// // //                 <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
// // //                 <p className="font-medium text-gray-900">Quality Assured</p>
// // //                 <p className="text-sm text-gray-500">100% authentic products</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Product Details Tabs */}
// // //         <div className="mt-16 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
// // //           {/* Tab Navigation */}
// // //           <div className="border-b border-gray-200">
// // //             <div className="flex">
// // //               {[
// // //                 { key: 'description', label: 'Description' },
// // //                 { key: 'specifications', label: 'Specifications' },
// // //                 { key: 'reviews', label: 'Reviews' }
// // //               ].map((tab) => (
// // //                 <button
// // //                   key={tab.key}
// // //                   onClick={() => setSelectedTab(tab.key as typeof selectedTab)}
// // //                   className={`px-8 py-4 font-medium transition-all duration-200 ${selectedTab === tab.key
// // //                     ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
// // //                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
// // //                     }`}
// // //                 >
// // //                   {tab.label}
// // //                 </button>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {/* Tab Content */}
// // //           <div className="p-8">
// // //             {selectedTab === 'description' && (
// // //               <div className="prose max-w-none">
// // //                 <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
// // //               </div>
// // //             )}

// // //             {selectedTab === 'specifications' && (
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                 {Object.entries(product.specifications).map(([key, value]) => (
// // //                   <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
// // //                     <span className="font-medium text-gray-900">{key}</span>
// // //                     <span className="text-gray-700">{value}</span>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}

// // //             {selectedTab === 'reviews' && (
// // //               <ReviewsSection
// // //                 reviews={product.reviews}
// // //                 rating={product.rating}
// // //                 totalReviews={product.totalReviews}
// // //               />
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };


// // // export default ProductDetailsPage;




// // // Image Gallery Component
// // "use client";
// // import React, { useState } from 'react';
// // import {
// //   Heart,
// //   ShoppingCart,
// //   Star,
// //   Plus,
// //   Minus,
// //   Share2,
// //   Truck,
// //   Shield,
// //   RefreshCw,
// //   ArrowLeft,
// //   Check,
// //   X,
// //   ChevronLeft,
// //   ChevronRight,
// //   Menu
// // } from 'lucide-react';
// // import { useWishListContext } from '@/context/WishListsContext';
// // import { useCart } from '@/context/CartContext';
// // import Link from 'next/link';
// // import { useParams, useRouter } from 'next/navigation';
// // import { useOrder } from '@/context/OrderContext';
// // import { useProductsContext } from '@/context/AllProductContext';
// // import { Product } from '@/types/global';
// // import LocationSelector from '@/components/LocationSelector';
// // import { Button } from '@/components/ui/button';
// // import AddCardList from '@/components/AddCards';

// // interface Review {
// //   id: number;
// //   userName: string;
// //   rating: number;
// //   comment: string;
// //   date: string;
// //   verified: boolean;
// //   helpful: number;
// // }

// // interface CartItem extends Product {
// //   quantity: number;
// // }

// // const ImageGallery: React.FC<{ images: string[]; productName: string }> = ({ images, productName }) => {
// //   const [currentImage, setCurrentImage] = useState<number>(0);

// //   const nextImage = (): void => {
// //     setCurrentImage((prev) => (prev + 1) % images.length);
// //   };

// //   const prevImage = (): void => {
// //     setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {/* Main Image */}
// //       <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
// //         <img
// //           src={images[currentImage]}
// //           alt={productName}
// //           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
// //         />
// //         {images.length > 1 && (
// //           <>
// //             <button
// //               onClick={prevImage}
// //               className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
// //             >
// //               <ChevronLeft size={20} />
// //             </button>
// //             <button
// //               onClick={nextImage}
// //               className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
// //             >
// //               <ChevronRight size={20} />
// //             </button>
// //           </>
// //         )}
// //         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
// //           {images.map((_, index) => (
// //             <div
// //               key={index}
// //               className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImage ? 'bg-white' : 'bg-white/50'
// //                 }`}
// //             />
// //           ))}
// //         </div>
// //       </div>

// //       {/* Thumbnail Images */}
// //       {images.length > 1 && (
// //         <div className="flex space-x-2 overflow-x-auto pb-2">
// //           {images.map((image, index) => (
// //             <button
// //               key={index}
// //               onClick={() => setCurrentImage(index)}
// //               className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImage
// //                 ? 'border-orange-500 shadow-lg'
// //                 : 'border-gray-200 hover:border-gray-300'
// //                 }`}
// //             >
// //               <img
// //                 src={image}
// //                 alt={`${productName} ${index + 1}`}
// //                 className="w-full h-full object-cover"
// //               />
// //             </button>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // // Reviews Component
// // const ReviewsSection: React.FC<{ reviews: Review[]; rating: number; totalReviews: number }> = ({
// //   reviews,
// //   rating,
// //   totalReviews
// // }) => {
// //   const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
// //   const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

// //   const RatingStars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => (
// //     <div className="flex items-center">
// //       {[...Array(5)].map((_, i) => (
// //         <Star
// //           key={i}
// //           size={size}
// //           className={`${i < Math.floor(rating)
// //             ? 'text-yellow-400 fill-current'
// //             : 'text-gray-300'
// //             }`}
// //         />
// //       ))}
// //     </div>
// //   );

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
// //         <div className="flex items-center space-x-2">
// //           <RatingStars rating={rating} size={20} />
// //           <span className="font-semibold text-lg">{rating}</span>
// //           <span className="text-gray-500">({totalReviews} reviews)</span>
// //         </div>
// //       </div>

// //       <div className="space-y-4">
// //         {displayedReviews.map((review) => (
// //           <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
// //             <div className="flex items-start justify-between mb-2">
// //               <div className="flex items-center space-x-2">
// //                 <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
// //                   {review.userName.charAt(0).toUpperCase()}
// //                 </div>
// //                 <div>
// //                   <p className="font-medium text-gray-900">{review.userName}</p>
// //                   <div className="flex items-center space-x-2">
// //                     <RatingStars rating={review.rating} />
// //                     {review.verified && (
// //                       <span className="text-xs text-green-600 flex items-center">
// //                         <Check size={12} className="mr-1" />
// //                         Verified Purchase
// //                       </span>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //               <span className="text-sm text-gray-500">{review.date}</span>
// //             </div>
// //             <p className="text-gray-700 mb-2">{review.comment}</p>
// //             <button className="text-sm text-gray-500 hover:text-gray-700">
// //               Helpful ({review.helpful})
// //             </button>
// //           </div>
// //         ))}
// //       </div>

// //       {reviews.length > 3 && (
// //         <button
// //           onClick={() => setShowAllReviews(!showAllReviews)}
// //           className="text-orange-600 hover:text-orange-700 font-medium"
// //         >
// //           {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // // Main Product Details Component
// // const ProductDetailsPage: React.FC = () => {
// //   const { wishListsData, setWistListsData } = useWishListContext();
// //   const { productsData, setProductsData } = useProductsContext();
// //   const { product_id }: any = useParams();
// //     const [cartOpen, setCartOpen] = useState(false);
// //     const [addressOpen, setAddressOpen] = useState(false);
// //     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// //   const [cartItems, setCartItems] = useState<CartItem[]>([]);
// //   const { state, dispatch } = useOrder();
// //   const router = useRouter();

// //   const handleGo = () => {
// //     router.push('/productList');
// //   };

// //   const [quantity, setQuantity] = useState<number>(1);
// //   const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');

// //   // Find the product by ID
// //   const product = productsData.find((item: Product) => item.id == product_id);

// //   // If product is not found, show loading or error message
// //   if (!product) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
// //           <button
// //             onClick={handleGo}
// //             className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
// //           >
// //             Back to Products
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const isInWishlist = wishListsData.some((item: any) => item.id === product.id);

// //   const handleQuantityChange = (change: number | undefined, type: string): void => {
// //     if (type === 'add' && change != undefined) {
// //       setQuantity(prev => Math.max(1, Math.min(prev + change, product.stockCount || 1)));
// //       updateQuantity(product.id, change);
// //     } else {
// //       updateQuantity(product.id, 0);
// //     }
// //   };

// //   const toggleWishlist = (): void => {
// //     if (isInWishlist) {
// //       setWistListsData(prev => prev.filter(item => item.id !== product.id));
// //     } else {
// //       setWistListsData(prev => [...prev, product]);
// //     }
// //   };

// //   const addToCart = (item: any) => {
// //     const existingItem = cartItems.find((cartItem: CartItem) => cartItem.id === item.id);
// //     if (existingItem) {
// //       setCartItems(
// //         cartItems.map((cartItem: CartItem) =>
// //           cartItem.id === item.id
// //             ? { ...cartItem, quantity: cartItem.quantity + 1 }
// //             : cartItem
// //         )
// //       );
// //       // let cartLine = { ...item, quantity: existingItem.quantity + 1 }

// //       dispatch({ type: "QTY", id: item.id, qty: existingItem.quantity + 1 });
// //     } else {
// //       setCartItems([...cartItems, { ...item, quantity: 1 }]);
// //       let cartLine = { ...item, quantity: 1 }
// //       dispatch({ type: "ADD", item: cartLine });
// //     }
// //   };

// //   const removeFromCart = (itemId: any) => {
// //     setCartItems(cartItems.filter((item: any) => item.id !== itemId))
// //   }

// //   const updateQuantity = (itemId: any, newQuantity: any) => {
// //     if (newQuantity === 0) {
// //       removeFromCart(itemId)
// //       dispatch({ type: "REMOVE", id: itemId });

// //     } else {
// //       setCartItems(cartItems.map((item: any) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
// //       dispatch({ type: "QTY", id: itemId, qty: newQuantity });
// //     }
// //   }

// //   const getTotalPrice = () => {
// //     return cartItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0)
// //   }

// //   const handleCheckout = () => {
// //     router.push('/checkout');
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
// //       {/* Header */}
// //         <div className="sticky top-0 z-50">
// //               <header className="bg-white shadow-sm border-b">
// //                 <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
// //                   <div className="flex items-center justify-between">
// //                     <div className="flex items-center gap-2 flex-shrink-0">
// //                       <img
// //                         src="../logoGro.png"
// //                         className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md"
// //                         alt="logo"
// //                       />
// //                       <div className="hidden sm:block">
// //                         <h1 className="text-lg font-semibold text-gray-900">Grocery Store</h1>
// //                       </div>
// //                     </div>



// //                     {/* Enhanced Action Buttons */}
// //                     <div className="flex items-center space-x-2">
// //                       {/* Cart */}
// //                       <AddCardList
// //                         cartItems={cartItems}
// //                         removeFromCart={removeFromCart}
// //                         updateQuantity={updateQuantity}
// //                         getTotalPrice={getTotalPrice}
// //                         setCartItems={setCartItems}
// //                         cartOpen={cartOpen}
// //                         setCartOpen={setCartOpen}
// //                       />

// //                       {/* Mobile Menu */}
// //                       <Button
// //                         variant="ghost"
// //                         size="icon"
// //                         className="md:hidden"
// //                         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //                       >
// //                         {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-10 w-15" />}
// //                       </Button>

// //                       {/* Profile */}
// //                       <div className="hidden sm:flex items-center cursor-pointer" onClick={() => router.push('/profile')}>
// //                         <img
// //                           className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
// //                           src="https://picsum.photos/200"
// //                           alt="profile"
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>

// //                 </div>
// //               </header>


// //             </div>
// //       {/* <header className="bg-white shadow-sm border-b sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto px-4 py-4">
// //           <div className="flex items-center space-x-4">
// //             <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200" onClick={handleGo}>
// //               <ArrowLeft className="w-6 h-6 text-gray-600" />
// //             </button>
// //             <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
// //               🛒
// //             </h1>
// //           </div>
// //         </div>
// //       </header> */}

// //       {/* Main Content */}
// //       <div className="max-w-7xl mx-auto px-4 py-8">
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// //           {/* Left Column - Images */}
// //           <div className="space-y-6">
// //             <ImageGallery images={product.images} productName={product.name} />
// //           </div>

// //           {/* Right Column - Product Info */}
// //           <div className="space-y-6">
// //             {/* Product Header */}
// //             <div>
// //               <div className="flex items-center space-x-2 mb-2">
// //                 <span className="text-sm text-gray-500">{product.brand}</span>
// //                 <span className="text-sm text-gray-300">•</span>
// //                 <span className="text-sm text-gray-500">SKU: {product.sku}</span>
// //               </div>
// //               <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

// //               {/* Rating */}
// //               <div className="flex items-center space-x-3 mb-4">
// //                 <div className="flex items-center">
// //                   {[...Array(5)].map((_, i) => (
// //                     <Star
// //                       key={i}
// //                       className={`w-5 h-5 ${i < Math.floor(product.rating)
// //                         ? 'text-yellow-400 fill-current'
// //                         : 'text-gray-300'
// //                         }`}
// //                     />
// //                   ))}
// //                 </div>
// //                 <span className="font-semibold text-lg">{product.rating}</span>
// //                 <span className="text-gray-500">({product.totalReviews} reviews)</span>
// //               </div>

// //               {/* Price */}
// //               <div className="flex items-center space-x-4 mb-6">
// //                 <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
// //                 {product.originalPrice !== product.price && (
// //                   <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
// //                 )}
// //                 {product.discount > 0 && (
// //                   <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
// //                     {product.discount}% OFF
// //                   </span>
// //                 )}
// //               </div>

// //               {/* Stock Status */}
// //               <div className="flex items-center space-x-2 mb-6">
// //                 {product.inStock ? (
// //                   <>
// //                     <Check className="w-5 h-5 text-green-500" />
// //                     <span className="text-green-600 font-medium">In Stock ({product.stockCount} available)</span>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <X className="w-5 h-5 text-red-500" />
// //                     <span className="text-red-600 font-medium">Out of Stock</span>
// //                   </>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Quantity Selector */}
// //             <div className="flex items-center space-x-4">
// //               <span className="font-medium text-gray-700">Quantity:</span>
// //               <div className="flex items-center border-2 border-gray-200 rounded-lg">
// //                 <button
// //                   onClick={() => handleQuantityChange(-1, "-")}
// //                   disabled={quantity <= 1}
// //                   className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
// //                 >
// //                   <Minus size={16} />
// //                 </button>
// //                 <span className="px-4 py-3 font-semibold min-w-[60px] text-center">{quantity}</span>
// //                 <button
// //                   onClick={() => handleQuantityChange(1, "add")}
// //                   disabled={quantity >= product.stockCount}
// //                   className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
// //                 >
// //                   <Plus size={16} />
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex space-x-4">
// //               <button
// //                 onClick={addToCart}
// //                 disabled={!product.inStock}
// //                 className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg disabled:cursor-not-allowed disabled:transform-none"
// //               >
// //                 <ShoppingCart className="w-5 h-5 mr-2" />
// //                 Add to Cart
// //               </button>
// //               <button
// //                 onClick={toggleWishlist}
// //                 className={`p-4 border-2 rounded-xl transition-all duration-200 hover:scale-105 ${isInWishlist
// //                   ? 'border-red-500 bg-red-50 text-red-500'
// //                   : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500'
// //                   }`}
// //               >
// //                 <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
// //               </button>
// //               <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-105">
// //                 <Share2 className="w-6 h-6 text-gray-600" />
// //               </button>
// //             </div>

// //             {/* Features */}
// //             <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
// //               <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
// //               <div className="grid grid-cols-1 gap-3">
// //                 {product.features.map((feature, index) => (
// //                   <div key={index} className="flex items-center space-x-3">
// //                     <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
// //                     <span className="text-gray-700">{feature}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Delivery Info */}
// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //               <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
// //                 <Truck className="w-8 h-8 text-green-500 mx-auto mb-2" />
// //                 <p className="font-medium text-gray-900">Free Delivery</p>
// //                 <p className="text-sm text-gray-500">On orders above ₹500</p>
// //               </div>
// //               <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
// //                 <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
// //                 <p className="font-medium text-gray-900">Easy Returns</p>
// //                 <p className="text-sm text-gray-500">7-day return policy</p>
// //               </div>
// //               <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-center">
// //                 <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
// //                 <p className="font-medium text-gray-900">Quality Assured</p>
// //                 <p className="text-sm text-gray-500">100% authentic products</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Product Details Tabs */}
// //         <div className="mt-16 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
// //           {/* Tab Navigation */}
// //           <div className="border-b border-gray-200">
// //             <div className="flex">
// //               {[
// //                 { key: 'description', label: 'Description' },
// //                 { key: 'specifications', label: 'Specifications' },
// //                 { key: 'reviews', label: 'Reviews' }
// //               ].map((tab) => (
// //                 <button
// //                   key={tab.key}
// //                   onClick={() => setSelectedTab(tab.key as typeof selectedTab)}
// //                   className={`px-8 py-4 font-medium transition-all duration-200 ${selectedTab === tab.key
// //                     ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
// //                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
// //                     }`}
// //                 >
// //                   {tab.label}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Tab Content */}
// //           <div className="p-8">
// //             {selectedTab === 'description' && (
// //               <div className="prose max-w-none">
// //                 <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
// //               </div>
// //             )}

// //             {selectedTab === 'specifications' && (
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 {Object.entries(product.specifications).map(([key, value]) => (
// //                   <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
// //                     <span className="font-medium text-gray-900">{key}</span>
// //                     <span className="text-gray-700">{value}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {selectedTab === 'reviews' && (
// //               <ReviewsSection
// //                 reviews={product.reviews}
// //                 rating={product.rating}
// //                 totalReviews={product.totalReviews}
// //               />
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetailsPage;

// // Enhanced Product Details Component with Fixed Cart Logic
// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Heart,
//   ShoppingCart,
//   Star,
//   Plus,
//   Minus,
//   Share2,
//   Truck,
//   Shield,
//   RefreshCw,
//   ArrowLeft,
//   Check,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Menu,
//   Eye,
//   Download,
//   MessageCircle,
//   ThumbsUp,
//   Filter,
//   Search,
//   Bookmark,
//   Gift,
//   Zap,
//   Package,
//   Clock,
//   MapPin,
//   CreditCard,
//   ShieldCheck,
//   Loader2
// } from 'lucide-react';
// import { useWishListContext } from '@/context/WishListsContext';
// import { useCart } from '@/context/CartContext';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { useOrder } from '@/context/OrderContext';
// import { useProductsContext } from '@/context/AllProductContext';
// import { Product } from '@/types/global';
// import LocationSelector from '@/components/LocationSelector';
// import { Button } from '@/components/ui/button';
// import AddCardList from '@/components/AddCards';

// interface Review {
//   id: number;
//   userName: string;
//   rating: number;
//   comment: string;
//   date: string;
//   verified: boolean;
//   helpful: number;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// interface Notification {
//   id: string;
//   message: string;
//   type: 'success' | 'error' | 'info' | 'warning';
// }

// // Enhanced Image Gallery with better animations and features
// const ImageGallery: React.FC<{ images: string[]; productName: string }> = ({ images, productName }) => {
//   const [currentImage, setCurrentImage] = useState<number>(0);
//   const [isZoomed, setIsZoomed] = useState<boolean>(false);
//   const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
//   const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
//   const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

//   const nextImage = useCallback((): void => {
//     setCurrentImage((prev) => (prev + 1) % images.length);
//     setIsImageLoading(true);
//   }, [images.length]);

//   const prevImage = useCallback((): void => {
//     setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
//     setIsImageLoading(true);
//   }, [images.length]);

//   const toggleZoom = (): void => {
//     setIsZoomed(!isZoomed);
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
//     if (!isZoomed) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width) * 100;
//     const y = ((e.clientY - rect.top) / rect.height) * 100;
//     setZoomPosition({ x, y });
//   };

//   const openFullscreen = (): void => {
//     setIsFullscreen(true);
//   };

//   const closeFullscreen = (): void => {
//     setIsFullscreen(false);
//     setIsZoomed(false);
//   };

//   // Auto-advance images
//   useEffect(() => {
//     if (images.length > 1) {
//       const interval = setInterval(nextImage, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [images.length, nextImage]);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (isFullscreen) {
//         if (e.key === 'ArrowLeft') prevImage();
//         if (e.key === 'ArrowRight') nextImage();
//         if (e.key === 'Escape') closeFullscreen();
//       }
//     };

//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, [isFullscreen, nextImage, prevImage]);

//   return (
//     <>
//       <div className="space-y-4">
//         {/* Main Image with enhanced features */}
//         <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group shadow-lg">
//           {isImageLoading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//               <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
//             </div>
//           )}
          
//           <img
//             src={images[currentImage]}
//             alt={productName}
//             className={`w-full h-full object-cover transition-all duration-500 cursor-pointer ${
//               isZoomed 
//                 ? 'scale-200 cursor-zoom-out' 
//                 : 'group-hover:scale-105 cursor-zoom-in'
//             } ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
//             style={isZoomed ? {
//               transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
//             } : {}}
//             onClick={toggleZoom}
//             onMouseMove={handleMouseMove}
//             onLoad={() => setIsImageLoading(false)}
//           />

//           {/* Enhanced Image Controls */}
//           <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
//             <button
//               onClick={openFullscreen}
//               className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
//               title="View fullscreen"
//             >
//               <Eye size={16} />
//             </button>
//             <button 
//               className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
//               title="Download image"
//             >
//               <Download size={16} />
//             </button>
//             <button 
//               className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
//               title="Share image"
//             >
//               <Share2 size={16} />
//             </button>
//           </div>

//           {/* Navigation arrows with better styling */}
//           {images.length > 1 && (
//             <>
//               <button
//                 onClick={prevImage}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <button
//                 onClick={nextImage}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </>
//           )}

//           {/* Enhanced progress indicators */}
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//             {images.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setCurrentImage(index);
//                   setIsImageLoading(true);
//                 }}
//                 className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                   index === currentImage 
//                     ? 'bg-white shadow-lg scale-125' 
//                     : 'bg-white/50 hover:bg-white/75'
//                 }`}
//               />
//             ))}
//           </div>

//           {/* Image counter */}
//           <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
//             {currentImage + 1} / {images.length}
//           </div>
//         </div>

//         {/* Enhanced Thumbnail Grid */}
//         {images.length > 1 && (
//           <div className="grid grid-cols-4 gap-3">
//             {images.map((image, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setCurrentImage(index);
//                   setIsImageLoading(true);
//                 }}
//                 className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
//                   index === currentImage
//                     ? 'border-orange-500 shadow-lg ring-2 ring-orange-200'
//                     : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
//                 }`}
//               >
//                 <img
//                   src={image}
//                   alt={`${productName} ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Enhanced Fullscreen Modal */}
//       {isFullscreen && (
//         <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-in fade-in duration-300">
//           <button
//             onClick={closeFullscreen}
//             className="absolute top-4 right-4 text-white p-3 hover:bg-white/20 rounded-full transition-all duration-200 z-10"
//           >
//             <X size={24} />
//           </button>
          
//           <div className="relative max-w-6xl max-h-6xl w-full h-full flex items-center justify-center p-8">
//             <img
//               src={images[currentImage]}
//               alt={productName}
//               className="max-w-full max-h-full object-contain"
//             />
            
//             {images.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-8 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-all duration-200"
//                 >
//                   <ChevronLeft size={32} />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-8 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-all duration-200"
//                 >
//                   <ChevronRight size={32} />
//                 </button>
//               </>
//             )}

//             {/* Fullscreen image counter */}
//             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
//               {currentImage + 1} of {images.length}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // Enhanced Reviews Section with better filtering
// const ReviewsSection: React.FC<{ reviews: Review[]; rating: number; totalReviews: number }> = ({
//   reviews,
//   rating,
//   totalReviews
// }) => {
//   const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
//   const [filterRating, setFilterRating] = useState<number>(0);
//   const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
//   const [searchTerm, setSearchTerm] = useState<string>('');

//   const filteredAndSortedReviews = reviews
//     .filter(review => {
//       const matchesRating = filterRating === 0 || review.rating === filterRating;
//       const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         review.userName.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesRating && matchesSearch;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'helpful':
//           return b.helpful - a.helpful;
//         case 'rating':
//           return b.rating - a.rating;
//         case 'recent':
//         default:
//           return new Date(b.date).getTime() - new Date(a.date).getTime();
//       }
//     });

//   const displayedReviews = showAllReviews ? filteredAndSortedReviews : filteredAndSortedReviews.slice(0, 3);

//   const RatingStars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => (
//     <div className="flex items-center">
//       {[...Array(5)].map((_, i) => (
//         <Star
//           key={i}
//           size={size}
//           className={`transition-colors duration-200 ${
//             i < Math.floor(rating)
//               ? 'text-yellow-400 fill-current'
//               : 'text-gray-300'
//           }`}
//         />
//       ))}
//     </div>
//   );

//   const handleHelpful = (reviewId: number) => {
//     console.log(`Marked review ${reviewId} as helpful`);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
//         <div className="flex items-center space-x-2">
//           <RatingStars rating={rating} size={20} />
//           <span className="font-semibold text-lg">{rating}</span>
//           <span className="text-gray-500">({totalReviews} reviews)</span>
//         </div>
//       </div>

//       {/* Enhanced Review Filters */}
//       <div className="bg-gray-50 rounded-xl p-4 space-y-4">
//         <div className="flex flex-wrap gap-4 items-center">
//           <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
//             <Search size={16} className="text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search reviews..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border-none outline-none text-sm bg-transparent"
//             />
//           </div>

//           <select
//             value={filterRating}
//             onChange={(e) => setFilterRating(Number(e.target.value))}
//             className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
//           >
//             <option value={0}>All Ratings</option>
//             <option value={5}>5 Stars</option>
//             <option value={4}>4 Stars</option>
//             <option value={3}>3 Stars</option>
//             <option value={2}>2 Stars</option>
//             <option value={1}>1 Star</option>
//           </select>

//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful' | 'rating')}
//             className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
//           >
//             <option value="recent">Most Recent</option>
//             <option value="helpful">Most Helpful</option>
//             <option value="rating">Highest Rating</option>
//           </select>
//         </div>

//         {/* Rating Distribution */}
//         <div className="grid grid-cols-5 gap-2">
//           {[5, 4, 3, 2, 1].map((stars) => {
//             const count = reviews.filter(r => r.rating === stars).length;
//             const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
//             return (
//               <div key={stars} className="text-center">
//                 <div className="text-xs text-gray-600 mb-1">{stars}★</div>
//                 <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-yellow-400 transition-all duration-500" 
//                     style={{ width: `${percentage}%` }}
//                   />
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">{count}</div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="space-y-4">
//         {displayedReviews.map((review) => (
//           <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
//                   {review.userName.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">{review.userName}</p>
//                   <div className="flex items-center space-x-2">
//                     <RatingStars rating={review.rating} />
//                     {review.verified && (
//                       <span className="text-xs text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
//                         <Check size={12} className="mr-1" />
//                         Verified Purchase
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <span className="text-sm text-gray-500">{review.date}</span>
//             </div>
//             <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
//             <div className="flex items-center justify-between">
//               <button
//                 onClick={() => handleHelpful(review.id)}
//                 className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition-colors duration-200"
//               >
//                 <ThumbsUp size={14} />
//                 <span>Helpful ({review.helpful})</span>
//               </button>
//               <button className="text-sm text-orange-600 hover:text-orange-700 transition-colors duration-200">
//                 Reply
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredAndSortedReviews.length > 3 && (
//         <button
//           onClick={() => setShowAllReviews(!showAllReviews)}
//           className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-medium transition-all duration-200"
//         >
//           {showAllReviews ? 'Show Less' : `Show All ${filteredAndSortedReviews.length} Reviews`}
//         </button>
//       )}
//     </div>
//   );
// };

// // Enhanced Notification Component
// const NotificationToast: React.FC<{ notification: Notification; onClose: () => void }> = ({
//   notification,
//   onClose
// }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 4000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const bgColor = {
//     success: 'bg-green-500',
//     error: 'bg-red-500',
//     info: 'bg-blue-500',
//     warning: 'bg-yellow-500'
//   }[notification.type];

//   const icon = {
//     success: <Check size={20} />,
//     error: <X size={20} />,
//     info: <MessageCircle size={20} />,
//     warning: <Shield size={20} />
//   }[notification.type];

//   return (
//     <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-xl shadow-xl z-50 transform transition-all duration-500 animate-in slide-in-from-right`}>
//       <div className="flex items-center space-x-3">
//         {icon}
//         <span className="font-medium">{notification.message}</span>
//         <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors duration-200">
//           <X size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Product Details Component with Fixed Cart Logic
// const ProductDetailsPage: React.FC = () => {
//   const { wishListsData, setWistListsData } = useWishListContext();
//   const { productsData } = useProductsContext();
//   const { product_id }: any = useParams();
//   const [cartOpen, setCartOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const { state, dispatch } = useOrder();
//   const router = useRouter();

//   // Enhanced state management
//   const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
//   const [showGiftOptions, setShowGiftOptions] = useState<boolean>(false);
//   const [selectedSize, setSelectedSize] = useState<string>('');
//   const [selectedColor, setSelectedColor] = useState<string>('');
//   const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
//   const [quantity, setQuantity] = useState<number>(1); // Fixed: Initialize with 1 instead of dynamic value

//   const handleGo = () => {
//     router.push('/productList');
//   };

//   // Find the product by ID
//   const product = productsData.find((item: Product) => item.id == product_id);
  
//   // Fixed: Get quantity from state but don't initialize component state with it
//   const cartItem = state?.items?.find((item: any) => item.id == product_id);
//   const cartQuantity = cartItem?.quantity || 0;

//   // Update local quantity when cart quantity changes
//   useEffect(() => {
//     if (cartQuantity > 0) {
//       setQuantity(cartQuantity);
//     }
//   }, [cartQuantity]);

//   // Enhanced notification system
//   const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
//     const id = Date.now().toString();
//     setNotifications(prev => [...prev, { id, message, type }]);
//   }, []);

//   const removeNotification = useCallback((id: string) => {
//     setNotifications(prev => prev.filter(n => n.id !== id));
//   }, []);

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
//         <div className="text-center animate-in fade-in duration-500">
//           <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Package className="w-12 h-12 text-gray-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
//           <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
//           <button
//             onClick={handleGo}
//             className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
//           >
//             Back to Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isInWishlist = wishListsData.some((item: any) => item.id === product.id);

//   // Fixed quantity change handler
//   const handleQuantityChange = (change: number): void => {
//     const newQuantity = Math.max(1, quantity + change);
//     const maxQuantity = product.stockCount || 10;
    
//     if (newQuantity <= maxQuantity) {
//       setQuantity(newQuantity);
      
//       // Update cart if item is already in cart
//       if (cartQuantity > 0) {
//         dispatch({ type: "QTY", id: product.id, qty: newQuantity });
//         addNotification(`Updated quantity to ${newQuantity}`, 'success');
//       }
//     } else {
//       addNotification(`Maximum ${maxQuantity} items available`, 'warning');
//     }
//   };

//   const toggleWishlist = (): void => {
//     if (isInWishlist) {
//       setWistListsData(prev => prev.filter(item => item.id !== product.id));
//       addNotification('Removed from wishlist', 'info');
//     } else {
//       setWistListsData(prev => [...prev, product]);
//       addNotification('Added to wishlist', 'success');
//     }
//   };

//   // Fixed addToCart function
//   const addToCart = async () => {
//     if (isAddingToCart) return;
    
//     setIsAddingToCart(true);
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      
//       const existingItem = state.items.find((item: any) => item.id === product.id);

//       if (existingItem) {
//         // Item already in cart, update quantity
//         const newQuantity = existingItem.quantity + quantity;
//         dispatch({ type: "QTY", id: product.id, qty: newQuantity });
//         addNotification(`Updated cart quantity to ${newQuantity}`, 'success');
//       } else {
//         // New item, add to cart
//         const newCartItem = { 
//           ...product, 
//           quantity: quantity,
//           selectedSize,
//           selectedColor 
//         };
//         dispatch({ type: "ADD", item: newCartItem });
//         addNotification(`Added ${quantity} item(s) to cart`, 'success');
//       }
      
//       // Reset quantity to 1 after adding
//       setQuantity(1);
      
//     } catch (error) {
//       addNotification('Failed to add item to cart', 'error');
//       console.error('Error adding to cart:', error);
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   const removeFromCart = (itemId: any) => {
//     dispatch({ type: "REMOVE", id: itemId });
//     addNotification('Removed from cart', 'info');
//     setQuantity(1); // Reset quantity when removed
//   };

//   const updateQuantity = (itemId: any, newQuantity: any) => {
//     if (newQuantity === 0) {
//       removeFromCart(itemId);
//     } else {
//       dispatch({ type: "QTY", id: itemId, qty: newQuantity });
//     }
//   };

//   const toggleBookmark = () => {
//     setIsBookmarked(!isBookmarked);
//     addNotification(
//       isBookmarked ? 'Removed bookmark' : 'Product bookmarked',
//       isBookmarked ? 'info' : 'success'
//     );
//   };

//   const buyNow = async () => {
//     await addToCart();
//     router.push('/checkout');
//   };

//   const shareProduct = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: product.name,
//           text: product.description,
//           url: window.location.href,
//         });
//       } catch (error) {
//         console.log('Error sharing:', error);
//       }
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       addNotification('Link copied to clipboard', 'success');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
//       {/* Enhanced Notifications */}
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         {notifications.map((notification) => (
//           <NotificationToast
//             key={notification.id}
//             notification={notification}
//             onClose={() => removeNotification(notification.id)}
//           />
//         ))}
//       </div>

//       {/* Enhanced Header */}
//       <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80">
//         <header className="shadow-sm border-b border-white/20">
//           <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3 flex-shrink-0">
//                 <button 
//                   onClick={handleGo} 
//                   className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200 hover:scale-105"
//                 >
//                   <ArrowLeft className="w-6 h-6 text-gray-600" />
//                 </button>
//                 <img
//                   src="../logoGro.png"
//                   className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl shadow-lg"
//                   alt="logo"
//                 />
//                 <div className="hidden sm:block">
//                   <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
//                     Grocery Store
//                   </h1>
//                 </div>
//               </div>

//               {/* Enhanced Action Buttons */}
//               <div className="flex items-center space-x-2">
//                 <LocationSelector />
                
//                 <button
//                   onClick={toggleBookmark}
//                   className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
//                     isBookmarked 
//                       ? 'bg-yellow-100 text-yellow-600 shadow-lg' 
//                       : 'hover:bg-white/50 text-gray-600'
//                   }`}
//                 >
//                   <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
//                 </button>

//                 <AddCardList
//                   cartItems={state.items}
//                   removeFromCart={removeFromCart}
//                   updateQuantity={updateQuantity}
//                   getTotalPrice={() => state.items.reduce((total: number, item: any) => total + item.price * item.quantity, 0)}
//                   setCartItems={() => {}}
//                   cartOpen={cartOpen}
//                   setCartOpen={setCartOpen}
//                 />

//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="md:hidden hover:bg-white/50 rounded-xl"
//                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 >
//                   {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//                 </Button>

//                 <div className="hidden sm:flex items-center cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => router.push('/profile')}>
//                   <img
//                     className="w-10 h-10 rounded-full shadow-lg border-2 border-white"
//                     src="https://picsum.photos/200"
//                     alt="profile"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>
//       </div>

//       {/* Main Content with Enhanced Layout */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Left Column - Enhanced Images */}
//           <div className="space-y-6">
//             <ImageGallery images={product.images} productName={product.name} />
            
//             {/* Product Tags */}
//             <div className="flex flex-wrap gap-2">
//               {product.discount > 0 && (
//                 <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
//                   {product.discount}% OFF
//                 </span>
//               )}
//               {product.features?.slice(0, 3).map((feature, index) => (
//                 <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                   {feature}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Right Column - Enhanced Product Info */}
//           <div className="space-y-6">
//             {/* Product Header with Enhanced Styling */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//               <div className="flex items-center space-x-2 mb-3">
//                 <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{product.brand}</span>
//                 <span className="text-sm text-gray-300">•</span>
//                 <span className="text-sm text-gray-500">SKU: {product.sku}</span>
//                 <div className="ml-auto flex items-center space-x-1">
//                   <Clock className="w-4 h-4 text-green-500" />
//                   <span className="text-sm text-green-600 font-medium">Quick Delivery</span>
//                 </div>
//               </div>
              
//               <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

//               {/* Enhanced Rating */}
//               <div className="flex items-center space-x-4 mb-6 p-3 bg-gray-50 rounded-xl">
//                 <div className="flex items-center space-x-2">
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`w-5 h-5 transition-all duration-200 ${
//                           i < Math.floor(product.rating)
//                             ? 'text-yellow-400 fill-current'
//                             : 'text-gray-300'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <span className="font-bold text-lg">{product.rating}</span>
//                 </div>
//                 <div className="h-4 w-px bg-gray-300"></div>
//                 <span className="text-gray-600">({product.totalReviews} reviews)</span>
//                 <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200">
//                   Read Reviews
//                 </button>
//               </div>

//               {/* Enhanced Price Section */}
//               <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6">
//                 <div className="flex items-center space-x-4 mb-2">
//                   <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
//                   {product.originalPrice !== product.price && (
//                     <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
//                   )}
//                   {product.discount > 0 && (
//                     <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
//                       Save ₹{product.originalPrice - product.price}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <CreditCard className="w-4 h-4" />
//                   <span>EMI starting from ₹{Math.round(product.price / 12)}/month</span>
//                 </div>
//               </div>

//               {/* Enhanced Stock Status */}
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-6">
//                 <div className="flex items-center space-x-2">
//                   {product.inStock ? (
//                     <>
//                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-600 font-medium">In Stock</span>
//                       <span className="text-gray-500">({product.stockCount} available)</span>
//                     </>
//                   ) : (
//                     <>
//                       <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                       <span className="text-red-600 font-medium">Out of Stock</span>
//                     </>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-1 text-sm text-gray-500">
//                   <MapPin className="w-4 h-4" />
//                   <span>Delivery to {state.address?.area || 'your location'}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Product Variants */}
//             {product.sizes && (
//               <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//                 <h3 className="font-semibold text-gray-900 mb-4">Choose Size:</h3>
//                 <div className="grid grid-cols-4 gap-3">
//                   {product.sizes.map((size: string) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`p-3 border-2 rounded-xl transition-all duration-200 hover:scale-105 ${
//                         selectedSize === size
//                           ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-lg'
//                           : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Enhanced Quantity Selector */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <span className="font-semibold text-gray-900">Quantity:</span>
//                 <span className="text-sm text-gray-500">Max {product.stockCount} per order</span>
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
//                   <button
//                     onClick={() => handleQuantityChange(-1)}
//                     disabled={quantity <= 1}
//                     className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
//                   >
//                     <Minus size={18} />
//                   </button>
//                   <div className="px-6 py-3 font-bold text-lg min-w-[80px] text-center bg-gray-50">
//                     {quantity}
//                   </div>
//                   <button
//                     onClick={() => handleQuantityChange(1)}
//                     disabled={quantity >= product.stockCount}
//                     className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
//                   >
//                     <Plus size={18} />
//                   </button>
//                 </div>
                
//                 {cartQuantity > 0 && (
//                   <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
//                     {cartQuantity} in cart
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Enhanced Action Buttons */}
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   onClick={addToCart}
//                   disabled={!product.inStock || isAddingToCart}
//                   className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {isAddingToCart ? (
//                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   ) : (
//                     <ShoppingCart className="w-5 h-5 mr-2" />
//                   )}
//                   {isAddingToCart ? 'Adding...' : 'Add to Cart'}
//                 </button>

//                 <button
//                   onClick={buyNow}
//                   disabled={!product.inStock}
//                   className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   <Zap className="w-5 h-5 mr-2" />
//                   Buy Now
//                 </button>
//               </div>

//               {/* Secondary Actions */}
//               <div className="grid grid-cols-3 gap-3">
//                 <button
//                   onClick={toggleWishlist}
//                   className={`p-4 border-2 rounded-xl transition-all duration-200 hover:scale-105 ${
//                     isInWishlist
//                       ? 'border-red-500 bg-red-50 text-red-500'
//                       : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500'
//                   }`}
//                 >
//                   <Heart className={`w-6 h-6 mx-auto ${isInWishlist ? 'fill-current' : ''}`} />
//                 </button>
                
//                 <button
//                   onClick={shareProduct}
//                   className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 hover:scale-105"
//                 >
//                   <Share2 className="w-6 h-6 mx-auto" />
//                 </button>
                
//                 <button
//                   onClick={() => setShowGiftOptions(!showGiftOptions)}
//                   className="p-4 border-2 border-purple-500 text-purple-500 rounded-xl hover:bg-purple-50 transition-all duration-200 hover:scale-105"
//                 >
//                   <Gift className="w-6 h-6 mx-auto" />
//                 </button>
//               </div>

//               {/* Gift Options Panel */}
//               {showGiftOptions && (
//                 <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 animate-in slide-in-from-top duration-300">
//                   <h4 className="font-bold text-purple-800 mb-4 flex items-center">
//                     <Gift className="w-5 h-5 mr-2" />
//                     Gift Options
//                   </h4>
//                   <div className="space-y-4">
//                     <label className="flex items-center space-x-3 cursor-pointer hover:bg-purple-100 p-2 rounded-lg transition-colors duration-200">
//                       <input type="checkbox" className="rounded text-purple-500 focus:ring-purple-500" />
//                       <span className="text-sm font-medium">Gift wrap (+₹50)</span>
//                     </label>
//                     <label className="flex items-center space-x-3 cursor-pointer hover:bg-purple-100 p-2 rounded-lg transition-colors duration-200">
//                       <input type="checkbox" className="rounded text-purple-500 focus:ring-purple-500" />
//                       <span className="text-sm font-medium">Include gift message</span>
//                     </label>
//                     <textarea
//                       placeholder="Write your gift message here..."
//                       className="w-full p-3 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
//                       rows={3}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Enhanced Features */}
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//               <h3 className="font-bold text-gray-900 mb-4 flex items-center">
//                 <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
//                 Key Features
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {product.features.map((feature, index) => (
//                   <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-gray-700">{feature}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Enhanced Delivery Info */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {[
//                 { icon: Truck, title: "Free Delivery", subtitle: "On orders above ₹500", color: "green" },
//                 { icon: RefreshCw, title: "Easy Returns", subtitle: "7-day return policy", color: "blue" },
//                 { icon: Shield, title: "Quality Assured", subtitle: "100% authentic products", color: "purple" }
//               ].map((item, index) => (
//                 <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
//                   <item.icon className={`w-8 h-8 text-${item.color}-500 mx-auto mb-2`} />
//                   <p className="font-semibold text-gray-900">{item.title}</p>
//                   <p className="text-sm text-gray-500">{item.subtitle}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Product Details Tabs */}
//         <div className="mt-16 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
//           {/* Tab Navigation */}
//           <div className="border-b border-gray-200 bg-gray-50">
//             <div className="flex">
//               {[
//                 { key: 'description', label: 'Description', icon: MessageCircle },
//                 { key: 'specifications', label: 'Specifications', icon: Eye },
//                 { key: 'reviews', label: 'Reviews', icon: Star }
//               ].map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setSelectedTab(tab.key as typeof selectedTab)}
//                   className={`flex-1 px-8 py-4 font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
//                     selectedTab === tab.key
//                       ? 'text-orange-600 border-b-3 border-orange-600 bg-white shadow-sm'
//                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   <tab.icon size={18} />
//                   <span>{tab.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="p-8">
//             {selectedTab === 'description' && (
//               <div className="prose max-w-none">
//                 <p className="text-gray-700 leading-relaxed text-lg mb-8">{product.description}</p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
//                     <h4 className="font-bold text-blue-900 mb-4 flex items-center">
//                       <Package className="w-5 h-5 mr-2" />
//                       What's Included
//                     </h4>
//                     <ul className="space-y-3">
//                       {[
//                         `1x ${product.name}`,
//                         'User Manual & Quick Start Guide',
//                         'Warranty Card',
//                         'Customer Support Contact'
//                       ].map((item, index) => (
//                         <li key={index} className="flex items-center space-x-3">
//                           <Check size={16} className="text-blue-500 flex-shrink-0" />
//                           <span className="text-blue-800">{item}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
//                     <h4 className="font-bold text-green-900 mb-4 flex items-center">
//                       <Shield className="w-5 h-5 mr-2" />
//                       Care Instructions
//                     </h4>
//                     <ul className="space-y-2 text-green-800">
//                       <li>• Store in a cool, dry place</li>
//                       <li>• Keep away from direct sunlight</li>
//                       <li>• Clean with a soft, damp cloth</li>
//                       <li>• Do not use harsh chemicals</li>
//                       <li>• Handle with care to avoid damage</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {selectedTab === 'specifications' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {Object.entries(product.specifications).map(([key, value]) => (
//                   <div key={key} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-4 rounded-lg transition-colors duration-200">
//                     <span className="font-semibold text-gray-900">{key}</span>
//                     <span className="text-gray-700 font-medium">{value}</span>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {selectedTab === 'reviews' && (
//               <ReviewsSection
//                 reviews={product.reviews}
//                 rating={product.rating}
//                 totalReviews={product.totalReviews}
//               />
//             )}
//           </div>
//         </div>

//         {/* Enhanced Related Products Section */}
//         <div className="mt-16">
//           <div className="flex items-center justify-between mb-8">
//             <h3 className="text-3xl font-bold text-gray-900">You might also like</h3>
//             <button onClick={()=>router.push(`/productList?category=${product?.category}`)} className="text-orange-600 hover:text-orange-700 font-semibold flex items-center space-x-1 transition-colors duration-200">
//               <span>View All</span>
//               <ChevronRight size={16} />
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {productsData.slice(0, 4).map((relatedProduct: Product) => (
//               <div
//                 key={relatedProduct.id}
//                 className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 group"
//                 onClick={() => router.push(`/product/${relatedProduct.id}`)}
//               >
//                 <div className="aspect-square overflow-hidden relative">
//                   <img
//                     src={relatedProduct.images[0]}
//                     alt={relatedProduct.name}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   {relatedProduct.discount > 0 && (
//                     <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                       -{relatedProduct.discount}%
//                     </div>
//                   )}
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
//                 </div>
                
//                 <div className="p-5">
//                   <h4 className="font-bold text-gray-900 mb-2 truncate group-hover:text-orange-600 transition-colors duration-200">
//                     {relatedProduct.name}
//                   </h4>
                  
//                   <div className="flex items-center space-x-2 mb-3">
//                     <div className="flex items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           size={14}
//                           className={`${
//                             i < Math.floor(relatedProduct.rating)
//                               ? 'text-yellow-400 fill-current'
//                               : 'text-gray-300'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-500">({relatedProduct.totalReviews})</span>
//                   </div>
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <span className="font-bold text-gray-900 text-lg">₹{relatedProduct.price}</span>
//                       {relatedProduct.originalPrice !== relatedProduct.price && (
//                         <span className="text-sm text-gray-500 line-through">₹{relatedProduct.originalPrice}</span>
//                       )}
//                     </div>
//                     <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors duration-200 hover:scale-105">
//                       <Plus size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Enhanced FAQ Section */}
//         <div className="mt-16 bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
//           <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
//             <MessageCircle className="w-8 h-8 mr-3 text-orange-500" />
//             Frequently Asked Questions
//           </h3>
          
//           <div className="space-y-4">
//             {[
//               {
//                 question: "What is the return policy?",
//                 answer: "We offer a hassle-free 7-day return policy for all products. Items must be in original condition with packaging. Free return pickup available."
//               },
//               {
//                 question: "How long does delivery take?",
//                 answer: "Standard delivery takes 2-5 business days. Express delivery is available for next-day delivery in select cities. Same-day delivery available for orders above ₹1000."
//               },
//               {
//                 question: "Is this product covered by warranty?",
//                 answer: "Yes, this product comes with a comprehensive 1-year manufacturer warranty covering defects and malfunctions. Extended warranty options available at checkout."
//               },
//               {
//                 question: "Can I track my order?",
//                 answer: "Absolutely! You'll receive a tracking number via email and SMS once your order ships. Real-time tracking is available on our website and mobile app."
//               },
//               {
//                 question: "What payment methods do you accept?",
//                 answer: "We accept all major credit/debit cards, UPI, net banking, wallets, and cash on delivery. EMI options available for orders above ₹5000."
//               }
//             ].map((faq, index) => (
//               <details key={index} className="border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors duration-200 group">
//                 <summary className="p-5 cursor-pointer hover:bg-orange-50 font-semibold text-gray-900 flex items-center justify-between transition-colors duration-200">
//                   <span>{faq.question}</span>
//                   <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform duration-200" />
//                 </summary>
//                 <div className="px-5 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
//                   {faq.answer}
//                 </div>
//               </details>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPage;


"use client";
import React, { useState, useRef, useCallback } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye, 
  Share2, 
  Zap, 
  CheckCircle, 
  Plus,
  Minus,
  ShoppingBag,
  Bookmark,
  TrendingUp
} from 'lucide-react';
import { useWishListContext } from '@/context/WishListsContext';
import Link from 'next/link';
import { Product } from '../types/global';
import "./../components/cards.css"

interface ProductCardGridProps {
  productLists: Product[];
  onAddToCart?: (product: Product, quantity?: number) => void;
  onToggleWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onShare?: (product: Product) => void;
  isInCart: (product: Product) => boolean;
  getCartQuantity?: (product: Product) => number;
  updateQuantity?: (productId: string, change: number) => void;
  isLoading?: boolean;
  showQuickActions?: boolean;
  showQuantityControls?: boolean;
  animationDelay?: boolean;
}

/* ------------------ Enhanced Responsive Product Card Grid ------------------ */
const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  productLists, 
  onAddToCart, 
  updateQuantity,
  onToggleWishlist,
  onQuickView,
  onShare,
  isInCart,
  getCartQuantity,
  isLoading,
  showQuickActions = true,
  showQuantityControls = true,
  animationDelay = true
}) => {
    const { wishListsData } = useWishListContext();
    const [quantities, setQuantities] = useState<{[key: string]: number}>({});
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [justAdded, setJustAdded] = useState<string | null>(null);
    const imageRefs = useRef<{[key: string]: HTMLImageElement | null}>({});

    // Enhanced quantity update handler
    const handleQuantityUpdate = useCallback((productId: string, change: number) => {
        const currentQuantity = quantities[productId] || 1;
        const newQuantity = Math.max(1, currentQuantity + change);
        
        setQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
        
        // Also update the global state if updateQuantity function is provided
        if (updateQuantity) {
            updateQuantity(productId, change);
        }
    }, [quantities, updateQuantity]);

    // Enhanced add to cart with proper quantity management
    const handleAddToCart = async (product: Product) => {
        const quantity = quantities[product.id] || 1;
        setAddingToCart(product.id.toString());
        
        try {
            await onAddToCart?.(product, quantity);
            setJustAdded(product.id.toString());
            
            // Reset quantity after adding to cart
            setQuantities(prev => ({ ...prev, [product.id]: 1 }));
            
            // Clear success state
            setTimeout(() => setJustAdded(null), 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setAddingToCart(null);
        }
    };

    // Share functionality
    const handleShare = async (product: Product) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out this amazing product: ${product.name}`,
                    url: `/products/${product.id}`
                });
            } catch (error) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback: copy to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`);
            }
            onShare?.(product);
        }
    };

    // Calculate savings
    const calculateSavings = (product: Product) => {
        return product.originalPrice - product.price;
    };

    // Get current quantity for display (from cart if in cart, otherwise from local state)
    const getCurrentQuantity = useCallback((product: Product) => {
        if (isInCart(product)) {
            return getCartQuantity?.(product) || 1;
        }
        return quantities[product.id] || 1;
    }, [isInCart, getCartQuantity, quantities]);

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {[...Array(10)].map((_, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200"></div>
                        <div className="p-2 sm:p-3 md:p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (productLists?.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🔍</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-sm sm:text-base text-gray-500 text-center px-4">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {productLists?.map((product, index) => {
                const isWishlisted = wishListsData.some((item: any) => item.id === product.id);
                const inCart = isInCart(product);
                const cartQuantity = getCartQuantity?.(product) || 0;
                const currentQuantity = getCurrentQuantity(product);
                const savings = calculateSavings(product);
                const isHovered = hoveredCard === product.id.toString();
                const isAdding = addingToCart === product.id.toString();
                const wasJustAdded = justAdded === product.id.toString();

                return (
                    <div
                        key={product.id}
                        className={`bg-white relative border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 hover:scale-[1.02] ${
                            animationDelay ? 'animate-fade-in-up' : ''
                        }`}
                        style={{
                            animationDelay: animationDelay ? `${index * 100}ms` : '0ms'
                        }}
                        onMouseEnter={() => setHoveredCard(product.id.toString())}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        {/* Image Container with Enhanced Hover Effects */}
                        <Link href={`/products/${product.id}`} className="block relative overflow-hidden">
                            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 sm:p-3 rounded-t-xl relative overflow-hidden">
                                <img
                                    ref={(el: HTMLImageElement | null) => {
                                        if (el) imageRefs.current[product.id] = el;
                                    }}
                                    src={product.images[0]}
                                    alt={product.name}
                                    className={`w-full h-full object-cover rounded-lg transition-all duration-700 ${
                                        isHovered ? 'scale-110 rotate-1' : 'scale-100 rotate-0'
                                    }`}
                                    loading="lazy"
                                />
                                
                                {/* Shimmer effect on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 ${
                                    isHovered ? 'animate-shimmer opacity-20' : ''
                                }`}></div>
                            </div>

                            {/* Enhanced badges */}
                            <div className="absolute top-0 left-0 z-20">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-br-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                                    <span className="flex items-center">
                                        <Zap className="w-3 h-3 mr-1" />
                                        {product.discount}% OFF
                                    </span>
                                </div>
                            </div>

                            {/* Trending badge for highly rated products */}
                            {product.rating >= 4.5 && (
                                <div className="absolute top-0 right-0 z-20">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-bl-xl shadow-lg">
                                        <TrendingUp className="w-3 h-3" />
                                    </div>
                                </div>
                            )}
                        </Link>

                        {/* Quick Action Buttons */}
                        {showQuickActions && (
                            <div className={`absolute top-2 right-2 flex flex-col space-y-2 z-30 transform transition-all duration-300 ${
                                isHovered ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                            }`}>
                                {/* Wishlist Button */}
                                <button
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        onToggleWishlist?.(product);
                                    }}
                                    className={`p-2 bg-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                                        isWishlisted ? 'bg-red-50 border-red-200' : 'border-gray-200'
                                    }`}
                                    data-wishlist={product.id}
                                >
                                    <Heart
                                        className={`w-4 h-4 transition-all duration-300 ${
                                            isWishlisted ? 'text-red-500 fill-current scale-110' : 'text-gray-400 hover:text-red-500'
                                        }`}
                                    />
                                </button>

                                {/* Quick View Button */}
                                <button
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        onQuickView?.(product);
                                    }}
                                    className="p-2 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 transform hover:scale-110 hover:bg-blue-50"
                                >
                                    <Eye className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors duration-300" />
                                </button>

                                {/* Share Button */}
                                <button
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleShare(product);
                                    }}
                                    className="p-2 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 transform hover:scale-110 hover:bg-green-50"
                                >
                                    <Share2 className="w-4 h-4 text-gray-400 hover:text-green-500 transition-colors duration-300" />
                                </button>
                            </div>
                        )}

                        {/* Enhanced Content */}
                        <div className="p-3 sm:p-4 md:p-5">
                            <Link href={`/products/${product.id}`}>
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base leading-tight">
                                    {product.name}
                                </h3>
                            </Link>

                            {/* Enhanced Rating with animation */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${
                                                    i < Math.floor(product.rating)
                                                        ? 'text-yellow-400 fill-current scale-100'
                                                        : 'text-gray-300 scale-90'
                                                } ${isHovered && i < Math.floor(product.rating) ? 'animate-pulse' : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-xs text-gray-600 font-medium">
                                        {product.rating}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {product.reviews ? `${product.reviews.length} reviews` : 'No reviews'}
                                </span>
                            </div>

                            {/* Enhanced Price Display */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{product.originalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-green-600 font-medium mt-1">
                                    You save ₹{savings.toLocaleString()}
                                </div>
                            </div>

                            {/* Enhanced Quantity Controls */}
                            {showQuantityControls && !inCart && (
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleQuantityUpdate(product.id.toString(), -1);
                                            }}
                                            className="p-1 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={currentQuantity <= 1}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                            {currentQuantity}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleQuantityUpdate(product.id.toString(), 1);
                                            }}
                                            className="p-1 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Cart Quantity Display when in cart */}
                            {inCart && showQuantityControls && (
                                <div className="flex items-center justify-between mb-3 p-2 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-medium text-blue-700">In Cart:</span>
                                    <div className="flex items-center border border-blue-300 rounded-lg bg-white">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (updateQuantity) {
                                                    updateQuantity(product.id.toString(), -1);
                                                }
                                            }}
                                            className="p-1 hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={cartQuantity <= 1}
                                        >
                                            <Minus className="w-3 h-3 text-blue-600" />
                                        </button>
                                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center text-blue-700">
                                            {cartQuantity}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (updateQuantity) {
                                                    updateQuantity(product.id.toString(), 1);
                                                }
                                            }}
                                            className="p-1 hover:bg-blue-100 transition-colors duration-200"
                                        >
                                            <Plus className="w-3 h-3 text-blue-600" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Add to Cart Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product);
                                }}
                                disabled={isAdding}
                                className={`w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm relative overflow-hidden ${
                                    wasJustAdded
                                        ? 'bg-green-500 text-white'
                                        : inCart
                                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                                        : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 shadow-lg hover:shadow-xl'
                                } ${isAdding ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {isAdding ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Adding...
                                    </div>
                                ) : wasJustAdded ? (
                                    <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Added!
                                    </div>
                                ) : inCart ? (
                                    <div className="flex items-center">
                                        <ShoppingBag className="w-4 h-4 mr-2" />
                                        In Cart ({cartQuantity})
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Add to Cart</span>
                                        <span className="sm:hidden">Add</span>
                                        {currentQuantity > 1 && (
                                            <span className="ml-1">({currentQuantity})</span>
                                        )}
                                    </div>
                                )}
                                
                                {/* Ripple effect */}
                                <div className={`absolute inset-0 bg-white opacity-0 ${
                                    isHovered ? 'animate-ping opacity-20' : ''
                                }`}></div>
                            </button>

                            {/* Additional Info on Hover */}
                            <div className={`mt-2 text-xs text-gray-500 transition-all duration-300 ${
                                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                            }`}>
                                <div className="flex justify-between items-center">
                                    <span>Free delivery available</span>
                                    <span className="text-green-600">✓ In stock</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductCardGrid;
import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useWishListContext, WishListContext } from '@/context/WishListsContext';
import Link from 'next/link';

/* ------------------ Reusable Grid ------------------ */
interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviews: number;
    image: string;
}
interface ProductCardGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}


const ProductCardGrid: React.FC<ProductCardGridProps>  = ({
  products, 
  onAddToCart, 
  onToggleWishlist
}: {
    products?: Product[];
    onAddToCart?: (product: Product) => void;
    onToggleWishlist?: (product: Product) => void;
}) => {
    const { wishListsData } = useWishListContext();

    if (products?.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    console.log("data",wishListsData)
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => (
                <div
                    key={product.id}
                    className="bg-white relative border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
                >
                    {/* Image + Discount + Wishlist (Inside Link) */}
                    <Link href={`/products/${product.id}`} className="block relative">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center py-2 rounded-md">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-120 h-120 object-cover"
                            />
                        </div>

                        {/* Discount badge */}
                        <div className="absolute top-0 left-0">
                            <div className="bg-[#6e5503] text-white text-xs font-bold px-3 py-1 rounded-br-lg custom-corner">
                                {product.discount}% OFF
                            </div>
                        </div>
                    </Link>

                    <button
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onToggleWishlist?.(product);
                        }}
                        className="absolute top-2 right-2 p-2  bg-white z-50 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                        <Heart
                            className={`w-5 h-5 ${wishListsData.some((item: any) => item.id === product.id)
                                    ? 'text-red-500 fill-current'
                                    : 'text-gray-400'
                                } hover:text-red-500`}
                        />
                    </button>

                    {/* Content */}
                    <div className="p-4">
                        <Link href={`/products/${product.id}`}>
                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:underline">
                                {product.name}
                            </h3>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                                ({product.reviews})
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <span className="text-lg font-bold text-gray-900">
                                    ₹{product.price}
                                </span>
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                    ₹{product.originalPrice}
                                </span>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={() => onAddToCart?.(product)}
                            className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>

    );
};

export default ProductCardGrid;
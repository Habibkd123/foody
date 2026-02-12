"use client";

import React, { useState, createContext, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';

import NavbarFilter from "@/components/NavbarFilter";
import ProductCardGrid from "@/components/ProductGrid";
import SidebarFilters from "@/components/SidebarFilters";

import { Search, Heart, ShoppingCart, Menu, X, Filter, Star, ChevronUp, Bell, Settings, User, LogOut } from 'lucide-react';
// eslint-disable-next-line import/no-unresolved
import { useFilterStore } from "@/lib/store/useFilterStore";
import Link from "next/link";
import AddCardList from "@/components/AddCards";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { Product } from "@/types/global";
import { useUserStore } from '@/lib/store/useUserStore';
import { useWishlistQuery } from "@/hooks/useWishlistQuery";
import { useCartStore } from "@/lib/store/useCartStore";
import AnnouncementBar from "@/components/AnnouncementBar";
import LocationSelector from "@/components/LocationSelector";
import NotificationCenter from '@/components/NotificationCenter';
import NotificationBanner from '@/components/NotificationBanner';
import AppHeader from "@/components/ui/AppHeader";
import { useSearchParams } from "next/navigation";
import { getCategories } from '@/components/APICall/category';
import ProductOptionsModal from '@/components/ProductOptionsModal';

// Type Definitions
interface CartItem extends Product {
  quantity: number;
}

const ProductGrid: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, updateFilter } = useFilterStore();
  const { data: productsData = [], isLoading: isProductsLoading } = useProductsQuery();
  const { user, logout: storeLogout } = useUserStore();
  const { data: wishListsData = [], addToWishlist, removeFromWishlist } = useWishlistQuery(user?._id);

  const {
    addItem: storeAddItem,
    removeItem: storeRemoveItem,
    updateQuantity: storeUpdateQty,
    items: cartLines
  } = useCartStore();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [filterAnimation, setFilterAnimation] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [categoriesById, setCategoriesById] = useState<Record<string, string>>({});
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selectedProductForOptions, setSelectedProductForOptions] = useState<any>(null);


  // Helper: select a category by id and sync URL
  const handleSelectCategory = useCallback((catId: string) => {
    updateFilter('category', catId);
    updateFilter('searchTerm', '');
    try {
      // Keep same path, just swap query category
      const qs = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      if (catId === 'all') {
        qs.delete('category');
      } else {
        qs.set('category', catId);
      }
      const newUrl = `${typeof window !== 'undefined' ? window.location.pathname : '/productlist'}${qs.toString() ? `?${qs.toString()}` : ''}`;
      // next/navigation router.replace accepts relative href
      router.replace(newUrl as any);
    } catch { }
    // Small UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router, updateFilter]);

  // Helper: resolve a category value (id, slug, or name) to the canonical _id used in products
  const resolveCategoryId = useCallback((val: string | undefined | null): string | null => {
    if (!val) return null;
    // If already an id present in keys, return as-is
    const asIs = val as string;
    // Try exact id match
    const hasId = (productsData as any[]).some(p => (typeof p.category === 'string' ? p.category : p?.category?._id) === asIs);
    if (hasId) return asIs;
    // Try by slug or name
    const found = (productsData as any[]).find(p => {
      const cat = typeof p.category === 'string' ? null : p?.category;
      return cat && (cat.slug === asIs || cat.name?.toLowerCase() === asIs.toLowerCase());
    });
    if (found) return typeof found.category === 'string' ? found.category : found.category?._id || null;
    return null;
  }, [productsData]);

  // Category keys and human labels (use stable IDs, work with object or string category)
  const categoryKeys = useMemo(
    () => {
      const ids = productsData.map((p: any) => (typeof p.category === 'string' ? p.category : p?.category?._id)).filter(Boolean);
      return Array.from(new Set(ids));
    },
    [productsData]
  );
  const categoryLabelMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    // Prefer fetched categories map first
    for (const [id, name] of Object.entries(categoriesById)) {
      if (id && name && !map[id]) map[id] = name;
    }
    // Fill remaining from products data fallbacks
    for (const p of productsData as any[]) {
      const id = typeof p.category === 'string' ? p.category : p?.category?._id;
      const label = p?.categoryName || p?.categoryLabel || p?.category?.name || String(id || '');
      if (id && !map[id]) map[id] = label;
    }
    return map;
  }, [productsData, categoriesById]);

  const currentCategoryLabel = useMemo(
    () => (filters.category === 'all' ? 'All' : (categoryLabelMap[filters.category] ?? filters.category)),
    [filters.category, categoryLabelMap]
  );


  // Preselect category from query (?category=...) once (on initial 'all') - supports id, slug, or name
  useEffect(() => {
    const qpCategory = searchParams?.get('category');
    if (qpCategory && filters.category === 'all') {
      const id = resolveCategoryId(qpCategory);
      if (id) {
        updateFilter('category', id);
      }
    }
  }, [searchParams, updateFilter, filters.category, resolveCategoryId]);

  // Guard: if filters.category is not 'all' and not a known id, try to normalize it
  useEffect(() => {
    if (filters.category && filters.category !== 'all') {
      const id = resolveCategoryId(filters.category);
      if (id && id !== filters.category) {
        updateFilter('category', id);
      }
    }
  }, [filters.category, resolveCategoryId, updateFilter]);

  useEffect(() => {
    if (user?._id) {
      fetch(`/api/recommendations/user/${user?._id}`)
        .then(res => res.json())
        .then(json => setRecommendations(json?.data || []))
        .catch(() => setRecommendations([]));
    }
  }, [user?._id]);

  // Load categories for id->name mapping so UI shows names instead of raw ids
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const data = await getCategories({ limit: 1000 });
        const items = (data?.data?.categories || data?.data || data?.categories || []) as any[];
        const map: Record<string, string> = {};
        for (const c of items) {
          const id = c?._id || c?.id;
          const name = c?.name || c?.title || '';
          if (id && name) map[String(id)] = String(name);
        }
        if (!ignore) setCategoriesById(map);
      } catch {
        // Ignore failures; UI will fallback to id or embedded name
      }
    };
    load();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (filters.searchTerm && filters.searchTerm.length > 1) {
      const q = filters.searchTerm.toLowerCase();
      const suggestions = productsData
        .filter((product: any) => {
          const catName = typeof product.category === 'string' ? product.category : product?.category?.name || '';
          return product.name.toLowerCase().includes(q) || catName.toLowerCase().includes(q);
        })
        .slice(0, 5)
        .map((product: Product) => product.name);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [filters.searchTerm, productsData]);

  const filteredProducts: Product[] = productsData.filter((product: any) => {
    if (filters.searchTerm && !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    const prodCatId = typeof product.category === 'string' ? product.category : product?.category?._id;
    if (filters.category !== 'all' && prodCatId !== filters.category) {
      return false;
    }
    if (filters.priceRanges.length > 0) {
      const priceRangeMap: Record<string, { min: number; max: number }> = {
        'under-100': { min: 0, max: 100 },
        '100-300': { min: 100, max: 300 },
        '300-500': { min: 300, max: 500 },
        'above-500': { min: 500, max: Infinity },
        '500-1000': { min: 500, max: 1000 },
        'above-1000': { min: 1000, max: Infinity }
      };
      const matchesPrice = filters.priceRanges.some((rangeKey: string) => {
        const range = priceRangeMap[rangeKey];
        return product.price >= (range?.min ?? 0) && product.price <= (range?.max ?? Infinity);
      });
      if (!matchesPrice) return false;
    }
    if (filters.ratings.length > 0) {
      const matchesRating = filters.ratings.some((rating: number) => product.rating >= rating);
      if (!matchesRating) return false;
    }
    return true;
  });

  const toggleWishlist = async (item: any) => {
    const isWishlistedAlready = wishListsData.some((fav: any) => fav._id === item._id);
    try {
      if (isWishlistedAlready) {
        await removeFromWishlist({ userId: user?._id || '', productId: item._id });
      } else {
        await addToWishlist({ userId: user?._id || '', productId: item._id });
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  const handleAddToCart = useCallback(async (item: Product) => {

    if (!user?._id) {
      alert('please Login First ')
      return;
    }
    const hasOptions = Array.isArray((item as any).variants) && (item as any).variants.length > 0
      || Array.isArray((item as any).addonGroups) && (item as any).addonGroups.length > 0;

    if (hasOptions) {
      setSelectedProductForOptions(item as any);
      setOptionsOpen(true);
      return;
    }

    const cartItem: any = {
      id: `${item._id}:base`,
      productId: item._id,
      configKey: 'base',
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.images[0],
    };
    storeAddItem(cartItem);
    alert('Product added to cart successfully');
  }, [storeAddItem, user?._id]);

  const removeFromCart1 = useCallback((itemId: any) => {
    storeRemoveItem(itemId);
    alert('Product removed from cart successfully');
  }, [storeRemoveItem]);

  const updateQuantity1 = useCallback((itemId: string, change: number) => {
    const currentItem = cartLines.find((item: any) => String(item.id) === String(itemId));
    if (currentItem) {
      const newQuantity = Math.max(0, currentItem.quantity + change);
      storeUpdateQty(itemId, newQuantity);
    }
  }, [cartLines, storeUpdateQty]);

  const isInCart = useCallback((product: Product) => {
    return cartLines.some((item: any) => (item.productId || String(item.id).split(':')[0]) === product._id);
  }, [cartLines]);

  const getCartQuantity = useCallback((product: Product) => {
    return cartLines
      .filter((item: any) => (item.productId || String(item.id).split(':')[0]) === product._id)
      .reduce((sum: number, it: any) => sum + Number(it.quantity || 0), 0);
  }, [cartLines]);

  const getTotalPrice = () => {
    return cartItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setFilterAnimation(true);
    updateFilter('category', 'all');
    updateFilter('priceRanges', []);
    updateFilter('ratings', []);
    updateFilter('searchTerm', '');
    setTimeout(() => setFilterAnimation(false), 300);
  };

  const handleLogout = () => {
    try {
      storeLogout();
    } catch (error) {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <ProductOptionsModal
        open={optionsOpen}
        product={selectedProductForOptions}
        onClose={() => {
          setOptionsOpen(false);
          setSelectedProductForOptions(null);
        }}
        onConfirm={async ({ quantity, configKey, variant, addons }) => {
          const item = selectedProductForOptions;
          if (!item?._id) return;
          const cartItem: any = {
            id: `${item._id}:${configKey}`,
            productId: item._id,
            configKey,
            variant,
            addons,
            name: item.name,
            price: item.price,
            quantity,
            image: item.images?.[0],
          };
          storeAddItem(cartItem);
          setOptionsOpen(false);
          setSelectedProductForOptions(null);
        }}
      />

      {/* Enhanced Header with animations */}
      <div className='sticky top-0 z-40'>
        <AnnouncementBar />
      </div>

      <AppHeader
        logoSrc="/logoGro.png"
        title="Gro-Delivery"
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        showSearch
        onSearch={(q) => updateFilter('searchTerm', q)}
        searchPlaceholder="Search products..."
        initialSearch={filters.searchTerm}
        actions={[
          ...(user?._id ? [
            { key: 'location', icon: <div className="hidden md:block"><LocationSelector /></div> },
            { key: 'notify', icon: <NotificationCenter location="products" /> }] : []),
          { key: 'wishlist', href: '/wishlist', icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />, badgeCount: wishListsData ? wishListsData.length : 0 },
          {
            key: 'cart', icon: (
              <div className={`transition-transform duration-300 ${cartAnimation ? 'scale-110' : 'scale-100'}`}>
                <AddCardList
                  cartItems={cartItems}
                  removeFromCart={removeFromCart1}
                  updateQuantity={(itemId: any, newQuantity: any) => {
                    if (newQuantity === 0) {
                      removeFromCart1(itemId);
                    } else {
                      const change = newQuantity - getCartQuantity({ id: itemId } as Product);
                      updateQuantity1(itemId?.toString(), change);
                    }
                  }}
                  getTotalPrice={getTotalPrice}
                  setCartItems={setCartItems}
                  cartOpen={cartOpen}
                  setCartOpen={setCartOpen}
                />
              </div>
            )
          },
          ...(user?._id ? [{
            key: 'profile',
            icon: (
              <img
                src={(user as any)?.avatar || (user as any)?.image || 'https://picsum.photos/seed/profile/100'}
                alt="profile"
                className="w-8 h-8 rounded-full border border-border"
              />
            ),
            onClick: () => setProfileMenuOpen(!profileMenuOpen)
          }] : [])
        ]}
      />

      {/* Profile Dropdown */}
      {profileMenuOpen && (
        <div className="fixed right-4 top-16 z-50 bg-card border border-border shadow-soft-lg rounded-lg w-56">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-3">
              <img
                src={(user as any)?.avatar || (user as any)?.image || 'https://picsum.photos/seed/profile/100'}
                className="w-10 h-10 rounded-full border"
                alt="profile"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{(((user as any)?.firstName || '') + ' ' + ((user as any)?.lastName || '')).trim() || (user as any)?.name || 'Your Account'}</p>
                <p className="text-xs text-muted-foreground truncate">{(user as any)?.email || ''}</p>
              </div>
            </div>
          </div>
          <div className="py-1">
            <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-secondary">Profile</Link>
            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm hover:bg-secondary">Logout</button>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden animate-in fade-in duration-300">
          <div className="fixed right-0 top-0 h-full w-80 bg-card shadow-soft overflow-y-auto animate-in slide-in-from-right duration-400">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="hover:bg-secondary transition-colors duration-300">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center space-x-3 mb-6 p-3 bg-secondary rounded-lg shadow-soft hover:shadow-soft-lg transition-shadow duration-300" onClick={() => router.push('/profile')}>
                <img className="w-10 h-10 rounded-full border-2 border-border" src="https://picsum.photos/200" alt="profile" />
                <div>
                  <p className="font-medium">{(user as any)?.fullName || 'Your Account'}</p>
                  <p className="text-sm text-gray-600">Manage your profile</p>
                </div>
              </div>
              <div className="mt-6">
                <SidebarFilters />
              </div>
              {/* Mobile Categories */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {categoryKeys.map((cat: string) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleSelectCategory(cat);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-3 py-1 rounded-full border text-xs ${filters.category === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-foreground border-border'} whitespace-nowrap`}
                    >
                      {categoryLabelMap[cat]}
                    </button>
                  ))}
                  {filters.category !== 'all' && (
                    <button
                      onClick={() => {
                        handleSelectCategory('all');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-3 py-1 rounded-full border text-xs bg-secondary text-foreground border-border whitespace-nowrap`}
                    >
                      All
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 hidden lg:block">
        <NotificationBanner location="products" />
      </div>

      {/* Top Category Pills (desktop only) */}
      <div className="hidden lg:block max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-2">
        <div className="flex gap-1 overflow-x-auto no-scrollbar py-0">
          {categoryKeys.map((cat: string) => (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className={`px-2 py-1 rounded-full border text-xs sm:text-sm ${filters.category === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-foreground border-border'} whitespace-nowrap hover:shadow-soft transition`}
            >
              {categoryLabelMap[cat]}
            </button>
          ))}
          {filters.category !== 'all' && (
            <button
              onClick={() => handleSelectCategory('all')}
              className={`px-2 py-1 rounded-full border text-xs sm:text-sm bg-secondary text-foreground border-border whitespace-nowrap hover:shadow-soft transition`}
            >
              All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-1 sm:px-2 lg:px-2  ">
        <div className="flex gap-2 lg:gap-2">
          <div className="hidden lg:block">
            <SidebarFilters productsData={productsData} />
          </div>

          <div className="flex-1">
            <div className="mb-4 lg:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">

                {filteredProducts.length === 0 && (
                  <p className="text-gray-500 animate-pulse">No products found. Try adjusting your filters.</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                {(filters.category !== 'all' || filters.priceRanges.length > 0 || filters.ratings.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="hover:bg-secondary hover:border-primary transition-all duration-300"
                  >
                    Clear All
                  </Button>
                )}

                {filters.category !== 'all' && (
                  <span className="bg-secondary text-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm animate-in slide-in-from-left duration-300">
                    Category: {currentCategoryLabel}
                  </span>
                )}
                {filters.priceRanges.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm animate-in slide-in-from-left duration-300 delay-100">
                    Price filters applied
                  </span>
                )}
                {filters.ratings.length > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm animate-in slide-in-from-left duration-300 delay-200">
                    Rating filters applied
                  </span>
                )}
              </div>
            </div>

            <div className="lg:hidden mb-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto hover:bg-secondary hover:border-primary transition-all duration-300 hover:shadow-md"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters & Categories
              </Button>
            </div>

            <div className={`transition-all duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {user?._id && recommendations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">Recommended for you</h3>
                  <ProductCardGrid
                    isLoading={false}
                    isInCart={isInCart}
                    getCartQuantity={getCartQuantity}
                    productLists={recommendations}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={toggleWishlist}
                  />
                </div>
              )}
              <ProductCardGrid
                isLoading={isProductsLoading}
                isInCart={isInCart}
                getCartQuantity={getCartQuantity}
                productLists={filteredProducts}
                onAddToCart={handleAddToCart}
                onToggleWishlist={toggleWishlist}
              />

              {/* More Categories Preview */}
              {filters.category !== 'all' && (
                <div className="mt-8 space-y-8">
                  {categoryKeys
                    .filter((cat: string) => cat !== filters.category)
                    .map((cat: string) => {
                      const sample = (productsData as any[])
                        .filter((p: any) => (typeof p.category === 'string' ? p.category : p?.category?._id) === cat)
                        .slice(0, 6);
                      if (sample.length === 0) return null;
                      return (
                        <div key={cat}>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg sm:text-xl font-semibold">{categoryLabelMap[cat]}</h3>
                            <button
                              onClick={() => handleSelectCategory(cat)}
                              className="text-primary text-sm hover:underline"
                            >
                              View All
                            </button>
                          </div>
                          <ProductCardGrid
                            isLoading={false}
                            isInCart={isInCart}
                            getCartQuantity={getCartQuantity}
                            productLists={sample}
                            onAddToCart={handleAddToCart}
                            onToggleWishlist={toggleWishlist}
                          />
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-110 z-40 animate-in slide-in-from-bottom duration-300"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Quick Actions Floating Menu */}
      <div className="fixed bottom-20 right-6 space-y-3 z-30">
        {cartItems.length > 0 && (
          <button
            onClick={() => setCartOpen(true)}
            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Background click handler for dropdowns */}
      {profileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setProfileMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductGrid;

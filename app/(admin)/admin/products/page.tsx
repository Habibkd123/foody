
"use client";
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, Search, Filter, ShoppingBag, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ProductManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    page: 1,
    limit: 10
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value.toString());
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data?.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/auth/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filters */}
      <Card className="border-none shadow-soft">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
              <div className="relative flex-1 max-w-full sm:max-w-md min-w-[280px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={filters.category}
                  onValueChange={(val) => setFilters(prev => ({ ...prev, category: val, page: 1 }))}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status}
                  onValueChange={(val) => setFilters(prev => ({ ...prev, status: val, page: 1 }))}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={() => router.push('/admin/products/add')}
              className="w-full xl:w-auto bg-primary hover:bg-primary/90 text-white shadow-soft font-semibold"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="border-none shadow-soft overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {products.map((product) => {
            const categoryName = typeof product.category === 'object' ? product.category.name : 'Uncategorized';
            const isActive = product.status === 'active';

            return (
              <Card key={product._id} className="group border-none shadow-soft overflow-hidden transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 flex flex-col">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant={isActive ? "default" : "destructive"} className={`shadow-md border-none px-2 ${isActive ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-rose-500 hover:bg-rose-500'}`}>
                      {product.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">{categoryName}</span>
                    <h3 className="text-sm font-bold text-foreground mt-0.5 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 h-[2.5em]">{product.description}</p>

                  <div className="mt-auto flex items-end justify-between pt-3 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-medium uppercase">Price</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-muted-foreground font-medium uppercase">Stock</span>
                      <Badge variant="outline" className={`text-[10px] font-bold px-1.5 py-0 border-none ${product.stock < 5 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {product.stock} units
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50" asChild>
                      <Link href={`/admin/products/view/${product._id}`}><EyeIcon className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:bg-amber-50" asChild>
                      <Link href={`/admin/products/${product._id}`}><PencilIcon className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => handleDelete(product._id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-none shadow-soft py-20 bg-background/50 border-2 border-dashed flex flex-col items-center justify-center text-center px-4">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>No products found</CardTitle>
          <CardDescription className="max-w-xs mt-2">
            We couldn't find any products matching your criteria. Try adjusting your filters or add a new one.
          </CardDescription>
          <Button onClick={() => router.push('/admin/products/add')} className="mt-6 bg-primary text-white shadow-soft">
            Add Your First Product
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-6 mt-8">
          <p className="text-xs text-muted-foreground font-medium">
            Showing <span className="text-foreground">{((filters.page - 1) * filters.limit) + 1}</span> to <span className="text-foreground">{Math.min(filters.page * filters.limit, pagination.totalItems)}</span> of <span className="text-foreground">{pagination.totalItems}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === pagination.totalPages}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
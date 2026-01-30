
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, ListTree, Package, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CategoriesToolbar from '@/components/admin/CategoriesToolbar';
import CategoriesTable from '@/components/admin/CategoriesTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Types
interface Category {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  image?: string;
  createdAt: string;
  products_count: number;
  subcategories?: Category[];
}

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [showForm, setShowForm] = useState(false);

  // Fetch categories
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === categories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map(c => c._id)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadCategories();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleBulkDelete = () => {
    // Implement bulk delete logic if API allows
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-soft transition-all hover:shadow-soft-lg group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <LayoutGrid className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Main + subcategories</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft transition-all hover:shadow-soft-lg group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Visible to customers</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft transition-all hover:shadow-soft-lg group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <div className="p-2 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
              <AlertCircle className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.filter(c => c.status !== 'active').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Inactive categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4">
        <CategoriesToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedCount={selectedIds.size}
          onBulkDelete={handleBulkDelete}
          onForceDelete={() => { }}
          onAddClick={() => router.push('/admin/categories/add')}
        />

        <CategoriesTable
          categories={filteredCategories}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelection={handleToggleSelection}
          viewMode={viewMode}
          onEdit={(cat) => console.log('Edit', cat)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;
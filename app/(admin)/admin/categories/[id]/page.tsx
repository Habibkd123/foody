
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Package,
    Calendar,
    Info,
    ExternalLink,
    ChevronRight,
    LayoutGrid,
    BarChart3,
    Search,
    MoreVertical,
    Eye,
    ShoppingBag,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const CategoryDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Category Details
                const catRes = await fetch(`/api/categories/${id}`);
                const catData = await catRes.json();
                if (catData.success) {
                    setCategory(catData.data);
                }

                // Fetch Products for this Category
                const prodRes = await fetch(`/api/auth/products?category=${id}`);
                const prodData = await prodRes.json();
                if (prodData.success) {
                    setProducts(prodData.data.products);
                }
            } catch (error) {
                console.error("Error fetching category details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-[400px] lg:col-span-1 rounded-xl" />
                    <Skeleton className="h-[600px] lg:col-span-2 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-muted p-4 rounded-full mb-4">
                    <Info className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Category not found</h2>
                <p className="text-muted-foreground mt-2">The category you are looking for does not exist or has been removed.</p>
                <Button onClick={() => router.push('/admin/categories')} className="mt-6">
                    Back to Categories
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10 shadow-sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Link href="/admin/categories" className="hover:text-primary transition-colors">Categories</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span>Details</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="shadow-sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="shadow-soft">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Category Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-soft overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                            <img
                                src={category.image || '/placeholder.png'}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                            <Badge
                                className={`absolute top-4 right-4 shadow-lg border-none ${category.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'}`}
                            >
                                {category.status}
                            </Badge>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <CardTitle className="text-lg mb-2">Description</CardTitle>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {category.description || 'No description provided for this category.'}
                                </p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Created on
                                    </span>
                                    <span className="font-semibold">{new Date(category.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Package className="h-4 w-4" /> Internal ID
                                    </span>
                                    <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{category._id}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-1 gap-4">
                        <Card className="border-none shadow-soft bg-primary/5">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-primary/70">Total Products</p>
                                    <p className="text-2xl font-black text-primary mt-1">{products.length}</p>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-xl">
                                    <ShoppingBag className="h-6 w-6 text-primary" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column - Products List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-soft h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Products in this category</CardTitle>
                                <CardDescription>Directory of all items assigned to {category.name}</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/products/add?category=${id}`}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Product
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="px-6 pb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Filter products..."
                                        className="pl-9 bg-muted/30 border-none shadow-none focus-visible:ring-1"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="pl-6">Product</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <TableRow key={product._id} className="group hover:bg-muted/30 transition-colors">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border border-border">
                                                            <AvatarImage src={product.images?.[0]} className="object-cover" />
                                                            <AvatarFallback className="bg-primary/10 text-primary uppercase font-bold text-xs">{product.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold">{product.name}</span>
                                                            <span className="text-[10px] text-muted-foreground font-mono">{product.sku || 'No SKU'}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-sm">₹{product.price}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`border-none ${product.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                        {product.stock} units
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className={`h-2 w-2 rounded-full ${product.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} title={product.status} />
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" asChild>
                                                            <Link href={`/admin/products/view/${product._id}`}><Eye className="h-4 w-4" /></Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                No products found in this category.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CategoryDetailPage;

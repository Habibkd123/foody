
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useOrdersQuery } from "@/hooks/useOrdersQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Package, Clock, Calendar, CheckCircle2, Truck, XCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return <CheckCircle2 className="h-3 w-3" />;
    case 'processing': return <Clock className="h-3 w-3" />;
    case 'out_for_delivery': return <Truck className="h-3 w-3" />;
    case 'cancelled': return <XCircle className="h-3 w-3" />;
    default: return <AlertCircle className="h-3 w-3" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'out_for_delivery': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUserStore();
  const { data: orders = [], isLoading: loading, error: queryError } = useOrdersQuery(user?._id);
  const [query, setQuery] = useState("");

  const error = queryError instanceof Error ? queryError.message : null;

  const activeId = useMemo(() => {
    const parts = pathname?.split("/") || [];
    return parts.length >= 3 ? parts[2] : "";
  }, [pathname]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o: any) => {
      const hid = (o?.orderId || o?._id || "").toString().toLowerCase();
      const status = String(o?.status || "").toLowerCase();
      const items = (o?.items || []).some((item: any) =>
        item?.product?.name?.toLowerCase().includes(q)
      );
      return hid.includes(q) || status.includes(q) || items;
    });
  }, [orders, query]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Order History</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold">{user?.name || "Customer"}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <Card className="border-none shadow-soft overflow-hidden h-full flex flex-col max-h-[calc(100vh-120px)]">
            <CardHeader className="p-4 flex-none border-b border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Order ID, status, or item..."
                  className="pl-9 bg-background border-none shadow-none ring-offset-background focus-visible:ring-1"
                />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-3 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))
                ) : error ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-destructive/50 mb-2" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <Package className="mx-auto h-12 w-12 opacity-20 mb-3" />
                    <p className="text-sm">No orders found</p>
                  </div>
                ) : (
                  filtered.map((o: any) => {
                    const id = o?._id;
                    const hid = o?.orderId || (id ? String(id).slice(-6) : "");
                    const status = String(o?.status || "").toLowerCase();
                    const total = Number(o?.total || 0).toFixed(2);
                    const href = `/orders/${id}`;
                    const active = activeId && id && String(activeId) === String(id);

                    return (
                      <Link
                        key={id}
                        href={href}
                        className={`
                                        group flex flex-col p-3 rounded-lg transition-all duration-200
                                        ${active
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 scale-[1.02]'
                            : 'hover:bg-muted text-foreground'
                          }
                                    `}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold tracking-tight">#{hid}</span>
                          <Badge
                            variant="secondary"
                            className={`
                                                text-[10px] h-5 gap-1 border-none font-bold uppercase
                                                ${active ? 'bg-white/20 text-white' : getStatusColor(status)}
                                            `}
                          >
                            {!active && getStatusIcon(status)}
                            {status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-medium ${active ? 'text-white/90' : 'text-muted-foreground'}`}>
                            ₹{total}
                          </span>
                          <div className={`flex items-center gap-1 ${active ? 'text-white/70' : 'text-muted-foreground'}`}>
                            <Calendar className="h-3 w-3" />
                            {new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 min-w-0 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}

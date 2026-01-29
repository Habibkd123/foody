"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useOrdersQuery } from "@/hooks/useOrdersQuery";

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
      return hid.includes(q) || status.includes(q);
    });
  }, [orders, query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="font-semibold">Orders</div>
          <div className="text-sm text-gray-500">{user?.email || user?.name || ""}</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <aside className="md:col-span-1">
          <div className="rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-800">
            <div className="p-3 border-b dark:border-gray-800">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Order ID or status"
                className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-800"
              />
            </div>
            <div className="max-h-[70vh] overflow-auto divide-y">
              {loading ? (
                <div className="p-3 text-sm text-gray-500">Loading orders...</div>
              ) : error ? (
                <div className="p-3 text-sm text-red-600">{error}</div>
              ) : filtered.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">No orders</div>
              ) : (
                filtered.map((o: any) => {
                  const id = o?._id;
                  const hid = o?.orderId || (id ? String(id).slice(-6) : "");
                  const status = String(o?.status || "").toLowerCase();
                  const total = Number(o?.total || 0).toFixed(2);
                  const href = `/orders/${id}`;
                  const active = activeId && id && String(activeId) === String(id);
                  return (
                    <Link key={id} href={href} className={`block p-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${active ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">#{hid}</div>
                        <div className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{status.replace(/_/g, ' ')}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">₹{total}</div>
                      <div className="text-[11px] text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        <main className="md:col-span-2 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Download, Calendar, TrendingUp, ShoppingBag, IndianRupee, Users, Printer } from "lucide-react";
import Link from "next/link";

type TrendPoint = { _id: string; revenue: number; orders: number };

type TopProduct = { productId: string; name: string; qty: number; revenue: number };

type TopBuyer = { userId: string; name: string; email?: string; orders: number; revenue: number };

type Analytics = {
  totals: { revenue: number; orders: number; items: number; aov: number };
  trend: (TrendPoint & { buyersCount?: number })[];
  topProducts: TopProduct[];
  topBuyers: TopBuyer[];
};

const ranges = [
  { key: "7d", label: "Last 7 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "custom", label: "Custom" },
] as const;

type RangeKey = typeof ranges[number]["key"];

export default function AdminSalesPage() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [method, setMethod] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<Analytics | null>(null);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set("range", range);
    if (range === "custom" && customStart) p.set("start", customStart);
    if (range === "custom" && customEnd) p.set("end", customEnd);
    if (status) p.set("status", status);
    if (method) p.set("method", method);
    return p.toString();
  }, [range, customStart, customEnd, status, method]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/admin/analytics?${query}`, { cache: "no-store" });
        const json = await res.json();
        if (!ignore) {
          if (json?.success) setData(json.data as Analytics);
          else setError(json?.message || "Failed to load analytics");
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Failed to load analytics");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [query]);

  const maxRevenue = useMemo(() => (data?.trend || []).reduce((m, p) => Math.max(m, p.revenue), 0), [data?.trend]);
  const maxOrders = useMemo(() => (data?.trend || []).reduce((m, p) => Math.max(m, p.orders), 0), [data?.trend]);
  const aovTrend = useMemo(() => (data?.trend || []).map(t => ({ _id: t._id, aov: t.orders ? t.revenue / t.orders : 0 })), [data?.trend]);
  const maxAOV = useMemo(() => aovTrend.reduce((m, p) => Math.max(m, p.aov), 0), [aovTrend]);
  const cumRevenue = useMemo(() => {
    let sum = 0; return (data?.trend || []).map(t => { sum += t.revenue; return { _id: t._id, value: sum }; });
  }, [data?.trend]);
  const maxCum = useMemo(() => cumRevenue.reduce((m, p) => Math.max(m, p.value), 0), [cumRevenue]);
  const conversionTrend = useMemo(() => (data?.trend || []).map(t => ({ _id: t._id, conv: (t.buyersCount && t.buyersCount > 0) ? (t.orders / t.buyersCount) : 0 })), [data?.trend]);
  const maxConv = useMemo(() => conversionTrend.reduce((m, p) => Math.max(m, p.conv), 0), [conversionTrend]);

  const exportCSV = () => {
    if (!data) return;
    const lines: string[] = [];
    lines.push("Section,Metric,Value");
    lines.push(`Totals,Revenue,${data.totals.revenue}`);
    lines.push(`Totals,Orders,${data.totals.orders}`);
    lines.push(`Totals,Items,${data.totals.items}`);
    lines.push(`Totals,AOV,${data.totals.aov.toFixed(2)}`);
    lines.push("");
    lines.push("Trend,Date,Revenue,Orders");
    data.trend.forEach((t) => lines.push(`Trend,${t._id},${t.revenue},${t.orders}`));
    lines.push("");
    lines.push("TopProducts,Name,Qty,Revenue");
    data.topProducts.forEach((p) => lines.push(`TopProducts,${p.name},${p.qty},${p.revenue}`));
    lines.push("");
    lines.push("TopBuyers,Name,Email,Orders,Revenue");
    data.topBuyers.forEach((b) => lines.push(`TopBuyers,${b.name || "User"},${b.email || ""},${b.orders},${b.revenue}`));

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Sales Analytics</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white border rounded-xl px-2 py-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              className="bg-transparent py-1 px-1 text-sm outline-none"
              value={range}
              onChange={(e) => setRange(e.target.value as RangeKey)}
            >
              {ranges.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
            {range === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" className="border rounded px-2 py-1 text-sm" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
                <input type="date" className="border rounded px-2 py-1 text-sm" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 bg-white border rounded-xl px-2 py-1">
            <span className="text-xs text-gray-500">Status</span>
            <select className="bg-transparent py-1 px-1 text-sm outline-none" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="PAID">Paid</option>
              <option value="DELIVERED">Delivered</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white border rounded-xl px-2 py-1">
            <span className="text-xs text-gray-500">Method</span>
            <select className="bg-transparent py-1 px-1 text-sm outline-none" value={method} onChange={(e)=>setMethod(e.target.value)}>
              <option value="all">All</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="razorpay">Razorpay</option>
            </select>
          </div>
          <button onClick={exportCSV} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm hover:opacity-90">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={printReport} className="inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><IndianRupee className="w-4 h-4" /> Revenue</div>
          <div className="text-xl font-bold">₹{(data?.totals.revenue || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><ShoppingBag className="w-4 h-4" /> Orders</div>
          <div className="text-xl font-bold">{(data?.totals.orders || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Users className="w-4 h-4" /> Items</div>
          <div className="text-xl font-bold">{(data?.totals.items || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> AOV</div>
          <div className="text-xl font-bold">₹{(data?.totals.aov || 0).toFixed(2)}</div>
        </div>
      </div>

      {/* Charts (pure CSS/SVG bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Revenue Trend</div>
          <div className="h-48 flex items-end gap-2">
            {(data?.trend || []).map((p) => {
              const h = maxRevenue > 0 ? Math.round((p.revenue / maxRevenue) * 100) : 0;
              return (
                <div key={`rev-${p._id}`} className="flex-1">
                  <div className="w-full bg-orange-500 rounded-t" style={{ height: `${h}%` }} />
                  <div className="text-[10px] text-center truncate mt-1">{p._id.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Orders Trend</div>
          <div className="h-48 flex items-end gap-2">
            {(data?.trend || []).map((p) => {
              const h = maxOrders > 0 ? Math.round((p.orders / maxOrders) * 100) : 0;
              return (
                <div key={`ord-${p._id}`} className="flex-1">
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
                  <div className="text-[10px] text-center truncate mt-1">{p._id.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">AOV Trend</div>
          <div className="h-48 flex items-end gap-2">
            {aovTrend.map((p) => {
              const h = maxAOV > 0 ? Math.round((p.aov / maxAOV) * 100) : 0;
              return (
                <div key={`aov-${p._id}`} className="flex-1">
                  <div className="w-full bg-emerald-500 rounded-t" style={{ height: `${h}%` }} />
                  <div className="text-[10px] text-center truncate mt-1">{p._id.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Cumulative Revenue</div>
          <div className="h-48 flex items-end gap-2">
            {cumRevenue.map((p) => {
              const h = maxCum > 0 ? Math.round((p.value / maxCum) * 100) : 0;
              return (
                <div key={`cum-${p._id}`} className="flex-1">
                  <div className="w-full bg-purple-500 rounded-t" style={{ height: `${h}%` }} />
                  <div className="text-[10px] text-center truncate mt-1">{p._id.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Conversion (orders/buyers)</div>
          <div className="h-48 flex items-end gap-2">
            {conversionTrend.map((p) => {
              const h = maxConv > 0 ? Math.round((p.conv / maxConv) * 100) : 0;
              return (
                <div key={`conv-${p._id}`} className="flex-1">
                  <div className="w-full bg-rose-500 rounded-t" style={{ height: `${h}%` }} />
                  <div className="text-[10px] text-center truncate mt-1">{p._id.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Top Products</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Product</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topProducts || []).map((p) => (
                  <tr key={String(p.productId)} className="border-t">
                    <td className="py-2 font-medium">
                      <Link href={`/admin/products/view/${String(p.productId)}` } className="text-blue-600 hover:underline">{p.name}</Link>
                    </td>
                    <td className="py-2">{p.qty}</td>
                    <td className="py-2">₹{p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
                {(!data || data.topProducts.length === 0) && !loading && (
                  <tr><td className="py-3 text-gray-400" colSpan={3}>No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm font-semibold mb-3">Top Buyers</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Orders</th>
                  <th className="py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topBuyers || []).map((b) => (
                  <tr key={String(b.userId)} className="border-t">
                    <td className="py-2 font-medium">
                      <Link href={`/admin/users?user=${String(b.userId)}`} className="text-blue-600 hover:underline">{b.name}</Link>
                    </td>
                    <td className="py-2">{b.email || ""}</td>
                    <td className="py-2">{b.orders}</td>
                    <td className="py-2">₹{b.revenue.toLocaleString()}</td>
                  </tr>
                ))}
                {(!data || data.topBuyers.length === 0) && !loading && (
                  <tr><td className="py-3 text-gray-400" colSpan={4}>No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

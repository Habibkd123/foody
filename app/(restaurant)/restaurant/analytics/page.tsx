"use client";

import React, { useEffect, useMemo, useState } from "react";

type AnalyticsData = {
  range: string;
  totals: { orders: number; revenue: number; canceledOrders: number; cancelRate: number };
  bestSellers: Array<{ productId: string; name?: string; quantity: number; revenue: number }>;
  peakHours: Array<{ hour: number; orders: number; revenue: number }>;
};

export default function RestaurantAnalyticsPage() {
  const [range, setRange] = useState<'day' | 'week' | 'month'>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/restaurant/analytics?range=${range}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Failed to fetch analytics');
      setData(json.data);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch analytics');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [range]);

  const peakSorted = useMemo(() => {
    const arr = Array.isArray(data?.peakHours) ? data!.peakHours : [];
    return [...arr].sort((a, b) => b.orders - a.orders).slice(0, 6);
  }, [data]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Best sellers, sales totals, peak hours, cancellations</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as any)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
            <button
              type="button"
              onClick={load}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="text-sm text-gray-600 dark:text-gray-400">Orders</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{data?.totals?.orders ?? 0}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">₹{Number(data?.totals?.revenue ?? 0).toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="text-sm text-gray-600 dark:text-gray-400">Canceled</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{data?.totals?.canceledOrders ?? 0}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="text-sm text-gray-600 dark:text-gray-400">Cancel Rate</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{data?.totals?.cancelRate ?? 0}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Best Selling Food</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {(data?.bestSellers || []).map((it) => (
                    <tr key={it.productId}>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{it.name || 'Item'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{it.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">₹{Number(it.revenue || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                  {(data?.bestSellers || []).length === 0 && (
                    <tr>
                      <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={3}>No sales data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Peak Order Hours</h2>
            </div>
            <div className="p-6">
              {peakSorted.length === 0 ? (
                <div className="text-sm text-gray-500">No data</div>
              ) : (
                <div className="space-y-3">
                  {peakSorted.map((h) => (
                    <div key={h.hour} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-gray-700 dark:text-gray-200">{String(h.hour).padStart(2, '0')}:00</div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-600 h-2"
                          style={{ width: `${Math.min(100, (h.orders / peakSorted[0].orders) * 100)}%` }}
                        />
                      </div>
                      <div className="w-16 text-right text-sm text-gray-700 dark:text-gray-200">{h.orders}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

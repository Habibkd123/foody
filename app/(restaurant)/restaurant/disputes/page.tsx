"use client";

import React, { useEffect, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
import RestaurantDisputeModal from "@/components/RestaurantDisputeModal";

export default function RestaurantDisputesPage() {
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/disputes", { method: "GET" });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Failed to fetch disputes");
      }
      setDisputes(Array.isArray(json.data) ? json.data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const openModal = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Disputes</h1>
            <p className="text-gray-600 dark:text-gray-400">View and respond to customer disputes</p>
          </div>
          <button
            onClick={fetchDisputes}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white dark:bg-gray-800 text-sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing" : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="text-gray-600 dark:text-gray-300">Loading disputes...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : disputes.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">No disputes yet</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {disputes.map((d: any) => (
                  <tr key={d._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {d?.order?.orderId || (d?.order?._id ? String(d.order._id).slice(-6) : String(d._id).slice(-6))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                      {String(d.reason || "")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {String(d.status || "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openModal(String(d._id))}
                        className="text-green-600 hover:text-green-900 inline-flex items-center"
                        title="View / Respond"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <RestaurantDisputeModal
          open={open}
          onOpenChange={setOpen}
          disputeId={selectedId}
          onUpdated={fetchDisputes}
        />
      </div>
    </div>
  );
}

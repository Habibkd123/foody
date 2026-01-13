"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useCustomToast } from "@/hooks/useCustomToast";

type InventoryItem = {
  _id: string;
  name: string;
  unit: string;
  quantity: number;
  lowStockThreshold: number;
  isActive: boolean;
};

export default function RestaurantInventoryPage() {
  const toast = useCustomToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    unit: "unit",
    quantity: 0,
    lowStockThreshold: 5,
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = search.trim()
        ? `/api/restaurant/inventory?q=${encodeURIComponent(search.trim())}`
        : "/api/restaurant/inventory";
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!json?.success) {
        throw new Error(json?.error || "Failed to fetch inventory");
      }
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const lowStockIds = useMemo(() => {
    return new Set(items.filter((i) => i.quantity <= i.lowStockThreshold).map((i) => i._id));
  }, [items]);

  const createItem = async () => {
    try {
      const res = await fetch("/api/restaurant/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || "Failed to create item");
      toast.success("Added", `${newItem.name} added to inventory`);
      setNewItem({ name: "", unit: "unit", quantity: 0, lowStockThreshold: 5 });
      await fetchItems();
    } catch (e: any) {
      toast.error("Create failed", e?.message || "Failed to create inventory item");
    }
  };

  const updateItem = async (id: string, patch: Partial<InventoryItem>) => {
    try {
      const res = await fetch(`/api/restaurant/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || "Failed to update item");
      toast.info("Updated", "Inventory updated");
      await fetchItems();
    } catch (e: any) {
      toast.error("Update failed", e?.message || "Failed to update inventory item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track raw items and low stock</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 mb-5 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
              placeholder="Item name (e.g. Cheese)"
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
            <input
              value={newItem.unit}
              onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))}
              placeholder="Unit (kg, pcs)"
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem((p) => ({ ...p, quantity: Number(e.target.value) }))}
              placeholder="Qty"
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={newItem.lowStockThreshold}
                onChange={(e) => setNewItem((p) => ({ ...p, lowStockThreshold: Number(e.target.value) }))}
                placeholder="Low stock"
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
              <button
                type="button"
                onClick={createItem}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory..."
            className="w-full sm:max-w-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
          />
          <button
            type="button"
            onClick={fetchItems}
            className="w-full sm:w-auto sm:ml-3 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900"
          >
            Search
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Qty</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Low Stock</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((it) => {
                  const isLow = lowStockIds.has(it._id);
                  return (
                    <tr key={it._id} className={isLow ? "bg-yellow-50" : ""}>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">{it.name}</div>
                        <div className="text-xs text-gray-500">Unit: {it.unit}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                        <input
                          type="number"
                          defaultValue={it.quantity}
                          onBlur={(e) => updateItem(it._id, { quantity: Number(e.target.value) })}
                          className="w-24 sm:w-28 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1"
                        />
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <input
                          type="number"
                          defaultValue={it.lowStockThreshold}
                          onBlur={(e) => updateItem(it._id, { lowStockThreshold: Number(e.target.value) })}
                          className="w-24 sm:w-28 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1"
                        />
                        {isLow && (
                          <div className="text-xs text-yellow-700 mt-1">Low stock</div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => updateItem(it._id, { isActive: false })}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white whitespace-nowrap"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

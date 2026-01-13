"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RestaurantProfileData = {
  phone?: string;
  image?: string;
  restaurant?: {
    name?: string;
    ownerName?: string;
    address?: string;
    offlineMode?: { paused?: boolean; resumeAt?: any };
    location?: { lat?: number; lng?: number };
    deliveryRadiusKm?: number;
    openingTime?: string;
    closingTime?: string;
    isOpen?: boolean;
    autoAcceptOrders?: boolean;
    autoRejectWhenClosed?: boolean;
    timingAutomation?: {
      enabled?: boolean;
      mode?: 'auto' | 'force_open' | 'force_closed';
      holidays?: Array<{ date: string }>;
      specialDays?: Array<{ date: string; isOpen?: boolean; openingTime?: string; closingTime?: string }>;
    };
    cancellationPenalty?: {
      enabled?: boolean;
      appliesFromStatus?: 'processing' | 'shipped';
      type?: 'percent' | 'fixed';
      value?: number;
      maxAmount?: number;
    };
    dynamicPricing?: {
      enabled?: boolean;
      weekend?: { type?: 'percent' | 'fixed'; value?: number };
      peakHours?: Array<{ start: string; end: string; type: 'percent' | 'fixed'; value: number }>;
      festivalDays?: Array<{ date: string; type: 'percent' | 'fixed'; value: number }>;
    };
    status?: "pending" | "approved" | "rejected";
  };
};

export default function RestaurantProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RestaurantProfileData>({});
  const [geoLoading, setGeoLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/restaurant/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!json?.success) {
        throw new Error(json?.error || "Failed to fetch profile");
      }
      setData(json.data || {});
    } catch (e: any) {
      setError(e?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const formatDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const getHolidaysText = () => {
    const h = data.restaurant?.timingAutomation?.holidays || [];
    return h.map((x) => String(x?.date || "")).filter(Boolean).join("\n");
  };

  const setHolidaysText = (text: string) => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const holidays = lines.map((date) => ({ date }));
    setData((p) => ({
      ...p,
      restaurant: {
        ...(p.restaurant || {}),
        timingAutomation: {
          ...(p.restaurant?.timingAutomation || {}),
          holidays,
        },
      },
    }));
  };

  const getSpecialDaysText = () => {
    const s = data.restaurant?.timingAutomation?.specialDays || [];
    return s
      .map((x) => {
        const date = String(x?.date || "").trim();
        if (!date) return "";
        if (x?.isOpen === false) return `${date} closed`;
        const start = String(x?.openingTime || "").trim();
        const end = String(x?.closingTime || "").trim();
        if (start && end) return `${date} open ${start} ${end}`;
        return `${date} open`;
      })
      .filter(Boolean)
      .join("\n");
  };

  const setSpecialDaysText = (text: string) => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const specialDays = lines.map((l) => {
      const parts = l.split(/\s+/);
      const date = parts[0];
      const flag = (parts[1] || "").toLowerCase();
      if (flag === "closed") return { date, isOpen: false };
      if (flag === "open") {
        const openingTime = parts[2] || "";
        const closingTime = parts[3] || "";
        return { date, isOpen: true, openingTime, closingTime };
      }
      return { date };
    });
    setData((p) => ({
      ...p,
      restaurant: {
        ...(p.restaurant || {}),
        timingAutomation: {
          ...(p.restaurant?.timingAutomation || {}),
          specialDays,
        },
      },
    }));
  };

  const appendLine = (current: string, line: string) => {
    const next = current.trim();
    return next ? `${next}\n${line}` : line;
  };

  const useCurrentLocation = async () => {
    try {
      setGeoLoading(true);
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        alert("Geolocation is not supported in this browser.");
        return;
      }

      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
        });
      });

      const lat = Number(pos.coords.latitude.toFixed(6));
      const lng = Number(pos.coords.longitude.toFixed(6));

      setData((p) => ({
        ...p,
        restaurant: {
          ...(p.restaurant || {}),
          location: {
            ...(p.restaurant?.location || {}),
            lat,
            lng,
          },
        },
      }));
    } catch (e: any) {
      alert(e?.message || "Unable to fetch your location.");
    } finally {
      setGeoLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch("/api/restaurant/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          image: data.image,
          restaurant: {
            name: data.restaurant?.name,
            ownerName: data.restaurant?.ownerName,
            address: data.restaurant?.address,
            offlineMode: data.restaurant?.offlineMode,
            location: data.restaurant?.location,
            deliveryRadiusKm: data.restaurant?.deliveryRadiusKm,
            openingTime: data.restaurant?.openingTime,
            closingTime: data.restaurant?.closingTime,
            isOpen: data.restaurant?.isOpen,
            autoAcceptOrders: data.restaurant?.autoAcceptOrders,
            autoRejectWhenClosed: data.restaurant?.autoRejectWhenClosed,
            timingAutomation: data.restaurant?.timingAutomation,
            cancellationPenalty: data.restaurant?.cancellationPenalty,
            dynamicPricing: data.restaurant?.dynamicPricing,
          },
        }),
      });
      const json = await res.json();
      if (!json?.success) {
        throw new Error(json?.error || "Failed to update profile");
      }

      await load();
      alert("Profile updated successfully");
    } catch (e: any) {
      alert(e?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurant Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your restaurant details</p>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Enable Auto Accept</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Automatically move new orders to processing</div>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.restaurant?.autoAcceptOrders)}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    restaurant: { ...(p.restaurant || {}), autoAcceptOrders: e.target.checked },
                  }))
                }
                className="h-5 w-5"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Auto Reject When Closed</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cancel new orders if restaurant is closed</div>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.restaurant?.autoRejectWhenClosed)}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    restaurant: { ...(p.restaurant || {}), autoRejectWhenClosed: e.target.checked },
                  }))
                }
                className="h-5 w-5"
              />
            </div>
          </div>

          <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Restaurant Timing Automation</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Auto open/close by time + holidays + special-day overrides (Asia/Kolkata)</div>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.restaurant?.timingAutomation?.enabled)}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    restaurant: {
                      ...(p.restaurant || {}),
                      timingAutomation: {
                        ...(p.restaurant?.timingAutomation || {}),
                        enabled: e.target.checked,
                      },
                    },
                  }))
                }
                className="h-5 w-5"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mode</label>
                <select
                  value={(data.restaurant?.timingAutomation?.mode as any) || 'auto'}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      restaurant: {
                        ...(p.restaurant || {}),
                        timingAutomation: {
                          ...(p.restaurant?.timingAutomation || {}),
                          mode: e.target.value as any,
                        },
                      },
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                >
                  <option value="auto">Auto (use opening/closing time)</option>
                  <option value="force_open">Force Open</option>
                  <option value="force_closed">Force Closed</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Cancellation Penalty</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Apply penalty when order is canceled after cooking started</div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(data.restaurant?.cancellationPenalty?.enabled)}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      restaurant: {
                        ...(p.restaurant || {}),
                        cancellationPenalty: {
                          ...(p.restaurant?.cancellationPenalty || {}),
                          enabled: e.target.checked,
                        },
                      },
                    }))
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Applies From Status</label>
                  <select
                    value={(data.restaurant?.cancellationPenalty?.appliesFromStatus as any) || 'processing'}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        restaurant: {
                          ...(p.restaurant || {}),
                          cancellationPenalty: {
                            ...(p.restaurant?.cancellationPenalty || {}),
                            appliesFromStatus: e.target.value as any,
                          },
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  >
                    <option value="processing">Processing (cooking started)</option>
                    <option value="shipped">Shipped</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Type</label>
                  <select
                    value={(data.restaurant?.cancellationPenalty?.type as any) || 'percent'}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        restaurant: {
                          ...(p.restaurant || {}),
                          cancellationPenalty: {
                            ...(p.restaurant?.cancellationPenalty || {}),
                            type: e.target.value as any,
                          },
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Value</label>
                  <input
                    type="number"
                    value={Number(data.restaurant?.cancellationPenalty?.value ?? 0)}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        restaurant: {
                          ...(p.restaurant || {}),
                          cancellationPenalty: {
                            ...(p.restaurant?.cancellationPenalty || {}),
                            value: Number(e.target.value),
                          },
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Max Amount (₹)</label>
                  <input
                    type="number"
                    value={Number(data.restaurant?.cancellationPenalty?.maxAmount ?? 0)}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        restaurant: {
                          ...(p.restaurant || {}),
                          cancellationPenalty: {
                            ...(p.restaurant?.cancellationPenalty || {}),
                            maxAmount: Number(e.target.value),
                          },
                        },
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Holidays</label>
              <div className="text-xs text-gray-500 mb-2">One date per line: <code>YYYY-MM-DD</code></div>
              <div className="mb-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const today = formatDate(new Date());
                    setHolidaysText(appendLine(getHolidaysText(), today));
                  }}
                  className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                  Add Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    setHolidaysText(appendLine(getHolidaysText(), formatDate(d)));
                  }}
                  className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                  Add Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setHolidaysText("")}
                  className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={(() => {
                  const h = data.restaurant?.timingAutomation?.holidays || [];
                  return h.map((x) => String(x?.date || '')).filter(Boolean).join('\n');
                })()}
                onChange={(e) => setHolidaysText(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Special Day Overrides</label>
              <div className="text-xs text-gray-500 mb-2">
                Format per line:
                <code className="ml-1">YYYY-MM-DD closed</code>
                <span className="mx-1">or</span>
                <code>YYYY-MM-DD open HH:MM HH:MM</code>
              </div>
              <div className="mb-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const today = formatDate(new Date());
                    setSpecialDaysText(appendLine(getSpecialDaysText(), `${today} closed`));
                  }}
                  className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                  Add Today Closed
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const today = formatDate(new Date());
                    setSpecialDaysText(appendLine(getSpecialDaysText(), `${today} open 10:00 22:00`));
                  }}
                  className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                  Add Today Open (10-22)
                </button>
                <button
                  type="button"
                  onClick={() => setSpecialDaysText("")}
                  className="px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={(() => {
                  const s = data.restaurant?.timingAutomation?.specialDays || [];
                  return s.map((x) => {
                    const date = String(x?.date || '').trim();
                    if (!date) return '';
                    if (x?.isOpen === false) return `${date} closed`;
                    const start = String(x?.openingTime || '').trim();
                    const end = String(x?.closingTime || '').trim();
                    if (start && end) return `${date} open ${start} ${end}`;
                    return `${date} open`;
                  }).filter(Boolean).join('\n');
                })()}
                onChange={(e) => setSpecialDaysText(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Dynamic Pricing</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Festival &gt; Weekend &gt; Peak (Asia/Kolkata)</div>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.restaurant?.dynamicPricing?.enabled)}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    restaurant: {
                      ...(p.restaurant || {}),
                      dynamicPricing: {
                        ...(p.restaurant?.dynamicPricing || {}),
                        enabled: e.target.checked,
                      },
                    },
                  }))
                }
                className="h-5 w-5"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weekend Type</label>
                <select
                  value={(data.restaurant?.dynamicPricing?.weekend?.type as any) || 'percent'}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      restaurant: {
                        ...(p.restaurant || {}),
                        dynamicPricing: {
                          ...(p.restaurant?.dynamicPricing || {}),
                          weekend: {
                            ...(p.restaurant?.dynamicPricing?.weekend || {}),
                            type: e.target.value as any,
                          },
                        },
                      },
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weekend Value</label>
                <input
                  type="number"
                  value={Number(data.restaurant?.dynamicPricing?.weekend?.value ?? 0)}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      restaurant: {
                        ...(p.restaurant || {}),
                        dynamicPricing: {
                          ...(p.restaurant?.dynamicPricing || {}),
                          weekend: {
                            ...(p.restaurant?.dynamicPricing?.weekend || {}),
                            value: Number(e.target.value),
                          },
                        },
                      },
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <div className="font-medium text-gray-900 dark:text-white mb-2">Peak Hours Rule (single slot)</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Start (HH:MM)</label>
                  <input
                    value={data.restaurant?.dynamicPricing?.peakHours?.[0]?.start || '18:00'}
                    onChange={(e) => {
                      const next = [{
                        start: e.target.value,
                        end: data.restaurant?.dynamicPricing?.peakHours?.[0]?.end || '22:00',
                        type: (data.restaurant?.dynamicPricing?.peakHours?.[0]?.type as any) || 'percent',
                        value: Number(data.restaurant?.dynamicPricing?.peakHours?.[0]?.value ?? 0),
                      }];
                      setData((p) => ({
                        ...p,
                        restaurant: {
                          ...(p.restaurant || {}),
                          dynamicPricing: { ...(p.restaurant?.dynamicPricing || {}), peakHours: next },
                        },
                      }));
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">End (HH:MM)</label>
                  <input
                    value={data.restaurant?.dynamicPricing?.peakHours?.[0]?.end || '22:00'}
                    onChange={(e) => {
                      const next = [{
                        start: data.restaurant?.dynamicPricing?.peakHours?.[0]?.start || '18:00',
                        end: e.target.value,
                        type: (data.restaurant?.dynamicPricing?.peakHours?.[0]?.type as any) || 'percent',
                        value: Number(data.restaurant?.dynamicPricing?.peakHours?.[0]?.value ?? 0),
                      }];
                      setData((p) => ({
                        ...p,
                        restaurant: {
                          ...(p.restaurant || {}),
                          dynamicPricing: { ...(p.restaurant?.dynamicPricing || {}), peakHours: next },
                        },
                      }));
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Type</label>
                  <select
                    value={(data.restaurant?.dynamicPricing?.peakHours?.[0]?.type as any) || 'percent'}
                    onChange={(e) => {
                      const next = [{
                        start: data.restaurant?.dynamicPricing?.peakHours?.[0]?.start || '18:00',
                        end: data.restaurant?.dynamicPricing?.peakHours?.[0]?.end || '22:00',
                        type: e.target.value as any,
                        value: Number(data.restaurant?.dynamicPricing?.peakHours?.[0]?.value ?? 0),
                      }];
                      setData((p) => ({
                        ...p,
                        restaurant: {
                          ...(p.restaurant || {}),
                          dynamicPricing: { ...(p.restaurant?.dynamicPricing || {}), peakHours: next },
                        },
                      }));
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300">Value</label>
                  <input
                    type="number"
                    value={Number(data.restaurant?.dynamicPricing?.peakHours?.[0]?.value ?? 0)}
                    onChange={(e) => {
                      const next = [{
                        start: data.restaurant?.dynamicPricing?.peakHours?.[0]?.start || '18:00',
                        end: data.restaurant?.dynamicPricing?.peakHours?.[0]?.end || '22:00',
                        type: (data.restaurant?.dynamicPricing?.peakHours?.[0]?.type as any) || 'percent',
                        value: Number(e.target.value),
                      }];
                      setData((p) => ({
                        ...p,
                        restaurant: {
                          ...(p.restaurant || {}),
                          dynamicPricing: { ...(p.restaurant?.dynamicPricing || {}), peakHours: next },
                        },
                      }));
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Festival Days</label>
              <div className="text-xs text-gray-500 mb-2">Format: one per line like <code>YYYY-MM-DD percent 10</code> or <code>YYYY-MM-DD fixed 50</code></div>
              <textarea
                value={(() => {
                  const f = data.restaurant?.dynamicPricing?.festivalDays || [];
                  return f.map((x) => `${x.date} ${x.type || 'percent'} ${Number(x.value ?? 0)}`).join('\n');
                })()}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean);
                  const fest = lines.map((l) => {
                    const [date, type, value] = l.split(/\s+/);
                    return { date, type: (type as any) || 'percent', value: Number(value || 0) };
                  });
                  setData((p) => ({
                    ...p,
                    restaurant: {
                      ...(p.restaurant || {}),
                      dynamicPricing: { ...(p.restaurant?.dynamicPricing || {}), festivalDays: fest },
                    },
                  }));
                }}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>
          </div>
          <button
            onClick={() => router.push("/restaurant")}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Name</label>
              <input
                value={data.restaurant?.name || ""}
                onChange={(e) => setData((p) => ({ ...p, restaurant: { ...(p.restaurant || {}), name: e.target.value } }))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Owner Name</label>
              <input
                value={data.restaurant?.ownerName || ""}
                onChange={(e) => setData((p) => ({ ...p, restaurant: { ...(p.restaurant || {}), ownerName: e.target.value } }))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <textarea
              value={data.restaurant?.address || ""}
              onChange={(e) => setData((p) => ({ ...p, restaurant: { ...(p.restaurant || {}), address: e.target.value } }))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              rows={3}
            />
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Offline Mode (Pause Orders)</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Temporarily stop accepting new orders</div>
              </div>
              <input
                type="checkbox"
                checked={Boolean(data.restaurant?.offlineMode?.paused)}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    restaurant: {
                      ...(p.restaurant || {}),
                      offlineMode: {
                        ...(p.restaurant?.offlineMode || {}),
                        paused: e.target.checked,
                      },
                    },
                  }))
                }
                className="h-5 w-5"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Auto Resume At (optional)</label>
              <input
                type="datetime-local"
                value={(() => {
                  const v: any = (data.restaurant as any)?.offlineMode?.resumeAt;
                  if (!v) return '';
                  const d = new Date(v);
                  if (Number.isNaN(d.getTime())) return '';
                  const pad = (n: number) => String(n).padStart(2, '0');
                  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                })()}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    restaurant: {
                      ...(p.restaurant || {}),
                      offlineMode: {
                        ...(p.restaurant?.offlineMode || {}),
                        resumeAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                      },
                    },
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
              <div className="text-xs text-gray-500 mt-1">If set, orders will automatically resume after this time.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Lat</label>
              <input
                type="number"
                value={String(data.restaurant?.location?.lat ?? '')}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    restaurant: {
                      ...(p.restaurant || {}),
                      location: {
                        ...(p.restaurant?.location || {}),
                        lat: e.target.value === '' ? undefined : Number(e.target.value),
                      },
                    },
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Lng</label>
              <input
                type="number"
                value={String(data.restaurant?.location?.lng ?? '')}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    restaurant: {
                      ...(p.restaurant || {}),
                      location: {
                        ...(p.restaurant?.location || {}),
                        lng: e.target.value === '' ? undefined : Number(e.target.value),
                      },
                    },
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Radius (km)</label>
              <input
                type="number"
                min={0}
                value={Number(data.restaurant?.deliveryRadiusKm ?? 0)}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    restaurant: {
                      ...(p.restaurant || {}),
                      deliveryRadiusKm: Number(e.target.value),
                    },
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
              <div className="mt-2">
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={geoLoading}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm disabled:opacity-60"
                >
                  {geoLoading ? "Getting Location..." : "Use Current Location"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opening Time</label>
              <input
                value={data.restaurant?.openingTime || ""}
                onChange={(e) => setData((p) => ({ ...p, restaurant: { ...(p.restaurant || {}), openingTime: e.target.value } }))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                placeholder="10:00 AM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Closing Time</label>
              <input
                value={data.restaurant?.closingTime || ""}
                onChange={(e) => setData((p) => ({ ...p, restaurant: { ...(p.restaurant || {}), closingTime: e.target.value } }))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                placeholder="10:00 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <input
                value={data.phone || ""}
                onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
              <input
                value={data.image || ""}
                onChange={(e) => setData((p) => ({ ...p, image: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Status: <span className="font-medium">{data.restaurant?.status || ""}</span>
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RaiseDisputeModal from "@/components/RaiseDisputeModal";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderIdParam = useMemo(() => String(params?.orderId || ""), [params]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!orderIdParam) {
        setError("Invalid order id");
        return;
      }
      const res = await fetch(`/api/orders/${orderIdParam}`, { method: "GET" });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Failed to fetch order");
      }
      setOrder(json.data);
      setNotesDraft(json.data?.notes || '');
    } catch (e: any) {
      setError(e?.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderIdParam]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-600">Loading order...</div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="mb-4">
          <button onClick={() => router.back()} className="px-3 py-1.5 rounded-md border">Back</button>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="mb-4">
          <button onClick={() => router.back()} className="px-3 py-1.5 rounded-md border">Back</button>
        </div>
        <div className="rounded-md border p-4">Order not found.</div>
      </div>
    );
  }

  const humanId = order?.orderId || (order?._id ? String(order._id).slice(-6) : "");

  const saveNotes = async () => {
    try {
      if (!order?._id) return;
      setSavingNotes(true);
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesDraft }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed to save notes');
      await load();
    } catch (e: any) {
      alert(e?.message || 'Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const updateStatus = async (nextStatus: string) => {
    try {
      if (!order?._id) return;
      setUpdatingStatus(true);
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed to update status');
      await load();
    } catch (e: any) {
      alert(e?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="px-3 py-1.5 rounded-md border">Back</button>
          <div className="text-sm text-gray-500">Order ID: <span className="font-medium">{humanId}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="px-3 py-1.5 rounded-md border">Print</button>
          {order?._id && (
            <a
              href={`/api/orders/${order._id}/invoice`}
              target="_blank"
              className="px-3 py-1.5 rounded-md border bg-emerald-600 text-white hover:bg-emerald-700"
              rel="noreferrer"
            >
              Invoice
            </a>
          )}
          <button className="px-3 py-1.5 rounded-md border opacity-60 cursor-not-allowed" title="Refund flow not configured">
            Refund
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-800 p-4 sm:p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold">Order Summary</div>
            <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-600 font-semibold">₹{Number(order.total || 0).toFixed(2)}</div>
            <div className="mt-1 inline-block px-2 py-0.5 rounded text-xs bg-gray-100">
              {String(order.status || "").toLowerCase()}
            </div>
          </div>
        </div>

        <div className="rounded-md border p-3">
          <div className="text-sm font-medium mb-2">Update Status</div>
          <div className="flex flex-wrap gap-2">
            {['pending','processing','out_for_delivery','completed','cancelled'].map((s) => (
              <button
                key={s}
                disabled={updatingStatus}
                onClick={() => updateStatus(s)}
                className={`px-3 py-1.5 rounded-md border text-sm ${String(order.status || '').toLowerCase() === s ? 'bg-gray-900 text-white' : 'bg-white'}`}
              >
                {s.replace(/_/g,' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-md border p-3">
            <div className="text-sm font-medium mb-1">Buyer</div>
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {(order.user?.firstName || '') + ' ' + (order.user?.lastName || '')}
            </div>
            {order.user?.email && (
              <div className="text-xs text-gray-500">{order.user.email}</div>
            )}
            {order.user?.phone && (
              <div className="text-xs text-gray-500">{order.user.phone}</div>
            )}
          </div>
          <div className="rounded-md border p-3">
            <div className="text-sm font-medium mb-1">Delivery</div>
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {order.delivery?.address ? String(order.delivery.address) : '—'}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Status: {order.delivery?.status || '—'}
              {order.delivery?.estimatedDelivery && (
                <span className="ml-2">ETA: {new Date(order.delivery.estimatedDelivery).toLocaleString()}</span>
              )}
              {order.delivery?.trackingNumber && (
                <span className="ml-2">Tracking: {order.delivery.trackingNumber}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-md border p-3">
            <div className="text-xs text-gray-500">Mongo ID</div>
            <div className="text-sm break-all">{String(order._id || '')}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-gray-500">Payment Method</div>
            <div className="text-sm">{order.method || '—'}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-gray-500">Payment ID</div>
            <div className="text-sm break-all">{order.paymentId || '—'}</div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Items</div>
          <div className="divide-y rounded-md border">
            {(order.items || []).map((it: any, idx: number) => {
              const p = it?.product || {};
              const img = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '';
              const cat = typeof p?.category === 'object' && p?.category ? p.category.name : '';
              const qty = Number(it?.quantity || 0);
              const price = Number(it?.price || 0);
              const lineTotal = (qty * price).toFixed(2);
              return (
                <div key={idx} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border bg-gray-50">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p?.name || 'Product'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-content-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{p?.name || 'Item'}</div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            {cat && <span className="px-1.5 py-0.5 rounded bg-gray-100">{cat}</span>}
                            {p?.brand && <span>Brand: {p.brand}</span>}
                            {p?.sku && <span>SKU: {p.sku}</span>}
                            {Array.isArray(p?.tags) && p.tags.length > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <span>Tags:</span>
                                <span className="max-w-[220px] truncate">{p.tags.join(', ')}</span>
                              </span>
                            )}
                            {typeof p?.rating === 'number' && (
                              <span>Rating: {p.rating} ({Number(p?.totalReviews || 0)} reviews)</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{lineTotal}</div>
                          <div className="text-xs text-gray-500">Qty: {qty} × ₹{price.toFixed(2)}</div>
                        </div>
                      </div>
                      {p?.description && (
                        <div className="mt-1 text-xs text-gray-600 line-clamp-2">
                          {p.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-md border p-3 space-y-2">
            <div className="text-sm font-medium">Totals</div>
            <div className="text-sm flex items-center justify-between">
              <span>Items Subtotal</span>
              <span>₹{Number(order.itemsSubtotal || 0).toFixed(2)}</span>
            </div>
            {order.couponCode && (
              <div className="text-sm flex items-center justify-between">
                <span>Coupon ({order.couponCode})</span>
                <span>-₹{Number(order.discountAmount || 0).toFixed(2)}</span>
              </div>
            )}
            {order.invoice && (
              <div className="text-sm space-y-1">
                <div className="flex items-center justify-between"><span>Taxable Value</span><span>₹{Number(order.invoice.taxableValue || 0).toFixed(2)}</span></div>
                <div className="flex items-center justify-between"><span>CGST</span><span>₹{Number(order.invoice.cgstAmount || 0).toFixed(2)}</span></div>
                <div className="flex items-center justify-between"><span>SGST</span><span>₹{Number(order.invoice.sgstAmount || 0).toFixed(2)}</span></div>
                {Number(order.invoice.igstAmount || 0) > 0 && (
                  <div className="flex items-center justify-between"><span>IGST</span><span>₹{Number(order.invoice.igstAmount || 0).toFixed(2)}</span></div>
                )}
              </div>
            )}
            <div className="border-t pt-2 text-sm flex items-center justify-between">
              <span>Grand Total</span>
              <span className="font-semibold">₹{Number(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="rounded-md border p-3 space-y-2">
            <div className="text-sm font-medium">Notes & Status</div>
            <div className="text-sm">Status: <span className="font-medium">{String(order.status || '').toLowerCase()}</span></div>
            {order.notes && <div className="text-sm">Notes: {order.notes}</div>}
            {order.canceledAt && (
              <div className="text-sm">Canceled At: {new Date(order.canceledAt).toLocaleString()}</div>
            )}
            {typeof order.cancellationPenaltyAmount === 'number' && Number(order.cancellationPenaltyAmount) > 0 && (
              <div className="text-sm">Cancellation Penalty: ₹{Number(order.cancellationPenaltyAmount).toFixed(2)}</div>
            )}
            {order.refundStatus && (
              <div className="text-sm">Refund: {order.refundStatus}{order.refundAmount ? ` (₹${Number(order.refundAmount).toFixed(2)})` : ''}</div>
            )}
            <div className="mt-2">
              <div className="text-sm font-medium mb-1">Internal Notes</div>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={3}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Add internal notes..."
              />
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="mt-2 px-3 py-1.5 rounded-md bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60"
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-md border p-3">
            <div className="text-sm font-medium mb-1">Payment</div>
            <div className="text-sm flex items-center justify-between"><span>Method</span><span>{order.method || '—'}</span></div>
            <div className="text-sm flex items-center justify-between"><span>Transaction ID</span><span className="break-all">{order.paymentId || '—'}</span></div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-sm font-medium mb-1">Quick Actions</div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 rounded-md border opacity-60 cursor-not-allowed">Send Email</button>
              <button className="px-3 py-1.5 rounded-md border opacity-60 cursor-not-allowed">Duplicate Order</button>
              <button className="px-3 py-1.5 rounded-md border border-red-300 text-red-700 opacity-60 cursor-not-allowed">Cancel Order</button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Payment: {order.method || ""}</div>
          <button
            onClick={() => setDisputeOpen(true)}
            className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white"
          >
            Raise Dispute
          </button>
        </div>
      </div>

      <RaiseDisputeModal
        open={disputeOpen}
        onOpenChange={setDisputeOpen}
        order={order}
        onCreated={() => {
          setDisputeOpen(false);
          load();
        }}
      />
    </div>
  );
}

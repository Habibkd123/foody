"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RaiseDisputeModal from "@/components/RaiseDisputeModal";
import { useOrderDetailsQuery } from "@/hooks/useOrderDetailsQuery";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useUserStore } from "@/lib/store/useUserStore";
import { BellRing, CheckCircle2, Truck, Star } from "lucide-react";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderIdParam = useMemo(() => String(params?.orderId || ""), [params]);

  const { user } = useUserStore();
  const toast = useCustomToast();
  const { data: order, isLoading: loading, error: queryError, updateOrder, refetch } = useOrderDetailsQuery(orderIdParam);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [review, setReview] = useState<any>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [restaurantComment, setRestaurantComment] = useState('');
  const [driverRating, setDriverRating] = useState(0);
  const [driverComment, setDriverComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const error = queryError instanceof Error ? queryError.message : null;

  useEffect(() => {
    let socket: any;

    const initSocket = async () => {
      if (!user?._id) return;

      // Ensure socket server is up
      await fetch('/api/socket', { method: 'POST' });

      const { io } = await import('socket.io-client');
      socket = io({
        path: '/api/socket',
        addTrailingSlash: false,
      });

      socket.on('connect', () => {
        console.log('Customer connected to socket:', socket.id);
        socket.emit('join', user._id);
      });

      socket.on('orderStatusUpdate', (data: any) => {
        if (data.orderId === orderIdParam || data.orderNumber === orderIdParam) {
          toast.info(
            'Order Update!',
            data.message
          );
          // Play sound
          try { new Audio('/sounds/notification.mp3').play(); } catch (e) { }
          // Refresh order data
          refetch();
        }
      });
    };

    initSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user?._id, orderIdParam]);

  useEffect(() => {
    if (order?.notes) {
      setNotesDraft(order.notes);
    }
  }, [order?.notes]);

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
    if (!order?._id) return;
    try {
      setSavingNotes(true);
      await updateOrder({ id: order._id, data: { notes: notesDraft } });
    } catch (e: any) {
      alert(e?.message || 'Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const updateStatus = async (nextStatus: string) => {
    if (!order?._id) return;
    try {
      setUpdatingStatus(true);
      await updateOrder({ id: order._id, data: { status: nextStatus } });
    } catch (e: any) {
      alert(e?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const fetchReview = async () => {
    if (!orderIdParam) return;
    try {
      const res = await fetch(`/api/orders/${orderIdParam}/review`);
      const data = await res.json();
      if (data.success && data.data) {
        setReview(data.data);
      }
    } catch (error) {
      console.error('Error fetching review:', error);
    }
  };

  const submitReview = async () => {
    if (!user?._id || !orderIdParam) return;
    if (restaurantRating === 0) {
      toast.error('Rating Required', 'Please provide a rating for the restaurant');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await fetch(`/api/orders/${orderIdParam}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          restaurantRating,
          restaurantComment,
          driverRating,
          driverComment
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Review Submitted', 'Thank you for your feedback!');
        setReview(data.data);
        setShowReviewForm(false);
      } else {
        toast.error('Submission Failed', data.message);
      }
    } catch (error: any) {
      toast.error('Error', error.statusText || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [orderIdParam]);

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
            {['pending', 'processing', 'out_for_delivery', 'completed', 'cancelled'].map((s) => (
              <button
                key={s}
                disabled={updatingStatus}
                onClick={() => updateStatus(s)}
                className={`px-3 py-1.5 rounded-md border text-sm ${String(order.status || '').toLowerCase() === s ? 'bg-gray-900 text-white' : 'bg-white'}`}
              >
                {s.replace(/_/g, ' ')}
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

            {/* Review Section */}
            {order.status === 'delivered' && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Order Feedback</h3>

                {review ? (
                  <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Restaurant Rating</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= review.restaurantRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    {review.restaurantComment && <p className="text-sm italic">"{review.restaurantComment}"</p>}

                    {review.driverRating && (
                      <>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="font-medium text-sm">Driver Rating</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-4 h-4 ${s <= review.driverRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        {review.driverComment && <p className="text-sm italic">"{review.driverComment}"</p>}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30">
                    <p className="text-sm text-orange-800 dark:text-orange-300 mb-4">How was your experience? Your feedback helps us improve!</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Rate Food & Restaurant</label>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => setRestaurantRating(s)} className="p-1">
                              <Star className={`w-6 h-6 ${s <= restaurantRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} />
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="What did you like or dislike? (Optional)"
                          className="w-full text-sm p-2 border rounded-md"
                          value={restaurantComment}
                          onChange={(e) => setRestaurantComment(e.target.value)}
                        />
                      </div>

                      {order.rider && (
                        <div>
                          <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Rate Delivery Partner</label>
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} onClick={() => setDriverRating(s)} className="p-1">
                                <Star className={`w-6 h-6 ${s <= driverRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} />
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Any comments for the driver? (Optional)"
                            className="w-full text-sm p-2 border rounded-md"
                            value={driverComment}
                            onChange={(e) => setDriverComment(e.target.value)}
                          />
                        </div>
                      )}

                      <button
                        onClick={submitReview}
                        disabled={submittingReview}
                        className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
        }}
      />
    </div>
  );
}

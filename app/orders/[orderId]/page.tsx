
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RaiseDisputeModal from "@/components/RaiseDisputeModal";
import { useOrderDetailsQuery } from "@/hooks/useOrderDetailsQuery";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  ArrowLeft,
  Printer,
  FileText,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  User,
  Star,
  Search,
  MessageSquare,
  AlertCircle,
  IndianRupee,
  ShoppingBag,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

const getStatusStep = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 1;
    case 'processing': return 2;
    case 'out_for_delivery': return 3;
    case 'completed': return 4;
    default: return 0;
  }
}

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

  // Socket management
  useEffect(() => {
    let socket: any;

    const initSocket = async () => {
      if (!user?._id) return;
      await fetch('/api/socket', { method: 'POST' });
      const { io } = await import('socket.io-client');
      socket = io({
        path: '/api/socket',
        addTrailingSlash: false,
      });

      socket.on('connect', () => {
        socket.emit('join', user._id);
      });

      socket.on('orderStatusUpdate', (data: any) => {
        if (data.orderId === orderIdParam || data.orderNumber === orderIdParam) {
          toast.info('Order Update!', data.message);
          try { new Audio('/sounds/notification.mp3').play(); } catch (e) { }
          refetch();
        }
      });
    };

    initSocket();
    return () => { if (socket) socket.disconnect(); };
  }, [user?._id, orderIdParam, refetch, toast]);

  // Initial Review Fetch
  useEffect(() => {
    const fetchReview = async () => {
      if (!orderIdParam) return;
      try {
        const res = await fetch(`/api/orders/${orderIdParam}/review`);
        const data = await res.json();
        if (data.success && data.data) setReview(data.data);
      } catch (error) {
        console.error('Error fetching review:', error);
      }
    };
    fetchReview();
  }, [orderIdParam]);

  useEffect(() => {
    if (order?.notes) setNotesDraft(order.notes);
  }, [order?.notes]);

  const saveNotes = async () => {
    if (!order?._id) return;
    try {
      setSavingNotes(true);
      await updateOrder({ id: order._id, data: { notes: notesDraft } });
      toast.success('Notes Saved', 'Internal notes updated successfully');
    } catch (e: any) {
      toast.error('Error', e?.message || 'Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const updateStatus = async (nextStatus: string) => {
    if (!order?._id) return;
    try {
      setUpdatingStatus(true);
      await updateOrder({ id: order._id, data: { status: nextStatus } });
      toast.success('Status Updated', `Order is now ${nextStatus.replace(/_/g, ' ')}`);
    } catch (e: any) {
      toast.error('Error', e?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-12 w-full max-w-sm rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[500px] lg:col-span-2 rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <Card className="border-none shadow-soft text-center py-20 bg-muted/20">
        <div className="bg-destructive/10 p-4 rounded-full w-fit mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl">{error || "Order not found"}</CardTitle>
        <CardDescription className="mt-2">The order might have been moved or you don't have access to it.</CardDescription>
        <Button onClick={() => router.back()} className="mt-8" variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
        </Button>
      </Card>
    );
  }

  const humanId = order?.orderId || (order?._id ? String(order._id).slice(-6) : "");
  const currentStep = getStatusStep(order.status || "");

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-muted" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">
              <ShoppingBag className="h-3 w-3" />
              <span>Order Details</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary">#{humanId}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              ₹{Number(order.total || 0).toLocaleString('en-IN')}
              <Badge className={`border-none ${order.status === 'completed' ? 'bg-emerald-500' : 'bg-primary'}`}>
                {String(order.status || '').replace(/_/g, ' ')}
              </Badge>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print Order</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" asChild>
                  <a href={`/api/orders/${order._id}/invoice`} target="_blank" rel="noreferrer">
                    <FileText className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download Invoice</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button onClick={() => setDisputeOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
            Raise Dispute
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col: Order Info */}
        <div className="lg:col-span-2 space-y-8">

          {/* Status Progress */}
          <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg">Order Tracking</CardTitle>
              <CardDescription>Real-time updates for order #{humanId}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0" />
                {/* Active Progress Line */}
                <div
                  className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />

                {[
                  { step: 1, label: 'Placed', icon: Clock },
                  { step: 2, label: 'Kitchen', icon: Package },
                  { step: 3, label: 'Delivery', icon: Truck },
                  { step: 4, label: 'Completed', icon: CheckCircle2 }
                ].map((s) => {
                  const Icon = s.icon;
                  const isDone = currentStep >= s.step;
                  const isCurrent = currentStep === s.step;
                  return (
                    <div key={s.step} className="relative z-10 flex flex-col items-center gap-3">
                      <div className="relative">
                        {isCurrent && (
                          <div className="absolute -inset-2 rounded-full border-2 border-primary border-t-transparent animate-rotate-border opacity-50" />
                        )}
                        <div className={`
                            h-12 w-12 rounded-full flex items-center justify-center border-4 transition-all duration-500
                            ${isDone ? 'bg-primary border-primary text-white scale-110' : 'bg-card border-border text-muted-foreground'}
                            ${isCurrent ? 'ring-4 ring-primary/20 animate-smooth-pulse z-10 shadow-lg shadow-primary/30' : ''}
                        `}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${isDone ? 'text-primary' : 'text-muted-foreground'}`}>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Status Update Buttons */}
              <div className="mt-12 flex flex-wrap gap-2 justify-center pt-8 border-t border-border/50">
                <span className="w-full text-center text-[10px] uppercase font-bold text-muted-foreground mb-4">Quick Status Update</span>
                {['pending', 'processing', 'out_for_delivery', 'completed', 'cancelled'].map((s) => (
                  <Button
                    key={s}
                    variant={String(order.status || '').toLowerCase() === s ? 'default' : 'outline'}
                    size="sm"
                    disabled={updatingStatus}
                    onClick={() => updateStatus(s)}
                    className={`rounded-full shadow-sm text-xs font-bold ${s === 'cancelled' && 'hover:bg-rose-50 text-rose-500 hover:text-rose-600'}`}
                  >
                    {s.replace(/_/g, ' ')}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Items Receipt */}
          <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Items Ordered
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="pl-6">Product Details</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right pr-6 font-bold">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(order.items || []).map((it: any, idx: number) => {
                      const p = it?.product || {};
                      const img = p.images?.[0];
                      return (
                        <TableRow key={idx} className="group hover:bg-muted/20 transition-colors">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16 rounded-lg border-2 border-border shadow-soft">
                                <AvatarImage src={img} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary font-black uppercase">
                                  {p.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-bold text-base">{p.name || 'Unknown Item'}</span>
                                <span className="text-xs text-muted-foreground bg-muted w-fit px-1.5 py-0.5 rounded mt-1 font-mono">
                                  {p.brand || 'No Brand'} • {p.sku || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-sm font-black px-3 py-1 ring-1 ring-border">
                              ×{it.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="font-black text-primary">₹{(it.quantity * it.price).toFixed(2)}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">₹{Number(it.price).toFixed(2)} each</div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-6 flex flex-col gap-3">
              <div className="flex justify-between w-full text-sm font-medium">
                <span className="text-muted-foreground">Items Subtotal</span>
                <span>₹{Number(order.itemsSubtotal || 0).toFixed(2)}</span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between w-full text-sm font-black text-emerald-600">
                  <span>Coupon ({order.couponCode})</span>
                  <span>-₹{Number(order.discountAmount || 0).toFixed(2)}</span>
                </div>
              )}
              {order.invoice && (
                <div className="w-full space-y-2 pt-2 border-t border-dashed">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>GST (18% approx)</span>
                    <span>₹{(Number(order.invoice.cgstAmount) + Number(order.invoice.sgstAmount)).toFixed(2)}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between w-full pt-4 mt-2 border-t border-border">
                <span className="text-xl font-black italic">Total Amount</span>
                <span className="text-2xl font-black text-primary">₹{Number(order.total || 0).toFixed(2)}</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Col: Metadata & User */}
        <div className="space-y-8">

          {/* Buyer & Delivery */}
          <Card className="border-none shadow-soft bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Delivery Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-background shadow-sm">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-white font-black">
                    {order.user?.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm leading-none mb-1">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                  <p className="text-xs font-mono mt-1 text-primary">{order.user?.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-rose-500 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Address</span>
                    <span className="text-sm leading-relaxed">{order.delivery?.address || 'Self Pickup / Not Provided'}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Payment</span>
                    <span className="text-sm">{order.method || 'Cash on Delivery'}</span>
                    <span className="text-[10px] text-muted-foreground font-mono mt-1">{order.paymentId || 'NO_PAY_ID'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Feedback */}
          {order.status === 'completed' && (
            <Card className="border-none shadow-soft overflow-hidden">
              <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                  <Star className="h-5 w-5 fill-amber-600" /> Order Review
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {review ? (
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-xl">
                      <span className="text-xs font-bold uppercase block mb-3 text-muted-foreground">Restaurant Experience</span>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-4 w-4 ${i <= review.restaurantRating ? 'fill-amber-500 text-amber-500' : 'text-muted'}`} />)}
                      </div>
                      <p className="text-sm italic">"{review.restaurantComment || 'No comment provided'}"</p>
                    </div>
                    {review.driverRating && (
                      <div className="bg-muted/30 p-4 rounded-xl">
                        <span className="text-xs font-bold uppercase block mb-3 text-muted-foreground">Driver Feedback</span>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-4 w-4 ${i <= review.driverRating ? 'fill-amber-500 text-amber-500' : 'text-muted'}`} />)}
                        </div>
                        <p className="text-sm italic">"{review.driverComment || 'No comment provided'}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MessageSquare className="h-10 w-10 text-muted mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Customer hasn't provided feedback yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Internal Notes */}
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" /> Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                className="min-h-[100px] border-muted bg-muted/20 focus-visible:ring-primary"
                placeholder="Write private notes about this order..."
              />
            </CardContent>
            <CardFooter>
              <Button
                onClick={saveNotes}
                disabled={savingNotes}
                className="w-full font-bold shadow-soft"
                variant="secondary"
              >
                {savingNotes ? 'Saving...' : 'Update Notes'}
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>

      <RaiseDisputeModal
        open={disputeOpen}
        onOpenChange={setDisputeOpen}
        order={order}
        onCreated={() => setDisputeOpen(false)}
      />
    </div>
  );
}

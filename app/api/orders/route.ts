import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/app/models/Order';
import { OrderStatus } from '@/app/models/User';
import mongoose from 'mongoose';
import Delivery from '@/app/models/Delivery';
import Cart from '@/app/models/Cart';

// GET /api/orders - Fetch all orders with pagination, filtering, and population
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build filter object
    const filter: any = {};
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      filter.status = status;
    }
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.user = userId;
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Fetch orders with population
    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price image category')
      .populate('delivery', 'address status estimatedDelivery')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);
    
    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    console.log('[Orders POST] Enter handler');
    await connectDB();
    console.log('[Orders POST] Connected to DB');
    
    const body = await request.json();
    console.log('[Orders POST] Parsed body');
    const { user, items, total, paymentId, delivery, method, orderId } = body;
    console.log('[Orders POST] Extracted fields', {
      hasUser: !!user,
      itemsCount: Array.isArray(items) ? items.length : 'not-array',
      total,
      hasPaymentId: !!paymentId,
      hasDelivery: !!delivery,
      method,
      orderId,
    });
    
    // Validation
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      console.warn('[Orders POST] Invalid user', { user });
      return NextResponse.json(
        { success: false, error: 'Valid user ID is required' },
        { status: 400 }
      );
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn('[Orders POST] Invalid items array', { itemsType: typeof items, length: Array.isArray(items) ? items.length : undefined });
      return NextResponse.json(
        { success: false, error: 'Items array is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    if (!total || typeof total !== 'number' || total <= 0) {
      console.warn('[Orders POST] Invalid total', { total, type: typeof total });
      return NextResponse.json(
        { success: false, error: 'Valid total amount is required' },
        { status: 400 }
      );
    }
    
    if (!paymentId || typeof paymentId !== 'string') {
      console.warn('[Orders POST] Missing/invalid paymentId', { paymentId });
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }
    
    if (!orderId || typeof orderId !== 'string') {
      console.warn('[Orders POST] Missing/invalid orderId', { orderId });
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Validate items structure
    for (const item of items) {
      const idx = items.indexOf(item);
      console.log('[Orders POST] Validating item', { idx, product: item?.product, quantity: item?.quantity, price: item?.price });
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        console.warn('[Orders POST] Invalid product in item', { idx, product: item?.product });
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid product ID' },
          { status: 400 }
        );
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        console.warn('[Orders POST] Invalid quantity in item', { idx, quantity: item?.quantity });
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid quantity' },
          { status: 400 }
        );
      }
      if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
        console.warn('[Orders POST] Invalid price in item', { idx, price: item?.price });
        return NextResponse.json(
          { success: false, error: 'Each item must have a valid price' },
          { status: 400 }
        );
      }
    }
    
    // Create order data
    const orderData: any = {
      user,
      items,
      total,
      paymentId,
      orderId,
      method: method || 'card',
      status: OrderStatus.PENDING,
    };
    console.log('[Orders POST] Built orderData', {
      user: orderData.user?.toString?.() || orderData.user,
      itemsCount: orderData.items?.length,
      total: orderData.total,
      orderId: orderData.orderId,
      method: orderData.method,
      hasDelivery: !!orderData.delivery,
    });
    
    if (delivery && mongoose.Types.ObjectId.isValid(delivery)) {
      orderData.delivery = delivery;
      console.log('[Orders POST] Using provided delivery id', { delivery: delivery?.toString?.() || delivery });
    }
    
    // Create the order
    console.log('[Orders POST] Creating Order...');
    const newOrder = await Order.create(orderData);
    console.log('[Orders POST] Order created', { orderMongoId: newOrder?._id?.toString?.(), orderId: newOrder?.orderId });
    
    // If delivery ID was not provided, create a Delivery now and link it to the order
    if (!orderData.delivery) {
      console.log('[Orders POST] No delivery provided; creating Delivery...');
      const primaryProductId = items?.[0]?.product;
      if (!primaryProductId || !mongoose.Types.ObjectId.isValid(primaryProductId)) {
        throw new Error('Cannot create delivery: missing or invalid primary product ID from items[0].product');
      }

      try {
        const createdDelivery = await Delivery.create({
          order: newOrder._id,
          product: primaryProductId,
          address: (body.address || body.shippingAddress || '').toString?.() || String(body.address || body.shippingAddress || ''),
        });
        console.log('[Orders POST] Delivery created', { deliveryId: createdDelivery?._id?.toString?.(), orderMongoId: newOrder?._id?.toString?.() });
        await Order.findByIdAndUpdate(newOrder._id, { delivery: createdDelivery._id });
        console.log('[Orders POST] Linked delivery to order');
        // Reflect in local variable for accurate population
        orderData.delivery = createdDelivery._id;
      } catch (deliveryErr) {
        console.error('Delivery creation/linking failed for order', newOrder?._id?.toString?.(), deliveryErr);
      }
    }
    
    // After creating the order, mark user's cart as purchased and disable TTL
    try {
      if (user && mongoose.Types.ObjectId.isValid(user)) {
        await Cart.findOneAndUpdate(
          { user: user },
          { $set: { status: 'purchased', expiresAt: null, items: [] } },
          { new: true }
        );
      }
    } catch (cartUpdateErr) {
      console.error('[Orders POST] Failed to update cart status after purchase', cartUpdateErr);
    }

    // Populate the created order before returning
    console.log('[Orders POST] Populating order for response...');
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name price image category')
      .populate('delivery', 'address status estimatedDelivery');
    console.log('[Orders POST] Populated order ready');
    
    return NextResponse.json(
      { success: true, data: populatedOrder },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('[Orders POST] Error creating order:', error?.stack || error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Order with this ID already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}


//
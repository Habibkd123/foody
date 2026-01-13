import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import Order from '@/app/models/Order';
import User from '@/app/models/User';
import Product from '@/app/models/Product';

export type InvoiceSnapshot = {
  invoiceNumber: string;
  invoiceDate: Date;
  gstRate: number;
  taxableValue: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  currency: string;
};

export function computeGstBreakupFromTotalInclusive(totalInclusive: number, gstRate: number) {
  const rate = Math.max(0, Number(gstRate) || 0) / 100;
  const total = Math.max(0, Number(totalInclusive) || 0);
  if (rate <= 0) {
    return {
      taxableValue: Math.round(total * 100) / 100,
      gstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
    };
  }

  const taxable = total / (1 + rate);
  const gst = total - taxable;
  const cgst = gst / 2;
  const sgst = gst / 2;

  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    taxableValue: round2(taxable),
    gstAmount: round2(gst),
    cgstAmount: round2(cgst),
    sgstAmount: round2(sgst),
    igstAmount: 0,
  };
}

export function generateInvoiceNumber(now = new Date()) {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `INV-${yyyy}${mm}${dd}-${rand}`;
}

export async function ensureInvoiceForOrder(orderMongoId: string, opts?: { gstRate?: number }) {
  if (!orderMongoId || !mongoose.Types.ObjectId.isValid(orderMongoId)) return null;

  const order: any = await Order.findById(orderMongoId);
  if (!order) return null;

  const status = String(order.status || '').toLowerCase();
  if (status !== 'paid') return null;

  if (order.invoice?.invoiceNumber) {
    return order.invoice as InvoiceSnapshot;
  }

  const gstRate = Number(opts?.gstRate ?? 5);
  const breakup = computeGstBreakupFromTotalInclusive(Number(order.total || 0), gstRate);

  const invoice: InvoiceSnapshot = {
    invoiceNumber: generateInvoiceNumber(new Date()),
    invoiceDate: new Date(),
    gstRate,
    taxableValue: breakup.taxableValue,
    gstAmount: breakup.gstAmount,
    cgstAmount: breakup.cgstAmount,
    sgstAmount: breakup.sgstAmount,
    igstAmount: breakup.igstAmount,
    currency: 'INR',
  };

  order.invoice = invoice;
  await order.save();
  return invoice;
}

export async function buildInvoicePdfBuffer(orderId: string) {
  const order: any = await Order.findById(orderId)
    .populate('user', 'firstName lastName email phone addresses')
    .populate('delivery', 'address status estimatedDelivery trackingNumber')
    .populate('items.product', 'name restaurantId')
    .lean();

  if (!order) {
    throw new Error('Order not found');
  }

  const firstProduct: any = Array.isArray(order.items) && order.items.length > 0 ? order.items[0].product : null;
  const restaurantId = firstProduct?.restaurantId ? String(firstProduct.restaurantId) : '';
  const restaurantUser: any = restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)
    ? await User.findById(restaurantId).select('restaurant email phone').lean()
    : null;

  const invoice: any = order.invoice || {};

  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks: Buffer[] = [];
  doc.on('data', (c: any) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));

  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  doc.fontSize(18).text('Tax Invoice', { align: 'center' });
  doc.moveDown();

  doc.fontSize(10);
  doc.text(`Invoice No: ${invoice.invoiceNumber || '—'}`);
  doc.text(`Invoice Date: ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : '—'}`);
  doc.text(`Order ID: ${order.orderId || order._id}`);
  doc.text(`Payment: ${order.method || ''}`);

  doc.moveDown();
  doc.fontSize(12).text('Seller', { underline: true });
  doc.fontSize(10);
  doc.text(restaurantUser?.restaurant?.name || 'Restaurant');
  doc.text(restaurantUser?.restaurant?.address || '');
  if (restaurantUser?.email) doc.text(`Email: ${restaurantUser.email}`);
  if (restaurantUser?.phone) doc.text(`Phone: ${restaurantUser.phone}`);

  doc.moveDown();
  doc.fontSize(12).text('Buyer', { underline: true });
  doc.fontSize(10);
  doc.text(`${order?.user?.firstName || ''} ${order?.user?.lastName || ''}`.trim() || 'Customer');
  if (order?.user?.email) doc.text(`Email: ${order.user.email}`);
  if (order?.user?.phone) doc.text(`Phone: ${order.user.phone}`);
  if (order?.delivery?.address) doc.text(`Address: ${String(order.delivery.address)}`);

  doc.moveDown();
  doc.fontSize(12).text('Items', { underline: true });
  doc.moveDown(0.5);

  const startX = doc.x;
  const colName = startX;
  const colQty = 360;
  const colPrice = 410;
  const colTotal = 480;

  doc.fontSize(10).text('Item', colName, doc.y);
  doc.text('Qty', colQty, doc.y);
  doc.text('Price', colPrice, doc.y);
  doc.text('Total', colTotal, doc.y);
  doc.moveDown(0.4);
  doc.moveTo(startX, doc.y).lineTo(555, doc.y).strokeColor('#cccccc').stroke();
  doc.moveDown(0.4);

  let itemsTotal = 0;
  (order.items || []).forEach((it: any) => {
    const name = it?.product?.name || 'Item';
    const qty = Number(it?.quantity || 0);
    const price = Number(it?.price || 0);
    const total = Math.round(qty * price * 100) / 100;
    itemsTotal += total;

    const y = doc.y;
    doc.text(String(name), colName, y, { width: 330 });
    doc.text(String(qty), colQty, y);
    doc.text(price.toFixed(2), colPrice, y);
    doc.text(total.toFixed(2), colTotal, y);
    doc.moveDown();
  });

  doc.moveDown();
  doc.fontSize(12).text('Totals', { underline: true });
  doc.fontSize(10);

  const currency = invoice.currency || 'INR';
  const taxable = Number(invoice.taxableValue || 0);
  const cgst = Number(invoice.cgstAmount || 0);
  const sgst = Number(invoice.sgstAmount || 0);
  const igst = Number(invoice.igstAmount || 0);
  const grand = Number(order.total || 0);

  doc.text(`Taxable Value: ${currency} ${taxable.toFixed(2)}`);
  doc.text(`CGST (${invoice.gstRate ? invoice.gstRate / 2 : 0}%): ${currency} ${cgst.toFixed(2)}`);
  doc.text(`SGST (${invoice.gstRate ? invoice.gstRate / 2 : 0}%): ${currency} ${sgst.toFixed(2)}`);
  if (igst > 0) doc.text(`IGST: ${currency} ${igst.toFixed(2)}`);
  doc.text(`Grand Total: ${currency} ${grand.toFixed(2)}`);

  doc.moveDown();
  doc.fontSize(8).fillColor('#666666').text('This is a system-generated invoice.', { align: 'center' });

  doc.end();
  return done;
}

export async function getRestaurantIdForOrder(orderId: string) {
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) return '';

  const order: any = await Order.findById(orderId)
    .select('items')
    .populate('items.product', 'restaurantId')
    .lean();

  const items: any[] = Array.isArray(order?.items) ? order.items : [];
  try {
    if (!items.length) {
      console.warn('[getRestaurantIdForOrder] No items for order', { orderId });
    }
  } catch {}
  for (const it of items) {
    const product: any = it?.product;
    const rid = product?.restaurantId ? String(product.restaurantId) : '';
    if (rid && mongoose.Types.ObjectId.isValid(rid)) return rid;
  }

  const productIds: string[] = items
    .map((it: any) => {
      const p: any = it?.product;
      if (!p) return '';
      if (typeof p === 'string') return p;
      if (p?._id) return String(p._id);
      return '';
    })
    .filter(Boolean);

  if (!productIds.length) return '';

  const foundProducts: any[] = await Product.find({ _id: { $in: productIds } })
    .select('restaurantId')
    .lean();
  const restaurantIds: string[] = [];
  for (const fp of foundProducts) {
    const rid = fp?.restaurantId ? String(fp.restaurantId) : '';
    if (rid && mongoose.Types.ObjectId.isValid(rid)) {
      restaurantIds.push(rid);
    }
  }
  if (restaurantIds.length > 1) {
    console.warn('[getRestaurantIdForOrder] Multiple restaurantIds for order items; using first', {
      orderId,
      restaurantIds,
    });
  }
  if (restaurantIds.length === 0) {
    try {
      console.warn('[getRestaurantIdForOrder] Could not resolve restaurantId', {
        orderId,
        itemCount: items.length,
        productIds,
        foundProducts: foundProducts.length,
      });
    } catch {}
    return '';
  }
  return restaurantIds[0];
}

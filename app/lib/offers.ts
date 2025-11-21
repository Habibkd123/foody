import connectDB from '@/lib/mongodb';
import Offer from '@/app/models/Offer';
import Product from '@/app/models/Product';

// Compute offers applicable to a product id
export async function applicableOffersForProduct(productId: string) {
  await connectDB();
  const now = new Date();
  const productDoc: any = await Product.findById(productId).select('category tags').lean();
  if (!productDoc) return [] as any[];
  const q: any = {
    active: true,
    $or: [{ startsAt: { $exists: false } }, { startsAt: { $lte: now } }],
    $and: [{ $or: [{ endsAt: { $exists: false } }, { endsAt: { $gte: now } }]}],
  };
  const offers = await Offer.find(q).lean();
  return offers.filter((o: any) => {
    if (o.scope?.type === 'product') return o.scope.productIds?.some((id: string) => String(id) === String(productId));
    if (o.scope?.type === 'category') return o.scope.categoryIds?.some((id: string) => String(id) === String(productDoc.category));
    if (o.scope?.type === 'tag') return o.scope.tags?.some((t: string) => (productDoc.tags || []).includes(t));
    return false;
  });
}

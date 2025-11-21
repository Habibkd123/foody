import { ICoupon } from '@/app/models/Coupon';

export function computeCouponDiscount(coupon: ICoupon, cartTotal: number) {
  if (coupon.minTotal && cartTotal < coupon.minTotal) return 0;
  let discount = 0;
  if (coupon.type === 'percent') {
    discount = (cartTotal * coupon.value) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.value;
  }
  discount = Math.max(0, Math.min(discount, cartTotal));
  return Math.round(discount * 100) / 100;
}

export function isCouponActiveNow(coupon: ICoupon, now = new Date()) {
  if (coupon.active === false) return false;
  if (coupon.startsAt && now < new Date(coupon.startsAt)) return false;
  if (coupon.endsAt && now > new Date(coupon.endsAt)) return false;
  return true;
}

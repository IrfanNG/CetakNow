export function nextOrderCode(db, shop) {
  const count = db.orders.filter((o) => o.shop_id === shop.id).length;
  return `CN-${shop.shop_code}-${1001 + count}`;
}

export const ORDER_STATUSES = ['Pending Payment', 'Paid / New Order', 'Printing', 'Ready for Pickup', 'Completed', 'Cancelled', 'File Problem'];
export const PAID_STATUSES = ['paid'];

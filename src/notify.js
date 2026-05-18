import fs from 'node:fs/promises';
import { id, nowIso } from './db.js';
import { labelSlot } from './pickup.js';

export async function sendPaidOrderEmail(db, { shop, order, slot }) {
  const addOns = (order.product_items || []).map((product) => `- ${product.name}: RM${Number(product.price).toFixed(2)}`).join('\n') || '-';
  const fileCount = order.files?.length || (order.file_path ? 1 : 0);
  const message = `New Print Order\n\nOrder ID: ${order.order_code}\nCustomer Name: ${order.customer_name}\nPhone: ${order.customer_phone}\nFiles: ${fileCount}\nPages: ${order.page_count}\nPaper Size: ${order.paper_size || 'A4'}\nPrint Type: ${order.print_type}\nSides: ${order.sides}\nCopies: ${order.copies}\nAdd-ons:\n${addOns}\nPickup: ${order.pickup_date}, ${labelSlot(slot)}\nTotal: RM${Number(order.total_amount).toFixed(2)}\nStatus: Paid\n\nOpen Dashboard: /admin/orders/${order.id}\n`;
  await fs.mkdir('storage', { recursive: true });
  await fs.appendFile('storage/mail.log', `Subject: New Paid Print Order - ${order.order_code}\nTo: ${shop.email}\n${message}\n---\n`);
  db.notifications.push({ id: id('notification'), shop_id: shop.id, order_id: order.id, type: 'email', recipient: shop.email, status: 'sent', sent_at: nowIso(), created_at: nowIso() });
}

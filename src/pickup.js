export function isSlotAvailable({ db, shopId, slotId, pickupDate, minPrepMinutes = 60, now = new Date() }) {
  const slot = db.pickup_slots.find((s) => s.id === slotId && s.shop_id === shopId && s.is_active);
  if (!slot) return { ok: false, reason: 'Pickup slot unavailable' };
  const selected = new Date(`${pickupDate}T${slot.start_time}:00`);
  if (Number.isNaN(selected.getTime())) return { ok: false, reason: 'Invalid pickup date' };
  if (selected.getDay() !== Number(slot.day_of_week)) return { ok: false, reason: 'Shop is closed for this slot date' };
  if (selected.getTime() - now.getTime() < minPrepMinutes * 60_000) return { ok: false, reason: 'Pickup slot is too soon' };
  const used = db.orders.filter((o) => o.shop_id === shopId && o.pickup_date === pickupDate && o.pickup_slot_id === slotId && !['Cancelled'].includes(o.order_status)).length;
  if (used >= Number(slot.max_orders)) return { ok: false, reason: 'Pickup slot is fully booked' };
  return { ok: true, slot };
}

export function labelSlot(slot) {
  return `${slot.start_time} - ${slot.end_time}`;
}

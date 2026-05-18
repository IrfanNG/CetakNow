import { id, nowIso } from './db.js';

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

const DAY_MAP = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
export function parseOperatingHours(value = '') {
  const text = String(value || '').trim();
  const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  const fallback = { days: [1, 2, 3, 4, 5, 6], start: '09:00', end: '21:00' };
  if (!timeMatch) return fallback;
  const start = to24Hour(timeMatch[1], timeMatch[2] || '00', timeMatch[3]);
  const end = to24Hour(timeMatch[4], timeMatch[5] || '00', timeMatch[6]);
  const days = parseDays(text.slice(0, timeMatch.index));
  if (!start || !end || toMinutes(end) <= toMinutes(start)) return fallback;
  return { days: days.length ? days : fallback.days, start, end };
}

export function generateHourlyPickupSlots(operatingHours, maxOrders = 5) {
  const { days, start, end } = parseOperatingHours(operatingHours);
  const slots = [];
  for (const day of days) {
    for (let cursor = toMinutes(start), close = toMinutes(end); cursor + 60 <= close; cursor += 60) {
      slots.push({ day_of_week: day, start_time: fromMinutes(cursor), end_time: fromMinutes(cursor + 60), max_orders: maxOrders });
    }
  }
  return slots;
}

export function syncPickupSlotsForShop(db, shop, { maxOrders = 5 } = {}) {
  db.pickup_slots ||= [];
  db.orders ||= [];
  const updatedAt = nowIso();
  const desired = generateHourlyPickupSlots(shop.operating_hours, maxOrders);
  const existing = db.pickup_slots.filter((slot) => slot.shop_id === shop.id);
  const desiredKeys = new Set(desired.map(slotKey));
  const usedSlotIds = new Set(db.orders.filter((order) => order.shop_id === shop.id && order.pickup_slot_id).map((order) => order.pickup_slot_id));
  const seen = new Set();

  for (const slot of desired) {
    const key = slotKey(slot);
    const match = existing.find((item) => slotKey(item) === key && !seen.has(item.id));
    if (match) {
      match.max_orders = maxOrders;
      match.is_active = true;
      match.updated_at = updatedAt;
      seen.add(match.id);
    } else {
      db.pickup_slots.push({ id: id('slot'), shop_id: shop.id, ...slot, is_active: true, created_at: updatedAt, updated_at: updatedAt });
    }
  }

  for (const slot of existing) {
    if (!desiredKeys.has(slotKey(slot)) || seen.has(slot.id) === false) {
      slot.is_active = false;
      slot.updated_at = updatedAt;
      if (!usedSlotIds.has(slot.id)) slot.generated_from_operating_hours = true;
    }
  }
}

function parseDays(value) {
  const text = String(value || '').toLowerCase();
  const range = text.match(/(sun|mon|tue|wed|thu|fri|sat)\s*-\s*(sun|mon|tue|wed|thu|fri|sat)/);
  if (range) return expandDayRange(DAY_MAP[range[1]], DAY_MAP[range[2]]);
  return [...new Set((text.match(/sun|mon|tue|wed|thu|fri|sat/g) || []).map((day) => DAY_MAP[day]))].sort((a, b) => a - b);
}

function expandDayRange(start, end) {
  const days = [];
  let cursor = start;
  while (true) {
    days.push(cursor);
    if (cursor === end) break;
    cursor = (cursor + 1) % 7;
    if (days.length > 7) break;
  }
  return days;
}

function to24Hour(hourRaw, minuteRaw, periodRaw) {
  let hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || minute < 0 || minute > 59) return '';
  const period = String(periodRaw || '').toUpperCase();
  if (period === 'AM' && hour === 12) hour = 0;
  else if (period === 'PM' && hour < 12) hour += 12;
  if (hour < 0 || hour > 23) return '';
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function toMinutes(time) {
  const [hour, minute] = String(time).split(':').map(Number);
  return hour * 60 + minute;
}

function fromMinutes(value) {
  const hour = Math.floor(value / 60);
  const minute = value % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function slotKey(slot) {
  return `${slot.day_of_week}|${slot.start_time}|${slot.end_time}`;
}

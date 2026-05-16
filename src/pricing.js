export function calculateTotal({ pageCount, printType, copies, pricing }) {
  const price = printType === 'color' ? pricing.a4_color_price_per_page : pricing.a4_bw_price_per_page;
  return roundMoney(Number(pageCount) * Number(price) * Number(copies));
}

export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function formatMoney(value) {
  return `RM${Number(value).toFixed(2)}`;
}

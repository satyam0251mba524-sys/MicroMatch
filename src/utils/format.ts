const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const indianNumberFormatter = new Intl.NumberFormat('en-IN');

export function formatINR(amount: number): string {
  return inrFormatter.format(Math.round(amount));
}

export function formatIndianNumber(value: number): string {
  return indianNumberFormatter.format(Math.round(value));
}

export function formatFollowersCompact(followers: number): string {
  if (followers >= 1000) {
    const k = followers / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return String(followers);
}

export function calculateCommission(price: number): {
  price: number;
  platformFee: number;
  creatorPayout: number;
} {
  const platformFee = Math.round(price * 0.2);
  const creatorPayout = price - platformFee;
  return { price, platformFee, creatorPayout };
}

export function normalizeHandle(handle: string): string {
  const trimmed = handle.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

export function isValidIndianMobile(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));
}

export function formatWhatsAppHref(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

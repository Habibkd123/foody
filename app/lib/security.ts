import crypto from 'crypto';

export function getClientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '';
}

export function getUserAgent(headers: Headers): string {
  return headers.get('user-agent') || '';
}

export function ensureDeviceId(existing?: string | null): string {
  const v = typeof existing === 'string' ? existing.trim() : '';
  if (v) return v;
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return crypto.randomBytes(16).toString('hex');
}

export function ensureSessionId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return crypto.randomBytes(16).toString('hex');
}

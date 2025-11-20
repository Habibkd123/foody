type OTPRecord = {
  otp: string;
  expiresAt: number;
  verified: boolean;
};

// In-memory OTP store (resets on server restart). For production, use Redis or DB.
const store = new Map<string, OTPRecord>();

const TTL_MS = 5 * 60 * 1000; // 5 minutes

export function setOTP(email: string, otp: string) {
  store.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + TTL_MS,
    verified: false,
  });
}

export function verifyOTP(email: string, otp: string): boolean {
  const rec = store.get(email.toLowerCase());
  if (!rec) return false;
  if (Date.now() > rec.expiresAt) {
    store.delete(email.toLowerCase());
    return false;
  }
  const ok = rec.otp === otp;
  if (ok) {
    rec.verified = true;
    store.set(email.toLowerCase(), rec);
  }
  return ok;
}

export function isEmailVerified(email: string): boolean {
  const rec = store.get(email.toLowerCase());
  if (!rec) return false;
  if (Date.now() > rec.expiresAt) return false;
  return rec.verified === true;
}

export function clearOTP(email: string) {
  store.delete(email.toLowerCase());
}

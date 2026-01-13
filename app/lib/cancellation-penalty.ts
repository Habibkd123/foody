type PenaltyPolicy = {
  enabled?: boolean;
  appliesFromStatus?: 'processing' | 'shipped';
  type?: 'percent' | 'fixed';
  value?: number;
  maxAmount?: number;
};

export function computeCancellationPenaltyAmount(orderTotal: number, policy?: PenaltyPolicy) {
  if (!policy?.enabled) return 0;

  const total = Number(orderTotal || 0);
  if (!Number.isFinite(total) || total <= 0) return 0;

  const type = policy.type || 'percent';
  const value = Number(policy.value || 0);
  if (!Number.isFinite(value) || value <= 0) return 0;

  let amount = 0;
  if (type === 'fixed') {
    amount = value;
  } else {
    amount = (total * value) / 100;
  }

  const maxAmount = Number(policy.maxAmount || 0);
  if (Number.isFinite(maxAmount) && maxAmount > 0) {
    amount = Math.min(amount, maxAmount);
  }

  amount = Math.max(0, Math.min(amount, total));
  return Math.round(amount * 100) / 100;
}

export function shouldApplyCancellationPenalty(currentStatus: string, policy?: PenaltyPolicy) {
  if (!policy?.enabled) return false;
  const from = (policy.appliesFromStatus || 'processing').toLowerCase();
  const s = String(currentStatus || '').toLowerCase();

  if (from === 'shipped') {
    return s === 'shipped' || s === 'delivered';
  }

  return s === 'processing' || s === 'shipped' || s === 'delivered';
}

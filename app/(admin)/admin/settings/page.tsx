"use client";
import { useEffect, useState } from "react";

export default function AdminPaymentSettingsPage() {
  const [gateway, setGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => setGateway(d?.data?.paymentGateway === 'razorpay' ? 'razorpay' : 'stripe'))
      .catch(() => setGateway('stripe'));
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentGateway: gateway })
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.error || 'Failed to save');
      setMessage('Settings saved. Active gateway: ' + data.data.paymentGateway);
    } catch (e: any) {
      setMessage(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Payment Settings</h1>
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 max-w-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Gateway</label>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="gateway" value="stripe" checked={gateway === 'stripe'} onChange={() => setGateway('stripe')} />
            <span>Stripe</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="gateway" value="razorpay" checked={gateway === 'razorpay'} onChange={() => setGateway('razorpay')} />
            <span>Razorpay</span>
          </label>
        </div>
        <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
      </div>
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Note:</strong> Ensure these env vars are set:</p>
        <ul className="list-disc ml-6">
          <li>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY</li>
          <li>NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET</li>
        </ul>
      </div>
    </div>
  );
}

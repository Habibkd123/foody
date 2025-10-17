"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSearchParams } from 'next/navigation';

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ orderId: '', rating: 5, comment: '', contactEmail: '' });
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const oid = searchParams.get('orderId') || '';
    if (oid) {
      setForm((prev) => ({ ...prev, orderId: oid }));
    }
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('Thanks for your feedback!');
        setForm({ orderId: '', rating: 5, comment: '', contactEmail: '' });
      } else {
        setStatus(data.error || 'Failed to submit');
      }
    } catch {
      setStatus('Something went wrong');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Order Feedback</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Order ID (optional)</label>
          <Input value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} placeholder="e.g. ORD_1234" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Comments</label>
          <Textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Share your experience..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Email (optional)</label>
          <Input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="you@example.com" />
        </div>
        <div className="flex gap-3">
          <Button type="submit">Submit Feedback</Button>
        </div>
      </form>
      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
}

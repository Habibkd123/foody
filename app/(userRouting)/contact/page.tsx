"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('Message sent! We will get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus(data.error || 'Failed to submit');
      }
    } catch {
      setStatus('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">Contact Us</h1>
        <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit">Send Message</Button>
        </div>
        </form>
        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      </div>
    </div>
  );
}

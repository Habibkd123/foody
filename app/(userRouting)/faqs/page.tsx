"use client";
import { useEffect, useState } from 'react';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<Array<{ _id: string; question: string; answer: string; category?: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/faqs', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data.success) setFaqs(data.data || []);
      } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">FAQs</h1>
        <div className="space-y-4">
          {faqs.length === 0 && <p className="text-gray-600">No FAQs available yet.</p>}
          {faqs.map((f) => (
            <div key={f._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-medium">{f.question}</h3>
              <p className="text-gray-700 mt-2 whitespace-pre-line">{f.answer}</p>
              {f.category && <p className="text-xs text-gray-500 mt-1">Category: {f.category}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

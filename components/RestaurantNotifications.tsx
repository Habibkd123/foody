"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStorage } from "@/hooks/useAuth";
import { useCustomToast } from "@/hooks/useCustomToast";

function playBeep() {
  try {
    const AudioContextAny: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextAny) return;
    const ctx = new AudioContextAny();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.05;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close?.();
    }, 200);
  } catch {
    // ignore
  }
}

export default function RestaurantNotifications() {
  const { user } = useAuthStorage();
  const toast = useCustomToast();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const lowStockSeenRef = useRef<Set<string>>(new Set());
  const hydratedRef = useRef(false);

  const isApproved = !!user?.restaurant?.status && user.restaurant.status === 'approved';

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      const raw = window.localStorage.getItem('restaurant_seen_order_ids');
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        if (Array.isArray(ids)) {
          seenIdsRef.current = new Set(ids);
        }
      }
      const sound = window.localStorage.getItem('restaurant_sound_enabled');
      if (sound === '0') setSoundEnabled(false);

      const lowSeenRaw = window.localStorage.getItem('restaurant_low_stock_seen');
      if (lowSeenRaw) {
        const ids: string[] = JSON.parse(lowSeenRaw);
        if (Array.isArray(ids)) {
          lowStockSeenRef.current = new Set(ids);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('restaurant_sound_enabled', soundEnabled ? '1' : '0');
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  useEffect(() => {
    let ignore = false;

    const poll = async () => {
      if (!isApproved) return;
      try {
        const res = await fetch('/api/restaurant/orders?status=pending', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        if (!json?.success || !Array.isArray(json.data)) return;

        const incoming = json.data as any[];
        const incomingIds = incoming.map((o) => String(o?._id || '')).filter(Boolean);

        // First poll: only hydrate, don't toast
        if (seenIdsRef.current.size === 0) {
          incomingIds.forEach((id) => seenIdsRef.current.add(id));
        } else {
          const newOnes = incoming.filter((o) => {
            const id = String(o?._id || '');
            return id && !seenIdsRef.current.has(id);
          });

          if (!ignore && newOnes.length > 0) {
            const latest = newOnes[0];
            const orderNo = latest?.orderId || latest?._id;
            toast.info('New Order', `You have a new order: ${orderNo}`);
            if (soundEnabled) playBeep();

            newOnes.forEach((o) => {
              const id = String(o?._id || '');
              if (id) seenIdsRef.current.add(id);
            });
          }
        }

        // persist
        try {
          window.localStorage.setItem(
            'restaurant_seen_order_ids',
            JSON.stringify(Array.from(seenIdsRef.current).slice(0, 200))
          );
        } catch {
          // ignore
        }
      } catch {
        // ignore
      }
    };

    const pollLowStock = async () => {
      if (!isApproved) return;
      try {
        const res = await fetch('/api/restaurant/inventory/low-stock', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        if (!json?.success || !Array.isArray(json.data)) return;

        const lowItems = json.data as any[];
        for (const it of lowItems) {
          const id = String(it?._id || '');
          if (!id) continue;
          if (!lowStockSeenRef.current.has(id)) {
            lowStockSeenRef.current.add(id);
            if (!ignore) {
              toast.warning('Low Stock', `${it?.name || 'Item'} is low (${it?.quantity ?? 0} ${it?.unit || ''})`);
            }
          }
        }

        try {
          window.localStorage.setItem(
            'restaurant_low_stock_seen',
            JSON.stringify(Array.from(lowStockSeenRef.current).slice(0, 200))
          );
        } catch {
          // ignore
        }
      } catch {
        // ignore
      }
    };

    poll();
    pollLowStock();
    const t = setInterval(poll, 12000);
    const t2 = setInterval(pollLowStock, 30000);
    return () => {
      ignore = true;
      clearInterval(t);
      clearInterval(t2);
    };
  }, [isApproved, soundEnabled]);

  if (!isApproved) return null;

  return (
    <button
      type="button"
      onClick={() => setSoundEnabled((v) => !v)}
      className="fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 text-xs text-gray-700 dark:text-gray-200 shadow"
      title="Toggle new order sound"
    >
      Sound: {soundEnabled ? 'On' : 'Off'}
    </button>
  );
}

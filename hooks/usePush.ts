import { useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = typeof window !== 'undefined' ? window.atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export function usePush(userId?: string) {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSupported('serviceWorker' in navigator && 'PushManager' in window);
  }, []);

  const register = async () => {
    try {
      if (!supported) throw new Error('Push not supported');
      // register service worker
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) throw new Error('Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY');

      // request permission
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') throw new Error('Permission denied');

      // subscribe
      const existing = await reg.pushManager.getSubscription();
      const subscription = existing || (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      }));

      // save subscription
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userId, subscription }),
      });

      setSubscribed(true);
      return true;
    } catch (e: any) {
      setError(e?.message || 'Failed to subscribe');
      return false;
    }
  };

  return { supported, subscribed, register, error };
}

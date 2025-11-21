import { useEffect, useState } from 'react';

export function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).google?.maps) {
      setLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
      return;
    }

    const existing = document.getElementById('gmaps');
    if (existing) return; // another component is loading it

    const script = document.createElement('script');
    script.id = 'gmaps';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);
  }, []);

  return { loaded, error };
}

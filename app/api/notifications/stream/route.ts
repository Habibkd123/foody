import { NextRequest } from 'next/server';
import { notificationsBroadcaster } from '@/lib/notifications-sse';

export async function GET(_req: NextRequest) {
  const encoder = new TextEncoder();
  let keepAlive: ReturnType<typeof setInterval> | null = null;
  let unsubscribe: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // If enqueue fails, rely on cancel() cleanup
        }
      };

      // Initial ping
      send({ type: 'ping', ts: Date.now() });

      // Subscribe to broadcaster
      unsubscribe = notificationsBroadcaster.subscribe((evt) => {
        send(evt);
      });

      // Heartbeat
      keepAlive = setInterval(() => {
        send({ type: 'heartbeat', ts: Date.now() });
      }, 30000);
    },
    cancel() {
      if (keepAlive) {
        clearInterval(keepAlive);
        keepAlive = null;
      }
      if (unsubscribe) {
        try { unsubscribe(); } catch {}
        unsubscribe = null;
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

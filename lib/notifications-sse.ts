type Subscriber = (event: any) => void;

class NotificationsBroadcaster {
  private subscribers: Set<Subscriber> = new Set();

  subscribe(fn: Subscriber) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  emit(event: any) {
    for (const fn of this.subscribers) {
      try { fn(event); } catch { /* noop */ }
    }
  }
}

// Singleton in module scope (works across route handlers in same runtime)
export const notificationsBroadcaster = new NotificationsBroadcaster();

export function notifySubscribers(event: any) {
  notificationsBroadcaster.emit(event);
}

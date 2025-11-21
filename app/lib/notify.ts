export async function sendOrderStatusEmail(opts: {
  to?: string | null;
  orderId: string;
  status: string;
}) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || 'Gro Delivery <no-reply@gro.delivery>';
    if (!apiKey || !opts.to) return false;

    const subject = `Your order ${opts.orderId} is now ${opts.status}`;
    const html = `<p>Hello,</p><p>Your order <strong>${opts.orderId}</strong> status changed to <strong>${opts.status}</strong>.</p>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: opts.to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendPushNotificationBulk(_opts: {
  title: string;
  body: string;
  url?: string;
  userId?: string;
}) {
  // Placeholder: implement web-push when keys and dependency are available
  return false;
}

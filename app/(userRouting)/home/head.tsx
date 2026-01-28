export default function Head() {
  const baseUrlRaw =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  const baseUrl = baseUrlRaw.replace(/\/$/, '');
  const title = 'Gro-Delivery — Fresh Groceries, Faster Delivery';
  const description = 'Order daily essentials and modern milkshakes with lightning-fast delivery. Great prices, fresh products, and an effortless experience.';
  const canonical = `${baseUrl}/home`;
  const ogImage = '/logoGro.png';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="groceries, milkshake, food delivery, fresh, online grocery, quick delivery" />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content="index,follow" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Gro-Delivery" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}

import { removeExpiredPromotions } from '../../lib/session-expiry.mjs';

export default async function sessionPromotionExpiry(request, context) {
  const path = new URL(request.url).pathname;
  if (!['GET', 'HEAD'].includes(request.method) || /\/[^/]+\.[^/]+$/.test(path)
      || /^\/(?:api|\.netlify|\.well-known)\//.test(path)) return;
  // next() deliberately uses a full origin body, including on conditional requests.
  const response = await context.next();
  if (!response.headers.get('content-type')?.includes('text/html') || response.status !== 200) return response;
  const html = removeExpiredPromotions(await response.text());
  const headers = new Headers(response.headers);
  // A cached pre-deadline response must never survive a deadline at the CDN/browser.
  for (const name of ['etag', 'last-modified', 'content-length', 'content-encoding', 'expires']) headers.delete(name);
  for (const name of ['cache-control', 'cdn-cache-control', 'netlify-cdn-cache-control']) headers.set(name, 'no-store');
  headers.set('x-session-promotion-expiry', 'end-time-v1');
  return new Response(request.method === 'HEAD' ? null : html, { status: response.status, headers });
}

export const config = { path: '/*' };

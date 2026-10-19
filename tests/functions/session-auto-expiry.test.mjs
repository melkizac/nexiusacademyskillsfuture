import assert from 'node:assert/strict';
import test from 'node:test';
import { promotionDeadline, removeExpiredPromotions, watchExpiry } from '../../lib/session-expiry.mjs';
import handler from '../../netlify/edge-functions/session-promotion-expiry.js';

const end = '2026-10-17T12:00:00+08:00';
const cutoff = promotionDeadline(end);
const promo = `<session-promotion data-session-id="test" data-expires-at="${end}" style="display:contents"><section><div><a href="/workshops/test/">REGISTER NOW</a></div></section></session-promotion>`;

test('server removes a cached promotion at the exact end, retaining other content', () => {
  const page = `<main><h1>Current courses</h1>${promo}<p>November</p></main>`;
  assert.equal(removeExpiredPromotions(page, cutoff - 1), page);
  assert.equal(removeExpiredPromotions(page, cutoff), '<main><h1>Current courses</h1><p>November</p></main>');
  assert.equal(removeExpiredPromotions(page, cutoff + 86400000), removeExpiredPromotions(page, cutoff));
  assert.equal(cutoff, Date.parse('2026-10-17T04:00:00Z'));
});
test('missing, timezone-free and impossible dates fail closed', () => {
  for (const value of ['', '2026-10-17T12:00:00Z', '2026-02-30T12:00:00+08:00']) assert.throws(() => promotionDeadline(value));
  assert.equal(removeExpiredPromotions('<session-promotion>Hidden</session-promotion>', cutoff), '');
});
test('open-page timer fires at the cutoff without a new request and can be cancelled', () => {
  let now = cutoff - 1000, pending, fired = 0, cleared = false;
  const stop = watchExpiry(end, () => fired++, { now: () => now, setTimer: (cb, delay) => { pending = { cb, delay }; return 7; }, clearTimer: token => { assert.equal(token, 7); cleared = true; } });
  assert.equal(pending.delay, 1000); assert.equal(fired, 0);
  now = cutoff; pending.cb(); assert.equal(fired, 1);
  stop(); assert.equal(cleared, true); pending.cb(); assert.equal(fired, 1);
});
test('long waits do not overflow and already-expired sessions disappear immediately', () => {
  let delay, fired = 0;
  watchExpiry(end, () => fired++, { now: () => cutoff - 3000000000, setTimer: (_, ms) => { delay = ms; return 1; } });
  assert.equal(delay, 2147483647);
  watchExpiry(end, () => fired++, { now: () => cutoff, setTimer: () => assert.fail('No wait for expired session') });
  assert.equal(fired, 1);
});
test('edge transforms stale HTML, disables caching and preserves security headers', async () => {
  const headers = { 'content-type': 'text/html', 'cache-control': 'public,max-age=31536000', etag: 'old', 'content-security-policy': "default-src 'self'" };
  const r = await handler(new Request('https://academy.nexiuslabs.com/', { headers: { 'if-none-match': 'old' } }), { next: async () => new Response(`<main>${promo}<p>Keep me</p></main>`, { headers }) });
  assert.equal(await r.text(), '<main><p>Keep me</p></main>');
  for (const h of ['cache-control', 'cdn-cache-control', 'netlify-cdn-cache-control']) assert.equal(r.headers.get(h), 'no-store');
  assert.equal(r.headers.get('etag'), null);
  assert.equal(r.headers.get('content-security-policy'), headers['content-security-policy']);
  assert.equal(r.headers.get('x-session-promotion-expiry'), 'end-time-v1');
});
test('edge leaves assets, APIs, POSTs and non-HTML responses alone', async () => {
  for (const [path, method] of [['/assets/app.js', 'GET'], ['/api/lead', 'POST'], ['/workshops/test/', 'POST']]) {
    assert.equal(await handler(new Request('https://example.com' + path, { method }), { next: () => assert.fail('Unexpected origin call') }), undefined);
  }
  const r = new Response('plain', { headers: { 'content-type': 'text/plain' } });
  assert.equal(await handler(new Request('https://example.com/'), { next: async () => r }), r);
});

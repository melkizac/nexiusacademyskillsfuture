import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const ORIGIN = 'https://academy.nexiuslabs.com';
const normalize = (path) => path.replace(/\/$/, '') || '/';
const body = (html) => (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html)
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const text = (html) => body(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export function validateEvents(manifest) {
  if (manifest.version !== 1 || !Array.isArray(manifest.events)) throw new Error('Invalid workshop promotion registry');
  const paths = new Set();
  for (const event of manifest.events) {
    if (!event.id || !/^\/workshops\/[a-z0-9-]+$/.test(event.path || '') || paths.has(event.path)
        || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/.test(event.registrationClosesAt || '')
        || !Number.isFinite(Date.parse(event.registrationClosesAt)) || !event.authority
        || !Array.isArray(event.promotionMarkers) || !event.promotionMarkers.length
        || event.promotionMarkers.some(marker => typeof marker !== 'string' || !marker.trim())) {
      throw new Error(`Missing or invalid verified expiry for workshop ${event.id || event.path || '(unknown)'}`);
    }
    paths.add(event.path);
  }
  return manifest.events;
}

export const isExpired = (event, now) => now >= Date.parse(event.registrationClosesAt);

export function auditHome(html, events, now) {
  const errors = [];
  const content = body(html);
  for (const match of content.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const url = new URL(match[1].replace(/&amp;/g, '&'), ORIGIN);
    if (url.origin !== ORIGIN || !url.pathname.startsWith('/workshops/')) continue;
    const event = events.find(item => item.path === normalize(url.pathname));
    if (!event) errors.push(`Homepage workshop ${url.pathname} has no verified expiry in public/workshop-promotions.json`);
    else if (isExpired(event, now)) errors.push(`Homepage still links to expired workshop ${event.id}`);
  }
  for (const event of events.filter(item => isExpired(item, now))) {
    if (event.promotionMarkers.some(marker => content.toLowerCase().includes(marker.toLowerCase()))) {
      errors.push(`Homepage still promotes expired workshop ${event.id}`);
    }
  }
  return errors;
}

export function auditEvent(html, event, now) {
  if (!isExpired(event, now)) return [];
  const errors = [];
  const content = body(html);
  const readable = text(html);
  if (!/registration\s+(?:is\s+)?closed/i.test(readable) || !/(?:event|workshop|session)\s+(?:has\s+)?ended|past\s+event/i.test(readable)) {
    errors.push(`${event.id}: expired event must clearly say it has ended and registration is closed`);
  }
  if (/<form\b|<input\b|\btype=["']submit["']|href=["'][^"']*#registration\b/i.test(content)
      || /register\s+now|reserve\s+(?:your\s+)?seat|seats\s+are\s+limited/i.test(readable)) {
    errors.push(`${event.id}: expired event still accepts or promotes registration`);
  }
  if (/schema\.org\/InStock/.test(html)) errors.push(`${event.id}: expired event has an available structured offer`);
  return errors;
}

export async function checkExpiry({ live = false, root = new URL('../', import.meta.url), now = Date.now() } = {}) {
  const load = async (route) => {
    if (!live) return readFile(new URL(`dist/${route === '/' ? '' : route.slice(1) + '/'}index.html`, root), 'utf8');
    const response = await fetch(`${ORIGIN}${route === '/' ? '/' : route + '/'}`, { signal: AbortSignal.timeout(30000), headers: { 'cache-control': 'no-cache' } });
    if (!response.ok) throw new Error(`Public expiry check ${route}: HTTP ${response.status}`);
    return response.text();
  };
  const manifest = JSON.parse(await readFile(new URL('public/workshop-promotions.json', root), 'utf8'));
  const events = validateEvents(manifest);
  // The public copy is verified too: a stale local checkout cannot silently omit a newly deployed event.
  if (live) {
    const response = await fetch(`${ORIGIN}/workshop-promotions.json`, { signal: AbortSignal.timeout(30000), headers: { 'cache-control': 'no-cache' } });
    if (!response.ok) throw new Error(`Public promotion registry: HTTP ${response.status}`);
    const deployed = validateEvents(await response.json());
    if (JSON.stringify(events) !== JSON.stringify(deployed)) throw new Error('Local and deployed workshop registries differ; reconcile exact deployment before repair');
  }
  const errors = auditHome(await load('/'), events, now);
  for (const event of events.filter(item => isExpired(item, now))) errors.push(...auditEvent(await load(event.path), event, now));
  if (errors.length) throw new Error(errors.join('\n'));
  return { mode: live ? 'live' : 'build', checkedAt: new Date(now).toISOString(), registered: events.length, expired: events.filter(item => isExpired(item, now)).length, status: 'PASS' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  checkExpiry({ live: process.argv.includes('--live') }).then(result => console.log(JSON.stringify(result)))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}

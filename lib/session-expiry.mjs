export function promotionDeadline(endsAt) {
  const ms = Date.parse(endsAt);
  if (typeof endsAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/.test(endsAt)
      || !Number.isFinite(ms)
      || new Date(ms + 8 * 3600000).toISOString().slice(0, 19) !== endsAt.slice(0, 19)) {
    throw new Error('Session requires a verified end time with +08:00 Singapore offset');
  }
  return ms;
}

// Reschedule long waits instead of overflowing the browser's signed 32-bit timeout.
export function watchExpiry(endsAt, onExpire, { now = Date.now, setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  const deadline = promotionDeadline(endsAt);
  let timer;
  let stopped = false;
  const check = () => {
    if (stopped) return;
    const remaining = deadline - now();
    if (remaining <= 0) { stopped = true; onExpire(); return; }
    timer = setTimer(check, Math.min(remaining, 2147483647));
  };
  check();
  return () => { stopped = true; if (timer !== undefined) clearTimer(timer); };
}

// A dedicated, non-nested custom element is the boundary shared by React and the edge.
// Invalid/missing deadlines fail closed. No arbitrary HTML is executed or interpreted.
export function removeExpiredPromotions(html, now = Date.now()) {
  return html.replace(/<session-promotion\b([^>]*)>[\s\S]*?<\/session-promotion\s*>/gi, (block, attrs) => {
    const endsAt = attrs.match(/\bdata-expires-at=["']([^"']+)["']/i)?.[1];
    try { return now < promotionDeadline(endsAt) ? block : ''; }
    catch { return ''; }
  });
}

import React, { useEffect, useState } from 'react';
import manifest from '../../lib/workshop-promotions.generated.json';
import { promotionDeadline, watchExpiry } from '../../lib/session-expiry.mjs';

/** All dated session cards, banners and registration promotions use this boundary. */
export default function SessionPromotion({ eventId, children }: { eventId: string; children: React.ReactNode }) {
  const event = manifest.events.find(item => item.id === eventId);
  if (!event) throw new Error(`Session ${eventId} needs a verified end time in workshop-promotions.json`);
  const endsAt = event.endsAt;
  const deadline = promotionDeadline(endsAt);
  const [active, setActive] = useState(() => Date.now() < deadline);

  useEffect(() => {
    const check = () => setActive(Date.now() < deadline);
    check();
    const stop = watchExpiry(endsAt, () => setActive(false));
    document.addEventListener('visibilitychange', check);
    window.addEventListener('pageshow', check);
    window.addEventListener('focus', check);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('pageshow', check);
      window.removeEventListener('focus', check);
    };
  }, [deadline, endsAt]);

  if (!active || Date.now() >= deadline) return null;
  return React.createElement('session-promotion', {
    'data-session-id': eventId,
    'data-expires-at': endsAt,
    style: { display: 'contents' },
  }, children);
}

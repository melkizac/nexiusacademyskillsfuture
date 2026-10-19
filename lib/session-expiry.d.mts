export function promotionDeadline(endsAt: string): number;
export function removeExpiredPromotions(html: string, now?: number): string;
export function watchExpiry(endsAt: string, onExpire: () => void, options?: {
  now?: () => number;
  setTimer?: (callback: () => void, delay: number) => unknown;
  clearTimer?: (handle: unknown) => void;
}): () => void;

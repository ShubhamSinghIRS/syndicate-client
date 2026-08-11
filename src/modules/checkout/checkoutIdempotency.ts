const CHECKOUT_IDEMPOTENCY_KEY = "checkoutIdempotencyKey";

// sessionStorage (not component state) so a page refresh mid-checkout reuses
// the same key instead of minting a new one - the backend uses it to return
// the existing order/gateway order instead of creating a duplicate.
export const getCheckoutIdempotencyKey = (): string => {
  const existing = sessionStorage.getItem(CHECKOUT_IDEMPOTENCY_KEY);
  if (existing) return existing;
  const fresh = crypto.randomUUID();
  sessionStorage.setItem(CHECKOUT_IDEMPOTENCY_KEY, fresh);
  return fresh;
};

export const clearCheckoutIdempotencyKey = (): void => {
  sessionStorage.removeItem(CHECKOUT_IDEMPOTENCY_KEY);
};

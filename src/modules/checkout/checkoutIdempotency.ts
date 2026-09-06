const CHECKOUT_IDEMPOTENCY_KEY = "checkoutIdempotencyKey";
const CHECKOUT_ITEMS_FINGERPRINT_KEY = "checkoutItemsFingerprint";

const fingerprintItems = (itemIds: string[]): string => [...itemIds].sort().join(",");

// Scoped to which items are being checked out, so a different item set always gets a fresh key.
export const getCheckoutIdempotencyKey = (itemIds: string[]): string => {
  const fingerprint = fingerprintItems(itemIds);
  const storedKey = sessionStorage.getItem(CHECKOUT_IDEMPOTENCY_KEY);
  const storedFingerprint = sessionStorage.getItem(CHECKOUT_ITEMS_FINGERPRINT_KEY);

  if (storedKey && storedFingerprint === fingerprint) {
    return storedKey;
  }

  const fresh = crypto.randomUUID();
  sessionStorage.setItem(CHECKOUT_IDEMPOTENCY_KEY, fresh);
  sessionStorage.setItem(CHECKOUT_ITEMS_FINGERPRINT_KEY, fingerprint);
  return fresh;
};

export const clearCheckoutIdempotencyKey = (): void => {
  sessionStorage.removeItem(CHECKOUT_IDEMPOTENCY_KEY);
  sessionStorage.removeItem(CHECKOUT_ITEMS_FINGERPRINT_KEY);
};

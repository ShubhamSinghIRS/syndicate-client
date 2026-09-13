// Only currency this app charges in today.
export const CURRENCY_CODE = "USD";

// Razorpay checkout modal identity/description.
export const RAZORPAY_MERCHANT_NAME = "Infollion";
export const RAZORPAY_PAYMENT_DESCRIPTION = "Transcript purchase";

export const CHECKOUT_HEADING = "Checkout";
export const BACK_TO_TRANSCRIPTS_LABEL = "Back To Transcripts";
export const BACK_TO_CART_LABEL = "Back To Cart";
export const BROWSE_TRANSCRIPTS_LABEL = "Browse Transcripts";

export const ALREADY_OWNED_SINGLE_MESSAGE =
  "One item was removed from checkout - you already own it.";
export const alreadyOwnedPluralMessage = (count: number): string =>
  `${count} items were removed from checkout - you already own them.`;

export const ORDER_PLACED_MESSAGE = "Order placed successfully.";

export const BUY_NOW_OWNED_HEADING = "You already own this transcript";
export const BUY_NOW_OWNED_BODY =
  "It's already in your library - no need to purchase it again.";
export const CART_EMPTY_HEADING = "Nothing to check out";
export const CART_EMPTY_BODY =
  "Your cart is empty. Browse our library of verified expert transcripts and add a few to get started.";

export const PAYMENT_VERIFY_FAILED_MESSAGE =
  "We couldn't confirm your payment. If you were charged, please contact support.";
export const RAZORPAY_LOAD_FAILED_MESSAGE =
  "Payment gateway failed to load. If you're using an ad blocker or privacy extension, try disabling it for this site, then refresh and try again.";
export const PAYMENT_START_FAILED_MESSAGE =
  "We couldn't start the payment. Please try again.";

// Order confirmation
export const ORDER_CONFIRMED_HEADING = "Purchase Confirmed";
export const RECEIPT_EMAILED_MESSAGE = "A receipt has been sent to your email.";
export const DOWNLOAD_RECEIPT_LABEL = "Download Receipt";
export const VIEW_TRANSCRIPT_LABEL = "View Transcript";
export const VIEW_MY_PURCHASE_LABEL = "View My Purchase";
export const DATE_LABEL = "Date";
export const AMOUNT_PAID_LABEL = "Amount Paid";
export const ORDER_DATE_LOCALE = "en-US";

// Order details/summary
export const PURCHASE_DETAILS_HEADING = "Purchase details";
export const PURCHASE_SUMMARY_HEADING = "Purchase summary";
export const TOTAL_LABEL = "Total";
export const PAY_NOW_LABEL = "Pay Now";
export const subtotalLabel = (itemCount: number): string =>
  `Subtotal (${itemCount} ${itemCount === 1 ? "transcript" : "transcripts"})`;

// Payment processing overlay
export const PAYMENT_PROCESSING_SLOW_THRESHOLD_MS = 8000;
export const PAYMENT_CONFIRMING_HEADING = "Confirming your payment...";
export const PAYMENT_CONFIRMING_BODY = "Please do not refresh or close this window.";
export const PAYMENT_SLOW_MESSAGE =
  "This is taking longer than usual. If you were charged, your order will be confirmed automatically once we hear back - otherwise you'll be refunded.";

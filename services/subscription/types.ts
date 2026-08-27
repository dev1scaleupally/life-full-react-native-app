/**
 * Shapes for section 6 (Subscription, Access & Domain Unlock). Kept separate
 * from services/api/types.ts the same way services/auth/types.ts is: these
 * mirror what a real /v1 entitlement endpoint would return, but nothing here
 * is backed by a real backend yet — see subscriptionService.ts.
 */

export type PlanId = 'lifefull_monthly' | 'lifefull_quarterly' | 'lifefull_half_year';

export type Plan = {
  id: PlanId;
  name: string;
  /** USD, one purchase at this cadence. */
  price: number;
  /** Billing cadence in months (1 = monthly, 3 = quarterly, 6 = half-year). */
  periodMonths: number;
};

/**
 * 'none' — never subscribed, trial still available (spec 6.1's 7-day trial).
 * 'trialing' — inside the free trial window.
 * 'active' — a live, paid subscription.
 * 'expired' | 'canceled' — previously subscribed, lapsed; trial is not
 * re-offered (spec 6.2's "Lapsed customer" state).
 */
export type EntitlementStatus = 'none' | 'trialing' | 'active' | 'expired' | 'canceled';

export type Entitlement = {
  status: EntitlementStatus;
  planId: PlanId | null;
  /** ISO date the current period (trial or paid) renews or ends. */
  renewsAt: string | null;
  trialEndsAt: string | null;
};

/** 'declined' is a StoreKit/Play Billing-level rejection (spec's "payment
 * failure" state) — the sheet stays open, the plan stays selected, and the
 * primary action becomes "Try again". 'generic' is anything else (network,
 * unexpected). */
export type PurchaseError = { kind: 'declined' | 'generic'; message: string };

/** 'not_found' means the store account genuinely carries no Lifefull
 * subscription (spec's "Restore purchase failure" state) — the likely cause
 * (a different account) is stated as fact, not treated as an error the
 * person caused. 'generic' is anything else. */
export type RestoreError = { kind: 'not_found' | 'generic'; message: string };

import type { Plan, PlanId } from './types';

/** Spec 6.1's three in-app subscription plans. Prices follow the written
 * pricing table exactly — a mockup floating around for this feature showed
 * Quarterly at $34.99, but that number only exists to make its own "Save
 * 22%" badge look round; it doesn't match the spec, so it isn't used here. */
export const PLANS: Plan[] = [
  { id: 'lifefull_monthly', name: 'Lifefull Monthly', price: 14.99, periodMonths: 1 },
  { id: 'lifefull_quarterly', name: 'Lifefull Quarterly', price: 39.99, periodMonths: 3 },
  { id: 'lifefull_half_year', name: 'Lifefull Half-Year', price: 59.99, periodMonths: 6 },
];

export const plansById: Record<PlanId, Plan> = Object.fromEntries(
  PLANS.map(plan => [plan.id, plan]),
) as Record<PlanId, Plan>;

/** The trial is offered on Monthly only (spec 6.1's "Lifefull Monthly ...
 * Free for 7 days" — the compact paywall sheet always shows this plan). */
export const TRIAL_PLAN = plansById.lifefull_monthly;

export function monthlyEquivalent(plan: Plan): number {
  return plan.price / plan.periodMonths;
}

/** Percent saved vs. paying for `baseline` (Monthly) every month for the
 * same stretch of time — this is what drives the "Save 11%" / "Save 33%"
 * badges in the expanded plan list, always derived from the real prices
 * above so it can never drift out of sync with them. */
export function savingsPct(plan: Plan, baseline: Plan = TRIAL_PLAN): number {
  if (plan.id === baseline.id) return 0;
  const full = monthlyEquivalent(baseline) * plan.periodMonths;
  return Math.round(((full - plan.price) / full) * 100);
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function billingPeriodLabel(plan: Plan): string {
  if (plan.periodMonths === 1) return 'monthly';
  if (plan.periodMonths === 3) return 'every 3 months';
  if (plan.periodMonths === 6) return 'every 6 months';
  return `every ${plan.periodMonths} months`;
}

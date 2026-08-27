/**
 * MOCK subscription backend. Persists entitlement in AsyncStorage and fakes
 * store latency, the same pattern as services/auth/authService.ts — every
 * paywall state (trial, purchase, restore, lapsed) is fully exercisable
 * end to end without a real StoreKit/Play Billing integration or backend.
 *
 * Replace every function body here with a real network call (receipt
 * validation + a GET entitlement endpoint, per spec 6.1/6.2) once the
 * backend exists; keep the signatures, since the redux saga only ever
 * imports from this module.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storage';
import { TRIAL_PLAN } from './plans';
import type { Entitlement, PlanId, PurchaseError, RestoreError } from './types';

const TRIAL_DAYS = 7;

function delay(ms = 900): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const EMPTY_ENTITLEMENT: Entitlement = {
  status: 'none',
  planId: null,
  renewsAt: null,
  trialEndsAt: null,
};

async function readEntitlement(): Promise<Entitlement> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.mockEntitlement);
  return raw ? (JSON.parse(raw) as Entitlement) : EMPTY_ENTITLEMENT;
}

async function writeEntitlement(entitlement: Entitlement): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.mockEntitlement, JSON.stringify(entitlement));
}

function addDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

/** GET entitlement — checked on launch/foreground/gating points per spec 6.2. */
async function getEntitlement(): Promise<Entitlement> {
  await delay(400);
  return readEntitlement();
}

/**
 * Starts the store's native purchase sheet for `planId`. The trial (spec
 * 6.1's 7-day free trial) only ever applies to the Monthly plan, and only
 * the first time — a lapsed account renewing gets a normal paid period, not
 * a second trial (spec's "Lapsed customer" state).
 *
 * A real StoreKit/Play Billing decline is a store-level event this mock
 * can't honestly fabricate, so purchase always succeeds — the PurchaseError
 * type and the paywall's "Try again" UI exist for when a real IAP layer
 * replaces this and can actually reject.
 */
async function purchase(planId: PlanId): Promise<Entitlement> {
  await delay(1200);
  const current = await readEntitlement();
  const isFirstEverSubscription = current.status === 'none';
  const startingTrial = isFirstEverSubscription && planId === TRIAL_PLAN.id;
  const entitlement: Entitlement = startingTrial
    ? {
        status: 'trialing',
        planId,
        trialEndsAt: addDays(TRIAL_DAYS),
        renewsAt: addDays(TRIAL_DAYS),
      }
    : { status: 'active', planId, renewsAt: addDays(30), trialEndsAt: null };
  await writeEntitlement(entitlement);
  return entitlement;
}

/**
 * Restore Purchases — asks the store which subscription this account
 * carries. Genuinely returns `not_found` when nothing was ever purchased in
 * this mock store (a fresh install, or an account that never subscribed);
 * genuinely returns the live entitlement otherwise.
 */
async function restore(): Promise<Entitlement> {
  await delay(900);
  const entitlement = await readEntitlement();
  if (entitlement.status === 'none') {
    const error: RestoreError = {
      kind: 'not_found',
      message: 'No active Lifefull subscription was found on this store account.',
    };
    throw error;
  }
  return entitlement;
}

/** Test-only — not wired to any screen. Lets a lapsed/expired paywall state
 * be exercised without waiting for real calendar time to pass (there's no
 * background renewal job in this mock, same as real cancellation happening
 * outside the app in the store's own settings). Call from a debugger
 * console: `subscriptionService.__setEntitlementForTesting({status:
 * 'expired', planId: 'lifefull_monthly', renewsAt: null, trialEndsAt:
 * null})`. */
async function __setEntitlementForTesting(entitlement: Entitlement): Promise<void> {
  await writeEntitlement(entitlement);
}

export const subscriptionService = {
  getEntitlement,
  purchase,
  restore,
  __setEntitlementForTesting,
};

export type { PurchaseError, RestoreError };

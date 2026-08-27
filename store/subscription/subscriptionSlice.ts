import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TRIAL_PLAN } from '../../services/subscription/plans';
import type {
  Entitlement,
  PlanId,
  PurchaseError,
  RestoreError,
} from '../../services/subscription/types';

export type SubscriptionState = {
  entitlement: Entitlement | null;
  entitlementStatus: 'idle' | 'loading' | 'error';
  entitlementError: string | null;

  /** Which plan is highlighted in the plan picker — defaults to the trial
   * plan (spec 6.1's compact sheet always leads with Monthly). */
  selectedPlanId: PlanId;

  purchaseStatus: 'idle' | 'loading' | 'error';
  purchaseError: PurchaseError | null;

  restoreStatus: 'idle' | 'loading' | 'error';
  restoreError: RestoreError | null;
};

const initialState: SubscriptionState = {
  entitlement: null,
  entitlementStatus: 'idle',
  entitlementError: null,
  selectedPlanId: TRIAL_PLAN.id,
  purchaseStatus: 'idle',
  purchaseError: null,
  restoreStatus: 'idle',
  restoreError: null,
};

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    entitlementRequested: state => {
      state.entitlementStatus = 'loading';
      state.entitlementError = null;
    },
    entitlementSucceeded: (state, action: PayloadAction<Entitlement>) => {
      state.entitlementStatus = 'idle';
      state.entitlement = action.payload;
    },
    entitlementFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.entitlementStatus = 'error';
      state.entitlementError = action.payload.message;
    },

    planSelected: (state, action: PayloadAction<PlanId>) => {
      state.selectedPlanId = action.payload;
    },

    purchaseRequested: (state, _action: PayloadAction<{ planId: PlanId }>) => {
      state.purchaseStatus = 'loading';
      state.purchaseError = null;
    },
    /** The declined charge keeps everything else on screen — the plan
     * selection above is untouched, and the sheet stays open (spec's
     * "Payment failure" state: "nothing was charged... the plan is still
     * selected"). */
    purchaseSucceeded: (state, action: PayloadAction<Entitlement>) => {
      state.purchaseStatus = 'idle';
      state.entitlement = action.payload;
    },
    purchaseFailed: (state, action: PayloadAction<PurchaseError>) => {
      state.purchaseStatus = 'error';
      state.purchaseError = action.payload;
    },
    /** Clears a purchase error without touching the selected plan — the
     * sheet's "Cancel" link under "Try again". */
    purchaseErrorDismissed: state => {
      state.purchaseStatus = 'idle';
      state.purchaseError = null;
    },

    restoreRequested: state => {
      state.restoreStatus = 'loading';
      state.restoreError = null;
    },
    restoreSucceeded: (state, action: PayloadAction<Entitlement>) => {
      state.restoreStatus = 'idle';
      state.entitlement = action.payload;
    },
    restoreFailed: (state, action: PayloadAction<RestoreError>) => {
      state.restoreStatus = 'error';
      state.restoreError = action.payload;
    },
    /** "Check again" / closing the restore-failure sheet. */
    restoreErrorDismissed: state => {
      state.restoreStatus = 'idle';
      state.restoreError = null;
    },
  },
});

export const subscriptionActions = subscriptionSlice.actions;

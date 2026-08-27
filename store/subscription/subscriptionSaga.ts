import { call, put, takeLatest } from 'redux-saga/effects';
import { subscriptionService } from '../../services/subscription/subscriptionService';
import type { Entitlement, PlanId, PurchaseError, RestoreError } from '../../services/subscription/types';
import { subscriptionActions } from './subscriptionSlice';

function asPurchaseError(err: unknown): PurchaseError {
  if (err && typeof err === 'object' && 'kind' in err) return err as PurchaseError;
  return { kind: 'generic', message: 'Something went wrong. Please try again.' };
}

function asRestoreError(err: unknown): RestoreError {
  if (err && typeof err === 'object' && 'kind' in err) return err as RestoreError;
  return { kind: 'generic', message: 'Something went wrong. Please try again.' };
}

function* handleEntitlementRequested() {
  try {
    const entitlement: Entitlement = yield call(subscriptionService.getEntitlement);
    yield put(subscriptionActions.entitlementSucceeded(entitlement));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    yield put(subscriptionActions.entitlementFailed({ message }));
  }
}

function* handlePurchaseRequested(action: ReturnType<typeof subscriptionActions.purchaseRequested>) {
  try {
    const planId: PlanId = action.payload.planId;
    const entitlement: Entitlement = yield call(subscriptionService.purchase, planId);
    yield put(subscriptionActions.purchaseSucceeded(entitlement));
  } catch (err) {
    yield put(subscriptionActions.purchaseFailed(asPurchaseError(err)));
  }
}

function* handleRestoreRequested() {
  try {
    const entitlement: Entitlement = yield call(subscriptionService.restore);
    yield put(subscriptionActions.restoreSucceeded(entitlement));
  } catch (err) {
    yield put(subscriptionActions.restoreFailed(asRestoreError(err)));
  }
}

export function* subscriptionSaga() {
  yield takeLatest(subscriptionActions.entitlementRequested.type, handleEntitlementRequested);
  yield takeLatest(subscriptionActions.purchaseRequested.type, handlePurchaseRequested);
  yield takeLatest(subscriptionActions.restoreRequested.type, handleRestoreRequested);
}

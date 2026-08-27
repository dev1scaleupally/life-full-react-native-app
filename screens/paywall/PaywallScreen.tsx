import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ACCOUNT_DELETE_ITEMS, DestructiveConfirmSheet } from '../../components/DestructiveConfirmSheet';
import { BellIcon } from '../../components/icons/BellIcon';
import { ChevronLeft } from '../../components/icons/ChevronLeft';
import { ClockIcon } from '../../components/icons/ClockIcon';
import { CompassIcon } from '../../components/icons/CompassIcon';
import { Icon } from '../../components/icons/Icons';
import { Mark } from '../../components/Mark';
import { BodyText, Heading } from '../../components/Typography';
import { plansById, TRIAL_PLAN } from '../../services/subscription/plans';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { subscriptionActions } from '../../store/subscription/subscriptionSlice';
import { CompactPlanSheet, PlanListSheet } from './PlanPickerSheet';

export type PaywallScreenProps = {
  /** Entitlement is now active (fresh purchase, restore, or was already
   * active) — proceed. */
  onContinue: () => void;
  /** Header back chevron — only passed when this paywall can be backed out
   * of without subscribing (Settings' Subscription row; spec 6.2: "Settings
   * remains reachable without an entitlement"). Omitted for the hard
   * first-run gate right after onboarding. */
  onBack?: () => void;
  onDeleteAccount: () => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const FEATURES = [
  { icon: CompassIcon, text: 'Guided discovery sessions through major life domains' },
  { icon: BellIcon, text: 'From commitment to review of real-world actions' },
  { icon: ClockIcon, text: 'Paced progress for a digestible transition in retirement' },
];

type SheetView = 'purchase' | 'restore';

/**
 * Section 6's commercial gate. All five dynamic states from the design
 * (trial offer, payment failure, restore failure, already subscribed,
 * lapsed customer) are one screen driven entirely by `entitlement.status` —
 * see store/subscription/subscriptionSlice.ts. A successful purchase or
 * restore doesn't jump straight past the paywall; it just re-renders this
 * same screen into its "already subscribed" state, same as reaching the
 * gate with a live plan does — one "Continue to Lifefull" button either way.
 */
export function PaywallScreen({ onContinue, onBack, onDeleteAccount }: PaywallScreenProps) {
  const dispatch = useAppDispatch();
  const entitlement = useAppSelector(state => state.subscription.entitlement);
  const entitlementStatus = useAppSelector(state => state.subscription.entitlementStatus);
  const selectedPlanId = useAppSelector(state => state.subscription.selectedPlanId);
  const purchaseStatus = useAppSelector(state => state.subscription.purchaseStatus);
  const purchaseError = useAppSelector(state => state.subscription.purchaseError);
  const restoreStatus = useAppSelector(state => state.subscription.restoreStatus);
  const restoreError = useAppSelector(state => state.subscription.restoreError);

  const [sheetView, setSheetView] = useState<SheetView>('purchase');
  const [deleteSheetOpen, setDeleteSheetOpen] = useState(false);

  useEffect(() => {
    dispatch(subscriptionActions.entitlementRequested());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openRestore() {
    setSheetView('restore');
    dispatch(subscriptionActions.restoreRequested());
  }

  function backToPurchase() {
    setSheetView('purchase');
    dispatch(subscriptionActions.restoreErrorDismissed());
  }

  function handleDeleteConfirmed() {
    setDeleteSheetOpen(false);
    onDeleteAccount();
  }

  if (entitlementStatus === 'loading' && !entitlement) {
    return <View className="flex-1 bg-surface-screen" />;
  }

  if (entitlementStatus === 'error' && !entitlement) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-surface-screen px-8">
        <BodyText className="text-center text-text-body">
          We couldn't load your subscription. Check your connection and try again.
        </BodyText>
        <Button onPress={() => dispatch(subscriptionActions.entitlementRequested())}>Try again</Button>
      </View>
    );
  }

  const status = entitlement?.status ?? 'none';

  // "Existing subscription" — reaching the gate with a live plan (a fresh
  // purchase/restore just now, or one already in place) replaces the whole
  // screen; the only action is continuing into the app.
  if (status === 'active' || status === 'trialing') {
    const plan = entitlement?.planId ? plansById[entitlement.planId] : TRIAL_PLAN;
    const renewsLabel =
      status === 'trialing' && entitlement?.trialEndsAt
        ? `Trial ends ${formatDate(entitlement.trialEndsAt)}`
        : entitlement?.renewsAt
          ? `Renews ${formatDate(entitlement.renewsAt)}`
          : null;
    return (
      <View className="flex-1 bg-surface-screen">
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 justify-center px-6">
          <View className="items-center gap-5">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-success-soft">
              <Icon name="check" size={30} color="#71754C" />
            </View>
            <Heading level="h2" className="text-center">
              You're already subscribed
            </Heading>
            <View className="w-full flex-row items-center justify-between rounded-lg border border-border-subtle bg-surface-card p-4">
              <BodyText className="font-sans-bold text-text-heading">{plan.name}</BodyText>
              <Badge tone={status === 'trialing' ? 'info' : 'success'}>
                {status === 'trialing' ? 'Trial' : 'Active'}
              </Badge>
            </View>
            {renewsLabel ? (
              <BodyText size="sm" className="-mt-3 self-start text-text-muted">
                {renewsLabel}
              </BodyText>
            ) : null}
          </View>
        </SafeAreaView>
        <SafeAreaView edges={['bottom']} className="border-t border-border-subtle bg-surface-card px-6 pt-4">
          <Button size="lg" onPress={onContinue}>
            Continue to Lifefull
          </Button>
        </SafeAreaView>
      </View>
    );
  }

  const lapsed = status === 'expired' || status === 'canceled';

  return (
    <View className="flex-1 bg-surface-screen">
      <SafeAreaView edges={['top']}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={12}
            className="px-4 pt-3"
          >
            <ChevronLeft />
          </Pressable>
        ) : null}
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-6 px-6 pb-72 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Mark height={40} />
        <Heading level="h2" className="text-center">
          {lapsed ? 'Your subscription has ended' : 'Start planning your life after work'}
        </Heading>
        {lapsed ? (
          <BodyText className="-mt-4 text-center text-text-body">
            Everything you've built for life after work is still here. Renewing brings back:
          </BodyText>
        ) : null}

        <View className="w-full gap-4">
          {FEATURES.map(({ icon: FeatureIcon, text }) => (
            <View key={text} className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-lg bg-surface-sunken">
                <FeatureIcon size={18} />
              </View>
              <BodyText className="flex-1 text-text-body">{text}</BodyText>
            </View>
          ))}
        </View>
      </ScrollView>

      {sheetView === 'restore' ? (
        <CompactPlanSheet
          visible
          error={
            restoreError
              ? `${restoreError.message} If you subscribed with a different account, sign in to that one and try again.`
              : null
          }
          primaryLabel={restoreStatus === 'loading' ? 'Checking…' : 'Check again'}
          primaryLoading={restoreStatus === 'loading'}
          onPrimaryPress={openRestore}
          onCancel={backToPurchase}
        />
      ) : lapsed ? (
        <PlanListSheet
          visible
          selectedPlanId={selectedPlanId}
          onSelectPlan={id => dispatch(subscriptionActions.planSelected(id))}
          primaryLabel="Renew subscription"
          primaryLoading={purchaseStatus === 'loading'}
          onPrimaryPress={() => dispatch(subscriptionActions.purchaseRequested({ planId: selectedPlanId }))}
          onRestorePurchases={openRestore}
          onDeleteAccount={() => setDeleteSheetOpen(true)}
        />
      ) : (
        <CompactPlanSheet
          visible
          error={purchaseError?.message}
          primaryLabel={purchaseError ? 'Try again' : 'Start free trial'}
          primaryLoading={purchaseStatus === 'loading'}
          onPrimaryPress={() => dispatch(subscriptionActions.purchaseRequested({ planId: TRIAL_PLAN.id }))}
          onCancel={() => dispatch(subscriptionActions.purchaseErrorDismissed())}
          onRestorePurchases={openRestore}
        />
      )}

      <DestructiveConfirmSheet
        visible={deleteSheetOpen}
        items={ACCOUNT_DELETE_ITEMS}
        confirmLabel="Delete everything"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteSheetOpen(false)}
      />
    </View>
  );
}

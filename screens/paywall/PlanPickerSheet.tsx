import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { ChevronRight } from '../../components/icons/ChevronRight';
import { Icon } from '../../components/icons/Icons';
import { BodyText } from '../../components/Typography';
import {
  billingPeriodLabel,
  formatPrice,
  monthlyEquivalent,
  PLANS,
  savingsPct,
  TRIAL_PLAN,
} from '../../services/subscription/plans';
import type { PlanId } from '../../services/subscription/types';

function ErrorBanner({ message }: { message: string }) {
  return (
    <View className="flex-row items-start gap-3 rounded-lg bg-danger-soft p-4">
      <Icon name="alert" size={18} color="#8F3320" />
      <BodyText size="sm" className="flex-1 text-[#8F3320]">
        {message}
      </BodyText>
    </View>
  );
}

function TermsFooter() {
  return (
    <BodyText size="caption" className="text-center text-text-muted">
      Cancel anytime in your store settings.{' '}
      <BodyText size="caption" className="text-brand-ink underline">
        Terms of Use
      </BodyText>
      {' · '}
      <BodyText size="caption" className="text-brand-ink underline">
        Privacy Policy
      </BodyText>
    </BodyText>
  );
}

export type CompactPlanSheetProps = {
  visible: boolean;
  /** Set for the "Payment failure" / "Restore purchase failure" states —
   * shown above the primary button, plan selection stays intact either way. */
  error?: string | null;
  primaryLabel: string;
  primaryLoading: boolean;
  onPrimaryPress: () => void;
  onCancel: () => void;
  /** Omitted while already showing the restore-checking flavor of this same
   * sheet, so "Restore purchases" can't be tapped again mid-check. */
  onRestorePurchases?: () => void;
};

/**
 * The trial-offer sheet — always just the Monthly plan (spec 6.1's trial
 * only applies to it). Used for the first-run paywall, and reused unchanged
 * (same plan block, different error/label) for the payment-declined /
 * restore-not-found states: the design's point is that a failure here
 * doesn't reset anything, it just adds the banner and swaps the button.
 */
export function CompactPlanSheet({
  visible,
  error,
  primaryLabel,
  primaryLoading,
  onPrimaryPress,
  onCancel,
  onRestorePurchases,
}: CompactPlanSheetProps) {
  return (
    <BottomSheet visible={visible} onRequestClose={onCancel} className="pb-6">
      {error ? <ErrorBanner message={error} /> : null}
      <View className="flex-row items-start justify-between">
        <BodyText className="font-sans-bold text-lg text-text-heading">{TRIAL_PLAN.name}</BodyText>
        <BodyText className="font-sans-bold text-lg text-text-heading">Free for 7 days</BodyText>
      </View>
      <BodyText size="sm" className="-mt-2 text-text-muted">
        {`Then ${formatPrice(TRIAL_PLAN.price)} monthly. Charged to your App Store account.`}
      </BodyText>
      <Button size="lg" loading={primaryLoading} onPress={onPrimaryPress}>
        {primaryLabel}
      </Button>
      <Pressable accessibilityRole="button" onPress={onCancel} className="items-center py-1">
        <BodyText className="text-text-muted">Cancel</BodyText>
      </Pressable>
      {onRestorePurchases ? (
        <Pressable accessibilityRole="button" onPress={onRestorePurchases} className="items-center py-1">
          <BodyText size="sm" className="text-text-muted">
            Restore purchases
          </BodyText>
        </Pressable>
      ) : null}
    </BottomSheet>
  );
}

function PlanRow({ planId, selected, onSelect }: { planId: PlanId; selected: boolean; onSelect: (id: PlanId) => void }) {
  const plan = PLANS.find(p => p.id === planId)!;
  const pct = savingsPct(plan);
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={() => onSelect(planId)}
      className={`flex-row items-center gap-3 rounded-lg border-[1.5px] p-4 ${
        selected ? 'border-brand bg-brand-soft' : 'border-border-subtle'
      }`}
    >
      <View
        className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
          selected ? 'border-brand' : 'border-border-strong'
        }`}
      >
        {selected ? <View className="h-2.5 w-2.5 rounded-full bg-brand" /> : null}
      </View>
      <View className="flex-1">
        <BodyText className="font-sans-bold text-text-heading">{plan.name}</BodyText>
        <BodyText size="sm" className="text-text-muted">
          {`billed ${billingPeriodLabel(plan)}`}
        </BodyText>
      </View>
      <View className="items-end">
        <BodyText className="font-sans-bold text-text-heading">{formatPrice(plan.price)}</BodyText>
        {pct > 0 ? (
          <BodyText size="caption" className="text-success">
            {`Save ${pct}% · ${formatPrice(monthlyEquivalent(plan))}/mo`}
          </BodyText>
        ) : null}
      </View>
    </Pressable>
  );
}

export type PlanListSheetProps = {
  visible: boolean;
  selectedPlanId: PlanId;
  onSelectPlan: (id: PlanId) => void;
  primaryLabel: string;
  primaryLoading: boolean;
  onPrimaryPress: () => void;
  onRestorePurchases: () => void;
  onDeleteAccount: () => void;
};

/**
 * The full plan list — reached from Settings' "Subscription" row for an
 * active subscriber ("View more plans"), and opened straight to this state
 * for a lapsed customer (spec: trial not re-offered, Delete my account sits
 * alongside Restore since Settings is behind the entitlement gate).
 */
export function PlanListSheet({
  visible,
  selectedPlanId,
  onSelectPlan,
  primaryLabel,
  primaryLoading,
  onPrimaryPress,
  onRestorePurchases,
  onDeleteAccount,
}: PlanListSheetProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <BottomSheet visible={visible} className="gap-5 pb-6">
      <Pressable
        accessibilityRole="button"
        onPress={() => setExpanded(e => !e)}
        className="flex-row items-center justify-between self-center rounded-pill bg-surface-ink px-4 py-2"
      >
        <BodyText size="sm" className="font-sans-bold text-text-on-brand">
          View more plans
        </BodyText>
        <View style={{ transform: [{ rotate: expanded ? '270deg' : '90deg' }], marginLeft: 6 }}>
          <ChevronRight size={14} color="#FFFFFF" />
        </View>
      </Pressable>

      {expanded ? (
        <View className="gap-3">
          {PLANS.map(plan => (
            <PlanRow key={plan.id} planId={plan.id} selected={plan.id === selectedPlanId} onSelect={onSelectPlan} />
          ))}
        </View>
      ) : null}

      <Button size="lg" loading={primaryLoading} onPress={onPrimaryPress}>
        {primaryLabel}
      </Button>

      <View className="flex-row items-center justify-center gap-2">
        <Pressable accessibilityRole="button" onPress={onRestorePurchases}>
          <BodyText size="sm" className="text-text-muted">
            Restore purchases
          </BodyText>
        </Pressable>
        <BodyText size="sm" className="text-text-muted">
          ·
        </BodyText>
        <Pressable accessibilityRole="button" onPress={onDeleteAccount}>
          <BodyText size="sm" className="text-danger underline">
            Delete my account
          </BodyText>
        </Pressable>
      </View>

      <TermsFooter />
    </BottomSheet>
  );
}

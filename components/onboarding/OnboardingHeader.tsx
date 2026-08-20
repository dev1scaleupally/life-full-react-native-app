import { Pressable, View } from 'react-native';
import { ChevronLeft } from '../icons/ChevronLeft';
import { BodyText, Eyebrow } from '../Typography';

export type OnboardingHeaderProps = {
  /** 1-indexed current step, out of `total`. */
  step: number;
  total: number;
  onBack: () => void;
};

export function OnboardingHeader({ step, total, onBack }: OnboardingHeaderProps) {
  const progress = Math.min(1, Math.max(0, step / total));

  return (
    <View className="border-b border-border-subtle bg-surface-card px-4 pb-3 pt-2">
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          hitSlop={12}
          className="flex-row items-center gap-3"
        >
          <ChevronLeft />
          <Eyebrow>About you</Eyebrow>
        </Pressable>

        <BodyText size="sm" className="text-text-subtle">
          {step} of {total}
        </BodyText>
      </View>

      <View className="mt-3 h-1 overflow-hidden rounded-pill bg-surface-sunken">
        <View className="h-full rounded-pill bg-brand" style={{ width: `${progress * 100}%` }} />
      </View>
    </View>
  );
}

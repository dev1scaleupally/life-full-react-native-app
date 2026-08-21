import { View } from 'react-native';
import { LikertOptionRow } from './LikertOptionRow';
import { LIKERT_OPTIONS } from './types';

export type LikertStepProps = {
  value: number | null;
  onChange: (value: number) => void;
};

/** The shared 1–5 "Never" → "Always" scale every reflection question answers on. */
export function LikertStep({ value, onChange }: LikertStepProps) {
  return (
    <View className="gap-3">
      {LIKERT_OPTIONS.map(option => (
        <LikertOptionRow
          key={option.value}
          number={option.value}
          label={option.label}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}

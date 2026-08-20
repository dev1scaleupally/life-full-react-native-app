import { View } from 'react-native';
import { Input } from '../../Input';
import { SelectableRow } from '../SelectableRow';
import type { OnboardingAnswers, MultiSelectStepConfig } from '../types';

export type MultiSelectStepProps = {
  step: MultiSelectStepConfig;
  answers: OnboardingAnswers;
  onChange: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
};

export function MultiSelectStep({ step, answers, onChange }: MultiSelectStepProps) {
  const selectedValues = (answers[step.key] as string[]) ?? [];

  function toggle(value: string) {
    const next = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(step.key, next as OnboardingAnswers[typeof step.key]);
  }

  return (
    <View className="gap-3">
      {step.options.map(option => (
        <SelectableRow
          key={option.value}
          label={option.label}
          indicator="checkbox"
          selected={selectedValues.includes(option.value)}
          onPress={() => toggle(option.value)}
        />
      ))}

      {step.otherTextField && selectedValues.includes(step.otherTextField.triggerValue) ? (
        <Input
          value={String(answers[step.otherTextField.key] ?? '')}
          onChangeText={text =>
            onChange(step.otherTextField!.key, text as OnboardingAnswers[typeof step.otherTextField.key])
          }
          placeholder={step.otherTextField.placeholder}
          autoFocus
        />
      ) : null}
    </View>
  );
}

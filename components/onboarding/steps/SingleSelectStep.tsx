import { View } from 'react-native';
import { Input } from '../../Input';
import { BodyText } from '../../Typography';
import { SelectableRow } from '../SelectableRow';
import type { OnboardingAnswers, SingleSelectStepConfig } from '../types';

export type SingleSelectStepProps = {
  step: SingleSelectStepConfig;
  answers: OnboardingAnswers;
  onChange: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
};

export function SingleSelectStep({ step, answers, onChange }: SingleSelectStepProps) {
  const selected = answers[step.key] as string | null;

  return (
    <View className="gap-3">
      {step.options.map(option => (
        <SelectableRow
          key={option.value}
          label={option.label}
          selected={selected === option.value}
          onPress={() => onChange(step.key, option.value as OnboardingAnswers[typeof step.key])}
        />
      ))}

      {step.otherTextField && selected === step.otherTextField.triggerValue ? (
        <Input
          value={String(answers[step.otherTextField.key] ?? '')}
          onChangeText={text =>
            onChange(step.otherTextField!.key, text as OnboardingAnswers[typeof step.otherTextField.key])
          }
          placeholder={step.otherTextField.placeholder}
          autoFocus
        />
      ) : null}

      {step.secondaryTextField && selected ? (
        <View className="gap-2 pt-1">
          <BodyText size="sm" className="font-sans-bold text-text-heading">
            {step.secondaryTextField.prompt}
          </BodyText>
          <Input
            value={String(answers[step.secondaryTextField.key] ?? '')}
            onChangeText={text =>
              onChange(
                step.secondaryTextField!.key,
                text as OnboardingAnswers[typeof step.secondaryTextField.key],
              )
            }
            placeholder={step.secondaryTextField.placeholder}
          />
        </View>
      ) : null}
    </View>
  );
}

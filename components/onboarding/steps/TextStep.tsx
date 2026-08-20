import { Input } from '../../Input';
import type { OnboardingAnswers, TextStepConfig } from '../types';

export type TextStepProps = {
  step: TextStepConfig;
  answers: OnboardingAnswers;
  onChange: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
};

export function TextStep({ step, answers, onChange }: TextStepProps) {
  return (
    <Input
      value={String(answers[step.key] ?? '')}
      onChangeText={text => onChange(step.key, text as OnboardingAnswers[typeof step.key])}
      placeholder={step.placeholder}
      autoFocus
    />
  );
}

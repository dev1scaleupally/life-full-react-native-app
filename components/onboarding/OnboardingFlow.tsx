import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../Button';
import { ChevronRight } from '../icons/ChevronRight';
import { BodyText, Heading } from '../Typography';
import { OnboardingHeader } from './OnboardingHeader';
import { MultiSelectStep } from './steps/MultiSelectStep';
import { SingleSelectStep } from './steps/SingleSelectStep';
import { TextStep } from './steps/TextStep';
import {
  INITIAL_ANSWERS,
  isStepValid,
  nextVisibleIndex,
  resolveTitle,
  STEPS,
  type OnboardingAnswers,
} from './types';

export type OnboardingFlowProps = {
  /** Back pressed on the very first visible step. */
  onExit?: () => void;
  /** Continue pressed on the very last visible step. */
  onComplete?: (answers: OnboardingAnswers) => void;
  /** Resumes mid-flow (e.g. the app was closed and reopened) instead of
   * starting from question 1 — both provided together or not at all. */
  initialAnswers?: OnboardingAnswers;
  initialStepIndex?: number;
  /** Fires on every answer/step change so the caller can persist a resume
   * point (there's no account yet to save any of this server-side). Not
   * debounced — App.tsx just writes the small JSON blob straight through. */
  onProgress?: (answers: OnboardingAnswers, stepIndex: number) => void;
};

export function OnboardingFlow({
  onExit,
  onComplete,
  initialAnswers,
  initialStepIndex,
  onProgress,
}: OnboardingFlowProps) {
  // Owned here, once, for the life of the flow — going back never loses an answer.
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialAnswers ?? INITIAL_ANSWERS);
  const [stepIndex, setStepIndex] = useState(() => {
    if (initialStepIndex != null) return initialStepIndex;
    // In case step 0 itself were ever conditionally hidden.
    return STEPS[0].visible && !STEPS[0].visible(INITIAL_ANSWERS) ? nextVisibleIndex(-1, 1, INITIAL_ANSWERS) : 0;
  });

  useEffect(() => {
    onProgress?.(answers, stepIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, stepIndex]);

  const step = STEPS[stepIndex];
  const canContinue = isStepValid(step, answers);

  function onChange<K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }

  function handleBack() {
    const prev = nextVisibleIndex(stepIndex, -1, answers);
    if (prev < 0) {
      onExit?.();
      return;
    }
    setStepIndex(prev);
  }

  function handleContinue() {
    const next = nextVisibleIndex(stepIndex, 1, answers);
    if (next >= STEPS.length) {
      onComplete?.(answers);
      return;
    }
    setStepIndex(next);
  }

  return (
    <View className="flex-1 bg-surface-sunken">
      <SafeAreaView edges={['top']} className="bg-surface-card">
        <OnboardingHeader step={stepIndex + 1} total={STEPS.length} onBack={handleBack} />
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-6 pb-8 pt-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Heading level="h3">{resolveTitle(step, answers)}</Heading>
        {step.subtitle ? (
          <BodyText size="sm" className="text-text-muted">
            {step.subtitle}
          </BodyText>
        ) : null}

        <View className="pt-2">
          {step.type === 'text' ? (
            <TextStep step={step} answers={answers} onChange={onChange} />
          ) : step.type === 'single' ? (
            <SingleSelectStep step={step} answers={answers} onChange={onChange} />
          ) : (
            <MultiSelectStep step={step} answers={answers} onChange={onChange} />
          )}
        </View>
      </ScrollView>

      <SafeAreaView
        edges={['bottom']}
        className="border-t border-border-subtle bg-surface-card px-6 pt-4"
      >
        <Button
          size="lg"
          className="bg-brand-hover"
          disabled={!canContinue}
          onPress={handleContinue}
          rightIcon={<ChevronRight color="#FFFFFF" />}
        >
          Continue
        </Button>
      </SafeAreaView>
    </View>
  );
}

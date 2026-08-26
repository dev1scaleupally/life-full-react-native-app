import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../Button';
import { ChevronRight } from '../icons/ChevronRight';
import { OnboardingHeader } from '../onboarding/OnboardingHeader';
import { BodyText, Heading } from '../Typography';
import { LikertStep } from './LikertStep';
import { FLAT_QUESTIONS, type ReflectionAnswers } from './types';

export type ReflectionsFlowProps = {
  /** Back pressed on the very first question. */
  onExit?: () => void;
  /** Continue pressed on the very last question. */
  onComplete?: (answers: ReflectionAnswers) => void;
};

export function ReflectionsFlow({ onExit, onComplete }: ReflectionsFlowProps) {
  // Owned here, once, for the life of the flow — going back never loses an answer.
  const [answers, setAnswers] = useState<ReflectionAnswers>({});
  const [index, setIndex] = useState(0);

  const { domain, question } = FLAT_QUESTIONS[index];
  const value = answers[question.id] ?? null;
  const canContinue = value !== null;

  function handleBack() {
    if (index === 0) {
      onExit?.();
      return;
    }
    setIndex(index - 1);
  }

  function handleContinue() {
    if (index === FLAT_QUESTIONS.length - 1) {
      onComplete?.(answers);
      return;
    }
    setIndex(index + 1);
  }

  return (
    <View className="flex-1 bg-surface-sunken">
      <SafeAreaView edges={['top']} className="bg-surface-card">
        <OnboardingHeader
          label={domain.name}
          step={index + 1}
          total={FLAT_QUESTIONS.length}
          onBack={handleBack}
        />
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-6 pb-8 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* <BodyText 
          size="sm"
          className="font-sans-bold uppercase tracking-wide text-text-muted"
        >
          {domain.name}
        </BodyText> */}
        <Heading level="h3">{question.text}</Heading>

        <View className="pt-2">
          <LikertStep
            value={value}
            onChange={next =>
              setAnswers(prev => ({ ...prev, [question.id]: next }))
            }
          />
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

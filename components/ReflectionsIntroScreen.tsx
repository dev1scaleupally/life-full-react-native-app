import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { ChevronLeft } from './icons/ChevronLeft';
import { ChevronRight } from './icons/ChevronRight';
import { PersonFigureIcon } from './icons/PersonFigureIcon';
import { BodyText, Heading } from './Typography';

export type ReflectionsIntroScreenProps = {
  /** Back pressed in the header. */
  onBack?: () => void;
  /** Continue pressed in the footer. */
  onContinue?: () => void;
};

/**
 * Transition screen shown right before the reflections questionnaire — sets
 * expectations (short statements, a Never-to-Always scale) and reassures
 * before the assessment starts. The three figures mark progress through a
 * multi-part reflection; only the first is filled in since we're at the start.
 */
export function ReflectionsIntroScreen({
  onBack,
  onContinue,
}: ReflectionsIntroScreenProps) {
  return (
    <View className="flex-1 bg-surface-app">
      <SafeAreaView edges={['top']} className="bg-surface-card">
        <View className="flex-row items-center gap-3 border-b border-border-subtle px-4 py-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={12}
          >
            <ChevronLeft />
          </Pressable>
          <BodyText
            size="sm"
            className="flex-1 font-sans-bold uppercase tracking-wide text-text-muted"
          >
            Your reflections
          </BodyText>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-1 justify-center px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 flex-row items-end justify-center gap-0.5">
          <PersonFigureIcon color="#E3853B" />
          <PersonFigureIcon color="#CFC6B5" />
          <PersonFigureIcon color="#CFC6B5" />
        </View>

        <Heading level="h2" className="text-center">
          You aren't alone in this transition.
        </Heading>

        <BodyText className="mt-3.5">
          Research shows nearly 1 in 3 retirees struggles to adjust to life
          after work.
        </BodyText>

        <BodyText className="mt-3.5">
          We're here to help you navigate what's next — starting with an honest
          look at how retirement has been going for you. For each short
          statement ahead, choose how often it rings true lately, from{' '}
          <Text className="font-sans-bold text-text-body">Never</Text> to{' '}
          <Text className="font-sans-bold text-text-body">Always</Text>.
        </BodyText>
      </ScrollView>

      <SafeAreaView
        edges={['bottom']}
        className="border-t border-border-subtle bg-surface-card px-6 pt-4"
      >
        <Button
          size="lg"
          className="bg-brand-hover"
          onPress={onContinue}
          rightIcon={<ChevronRight color="#FFFFFF" />}
        >
          Continues
        </Button>
      </SafeAreaView>
    </View>
  );
}

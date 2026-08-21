import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { ChevronRight } from './icons/ChevronRight';
import { CompassIcon } from './icons/CompassIcon';
import { HomeIcon } from './icons/HomeIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { Mark } from './Mark';
import { BodyText, Heading } from './Typography';

type IntroRow = {
  icon: ReactNode;
  title: string;
  description: string;
};

const ROWS: IntroRow[] = [
  {
    icon: <HomeIcon />,
    title: 'A little about your life',
    description: "A few simple choices — nothing you're not comfortable sharing.",
  },
  {
    icon: <LightbulbIcon />,
    title: 'How retirement is going',
    description: 'Honest reflections across the things that shape a good retirement.',
  },
  {
    icon: <CompassIcon />,
    title: 'A starting point, together',
    description: "We'll show you a summary of where you are today, and take it from there.",
  },
];

function IntroRowItem({ row, isLast }: { row: IntroRow; isLast: boolean }) {
  return (
    <View
      className={`flex-row gap-4 py-4 ${isLast ? '' : 'border-b border-border-subtle'}`}
    >
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-surface-card">
        {row.icon}
      </View>
      <View className="flex-1 gap-1">
        <BodyText className="font-sans-bold text-text-heading text-lg">{row.title}</BodyText>
        <BodyText size="sm" className="text-text-muted text-base">
          {row.description}
        </BodyText>
      </View>
    </View>
  );
}

export type IntroScreenProps = {
  onBegin?: () => void;
};

export function IntroScreen({ onBegin }: IntroScreenProps) {
  return (
    <View className="flex-1 bg-surface-sunken">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6 px-6 pb-8 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center gap-3">
            <Mark variant="orange" height={44} />
            <Heading level="h2" className="text-center text-3xl">
              Let's get to know you
            </Heading>
            <BodyText className="text-center text-text-muted text-lg">
              Your answers shape your first session.
            </BodyText>
          </View>

          <View>
            {ROWS.map((row, i) => (
              <IntroRowItem key={row.title} row={row} isLast={i === ROWS.length - 1} />
            ))}
          </View>

          <View className="gap-3">
            <BodyText size="xs">
              <Text className="font-sans-bold text-text-heading">
                What Lifefull does:{' '}
              </Text>
              help you reflect on what matters next and turn it into small
              real-world steps.
            </BodyText>
            <BodyText size="xs">  
              <Text className="font-sans-bold text-text-heading">
                What it doesn't:{' '}
              </Text>
              give medical, psychological, or financial advice. When a topic
              needs a professional, we'll say so.
            </BodyText>
          </View>
        </ScrollView>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} className="border-t border-border-subtle bg-surface-card px-6 pt-4">
        <Button
          size="lg"
          className="bg-brand-hover"
          onPress={onBegin}
          rightIcon={<ChevronRight color="#FFFFFF" />}
        >
          Begin
        </Button>
      </SafeAreaView>
    </View>
  );
}

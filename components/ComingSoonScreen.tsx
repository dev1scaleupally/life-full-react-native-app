import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SparkleIcon } from './icons/SparkleIcon';
import { BodyText, Heading } from './Typography';

export type ComingSoonScreenProps = {
  /** What this stands in for, e.g. "Coach", "Plan". */
  title: string;
  /** Optional one-line detail on what'll live here eventually. */
  detail?: string;
};

/** Stand-in for any screen/tab this handoff doesn't build yet — real
 * navigation reaches it, but there's nothing behind it besides this. */
export function ComingSoonScreen({ title, detail }: ComingSoonScreenProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-surface-screen px-8">
      <SafeAreaView edges={['top']} />
      <View className="h-14 w-14 items-center justify-center rounded-full bg-olive-50">
        <SparkleIcon size={24} color="#71754C" />
      </View>
      <Heading level="h3" className="text-center">
        {title} is coming soon
      </Heading>
      {detail ? (
        <BodyText size="sm" className="text-center text-text-muted">
          {detail}
        </BodyText>
      ) : null}
    </View>
  );
}

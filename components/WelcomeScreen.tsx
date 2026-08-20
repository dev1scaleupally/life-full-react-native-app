import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { DawnGradient } from './DawnGradient';
import { ChevronRight } from './icons/ChevronRight';
import { Logo } from './Logo';
import { BodyText, Heading } from './Typography';

export type WelcomeScreenProps = {
  onGetStarted?: () => void;
};

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <View className="flex-1">
      <DawnGradient />
      <SafeAreaView className="flex-1 px-6">
        <View className="flex-row justify-end pt-2">
          <View className="rounded-pill bg-black/30 px-3.5 py-1.5">
            <BodyText size="sm" className="font-sans-bold text-white">
              Dawn · switch
            </BodyText>
          </View>
        </View>

        <View className="flex-1 justify-center gap-5">
          <Logo variant="white" height={26} />

          <Heading level="h1" className="text-5xl text-white">
            Your life after work, guided.
          </Heading>

          <BodyText size="lg" className="text-white/80">
            A personal AI guide for retirement that helps you find purpose,
            connection, and daily rhythm, one conversation at a time.
          </BodyText>
        </View>

        <View className="gap-5 pb-2">
          <Button
            variant="inverse"
            size="lg"
            onPress={onGetStarted}
            rightIcon={<ChevronRight color="#1C2C3E" />}
          >
            Get started
          </Button>

          <BodyText className="text-center text-white">
            Already with us? <Text className="font-sans-bold">Sign in</Text>
          </BodyText>

          <BodyText size="sm" className="text-center text-white/70">
            <Text className="underline">Terms of Use</Text>
            {'  ·  '}
            <Text className="underline">Privacy Policy</Text>
          </BodyText>
        </View>
      </SafeAreaView>
    </View>
  );
}

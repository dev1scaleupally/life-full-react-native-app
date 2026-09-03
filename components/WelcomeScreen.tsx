import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { DawnGradient } from './DawnGradient';
import { GraphicSunrise } from './GraphicSunrise';
import { ChevronRight } from './icons/ChevronRight';
import { Logo } from './Logo';
import { layout } from '../tokens/theme';
import { BodyText, Heading } from './Typography';

export type WelcomeScreenProps = {
  onGetStarted?: () => void;
  onSignIn?: () => void;
};

type BackgroundVariant = 'dawn' | 'graphic';

export function WelcomeScreen({ onGetStarted, onSignIn }: WelcomeScreenProps) {
  // Purely cosmetic, local-only choice — which background this Welcome
  // screen shows. The pill always names the variant currently on screen and
  // switches to the other one when tapped.
  const [background, setBackground] = useState<BackgroundVariant>('dawn');
  // Dawn's bottom is a light warm orange (dark text reads fine there, per
  // the original design); Graphic's bottom is dark hill silhouettes, where
  // that same dark navy text is nearly illegible — the footer links need to
  // flip to white against it.
  const footerTextClass = background === 'dawn' ? 'text-navy-700' : 'text-white';

  return (
    <View className="flex-1">
      {background === 'dawn' ? <DawnGradient /> : <GraphicSunrise />}
      <SafeAreaView className="flex-1 px-6">
        <View className="flex-row justify-end pt-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Switch background — currently ${background === 'dawn' ? 'Dawn' : 'Graphic'}`}
            hitSlop={8}
            onPress={() => setBackground(v => (v === 'dawn' ? 'graphic' : 'dawn'))}
            className="rounded-pill bg-black/30 px-3.5 py-1.5"
          >
            <BodyText size="sm" className="font-sans-bold text-white">
              {background === 'dawn' ? 'Dawn' : 'Graphic'} · switch
            </BodyText>
          </Pressable>
        </View>

        <View className="flex-1 justify-center gap-5">
          <Logo variant="white-mark" height={26} />

          <Heading level="h1" className="text-4xl text-white">
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

          <Pressable
            accessibilityRole="link"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={onSignIn}
            style={{ minHeight: layout.tapMin, justifyContent: 'center' }}
          >
            <BodyText className={`text-center ${footerTextClass}`}>
              Already with us? <Text className="font-sans-bold">Sign in</Text>
            </BodyText>
          </Pressable>

          <BodyText size="sm" className={`text-center ${footerTextClass}`}>
            <Text className="underline">Terms of Use</Text>
            {'  ·  '}
            <Text className="underline">Privacy Policy</Text>
          </BodyText>
        </View>
      </SafeAreaView>
    </View>
  );
}

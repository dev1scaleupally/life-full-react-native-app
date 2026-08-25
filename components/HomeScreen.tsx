import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ComingSoonScreen } from './ComingSoonScreen';
import { GearIcon } from './icons/GearIcon';
import { PersonIcon } from './icons/PersonIcon';
import { IconButton } from './IconButton';
import { Logo } from './Logo';

export type HomeScreenProps = {
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
};

/**
 * Section 4.6 — only the brand bar is real. Sage's next-step card, the
 * distress card, the current-commitment card, the domain list, and the
 * re-administration card are all still to build; this is the honest
 * placeholder for that body until they exist.
 */
export function HomeScreen({ onOpenProfile, onOpenSettings }: HomeScreenProps) {
  return (
    <View className="flex-1 bg-surface-screen">
      <SafeAreaView edges={['top']} className="bg-surface-card">
        <View className="flex-row items-center justify-between border-b border-border-subtle px-4 py-3">
          <Logo height={22} />
          <View className="flex-row items-center gap-1">
            <IconButton
              icon={<PersonIcon size={20} />}
              accessibilityLabel="Profile"
              onPress={onOpenProfile}
            />
            <IconButton
              icon={<GearIcon size={20} />}
              accessibilityLabel="Settings"
              onPress={onOpenSettings}
            />
          </View>
        </View>
      </SafeAreaView>
      <ComingSoonScreen
        title="Your dashboard"
        detail="Sage's next step, your current commitment, and your four life domains will live here."
      />
    </View>
  );
}

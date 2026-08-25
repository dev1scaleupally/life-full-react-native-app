import { useState } from 'react';
import { View } from 'react-native';
import { BottomTabBar, type MainTab } from './BottomTabBar';
import { ComingSoonScreen } from './ComingSoonScreen';
import { HomeScreen } from './HomeScreen';

export type MainTabsProps = {
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
};

/** Section 4.5's three primary areas. Home has its real header wired (4.6);
 * Coach (4.7, labeled "Sage" in-product) and Plan (4.8) are both fully
 * unbuilt — the tab bar and switching between them is real, the content
 * behind Sage/Plan isn't yet. */
export function MainTabs({ onOpenProfile, onOpenSettings }: MainTabsProps) {
  const [active, setActive] = useState<MainTab>('home');

  return (
    <View className="flex-1">
      <View className="flex-1">
        {active === 'home' ? (
          <HomeScreen onOpenProfile={onOpenProfile} onOpenSettings={onOpenSettings} />
        ) : active === 'sage' ? (
          <ComingSoonScreen title="Sage" detail="Your AI coaching conversations will happen here." />
        ) : (
          <ComingSoonScreen title="Plan" detail="Your commitments and tasks will live here." />
        )}
      </View>
      <BottomTabBar active={active} onChange={setActive} />
    </View>
  );
}

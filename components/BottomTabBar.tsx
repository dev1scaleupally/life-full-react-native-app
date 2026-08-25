import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarIcon } from './icons/CalendarIcon';
import { HomeIcon } from './icons/HomeIcon';
import { SparkleIcon } from './icons/SparkleIcon';
import { BodyText } from './Typography';

export type MainTab = 'home' | 'sage' | 'plan';

const TABS: { key: MainTab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'sage', label: 'Sage' },
  { key: 'plan', label: 'Plan' },
];

const ACTIVE_COLOR = '#A2571F'; // brand
const INACTIVE_COLOR = '#5F574A'; // text-muted

function TabIcon({ tab, color }: { tab: MainTab; color: string }) {
  if (tab === 'home') return <HomeIcon size={22} color={color} />;
  if (tab === 'sage') return <SparkleIcon size={22} color={color} />;
  return <CalendarIcon size={22} color={color} />;
}

export type BottomTabBarProps = {
  active: MainTab;
  onChange: (tab: MainTab) => void;
};

/** Section 4.5's three-tab bar — Home, Coach (labeled "Sage" in-product), Plan.
 * Present on the three primary areas; the current area's tab is highlighted. */
export function BottomTabBar({ active, onChange }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} className="border-t border-border-subtle bg-surface-card">
      <View className="flex-row">
        {TABS.map(tab => {
          const isActive = tab.key === active;
          const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => onChange(tab.key)}
              className="flex-1 items-center gap-1 py-2.5"
              hitSlop={4}
            >
              <TabIcon tab={tab.key} color={color} />
              <BodyText size="caption" className={isActive ? 'font-sans-bold text-brand' : 'text-text-muted'}>
                {tab.label}
              </BodyText>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

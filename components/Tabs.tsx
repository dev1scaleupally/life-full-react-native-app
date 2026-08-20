import { Pressable, View } from 'react-native';
import { BodyText } from './Typography';

export type TabItem<T extends string = string> = { key: T; label: string };

export type TabsProps<T extends string = string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (key: T) => void;
  className?: string;
};

export function Tabs<T extends string = string>({ items, value, onChange, className = '' }: TabsProps<T>) {
  return (
    <View className={`flex-row border-b border-border-subtle ${className}`}>
      {items.map(item => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(item.key)}
            className={`items-center px-4 py-3 ${active ? 'border-b-2 border-brand' : ''}`}
          >
            <BodyText size="sm" className={active ? 'font-sans-bold text-brand' : 'text-text-muted'}>
              {item.label}
            </BodyText>
          </Pressable>
        );
      })}
    </View>
  );
}

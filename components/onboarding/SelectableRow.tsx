import { Pressable, View } from 'react-native';
import { BodyText } from '../Typography';
import { usePressed } from '../usePressed';

export type SelectableRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** @default 'radio' */
  indicator?: 'radio' | 'checkbox';
};

export function SelectableRow({ label, selected, onPress, indicator = 'radio' }: SelectableRowProps) {
  const { pressed, onPressIn, onPressOut } = usePressed();

  return (
    <Pressable
      accessibilityRole={indicator === 'radio' ? 'radio' : 'checkbox'}
      accessibilityState={{ selected, checked: selected }}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className={`flex-row items-center justify-between rounded-lg border px-4 py-4 ${
        selected
          ? 'border-brand bg-brand-soft'
          : pressed
            ? 'border-border-strong bg-surface-card'
            : 'border-border bg-surface-card'
      }`}
    >
      <BodyText className={`flex-1 pr-3 ${selected ? 'font-sans-bold text-brand' : 'text-text-body'}`}>
        {label}
      </BodyText>

      {indicator === 'radio' ? (
        <View
          className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
            selected ? 'border-brand' : 'border-border-strong'
          }`}
        >
          {selected ? <View className="h-3 w-3 rounded-full bg-brand" /> : null}
        </View>
      ) : (
        <View
          className={`h-6 w-6 items-center justify-center rounded-sm border-2 ${
            selected ? 'border-brand bg-brand' : 'border-border-strong'
          }`}
        >
          {selected ? (
            <BodyText size="caption" className="font-sans-bold text-text-on-brand">
              ✓
            </BodyText>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

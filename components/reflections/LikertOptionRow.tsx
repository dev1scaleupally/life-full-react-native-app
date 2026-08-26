import { Pressable, View } from 'react-native';
import { BodyText } from '../Typography';
import { usePressed } from '../usePressed';

export type LikertOptionRowProps = {
  /** The 1–5 scale position, shown in the leading circle instead of a plain dot. */
  number: number;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function LikertOptionRow({
  number,
  label,
  selected,
  onPress,
}: LikertOptionRowProps) {
  const { pressed, onPressIn, onPressOut } = usePressed();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className={`flex-row items-center gap-4 rounded-lg border px-4 py-4 ${
        selected
          ? 'border-brand bg-brand-soft'
          : pressed
          ? 'border-border-strong bg-surface-card'
          : 'border-border bg-surface-card'
      }`}
    >
      <View
        className={`h-9 w-9 items-center justify-center rounded-full border-2 ${
          selected ? 'border-brand' : 'border-border-strong'
        }`}
      >
        <BodyText
          size="sm"
          className={`font-sans-bold ${
            selected ? 'text-brand' : 'text-text-muted'
          }`}
        >
          {number}
        </BodyText>
      </View>
      <BodyText
        className={`flex-1 text-base ${
          selected ? 'font-sans-bold text-brand' : 'text-text-body'
        }`}
      >
        {label}
      </BodyText>
    </Pressable>
  );
}

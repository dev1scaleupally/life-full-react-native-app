import { Pressable, View } from 'react-native';
import { BodyText } from './Typography';
import { usePressed } from './usePressed';

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function Checkbox({ checked, onChange, label, disabled, className = '' }: CheckboxProps) {
  const { pressed, onPressIn, onPressOut } = usePressed();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className={`flex-row items-center gap-3 ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      <View
        className={`h-6 w-6 items-center justify-center rounded-sm border-2 ${
          checked ? 'border-brand bg-brand' : pressed ? 'border-brand' : 'border-border-strong'
        }`}
      >
        {checked ? (
          <BodyText size="caption" className="font-sans-bold text-text-on-brand">
            ✓
          </BodyText>
        ) : null}
      </View>
      {label ? <BodyText className="flex-1 text-text-body">{label}</BodyText> : null}
    </Pressable>
  );
}

import { Pressable } from 'react-native';
import { BodyText } from '../../components/Typography';
import { layout } from '../../tokens/theme';

export type PasswordVisibilityToggleProps = {
  shown: boolean;
  onToggle: () => void;
};

/** The "Show/Hide" text toggle inside a password Input's `rightElement`. */
export function PasswordVisibilityToggle({ shown, onToggle }: PasswordVisibilityToggleProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={shown ? 'Hide password' : 'Show password'}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      onPress={onToggle}
      style={{ minHeight: layout.tapMin, justifyContent: 'center' }}
    >
      <BodyText size="sm" className="font-sans-bold text-text-link">
        {shown ? 'Hide' : 'Show'}
      </BodyText>
    </Pressable>
  );
}

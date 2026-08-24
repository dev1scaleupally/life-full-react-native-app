import { Pressable } from 'react-native';
import { BodyText } from '../../components/Typography';
import { layout } from '../../tokens/theme';

export type PressableLinkProps = {
  onPress: () => void;
  label: string;
  center?: boolean;
};

/** A text link with a real 44pt tap target via hitSlop, not enlarged visuals. */
export function PressableLink({ onPress, label, center }: PressableLinkProps) {
  return (
    <Pressable
      accessibilityRole="link"
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      onPress={onPress}
      style={{ minHeight: layout.tapMin, justifyContent: 'center' }}
    >
      <BodyText className={`font-sans-bold text-text-link ${center ? 'text-center' : ''}`}>
        {label}
      </BodyText>
    </Pressable>
  );
}

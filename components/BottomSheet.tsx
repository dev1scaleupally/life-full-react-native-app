import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from './cn';

export type BottomSheetProps = {
  visible: boolean;
  /** Tapping the dimmed backdrop — omit to make the sheet non-dismissable
   * that way (e.g. the destructive "This can't be undone" confirm, which
   * the user must explicitly choose Delete or Cancel on). */
  onRequestClose?: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * Dimmed backdrop + rounded-top sheet over whatever screen is behind it —
 * same Modal-based shell as Select.tsx's option picker. The paywall's
 * compact/expanded plan pickers, its error states, and the destructive
 * delete-account confirm all layer on top of the same base screen this way,
 * matching the design's "the sheet stays open, everything behind it stays put."
 */
export function BottomSheet({ visible, onRequestClose, children, className = '' }: BottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <Pressable
        accessibilityRole={onRequestClose ? 'button' : undefined}
        accessibilityLabel={onRequestClose ? 'Dismiss' : undefined}
        onPress={onRequestClose}
        className="flex-1 justify-end bg-black/40"
      >
        {/* Swallow the touch so tapping the sheet itself doesn't close it via the backdrop's onPress. */}
        <Pressable onPress={() => {}}>
          <SafeAreaView edges={['bottom']} className={cn('rounded-t-2xl bg-surface-card shadow-xl', className)}>
            <View className="gap-4 px-6 pt-6">{children}</View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

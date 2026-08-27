import { View } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { Icon } from './icons/Icons';
import { BodyText, Heading } from './Typography';

/** What every account-deletion entry point in the app loses — Settings'
 * Account section and the lapsed paywall's "Delete my account" both pass
 * this same list, per the design's note that it's one unchanged sheet. */
export const ACCOUNT_DELETE_ITEMS = [
  'Every session with Sage',
  'Your answers, results and plan',
  'Your profile and sign-in',
];

export type DestructiveConfirmSheetProps = {
  visible: boolean;
  /** What's being lost — rendered as a bulleted list under the intro copy. */
  items: string[];
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * The one "This can't be undone" sheet shared by account deletion wherever
 * it's offered — Settings' Account section and the lapsed paywall's "Delete
 * my account" both open this exact component, per the design's note that
 * it's "the same destructive sheet used in Settings, unchanged."
 */
export function DestructiveConfirmSheet({
  visible,
  items,
  confirmLabel,
  onConfirm,
  onCancel,
}: DestructiveConfirmSheetProps) {
  return (
    <BottomSheet visible={visible} onRequestClose={onCancel} className="pb-6">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-danger-soft">
        <Icon name="alert" size={20} color="#C24A2F" />
      </View>
      <Heading level="h3">This can't be undone</Heading>
      <BodyText className="text-text-body">
        Deleting your account removes everything you've built here, and we can't recover it afterwards.
      </BodyText>
      <View className="gap-2">
        {items.map(item => (
          <View key={item} className="flex-row items-center gap-2">
            <Icon name="x" size={14} color="#C24A2F" />
            <BodyText size="sm" className="flex-1 text-text-body">
              {item}
            </BodyText>
          </View>
        ))}
      </View>
      <Button variant="primary" size="lg" className="bg-danger" onPress={onConfirm}>
        {confirmLabel}
      </Button>
      <Button variant="secondary" size="lg" onPress={onCancel}>
        Cancel
      </Button>
    </BottomSheet>
  );
}

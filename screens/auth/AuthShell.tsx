import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/icons/Icons';
import { Band, Col } from '../../components/ReadingColumn';
import { BodyText } from '../../components/Typography';
import { layout } from '../../tokens/theme';

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPress={onPress}
      className="-ml-2 flex-row items-center gap-1 pr-3"
      style={{ minHeight: layout.tapMin }}
    >
      <Icon name="chevronLeft" size={20} />
      <BodyText className="font-sans-bold text-text-heading">Back</BodyText>
    </Pressable>
  );
}

export type AuthShellProps = {
  /** Omit to render a header with no back control (e.g. NewPasswordScreen, reached only via deep link). */
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * The one shell every AuthStack screen shares: full-bleed header band (back
 * chevron + "Back" label) -> scrolling reading-column body -> pinned footer
 * band with the single primary action. Every Col gets the 18pt gutter and
 * 620pt cap automatically (see components/ReadingColumn.tsx).
 */
export function AuthShell({ onBack, children, footer }: AuthShellProps) {
  return (
    <View className="flex-1 bg-surface-app">
      <SafeAreaView edges={['top']}>
        <Band>
          <Col className="py-2">{onBack ? <BackButton onPress={onBack} /> : <View style={{ height: layout.tapMin }} />}</Col>
        </Band>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Col className="flex-1 gap-6 pb-8 pt-2">{children}</Col>
      </ScrollView>

      {footer ? (
        <SafeAreaView edges={['bottom']}>
          <Band className="border-t border-border-subtle bg-surface-card pt-4">
            <Col className="pb-2">{footer}</Col>
          </Band>
        </SafeAreaView>
      ) : null}
    </View>
  );
}

import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button';
import { Icon, type IconName } from '../../components/icons/Icons';
import { BodyText, Heading } from '../../components/Typography';
import { c } from '../../tokens/theme';
import { AuthBanner } from './AuthBanner';
import { AuthShell } from './AuthShell';
import { PressableLink } from './PressableLink';

export type WaitingScreenProps = {
  onBack: () => void;
  icon: Extract<IconName, 'mail' | 'alert'>;
  headline: string;
  body: ReactNode;
  ctaLabel: string;
  ctaDisabled: boolean;
  onPressCta: () => void;
  confirmation?: string | null;
  error?: string | null;
  hint?: string;
  onUseDifferentEmail?: () => void;
};

/** The shared waiting-state shape behind EmailVerify and ResetLinkSent. */
export function WaitingScreen({
  onBack,
  icon,
  headline,
  body,
  ctaLabel,
  ctaDisabled,
  onPressCta,
  confirmation,
  error,
  hint,
  onUseDifferentEmail,
}: WaitingScreenProps) {
  const isAlert = icon === 'alert';
  return (
    <AuthShell
      onBack={onBack}
      footer={
        <View className="gap-3">
          {error ? <AuthBanner variant="danger">{error}</AuthBanner> : null}
          {confirmation ? <AuthBanner variant="success">{confirmation}</AuthBanner> : null}
          <Button size="lg" disabled={ctaDisabled} onPress={onPressCta}>
            {ctaLabel}
          </Button>
          {onUseDifferentEmail ? (
            <PressableLink onPress={onUseDifferentEmail} label="Use a different email address" center />
          ) : null}
          {hint ? (
            <BodyText size="caption" className="text-center">
              {hint}
            </BodyText>
          ) : null}
        </View>
      }
    >
      <View className="flex-1 items-center justify-center gap-4 pt-8">
        <View
          className={`h-16 w-16 items-center justify-center rounded-full ${
            isAlert ? 'bg-danger-soft' : 'bg-brand-soft'
          }`}
        >
          <Icon name={icon} size={28} color={isAlert ? c.danger : c.brandPrimary} />
        </View>
        <Heading level="h2" className={`text-center ${isAlert ? 'text-danger' : ''}`}>
          {headline}
        </Heading>
        {body}
      </View>
    </AuthShell>
  );
}

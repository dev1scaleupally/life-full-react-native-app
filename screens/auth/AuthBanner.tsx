import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Icon } from '../../components/icons/Icons';
import { BodyText } from '../../components/Typography';
import { c } from '../../tokens/theme';

export type AuthBannerProps = {
  /** danger = account-level server failure (alert icon); success = olive confirmation (check icon). */
  variant: 'danger' | 'success';
  children: ReactNode;
};

/**
 * Full-width banner reserved for account-level conditions the server
 * reports (danger) or a one-line confirmation (success) — never for
 * field-level validation, which lives on the field itself via Input's
 * `error` prop.
 */
export function AuthBanner({ variant, children }: AuthBannerProps) {
  const isDanger = variant === 'danger';
  return (
    <View
      className={`flex-row items-start gap-2 rounded-md border px-4 py-3 ${
        isDanger ? 'border-danger bg-danger-soft' : 'border-success bg-success-soft'
      }`}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Icon name={isDanger ? 'alert' : 'check'} size={18} color={isDanger ? c.danger : c.success} />
      <BodyText size="sm" className={`flex-1 ${isDanger ? 'text-danger' : 'text-success'}`}>
        {children}
      </BodyText>
    </View>
  );
}

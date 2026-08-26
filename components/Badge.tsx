import { View } from 'react-native';
import { cn } from './cn';
import { BodyText } from './Typography';

type BadgeTone = 'brand' | 'success' | 'info' | 'warning' | 'accent' | 'danger';

const toneClasses: Record<BadgeTone, { bg: string; text: string }> = {
  brand: { bg: 'bg-brand-soft', text: 'text-brand' },
  success: { bg: 'bg-success-soft', text: 'text-success' },
  info: { bg: 'bg-info-soft', text: 'text-info' },
  warning: { bg: 'bg-warning-soft', text: 'text-warning' },
  accent: { bg: 'bg-accent-soft', text: 'text-accent' },
  danger: { bg: 'bg-danger-soft', text: 'text-danger' },
};

export type BadgeProps = {
  /** @default 'brand' */
  tone?: BadgeTone;
  children: string;
  className?: string;
};

export function Badge({ tone = 'brand', children, className = '' }: BadgeProps) {
  const { bg, text } = toneClasses[tone];
  return (
    <View className={cn('self-start rounded-pill px-3 py-1', bg, className)}>
      <BodyText size="caption" className={`font-sans-bold uppercase tracking-wide ${text}`}>
        {children}
      </BodyText>
    </View>
  );
}

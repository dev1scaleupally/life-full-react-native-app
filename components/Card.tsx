import { View, type ViewProps } from 'react-native';
import { cn } from './cn';

export type CardProps = ViewProps & { className?: string };

export function Card({ className = '', ...rest }: CardProps) {
  return (
    <View
      className={cn('rounded-xl border border-border-subtle bg-surface-card p-5', className)}
      {...rest}
    />
  );
}

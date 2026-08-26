import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import { cn } from './cn';
import { BodyText } from './Typography';
import { usePressed } from './usePressed';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse';
type ButtonSize = 'sm' | 'md' | 'lg';

const containerClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand',
  secondary: 'border border-border bg-transparent',
  ghost: 'bg-transparent',
  inverse: 'bg-surface-card',
};

const containerPressedClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-active',
  secondary: 'border border-border bg-surface-sunken',
  ghost: 'bg-surface-sunken',
  inverse: 'bg-neutral-100',
};

const textClasses: Record<ButtonVariant, string> = {
  primary: 'text-text-on-brand',
  secondary: 'text-text-heading',
  ghost: 'text-brand',
  inverse: 'text-text-heading',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  md: 'px-5 py-3',
  lg: 'px-5 py-3',
};

const textSizeClasses: Record<ButtonSize, 'sm' | 'base' | 'lg'> = {
  sm: 'sm',
  md: 'base',
  lg: 'lg',
};

export type ButtonProps = Omit<PressableProps, 'children'> & {
  /** @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  loading?: boolean;
  children: string;
  /** Rendered before the label, e.g. a provider mark on an OAuth button. Hidden while loading. */
  leftIcon?: ReactNode;
  /** Rendered after the label, e.g. a chevron icon. Hidden while loading. */
  rightIcon?: ReactNode;
  className?: string;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}: ButtonProps) {
  const { pressed, onPressIn, onPressOut } = usePressed();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-pill',
        pressed ? containerPressedClasses[variant] : containerClasses[variant],
        sizeClasses[size],
        isDisabled ? 'opacity-50' : '',
        className
      )}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#A2571F'} />
      ) : (
        <>
          {leftIcon}
          <BodyText
            size={textSizeClasses[size]}
            className={`font-sans-bold ${textClasses[variant]}`}
          >
            {children}
          </BodyText>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}

import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import { BodyText } from './Typography';
import { usePressed } from './usePressed';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const containerClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand',
  secondary: 'border border-border bg-transparent',
  ghost: 'bg-transparent',
};

const containerPressedClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-active',
  secondary: 'border border-border bg-surface-sunken',
  ghost: 'bg-surface-sunken',
};

const textClasses: Record<ButtonVariant, string> = {
  primary: 'text-text-on-brand',
  secondary: 'text-text-heading',
  ghost: 'text-brand',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
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
  className?: string;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
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
      className={`flex-row items-center justify-center rounded-pill ${
        pressed ? containerPressedClasses[variant] : containerClasses[variant]
      } ${sizeClasses[size]} ${isDisabled ? 'opacity-50' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#A2571F'} />
      ) : (
        <BodyText
          size={textSizeClasses[size]}
          className={`font-sans-bold ${textClasses[variant]}`}
        >
          {children}
        </BodyText>
      )}
    </Pressable>
  );
}

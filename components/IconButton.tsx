import type { ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { usePressed } from './usePressed';

type IconButtonVariant = 'filled' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
};

export type IconButtonProps = Omit<PressableProps, 'children'> & {
  icon: ReactNode;
  /** @default 'ghost' */
  variant?: IconButtonVariant;
  /** @default 'md' */
  size?: IconButtonSize;
  className?: string;
};

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled,
  className = '',
  ...rest
}: IconButtonProps) {
  const { pressed, onPressIn, onPressOut } = usePressed();
  const base = variant === 'filled' ? 'bg-brand' : 'bg-transparent';
  const pressedBg = variant === 'filled' ? 'bg-brand-active' : 'bg-surface-sunken';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled ?? undefined }}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className={`items-center justify-center rounded-full ${sizeClasses[size]} ${
        pressed ? pressedBg : base
      } ${disabled ? 'opacity-50' : ''} ${className}`}
      {...rest}
    >
      {icon}
    </Pressable>
  );
}

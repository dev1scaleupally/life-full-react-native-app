import { Image, View } from 'react-native';
import { cn } from './cn';
import { BodyText } from './Typography';

type AvatarSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-16 w-16',
};

const textSizeClasses: Record<AvatarSize, 'sm' | 'base' | 'lg'> = {
  sm: 'sm',
  md: 'base',
  lg: 'lg',
};

export type AvatarProps = {
  /** Remote image URL. When omitted, falls back to `initials` on a soft brand chip. */
  source?: string;
  initials?: string;
  /** @default 'md' */
  size?: AvatarSize;
  className?: string;
};

export function Avatar({ source, initials, size = 'md', className = '' }: AvatarProps) {
  if (source) {
    return <Image source={{ uri: source }} className={cn('rounded-full', sizeClasses[size], className)} />;
  }

  return (
    <View
      className={cn('items-center justify-center rounded-full bg-brand-soft', sizeClasses[size], className)}
    >
      <BodyText size={textSizeClasses[size]} className="font-sans-bold text-brand">
        {initials ?? '?'}
      </BodyText>
    </View>
  );
}

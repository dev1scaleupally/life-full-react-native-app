import { useState, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { cn } from './cn';
import { BodyText } from './Typography';

export type InputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: string;
  /** Rendered inside the field, right-aligned — e.g. a password show/hide toggle. */
  rightElement?: ReactNode;
  className?: string;
};

export function Input({
  label,
  helperText,
  error,
  rightElement,
  className = '',
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  // Focus uses the teal `info` token, never brand orange — orange is reserved
  // for primary action/emphasis (see tokens/theme.ts's `c` comments).
  const borderClass = error ? 'border-danger' : focused ? 'border-info' : 'border-border';

  return (
    <View className="gap-1.5">
      {label ? (
        <BodyText size="sm" className="font-sans-bold text-text-heading">
          {label}
        </BodyText>
      ) : null}
      <View className="relative justify-center">
        <TextInput
          placeholderTextColor="#ABA08C" // neutral-400
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            'rounded-md border bg-surface-card px-4 py-3 font-sans text-base text-text-body',
            borderClass,
            rightElement ? 'pr-16' : '',
            className
          )}
          {...rest}
        />
        {rightElement ? <View className="absolute right-3">{rightElement}</View> : null}
      </View>
      {error ? (
        <BodyText
          size="caption"
          className="text-danger"
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </BodyText>
      ) : helperText ? (
        <BodyText size="caption">{helperText}</BodyText>
      ) : null}
    </View>
  );
}

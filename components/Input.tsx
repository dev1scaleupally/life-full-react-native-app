import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { BodyText } from './Typography';

export type InputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
};

export function Input({
  label,
  helperText,
  error,
  className = '',
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderClass = error ? 'border-danger' : focused ? 'border-brand' : 'border-border';

  return (
    <View className="gap-1.5">
      {label ? (
        <BodyText size="sm" className="font-sans-bold text-text-heading">
          {label}
        </BodyText>
      ) : null}
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
        className={`rounded-md border bg-surface-card px-4 py-3 font-sans text-base text-text-body ${borderClass} ${className}`}
        {...rest}
      />
      {error ? (
        <BodyText size="caption" className="text-danger">
          {error}
        </BodyText>
      ) : helperText ? (
        <BodyText size="caption">{helperText}</BodyText>
      ) : null}
    </View>
  );
}

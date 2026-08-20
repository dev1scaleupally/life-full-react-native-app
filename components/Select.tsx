import { useState } from 'react';
import { FlatList, Modal, Pressable, View } from 'react-native';
import { BodyText } from './Typography';

export type SelectOption<T extends string = string> = { label: string; value: T };

export type SelectProps<T extends string = string> = {
  label?: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
};

export function Select<T extends string = string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select…',
  className = '',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <View className="gap-1.5">
      {label ? (
        <BodyText size="sm" className="font-sans-bold text-text-heading">
          {label}
        </BodyText>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        className={`flex-row items-center justify-between rounded-md border border-border bg-surface-card px-4 py-3 ${className}`}
      >
        <BodyText className={selected ? 'text-text-body' : 'text-text-subtle'}>
          {selected ? selected.label : placeholder}
        </BodyText>
        <BodyText className="text-text-subtle">⌄</BodyText>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setOpen(false)}
        >
          {/* Swallow the touch so tapping the sheet itself doesn't close it via the backdrop's onPress */}
          <Pressable onPress={() => {}} className="max-h-96 rounded-t-2xl bg-surface-card pb-6 pt-2">
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={`px-5 py-3.5 ${item.value === value ? 'bg-surface-sunken' : ''}`}
                >
                  <BodyText
                    className={item.value === value ? 'font-sans-bold text-brand' : 'text-text-body'}
                  >
                    {item.label}
                  </BodyText>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

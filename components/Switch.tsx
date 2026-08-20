import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from 'react-native';

export type SwitchProps = Omit<RNSwitchProps, 'trackColor' | 'thumbColor' | 'ios_backgroundColor'>;

/** Themed wrapper around RN's built-in Switch — brand orange when on, warm-neutral track when off. */
export function Switch(props: SwitchProps) {
  return (
    <RNSwitch
      trackColor={{ false: '#E4DDD0', true: '#A2571F' }} // neutral-200 / brand
      thumbColor="#FFFFFF"
      ios_backgroundColor="#E4DDD0"
      {...props}
    />
  );
}
